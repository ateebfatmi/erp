import { describe, it, expect } from 'vitest';
import { calculateSalaryBreakdown, amountInWords } from '../calculator';
import { generateSalarySlipPdf } from '@/modules/documents/pdf-generator';

describe('Staff Payroll & Indian Statutory HRIS Engine', () => {
  it('correctly calculates HRA, DA, EPF, and deductions for senior faculty', () => {
    const basic = 85000;
    const breakdown = calculateSalaryBreakdown(basic);

    expect(breakdown.basic).toBe(85000);
    expect(breakdown.hra).toBe(34000); // 40%
    expect(breakdown.da).toBe(12750); // 15%
    expect(breakdown.conveyance).toBe(3200);
    expect(breakdown.specialAllowance).toBe(8500); // 10%
    expect(breakdown.grossSalary).toBe(143450);

    // EPF: 12% of (Basic + DA) = 12% of 97750
    expect(breakdown.epf).toBe(11730);
    expect(breakdown.esi).toBe(0); // Gross > 21,000
    expect(breakdown.professionalTax).toBe(200);
    expect(breakdown.tds).toBe(14345); // 10% for > 10L bracket

    expect(breakdown.totalDeductions).toBe(26275);
    expect(breakdown.netSalary).toBe(117175);
    expect(breakdown.grossSalary - breakdown.totalDeductions).toBe(breakdown.netSalary);
  });

  it('correctly converts numeric salary amounts into Indian English words', () => {
    const text = amountInWords(117175);
    expect(text).toContain('One Lakh Seventeen Thousand');
    expect(text).toContain('Rupees Only');
  });

  it('generates a valid, binary-compliant PDF salary slip', async () => {
    const breakdown = calculateSalaryBreakdown(68000);
    const pdfBytes = await generateSalarySlipPdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Vasant Kunj, New Delhi',
      affiliationNumber: '2130894',
      payslipNumber: 'PAY/2026/11/T02',
      payPeriod: 'November 2026',
      employeeCode: 'DPGA-T02',
      employeeName: 'Mrs. Sunita Deshmukh',
      designation: 'PGT Mathematics',
      department: 'Mathematics',
      joiningDate: '2021-04-10',
      bankName: 'HDFC Bank Ltd.',
      bankAccount: '•••• •••• 9012',
      pan: 'ABCPS••••K',
      pfUan: '100918239481',
      workingDays: 30,
      presentDays: 30,
      lopDays: 0,
      earnings: [
        { title: 'Basic Pay', amount: breakdown.basic },
        { title: 'HRA (40%)', amount: breakdown.hra },
        { title: 'DA (15%)', amount: breakdown.da },
      ],
      deductions: [
        { title: 'EPF (12%)', amount: breakdown.epf },
        { title: 'Professional Tax', amount: breakdown.professionalTax },
      ],
      grossEarnings: breakdown.grossSalary,
      totalDeductions: breakdown.totalDeductions,
      netPay: breakdown.netSalary,
      netPayWords: amountInWords(breakdown.netSalary),
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);
    const magicHeader = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(magicHeader).toBe('%PDF-');
  });
});
