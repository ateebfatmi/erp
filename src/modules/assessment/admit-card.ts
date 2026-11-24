/**
 * CBSE Examination Admit Card & Hall Ticket Engine
 * Statutory Compliance: CBSE Examination Bye-Laws Rule 13 (Attendance >= 75%),
 * Rule 14 (Roll Number and Admit Card Issuance), and Rule 15 (Examination Centers).
 */

export interface AdmitCardSubjectSchedule {
  subjectCode: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  dayOfWeek: string;
  reportingTime: string;
  readingTime: string;
  examTiming: string;
}

export interface CbseAdmitCard {
  rollNumber: string; // 8-digit official CBSE roll number
  locRegistrationNumber: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: 'MALE' | 'FEMALE';
  schoolName: string;
  schoolCode: string;
  centerCode: string;
  centerName: string;
  centerAddress: string;
  gradeClass: string;
  academicSession: string;
  attendancePercentage: number;
  isAttendanceQualified: boolean; // Must be >= 75%
  noDuesCleared: boolean;
  cwsnConcessions?: string;
  subjects: AdmitCardSubjectSchedule[];
  admitCardSerial: string;
  verificationQrHash: string;
  status: 'GENERATED_VERIFIED' | 'HELD_ATTENDANCE_SHORTAGE' | 'HELD_FEE_DUES';
  importantInstructions: string[];
}

export const CBSE_EXAM_INSTRUCTIONS: string[] = [
  'Reporting time at examination center is 09:45 AM. Center gates close strictly at 10:00 AM.',
  '15 minutes dedicated question paper reading time is provided from 10:15 AM to 10:30 AM.',
  'Candidates must be in proper school uniform and carry their original School Identity Card alongside this Admit Card.',
  'Electronic devices including mobile phones, Bluetooth earphones, smartwatches, and programmable calculators are strictly barred.',
  'Permitted stationary: Transparent pouch with blue/royal blue ballpoint pens, pencil, eraser, and transparent water bottle.',
  'Any unfair means (UFM) will lead to debarment from the examination per CBSE Examination Bye-Laws.',
];

/**
 * Compiles a certified CBSE Board Examination Admit Card validating attendance and fees
 */
export function generateCbseAdmitCard(params: {
  rollNumber: string;
  locRegistrationNumber: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: 'MALE' | 'FEMALE';
  gradeClass: string;
  academicSession?: string;
  attendancePercentage: number;
  noDuesCleared: boolean;
  cwsnConcessions?: string;
  subjects: AdmitCardSubjectSchedule[];
  centerCode?: string;
  centerName?: string;
  centerAddress?: string;
}): CbseAdmitCard {
  const isAttendanceQualified = params.attendancePercentage >= 75;
  const serial = `CBSE-AC/2025/${params.rollNumber}`;
  const qrHash = `CBSE-VER-2025-${Buffer.from(`${params.rollNumber}:${params.locRegistrationNumber}:${params.candidateName}`).toString('base64').substring(0, 16)}`;

  let status: CbseAdmitCard['status'] = 'GENERATED_VERIFIED';

  if (!isAttendanceQualified) {
    status = 'HELD_ATTENDANCE_SHORTAGE';
  } else if (!params.noDuesCleared) {
    status = 'HELD_FEE_DUES';
  }

  return {
    rollNumber: params.rollNumber,
    locRegistrationNumber: params.locRegistrationNumber,
    candidateName: params.candidateName,
    motherName: params.motherName,
    fatherName: params.fatherName,
    gender: params.gender,
    schoolName: 'Delhi Public Global Academy',
    schoolCode: '70842',
    centerCode: params.centerCode || '814012',
    centerName: params.centerName || 'Delhi Public School, Sector 30, Noida',
    centerAddress: params.centerAddress || 'Sector 30, Gautam Buddha Nagar, Noida, UP 201301',
    gradeClass: params.gradeClass,
    academicSession: params.academicSession || '2024-25',
    attendancePercentage: params.attendancePercentage,
    isAttendanceQualified,
    noDuesCleared: params.noDuesCleared,
    cwsnConcessions: params.cwsnConcessions,
    subjects: params.subjects,
    admitCardSerial: serial,
    verificationQrHash: qrHash,
    status,
    importantInstructions: CBSE_EXAM_INSTRUCTIONS,
  };
}

/**
 * Verifies if student can print / download admit card
 */
export function verifyAdmitCardRelease(card: CbseAdmitCard): {
  canDownload: boolean;
  blockingReason?: string;
} {
  if (card.status === 'HELD_ATTENDANCE_SHORTAGE') {
    return {
      canDownload: false,
      blockingReason: `CBSE Rule 13 Attendance Shortage: Current attendance is ${card.attendancePercentage}% (minimum required is 75%). Requires Regional Officer condonation.`,
    };
  }

  if (card.status === 'HELD_FEE_DUES') {
    return {
      canDownload: false,
      blockingReason: 'Outstanding Fee Dues: Please clear term fee dues with the Accounts Cell to unlock your official Hall Ticket.',
    };
  }

  return { canDownload: true };
}

/**
 * Pre-seeded Class 10 Board Exam Schedule (Aarav Mehta)
 */
export const SAMPLE_CLASS_10_SUBJECTS: AdmitCardSubjectSchedule[] = [
  {
    subjectCode: '184',
    subjectName: 'English Language & Literature',
    examDate: '2025-02-21',
    dayOfWeek: 'Friday',
    reportingTime: '09:45 AM',
    readingTime: '10:15 AM - 10:30 AM',
    examTiming: '10:30 AM - 01:30 PM',
  },
  {
    subjectCode: '085',
    subjectName: 'Hindi Course - B',
    examDate: '2025-02-28',
    dayOfWeek: 'Friday',
    reportingTime: '09:45 AM',
    readingTime: '10:15 AM - 10:30 AM',
    examTiming: '10:30 AM - 01:30 PM',
  },
  {
    subjectCode: '086',
    subjectName: 'Science (Theory)',
    examDate: '2025-03-04',
    dayOfWeek: 'Tuesday',
    reportingTime: '09:45 AM',
    readingTime: '10:15 AM - 10:30 AM',
    examTiming: '10:30 AM - 01:30 PM',
  },
  {
    subjectCode: '041',
    subjectName: 'Mathematics (Standard)',
    examDate: '2025-03-10',
    dayOfWeek: 'Monday',
    reportingTime: '09:45 AM',
    readingTime: '10:15 AM - 10:30 AM',
    examTiming: '10:30 AM - 01:30 PM',
  },
  {
    subjectCode: '087',
    subjectName: 'Social Science',
    examDate: '2025-03-15',
    dayOfWeek: 'Saturday',
    reportingTime: '09:45 AM',
    readingTime: '10:15 AM - 10:30 AM',
    examTiming: '10:30 AM - 01:30 PM',
  },
];

/**
 * Pre-seeded Sample Admit Card for Aarav Mehta
 */
export const INITIAL_ADMIT_CARD: CbseAdmitCard = generateCbseAdmitCard({
  rollNumber: '21309841',
  locRegistrationNumber: 'A/1/25/70842/0142',
  candidateName: 'Aarav Mehta',
  motherName: 'Sunita Mehta',
  fatherName: 'Rajesh Mehta',
  gender: 'MALE',
  gradeClass: 'Class 10 (Secondary School Examination)',
  academicSession: '2024-25',
  attendancePercentage: 88.4,
  noDuesCleared: true,
  cwsnConcessions: 'CWSN (Dyslexia): Scribe permitted & 60 mins compensatory extra time allowed per paper',
  subjects: SAMPLE_CLASS_10_SUBJECTS,
});
