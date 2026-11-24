/**
 * CBSE Continuous Professional Development (CPD) & Teacher Training Engine
 * Statutory Compliance: NEP 2020 Para 5.15 & CBSE Circular Acad-38/2021
 * 
 * Mandate: Every school teacher must complete a minimum of 50 hours of CPD per year:
 * - At least 25 hours conducted by CBSE Centres of Excellence (CoE) or NCERT NISHTHA on DIKSHA.
 * - Remaining 25 hours through school in-house workshops, collaborative learning, or MOOCs.
 */

export type CpdAgencyType =
  | 'CBSE_COE_ONLINE'
  | 'CBSE_COE_OFFLINE'
  | 'NCERT_NISHTHA_DIKSHA'
  | 'IN_HOUSE_SCHOOL_WORKSHOP'
  | 'UNIVERSITY_MOOC';

export type CpdTheme =
  | 'PEDAGOGY_AND_LESSON_PLANNING'
  | 'NEP_2020_HOLISTIC_ASSESSMENT'
  | 'INCLUSIVE_EDUCATION_AND_CWSN'
  | 'CYBER_SAFETY_AND_DIGITAL_LITERACY'
  | 'EXPERIENTIAL_AND_ART_INTEGRATED_LEARNING'
  | 'MENTAL_HEALTH_AND_ADOLESCENT_COUNSELING';

export type CpdVerificationStatus = 'SUBMITTED' | 'VERIFIED_BY_PRINCIPAL' | 'REJECTED';

export interface CpdTrainingRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  designation: string; // e.g. "PGT Mathematics"
  programTitle: string;
  organizingAgency: CpdAgencyType;
  theme: CpdTheme;
  completionDate: string; // YYYY-MM-DD
  durationHours: number;
  certificateNumber: string;
  certificateUrl?: string;
  status: CpdVerificationStatus;
  principalRemarks?: string;
}

export interface CpdProgressSummary {
  teacherId: string;
  totalHoursCompleted: number;
  statutoryCbseNishthaHours: number; // Must be >= 25
  inHouseAndMoocHours: number;
  targetHours: 50;
  percentageCompleted: number;
  isCompliant: boolean;
  hoursNeededForCompliance: number;
  verifiedHours: number;
}

/**
 * Calculates a faculty member's progress toward the statutory 50-hour CBSE CPD quota
 */
export function calculateCpdProgress(
  teacherId: string,
  records: CpdTrainingRecord[]
): CpdProgressSummary {
  const teacherRecords = records.filter(
    (r) => r.teacherId === teacherId && r.status !== 'REJECTED'
  );

  let totalHours = 0;
  let cbseNishthaHours = 0;
  let inHouseHours = 0;
  let verifiedHours = 0;

  for (const rec of teacherRecords) {
    totalHours += rec.durationHours;

    if (
      rec.organizingAgency === 'CBSE_COE_ONLINE' ||
      rec.organizingAgency === 'CBSE_COE_OFFLINE' ||
      rec.organizingAgency === 'NCERT_NISHTHA_DIKSHA'
    ) {
      cbseNishthaHours += rec.durationHours;
    } else {
      inHouseHours += rec.durationHours;
    }

    if (rec.status === 'VERIFIED_BY_PRINCIPAL') {
      verifiedHours += rec.durationHours;
    }
  }

  // Compliant if total >= 50 AND cbse/nishtha >= 25
  const isCompliant = totalHours >= 50 && cbseNishthaHours >= 25;
  const hoursNeeded = Math.max(0, 50 - totalHours);
  const percentageCompleted = Math.min(100, Math.round((totalHours / 50) * 100));

  return {
    teacherId,
    totalHoursCompleted: totalHours,
    statutoryCbseNishthaHours: cbseNishthaHours,
    inHouseAndMoocHours: inHouseHours,
    targetHours: 50,
    percentageCompleted,
    isCompliant,
    hoursNeededForCompliance: hoursNeeded,
    verifiedHours,
  };
}

/**
 * Validates and logs a new CPD training certificate submission
 */
export function logCpdTraining(params: {
  teacherId: string;
  teacherName: string;
  designation: string;
  programTitle: string;
  organizingAgency: CpdAgencyType;
  theme: CpdTheme;
  completionDate: string;
  durationHours: number;
  certificateNumber: string;
}): CpdTrainingRecord {
  if (params.durationHours <= 0 || params.durationHours > 50) {
    throw new Error('Training duration must be between 1 and 50 hours per module');
  }

  if (!params.certificateNumber || params.certificateNumber.trim().length < 4) {
    throw new Error('A valid issuing certificate or DIKSHA transaction ID is mandatory');
  }

  const id = `CPD-${Date.now().toString().slice(-6)}`;

  return {
    id,
    teacherId: params.teacherId,
    teacherName: params.teacherName,
    designation: params.designation,
    programTitle: params.programTitle.trim(),
    organizingAgency: params.organizingAgency,
    theme: params.theme,
    completionDate: params.completionDate,
    durationHours: params.durationHours,
    certificateNumber: params.certificateNumber.trim(),
    status: 'SUBMITTED',
  };
}

/**
 * Verifies or endorses a teacher's CPD submission by the school principal / head of school
 */
export function verifyCpdTraining(
  records: CpdTrainingRecord[],
  recordId: string,
  decision: 'VERIFIED_BY_PRINCIPAL' | 'REJECTED',
  remarks?: string
): CpdTrainingRecord[] {
  return records.map((r) => {
    if (r.id !== recordId) return r;
    return {
      ...r,
      status: decision,
      principalRemarks: remarks || (decision === 'VERIFIED_BY_PRINCIPAL' ? 'Verified against CBSE CoE attendance records.' : 'Rejected'),
    };
  });
}

/**
 * Pre-seeded statutory CPD training records
 */
export const INITIAL_CPD_RECORDS: CpdTrainingRecord[] = [
  {
    id: 'CPD-90112',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    designation: 'PGT Mathematics',
    programTitle: 'NEP 2020 Competency-Based Assessment in Secondary Mathematics',
    organizingAgency: 'CBSE_COE_ONLINE',
    theme: 'NEP_2020_HOLISTIC_ASSESSMENT',
    completionDate: '2024-05-18',
    durationHours: 10,
    certificateNumber: 'CBSE/COE-NOIDA/2024/09812',
    status: 'VERIFIED_BY_PRINCIPAL',
    principalRemarks: 'Attended full online module. Endorsed for CBSE OASIS upload.',
  },
  {
    id: 'CPD-90113',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    designation: 'PGT Mathematics',
    programTitle: 'NCERT NISHTHA 2.0 — Pedagogical Leadership & Art Integration',
    organizingAgency: 'NCERT_NISHTHA_DIKSHA',
    theme: 'EXPERIENTIAL_AND_ART_INTEGRATED_LEARNING',
    completionDate: '2024-07-22',
    durationHours: 15,
    certificateNumber: 'DIKSHA/NISHTHA/2024/77412',
    status: 'VERIFIED_BY_PRINCIPAL',
    principalRemarks: 'Verified against DIKSHA QR ledger.',
  },
  {
    id: 'CPD-90114',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    designation: 'PGT Mathematics',
    programTitle: 'In-House Workshop on Designing Rubrics for 360° Holistic Progress Card',
    organizingAgency: 'IN_HOUSE_SCHOOL_WORKSHOP',
    theme: 'NEP_2020_HOLISTIC_ASSESSMENT',
    completionDate: '2024-08-30',
    durationHours: 12,
    certificateNumber: 'DPGA/INHOUSE/2024/041',
    status: 'VERIFIED_BY_PRINCIPAL',
    principalRemarks: 'Facilitated session for mathematics faculty department.',
  },
  {
    id: 'CPD-90115',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    designation: 'PGT Mathematics',
    programTitle: 'Cyber Safety in Hybrid Digital Classrooms & Student Data Protection',
    organizingAgency: 'CBSE_COE_ONLINE',
    theme: 'CYBER_SAFETY_AND_DIGITAL_LITERACY',
    completionDate: '2024-10-15',
    durationHours: 6,
    certificateNumber: 'CBSE/COE-DEL/2024/44120',
    status: 'SUBMITTED',
  },
  {
    id: 'CPD-90201',
    teacherId: 'tch-02',
    teacherName: 'Dr. Rajesh Deshmukh',
    designation: 'PGT Physics',
    programTitle: 'Experiential Physics Lab Learning & Atal Tinkering Labs (ATL) Integration',
    organizingAgency: 'CBSE_COE_OFFLINE',
    theme: 'EXPERIENTIAL_AND_ART_INTEGRATED_LEARNING',
    completionDate: '2024-06-12',
    durationHours: 20,
    certificateNumber: 'CBSE/COE-NOIDA/2024/11029',
    status: 'VERIFIED_BY_PRINCIPAL',
  },
];
