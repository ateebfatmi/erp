/**
 * Section 80C Statutory Tuition Fee Certificate Generator
 * Compliance: Section 80C(2)(xvii) of the Income Tax Act, 1961 (India)
 * 
 * Under Section 80C, deduction is admissible only on pure "Tuition Fee" paid
 * for full-time education of any two children. Development charges, transport,
 * admission fee, hostel fee, and activity charges are strictly ineligible.
 */

export interface FeeItemBreakdown {
  receiptNumber: string;
  paymentDate: string; // YYYY-MM-DD
  quarter: 'Q1 (Apr-Jun)' | 'Q2 (Jul-Sep)' | 'Q3 (Oct-Dec)' | 'Q4 (Jan-Mar)';
  totalAmountPaid: number;
  eligibleTuitionFee: number;
  ineligibleOtherCharges: number;
  paymentMode: string;
}

export interface Section80CCertificate {
  certificateNumber: string;
  financialYear: string; // e.g. "2024-25"
  assessmentYear: string; // e.g. "2025-26"
  issueDate: string;
  student: {
    fullName: string;
    admissionNumber: string;
    gradeClass: string;
    section: string;
    rollNumber: string;
  };
  parent: {
    fatherOrGuardianName: string;
    motherName: string;
    parentPan?: string;
  };
  institution: {
    name: string;
    affiliationNumber: string;
    schoolCode: string;
    pan: string;
    tan: string;
    address: string;
    signatoryName: string;
    signatoryDesignation: string;
  };
  quarterlyBreakdown: FeeItemBreakdown[];
  totalEligibleAmount: number;
  totalEligibleAmountInWords: string;
  totalIneligibleAmount: number;
  verificationHash: string;
}

/**
 * Converts numeric rupee amount into Indian currency words
 */
export function convertNumberToIndianWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertTwoDigits(n: number): string {
    if (n < 20) return ones[n];
    const unit = n % 10;
    return `${tens[Math.floor(n / 10)]}${unit ? ' ' + ones[unit] : ''}`;
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) {
      res += `${ones[hundred]} Hundred`;
      if (rest > 0) res += ' and ';
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${convertTwoDigits(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${convertTwoDigits(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${convertTwoDigits(thousand)} Thousand`);
  }
  if (remainder > 0) {
    parts.push(convertThreeDigits(remainder));
  }

  return `${parts.join(' ')} Rupees Only`.replace(/\s+/g, ' ').trim();
}

/**
 * Calculates Section 80C Certificate totals and compiles certificate data
 */
export function generateSection80CCertificate(params: {
  financialYear: string;
  student: Section80CCertificate['student'];
  parent: Section80CCertificate['parent'];
  institution?: Partial<Section80CCertificate['institution']>;
  feePayments: FeeItemBreakdown[];
}): Section80CCertificate {
  const [startYear] = params.financialYear.split('-');
  const endYearNum = parseInt(startYear, 10) + 1;
  const assessmentYear = `${endYearNum}-${(endYearNum + 1).toString().slice(-2)}`;

  const totalEligible = params.feePayments.reduce((sum, item) => sum + item.eligibleTuitionFee, 0);
  const totalIneligible = params.feePayments.reduce((sum, item) => sum + item.ineligibleOtherCharges, 0);

  const certNo = `SEC80C/${params.financialYear}/${params.student.admissionNumber.replace(/[^A-Za-z0-9]/g, '')}`;
  const verificationHash = `VER-80C-${Buffer.from(`${certNo}:${totalEligible}:${params.student.admissionNumber}`).toString('base64').substring(0, 16).toUpperCase()}`;

  const defaultInst: Section80CCertificate['institution'] = {
    name: 'Delhi Public Global Academy',
    affiliationNumber: 'CBSE/AFF/2130984',
    schoolCode: '70842',
    pan: 'AAAAA0000A',
    tan: 'DELA00000A',
    address: 'Knowledge Park V, Greater Noida, Gautam Buddha Nagar, UP 201306',
    signatoryName: 'Dr. Rameshwar Sharma',
    signatoryDesignation: 'Chief Accounts & Finance Officer',
    ...params.institution,
  };

  return {
    certificateNumber: certNo,
    financialYear: params.financialYear,
    assessmentYear,
    issueDate: new Date().toISOString().split('T')[0],
    student: params.student,
    parent: params.parent,
    institution: defaultInst,
    quarterlyBreakdown: params.feePayments,
    totalEligibleAmount: totalEligible,
    totalEligibleAmountInWords: convertNumberToIndianWords(totalEligible),
    totalIneligibleAmount: totalIneligible,
    verificationHash,
  };
}

/**
 * Sample pre-populated payments for Aarav Mehta (Class 10A)
 */
export const SAMPLE_80C_PAYMENTS: FeeItemBreakdown[] = [
  {
    receiptNumber: 'RCP-2024-0891',
    paymentDate: '2024-04-10',
    quarter: 'Q1 (Apr-Jun)',
    totalAmountPaid: 22500,
    eligibleTuitionFee: 16500,
    ineligibleOtherCharges: 6000, // Transport + Lab Maintenance
    paymentMode: 'Net Banking / HDFC',
  },
  {
    receiptNumber: 'RCP-2024-1422',
    paymentDate: '2024-07-08',
    quarter: 'Q2 (Jul-Sep)',
    totalAmountPaid: 22500,
    eligibleTuitionFee: 16500,
    ineligibleOtherCharges: 6000,
    paymentMode: 'Razorpay UPI',
  },
  {
    receiptNumber: 'RCP-2024-2109',
    paymentDate: '2024-10-05',
    quarter: 'Q3 (Oct-Dec)',
    totalAmountPaid: 22500,
    eligibleTuitionFee: 16500,
    ineligibleOtherCharges: 6000,
    paymentMode: 'Razorpay Card',
  },
  {
    receiptNumber: 'RCP-2025-0312',
    paymentDate: '2025-01-12',
    quarter: 'Q4 (Jan-Mar)',
    totalAmountPaid: 22500,
    eligibleTuitionFee: 16500,
    ineligibleOtherCharges: 6000,
    paymentMode: 'Razorpay UPI',
  },
];
