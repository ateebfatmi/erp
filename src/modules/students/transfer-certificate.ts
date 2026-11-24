/**
 * CBSE Statutory School Transfer Certificate (TC) & Leaving Certificate Engine
 * Compliant with CBSE Examination & Affiliation By-Laws (Rule 14 & Rule 15):
 * - Standard 20-point statutory TC questionnaire
 * - Mandatory No-Dues reconciliation prior to issuance
 * - UDISE+ Permanent Education Number (PEN) & CBSE Registration tagging
 * - Public authenticity verification hash ledger
 */

export type TcReasonForLeaving =
  | 'PARENT_JOB_TRANSFER'
  | 'HIGHER_STUDIES'
  | 'RELOCATION_ABROAD'
  | 'FAMILY_RELOCATION'
  | 'PERSONAL_REASON';

export type TcGeneralConduct = 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';

export type TcStatus = 'ISSUED_VALID' | 'REVOKED' | 'APPLICATION_PENDING';

export interface TransferCertificateRecord {
  id: string;
  tcNumber: string; // e.g. "TC/2026/1042"
  bookNumber: string; // e.g. "BK-2026-04"
  admissionNumber: string;
  penNumber: string; // 11-digit UDISE+ Permanent Education Number
  cbseRegNumber?: string;
  studentName: string;
  motherName: string;
  fatherName: string;
  nationality: string;
  category: 'GENERAL' | 'SC' | 'ST' | 'OBC';
  dateOfBirth: string; // YYYY-MM-DD
  dateOfBirthWords: string;
  dateOfFirstAdmission: string;
  lastClassStudied: string;
  schoolBoardExamResult: string;
  whetherFailed: boolean;
  subjectsStudied: string[];
  qualifiedForPromotion: boolean;
  promotionClass?: string;
  monthUpToWhichDuesPaid: string;
  duesCleared: boolean;
  feeConcessionAvailed?: string;
  totalWorkingDays: number;
  daysPresent: number;
  nccScoutGuide?: string;
  generalConduct: TcGeneralConduct;
  applicationDate: string;
  issueDate: string;
  reasonForLeaving: TcReasonForLeaving;
  status: TcStatus;
  principalSignatory: string;
  verificationHash: string;
  remarks?: string;
}

/**
 * Converts a date into formal words for official Indian educational certificates
 */
export function convertDateToWords(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const dayWords = [
    '', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
    'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth',
    'Eighteenth', 'Nineteenth', 'Twentieth', 'Twenty-First', 'Twenty-Second', 'Twenty-Third',
    'Twenty-Fourth', 'Twenty-Fifth', 'Twenty-Sixth', 'Twenty-Seventh', 'Twenty-Eighth',
    'Twenty-Ninth', 'Thirtieth', 'Thirty-First'
  ];

  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const yearWords: Record<number, string> = {
    2008: 'Two Thousand Eight',
    2009: 'Two Thousand Nine',
    2010: 'Two Thousand Ten',
    2011: 'Two Thousand Eleven',
    2012: 'Two Thousand Twelve',
    2013: 'Two Thousand Thirteen',
    2014: 'Two Thousand Fourteen',
    2015: 'Two Thousand Fifteen',
    2016: 'Two Thousand Sixteen',
    2017: 'Two Thousand Seventeen',
    2018: 'Two Thousand Eighteen',
    2019: 'Two Thousand Nineteen',
    2020: 'Two Thousand Twenty',
  };

  const dayStr = dayWords[day] || `${day}`;
  const monthStr = monthNames[month] || `${month}`;
  const yearStr = yearWords[year] || `${year}`;

  return `${dayStr} ${monthStr} ${yearStr}`;
}

/**
 * Issues a new verified CBSE Transfer Certificate
 */
export function issueTransferCertificate(params: {
  admissionNumber: string;
  studentName: string;
  motherName: string;
  fatherName: string;
  dateOfBirth: string;
  dateOfFirstAdmission: string;
  lastClassStudied: string;
  schoolBoardExamResult: string;
  subjectsStudied: string[];
  qualifiedForPromotion: boolean;
  promotionClass?: string;
  totalWorkingDays: number;
  daysPresent: number;
  duesCleared: boolean;
  monthUpToWhichDuesPaid: string;
  reasonForLeaving: TcReasonForLeaving;
  generalConduct?: TcGeneralConduct;
  penNumber?: string;
  cbseRegNumber?: string;
  principalSignatory?: string;
}): TransferCertificateRecord {
  // Validate No-Dues rule (CBSE Rule 14.2)
  if (!params.duesCleared) {
    throw new Error(
      `Cannot issue Transfer Certificate: Outstanding dues pending for ${params.studentName} (${params.admissionNumber}). Clear accounts ledger first.`
    );
  }

  // Validate attendance plausibility
  if (params.daysPresent > params.totalWorkingDays) {
    throw new Error('Days present cannot exceed total working days');
  }

  const serial = Math.floor(1000 + Math.random() * 9000);
  const tcNumber = `TC/2026/${serial}`;
  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];
  const dobWords = convertDateToWords(params.dateOfBirth);

  // Generate digital verification checksum hash
  const hashPayload = `${tcNumber}-${params.admissionNumber}-${params.studentName}-${todayIso}`;
  let hashVal = 0;
  for (let i = 0; i < hashPayload.length; i++) {
    hashVal = (hashVal << 5) - hashVal + hashPayload.charCodeAt(i);
    hashVal |= 0;
  }
  const verificationHash = `VOS-TC-SIG-${Math.abs(hashVal).toString(16).toUpperCase().padStart(8, '0')}`;

  return {
    id: `tc-${Date.now().toString().slice(-6)}`,
    tcNumber,
    bookNumber: 'BK-2026-01',
    admissionNumber: params.admissionNumber,
    penNumber: params.penNumber || `21308${Date.now().toString().slice(-6)}`,
    cbseRegNumber: params.cbseRegNumber,
    studentName: params.studentName,
    motherName: params.motherName,
    fatherName: params.fatherName,
    nationality: 'Indian',
    category: 'GENERAL',
    dateOfBirth: params.dateOfBirth,
    dateOfBirthWords: dobWords,
    dateOfFirstAdmission: params.dateOfFirstAdmission,
    lastClassStudied: params.lastClassStudied,
    schoolBoardExamResult: params.schoolBoardExamResult,
    whetherFailed: false,
    subjectsStudied: params.subjectsStudied,
    qualifiedForPromotion: params.qualifiedForPromotion,
    promotionClass: params.promotionClass,
    monthUpToWhichDuesPaid: params.monthUpToWhichDuesPaid,
    duesCleared: params.duesCleared,
    totalWorkingDays: params.totalWorkingDays,
    daysPresent: params.daysPresent,
    generalConduct: params.generalConduct || 'EXCELLENT',
    applicationDate: todayIso,
    issueDate: todayIso,
    reasonForLeaving: params.reasonForLeaving,
    status: 'ISSUED_VALID',
    principalSignatory: params.principalSignatory || 'Dr. Anita Roy, Ph.D. (Principal)',
    verificationHash,
    remarks: 'Diligent and well-behaved student. Best wishes for future academic endeavors.',
  };
}

/**
 * Searches and validates a TC from the statutory register
 */
export function verifyTransferCertificate(
  registry: TransferCertificateRecord[],
  query: { tcNumber?: string; admissionNumber?: string }
): { isValid: boolean; certificate?: TransferCertificateRecord; reason?: string } {
  const normTc = query.tcNumber?.trim().toUpperCase();
  const normAdm = query.admissionNumber?.trim().toUpperCase();

  if (!normTc && !normAdm) {
    return { isValid: false, reason: 'Either TC Number or Admission Number must be provided.' };
  }

  const match = registry.find((rec) => {
    if (normTc && rec.tcNumber.toUpperCase() === normTc) return true;
    if (normAdm && rec.admissionNumber.toUpperCase() === normAdm) return true;
    return false;
  });

  if (!match) {
    return {
      isValid: false,
      reason: 'No matching Transfer Certificate found in the official institutional register.',
    };
  }

  if (match.status === 'REVOKED') {
    return {
      isValid: false,
      certificate: match,
      reason: 'This Transfer Certificate was officially REVOKED by the school authority.',
    };
  }

  return {
    isValid: true,
    certificate: match,
  };
}

/**
 * Pre-seeded Official Transfer Certificate Registry
 */
export const INITIAL_TC_REGISTRY: TransferCertificateRecord[] = [
  {
    id: 'tc-001',
    tcNumber: 'TC/2026/1042',
    bookNumber: 'BK-2026-01',
    admissionNumber: 'DPGA/2021/1042',
    penNumber: '21308940012',
    cbseRegNumber: 'D/26/20194/0114',
    studentName: 'Aarav Mehta',
    motherName: 'Mrs. Sunita Mehta',
    fatherName: 'Mr. Rajesh Mehta',
    nationality: 'Indian',
    category: 'GENERAL',
    dateOfBirth: '2010-04-14',
    dateOfBirthWords: 'Fourteenth April Two Thousand Ten',
    dateOfFirstAdmission: '05-Apr-2021 in Class 5',
    lastClassStudied: 'Class 10 (Tenth)',
    schoolBoardExamResult: 'CBSE Secondary School Examination (Passed)',
    whetherFailed: false,
    subjectsStudied: ['English Standard', 'Mathematics Standard', 'Science', 'Social Science', 'Hindi B'],
    qualifiedForPromotion: true,
    promotionClass: 'Class 11 (Eleventh)',
    monthUpToWhichDuesPaid: 'March 2026',
    duesCleared: true,
    totalWorkingDays: 220,
    daysPresent: 208,
    generalConduct: 'EXCELLENT',
    applicationDate: '2026-03-28',
    issueDate: '2026-04-02',
    reasonForLeaving: 'PARENT_JOB_TRANSFER',
    status: 'ISSUED_VALID',
    principalSignatory: 'Dr. Anita Roy, Ph.D. (Principal)',
    verificationHash: 'VOS-TC-SIG-84E32B01',
    remarks: 'Outstanding student; School Captain and National Science Olympiad Finalist.',
  },
  {
    id: 'tc-002',
    tcNumber: 'TC/2026/1089',
    bookNumber: 'BK-2026-01',
    admissionNumber: 'DPGA/2021/1089',
    penNumber: '21308940089',
    cbseRegNumber: 'D/26/20194/0209',
    studentName: 'Diya Sharma',
    motherName: 'Mrs. Kavita Sharma',
    fatherName: 'Dr. Neeraj Sharma',
    nationality: 'Indian',
    category: 'GENERAL',
    dateOfBirth: '2010-08-22',
    dateOfBirthWords: 'Twenty-Second August Two Thousand Ten',
    dateOfFirstAdmission: '10-Apr-2021 in Class 5',
    lastClassStudied: 'Class 10 (Tenth)',
    schoolBoardExamResult: 'CBSE Secondary School Examination (Passed)',
    whetherFailed: false,
    subjectsStudied: ['English Communicative', 'Mathematics Standard', 'Science', 'Social Science', 'Sanskrit'],
    qualifiedForPromotion: true,
    promotionClass: 'Class 11 (Eleventh)',
    monthUpToWhichDuesPaid: 'March 2026',
    duesCleared: true,
    totalWorkingDays: 220,
    daysPresent: 214,
    generalConduct: 'VERY_GOOD',
    applicationDate: '2026-03-29',
    issueDate: '2026-04-03',
    reasonForLeaving: 'HIGHER_STUDIES',
    status: 'ISSUED_VALID',
    principalSignatory: 'Dr. Anita Roy, Ph.D. (Principal)',
    verificationHash: 'VOS-TC-SIG-A7F11C90',
    remarks: 'Disciplined and diligent; Head of School Choir.',
  },
];
