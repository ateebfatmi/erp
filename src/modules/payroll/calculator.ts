import { Employee } from '@/lib/database/types';

export interface SalaryBreakdown {
  basic: number;
  hra: number;
  da: number;
  conveyance: number;
  specialAllowance: number;
  grossSalary: number;
  epf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  totalDeductions: number;
  netSalary: number;
}

export interface SalarySlipPayload {
  slipId: string;
  month: string;
  year: number;
  employee: Employee;
  bankAccount: string;
  panNumber: string;
  pfUan: string;
  totalWorkingDays: number;
  presentDays: number;
  leaveDays: number;
  breakdown: SalaryBreakdown;
  generatedAt: string;
}

/**
 * Calculates Indian statutory payroll breakdown from employee basic pay
 */
export function calculateSalaryBreakdown(basicPay: number): SalaryBreakdown {
  const basic = Math.round(basicPay);
  // HRA: 40% of Basic
  const hra = Math.round(basic * 0.40);
  // DA (Dearness Allowance): 15% of Basic
  const da = Math.round(basic * 0.15);
  // Conveyance Allowance: Flat ₹3,200
  const conveyance = 3200;
  // Special Allowance: 10% of Basic
  const specialAllowance = Math.round(basic * 0.10);

  const grossSalary = basic + hra + da + conveyance + specialAllowance;

  // EPF: 12% of (Basic + DA), standard EPFO statutory guideline
  const epfWage = basic + da;
  const epf = Math.round(epfWage * 0.12);

  // ESI: 0.75% if Gross <= 21,000, otherwise 0
  const esi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;

  // Professional Tax: standard slab (₹200/mo)
  const professionalTax = 200;

  // TDS (Estimated Income Tax TDS for annual bracket)
  let tds = 0;
  const annualized = grossSalary * 12;
  if (annualized > 1000000) {
    tds = Math.round((grossSalary * 0.10));
  } else if (annualized > 700000) {
    tds = Math.round((grossSalary * 0.05));
  }

  const totalDeductions = epf + esi + professionalTax + tds;
  const netSalary = grossSalary - totalDeductions;

  return {
    basic,
    hra,
    da,
    conveyance,
    specialAllowance,
    grossSalary,
    epf,
    esi,
    professionalTax,
    tds,
    totalDeductions,
    netSalary,
  };
}

/**
 * Converts a number to Indian Rupee Words (e.g. "One Lakh Twenty Thousand Only")
 */
export function amountInWords(num: number): string {
  if (num === 0) return 'Zero Rupees';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertBelowHundred(n: number): string {
    if (n < 20) return a[n] || '';
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return (b[tens] ? b[tens] + (units ? ' ' + a[units] : '') : '').trim();
  }

  function convertBelowThousand(n: number): string {
    const hundred = Math.floor(n / 100);
    const rem = n % 100;
    let res = '';
    if (hundred > 0) {
      res += (a[hundred] || '') + ' Hundred';
    }
    if (rem > 0) {
      res += (res ? ' and ' : '') + convertBelowHundred(rem);
    }
    return res.trim();
  }

  let remaining = Math.floor(Math.abs(num));
  let result = '';

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crore > 0) {
    result += convertBelowThousand(crore) + ' Crore ';
  }

  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakh > 0) {
    result += convertBelowThousand(lakh) + ' Lakh ';
  }

  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousand > 0) {
    result += convertBelowThousand(thousand) + ' Thousand ';
  }

  if (remaining > 0) {
    result += convertBelowThousand(remaining) + ' ';
  }

  const trimmed = result.trim();
  return trimmed ? `${trimmed} Rupees Only` : 'Zero Rupees';
}
