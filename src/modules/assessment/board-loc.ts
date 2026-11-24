/**
 * VidyaOS - CBSE Board Examination List of Candidates (LOC) Verification Engine
 * Compliant with CBSE Examination By-Laws and Pariksha Sangam Portal Specifications
 */

export type BoardClass = 'class_10' | 'class_12';

export type SubjectType = 'compulsory' | 'elective' | 'skill' | 'internal_assessment';

export type CWSNConcession =
  | 'none'
  | 'extra_time_20m'
  | 'scribe_reader'
  | 'exempt_math_2nd_lang'
  | 'computer_assisted';

export interface CandidateSubject {
  code: string;
  name: string;
  type: SubjectType;
  hasPractical: boolean;
}

export interface LOCCandidate {
  id: string;
  admissionNumber: string;
  cbseRegNo: string;
  rollNo?: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: 'M' | 'F' | 'O';
  dob: string; // YYYY-MM-DD
  udisePEN: string; // 11-digit Permanent Education Number
  aadharNumber: string; // 12-digit UID
  cwsnCategory: CWSNConcession;
  boardClass: BoardClass;
  section: string;
  stream?: 'Science' | 'Commerce' | 'Humanities' | 'General';
  subjects: CandidateSubject[];
  photoWithDateVerified: boolean;
  signatureVerified: boolean;
  migrationRequired: boolean;
  feeAmount: number;
  validationStatus: 'verified' | 'data_error' | 'approved_by_principal';
  validationErrors: string[];
}

export interface LOCSummary {
  totalCandidates: number;
  class10Count: number;
  class12Count: number;
  verifiedCount: number;
  dataErrorCount: number;
  cwsnCount: number;
  totalCBSEFeeLiability: number;
}

export function formatCWSNConcession(c: CWSNConcession): string {
  switch (c) {
    case 'none':
      return 'General (No Concessions)';
    case 'extra_time_20m':
      return 'Compensatory Extra Time (20 mins/hr)';
    case 'scribe_reader':
      return 'Authorized Scribe & Reader';
    case 'exempt_math_2nd_lang':
      return 'Exempt from Standard Math / 2nd Language';
    case 'computer_assisted':
      return 'Computer-Aided Examination';
  }
}

/**
 * Validates candidate against strict CBSE Pariksha Sangam rules:
 * 1. 11-digit UDISE PEN
 * 2. 12-digit Aadhar
 * 3. Min 5 academic subjects
 * 4. Mutually exclusive subjects check (e.g. cannot take Math Standard 041 AND Math Basic 241)
 * 5. Photo & Signature verification
 * 6. Calculates statutory CBSE examination fee
 */
export function validateCandidateLOC(candidate: LOCCandidate): {
  isValid: boolean;
  errors: string[];
  calculatedFee: number;
} {
  const errors: string[] = [];

  // 1. UDISE PEN validation (11 numeric digits)
  const penDigits = candidate.udisePEN.replace(/\D/g, '');
  if (penDigits.length !== 11) {
    errors.push(`Invalid UDISE+ PEN: Expected 11 digits, found ${penDigits.length}`);
  }

  // 2. Aadhar validation (12 numeric digits)
  const aadharDigits = candidate.aadharNumber.replace(/\D/g, '');
  if (aadharDigits.length !== 12) {
    errors.push(`Invalid Aadhar Number: Expected 12 digits, found ${aadharDigits.length}`);
  }

  // 3. Subject validation
  const mainSubjects = candidate.subjects.filter((s) => s.type !== 'internal_assessment');
  if (mainSubjects.length < 5) {
    errors.push(`Candidate has only ${mainSubjects.length} main subjects. Minimum 5 subjects required by CBSE.`);
  }

  const subjectCodes = mainSubjects.map((s) => s.code.trim());

  // Check mutually exclusive Mathematics in Class 10
  if (candidate.boardClass === 'class_10') {
    const hasMathStd = subjectCodes.includes('041');
    const hasMathBasic = subjectCodes.includes('241');
    if (hasMathStd && hasMathBasic) {
      errors.push('Conflicting Mathematics: Cannot enroll in both Math Standard (041) and Math Basic (241).');
    }
  }

  // Check mutually exclusive Hindi in Class 10
  const hasHindiA = subjectCodes.includes('002');
  const hasHindiB = subjectCodes.includes('085');
  if (hasHindiA && hasHindiB) {
    errors.push('Conflicting Hindi: Cannot enroll in both Hindi Course-A (002) and Course-B (085).');
  }

  // 4. Photo & Signature checks
  if (!candidate.photoWithDateVerified) {
    errors.push('CBSE Photo Verification Pending: Photo must have candidate name & capture date printed at bottom.');
  }
  if (!candidate.signatureVerified) {
    errors.push('Candidate digital signature in black ink not verified.');
  }

  // 5. Fee Calculation per CBSE Exam By-Laws
  // Base fee: ₹1,500 for 5 main subjects
  let calculatedFee = 1500;
  if (mainSubjects.length > 5) {
    // Additional subject fee: ₹300 per subject beyond 5
    calculatedFee += (mainSubjects.length - 5) * 300;
  }

  // Class 12 practical fee: ₹150 per subject with practicals
  if (candidate.boardClass === 'class_12') {
    const practicalCount = mainSubjects.filter((s) => s.hasPractical).length;
    calculatedFee += practicalCount * 150;
  }

  // Migration Certificate fee: ₹350
  if (candidate.migrationRequired) {
    calculatedFee += 350;
  }

  return {
    isValid: errors.length === 0,
    errors,
    calculatedFee,
  };
}

/**
 * Calculates aggregate summary across candidate cohort
 */
export function calculateLOCSummary(candidates: LOCCandidate[]): LOCSummary {
  let class10Count = 0;
  let class12Count = 0;
  let verifiedCount = 0;
  let dataErrorCount = 0;
  let cwsnCount = 0;
  let totalCBSEFeeLiability = 0;

  for (const c of candidates) {
    if (c.boardClass === 'class_10') class10Count++;
    else if (c.boardClass === 'class_12') class12Count++;

    if (c.cwsnCategory !== 'none') cwsnCount++;

    const validation = validateCandidateLOC(c);
    if (validation.isValid) {
      verifiedCount++;
    } else {
      dataErrorCount++;
    }
    totalCBSEFeeLiability += validation.calculatedFee;
  }

  return {
    totalCandidates: candidates.length,
    class10Count,
    class12Count,
    verifiedCount,
    dataErrorCount,
    cwsnCount,
    totalCBSEFeeLiability,
  };
}

/**
 * Generates official Pariksha Sangam CSV export row
 */
export function formatParikshaSangamRow(c: LOCCandidate): string {
  const codes = c.subjects.map((s) => s.code).join(';');
  return `${c.cbseRegNo},${c.candidateName},${c.motherName},${c.fatherName},${c.dob},${c.gender},${c.udisePEN},${c.aadharNumber},"${codes}",${c.feeAmount},${c.cwsnCategory}`;
}

export const INITIAL_LOC_CANDIDATES: LOCCandidate[] = [
  {
    id: 'loc-001',
    admissionNumber: 'ADM-2018-0421',
    cbseRegNo: 'D/1/26/2130045/0001',
    rollNo: '14102901',
    candidateName: 'Aarav Sharma',
    motherName: 'Sunita Sharma',
    fatherName: 'Rajesh Sharma',
    gender: 'M',
    dob: '2010-04-14',
    udisePEN: '21300450011',
    aadharNumber: '542189012345',
    cwsnCategory: 'none',
    boardClass: 'class_10',
    section: 'A',
    stream: 'General',
    subjects: [
      { code: '184', name: 'ENGLISH LANG & LIT', type: 'compulsory', hasPractical: false },
      { code: '002', name: 'HINDI COURSE-A', type: 'compulsory', hasPractical: false },
      { code: '041', name: 'MATHEMATICS STANDARD', type: 'compulsory', hasPractical: false },
      { code: '086', name: 'SCIENCE', type: 'compulsory', hasPractical: true },
      { code: '087', name: 'SOCIAL SCIENCE', type: 'compulsory', hasPractical: false },
      { code: '402', name: 'INFORMATION TECHNOLOGY', type: 'skill', hasPractical: true },
      { code: '501', name: 'HEALTH & PHYSICAL ED', type: 'internal_assessment', hasPractical: false },
      { code: '502', name: 'WORK EXPERIENCE', type: 'internal_assessment', hasPractical: false },
    ],
    photoWithDateVerified: true,
    signatureVerified: true,
    migrationRequired: false,
    feeAmount: 1800, // 1500 (5 sub) + 300 (6th sub)
    validationStatus: 'verified',
    validationErrors: [],
  },
  {
    id: 'loc-002',
    admissionNumber: 'ADM-2018-0425',
    cbseRegNo: 'D/1/26/2130045/0002',
    rollNo: '14102902',
    candidateName: 'Diya Sengupta',
    motherName: 'Mousumi Sengupta',
    fatherName: 'Subir Sengupta',
    gender: 'F',
    dob: '2010-09-22',
    udisePEN: '21300450012',
    aadharNumber: '892134567890',
    cwsnCategory: 'extra_time_20m',
    boardClass: 'class_10',
    section: 'B',
    stream: 'General',
    subjects: [
      { code: '184', name: 'ENGLISH LANG & LIT', type: 'compulsory', hasPractical: false },
      { code: '085', name: 'HINDI COURSE-B', type: 'compulsory', hasPractical: false },
      { code: '241', name: 'MATHEMATICS BASIC', type: 'compulsory', hasPractical: false },
      { code: '086', name: 'SCIENCE', type: 'compulsory', hasPractical: true },
      { code: '087', name: 'SOCIAL SCIENCE', type: 'compulsory', hasPractical: false },
      { code: '417', name: 'ARTIFICIAL INTELLIGENCE', type: 'skill', hasPractical: true },
    ],
    photoWithDateVerified: true,
    signatureVerified: true,
    migrationRequired: false,
    feeAmount: 1800,
    validationStatus: 'verified',
    validationErrors: [],
  },
  {
    id: 'loc-003',
    admissionNumber: 'ADM-2018-0430',
    cbseRegNo: 'D/1/26/2130045/0003',
    candidateName: 'Rohan Mehra',
    motherName: 'Neelam Mehra',
    fatherName: 'Vikram Mehra',
    gender: 'M',
    dob: '2010-11-05',
    udisePEN: '2130045', // Error: only 7 digits
    aadharNumber: '998877', // Error: only 6 digits
    cwsnCategory: 'none',
    boardClass: 'class_10',
    section: 'A',
    stream: 'General',
    subjects: [
      { code: '184', name: 'ENGLISH LANG & LIT', type: 'compulsory', hasPractical: false },
      { code: '041', name: 'MATHEMATICS STANDARD', type: 'compulsory', hasPractical: false },
      { code: '241', name: 'MATHEMATICS BASIC', type: 'compulsory', hasPractical: false }, // Conflict!
      { code: '086', name: 'SCIENCE', type: 'compulsory', hasPractical: true },
    ],
    photoWithDateVerified: false,
    signatureVerified: false,
    migrationRequired: true,
    feeAmount: 1850,
    validationStatus: 'data_error',
    validationErrors: [
      'Invalid UDISE+ PEN: Expected 11 digits, found 7',
      'Invalid Aadhar Number: Expected 12 digits, found 6',
      'Candidate has only 4 main subjects. Minimum 5 subjects required by CBSE.',
      'Conflicting Mathematics: Cannot enroll in both Math Standard (041) and Math Basic (241).',
      'CBSE Photo Verification Pending: Photo must have candidate name & capture date printed at bottom.',
      'Candidate digital signature in black ink not verified.',
    ],
  },
  {
    id: 'loc-004',
    admissionNumber: 'ADM-2016-0188',
    cbseRegNo: 'D/2/26/2130045/0014',
    rollNo: '24601814',
    candidateName: 'Tanvi Aggarwal',
    motherName: 'Pooja Aggarwal',
    fatherName: 'Sanjay Aggarwal',
    gender: 'F',
    dob: '2008-07-19',
    udisePEN: '21300450014',
    aadharNumber: '671234567890',
    cwsnCategory: 'none',
    boardClass: 'class_12',
    section: 'A',
    stream: 'Science',
    subjects: [
      { code: '301', name: 'ENGLISH CORE', type: 'compulsory', hasPractical: false },
      { code: '042', name: 'PHYSICS', type: 'elective', hasPractical: true },
      { code: '043', name: 'CHEMISTRY', type: 'elective', hasPractical: true },
      { code: '041', name: 'MATHEMATICS', type: 'elective', hasPractical: false },
      { code: '083', name: 'COMPUTER SCIENCE', type: 'elective', hasPractical: true },
    ],
    photoWithDateVerified: true,
    signatureVerified: true,
    migrationRequired: true,
    feeAmount: 2300, // 1500 + (3 * 150 practicals) + 350 migration = 2300
    validationStatus: 'approved_by_principal',
    validationErrors: [],
  },
  {
    id: 'loc-005',
    admissionNumber: 'ADM-2016-0195',
    cbseRegNo: 'D/2/26/2130045/0015',
    rollNo: '24601815',
    candidateName: 'Harshvardhan Singh',
    motherName: 'Kavita Singh',
    fatherName: 'Digvijay Singh',
    gender: 'M',
    dob: '2008-12-03',
    udisePEN: '21300450015',
    aadharNumber: '445566778899',
    cwsnCategory: 'none',
    boardClass: 'class_12',
    section: 'B',
    stream: 'Commerce',
    subjects: [
      { code: '301', name: 'ENGLISH CORE', type: 'compulsory', hasPractical: false },
      { code: '055', name: 'ACCOUNTANCY', type: 'elective', hasPractical: true },
      { code: '054', name: 'BUSINESS STUDIES', type: 'elective', hasPractical: true },
      { code: '030', name: 'ECONOMICS', type: 'elective', hasPractical: true },
      { code: '048', name: 'PHYSICAL EDUCATION', type: 'elective', hasPractical: true },
      { code: '041', name: 'APPLIED MATHEMATICS', type: 'skill', hasPractical: false },
    ],
    photoWithDateVerified: true,
    signatureVerified: true,
    migrationRequired: false,
    feeAmount: 2400, // 1500 (5 sub) + 300 (6th sub) + (4 * 150 practicals) = 2400
    validationStatus: 'verified',
    validationErrors: [],
  },
];
