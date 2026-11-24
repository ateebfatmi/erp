import { NextRequest, NextResponse } from 'next/server';
import { generateSalarySlipPdf } from '@/modules/documents/pdf-generator';
import { calculateSalaryBreakdown, amountInWords } from '@/modules/payroll/calculator';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const employees = await repository.getEmployees(MOCK_TENANT.id);
  const emp = employees.find((e) => e.id === id || e.employee_code === id) || employees[0];

  const breakdown = calculateSalaryBreakdown(emp?.basic_salary || 65000);
  const monthName = 'November 2026';

  const pdfBytes = await generateSalarySlipPdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city}`,
    affiliationNumber: MOCK_TENANT.affiliation_number || 'CBSE/AFF/2130894',
    payslipNumber: `PAY/${monthName.replace(' ', '/')}/${emp?.employee_code || 'T01'}`,
    payPeriod: monthName,
    employeeCode: emp?.employee_code || 'DPGA-T01',
    employeeName: emp?.full_name || 'Dr. Rajeshwar Sharma',
    designation: emp?.designation_name || 'Senior PGT & Vice Principal',
    department: emp?.department_name || 'Physics & Academics',
    joiningDate: emp?.joining_date || '2020-06-15',
    bankName: 'HDFC Bank Ltd.',
    bankAccount: '•••• •••• 9012',
    pan: 'ABCPS••••K',
    pfUan: '100918239481',
    workingDays: 30,
    presentDays: 30,
    lopDays: 0,
    earnings: [
      { title: 'Basic Pay', amount: breakdown.basic },
      { title: 'House Rent Allowance (HRA 40%)', amount: breakdown.hra },
      { title: 'Dearness Allowance (DA 15%)', amount: breakdown.da },
      { title: 'Conveyance Allowance', amount: breakdown.conveyance },
      { title: 'Special Academic Allowance', amount: breakdown.specialAllowance },
    ],
    deductions: [
      { title: 'Employee Provident Fund (EPF 12%)', amount: breakdown.epf },
      { title: 'Employee State Insurance (ESIC)', amount: breakdown.esi },
      { title: 'Professional Tax (PT)', amount: breakdown.professionalTax },
      { title: 'TDS / Income Tax Withholding', amount: breakdown.tds },
    ],
    grossEarnings: breakdown.grossSalary,
    totalDeductions: breakdown.totalDeductions,
    netPay: breakdown.netSalary,
    netPayWords: amountInWords(breakdown.netSalary),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="payslip_${emp?.employee_code || 'emp'}_${monthName.replace(' ', '_')}.pdf"`,
    },
  });
}
