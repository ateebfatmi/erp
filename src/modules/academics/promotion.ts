/**
 * VidyaOS Academic Session Rollover & Annual Student Promotion Engine
 * Compliant with CBSE Examination Byelaws & Right to Education (RTE) Progression Rules
 */

export type PromotionStatus = 'PROMOTED' | 'PROMOTED_WITH_GRACE' | 'COMPARTMENT' | 'DETAINED' | 'GRADUATED_ALUMNI';

export interface PromotionCandidate {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  currentClass: string; // e.g. "Class 10"
  currentSection: string; // e.g. "Section A"
  rollNo: string;
  academicPercentage: number;
  failedSubjectsCount: number;
  attendancePercentage: number;
  hasMedicalCondonation: boolean;
}

export interface PromotionDecision {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  fromClass: string;
  toClass: string;
  targetSection: string;
  status: PromotionStatus;
  reason: string;
}

export interface SessionRolloverSummary {
  fromSession: string; // "2024-2025"
  toSession: string; // "2025-2026"
  totalCandidates: number;
  promotedCount: number;
  graduatedCount: number;
  compartmentCount: number;
  detainedCount: number;
  decisions: PromotionDecision[];
}

/**
 * Standard progression map from Grade 1 through Grade 12
 */
export const CLASS_PROGRESSION_MAP: Record<string, string> = {
  'Nursery': 'LKG',
  'LKG': 'UKG',
  'UKG': 'Class 1',
  'Class 1': 'Class 2',
  'Class 2': 'Class 3',
  'Class 3': 'Class 4',
  'Class 4': 'Class 5',
  'Class 5': 'Class 6',
  'Class 6': 'Class 7',
  'Class 7': 'Class 8',
  'Class 8': 'Class 9',
  'Class 9': 'Class 10',
  'Class 10': 'Class 11',
  'Class 11': 'Class 12',
  'Class 12': 'ALUMNI',
};

/**
 * Evaluates individual student progression for session rollover
 */
export function evaluateStudentPromotion(
  candidate: PromotionCandidate,
  targetSection: string = 'Section A'
): PromotionDecision {
  const minAttendance = candidate.hasMedicalCondonation ? 60 : 75;
  const attendancePassed = candidate.attendancePercentage >= minAttendance;

  const nextClass = CLASS_PROGRESSION_MAP[candidate.currentClass] || 'Class 11';

  // 1. Terminal Class 12 Graduation
  if (candidate.currentClass === 'Class 12') {
    if (candidate.failedSubjectsCount === 0 && candidate.academicPercentage >= 33 && attendancePassed) {
      return {
        enrollmentId: candidate.enrollmentId,
        studentId: candidate.studentId,
        studentName: candidate.studentName,
        fromClass: candidate.currentClass,
        toClass: 'ALUMNI',
        targetSection: 'Graduated Batch',
        status: 'GRADUATED_ALUMNI',
        reason: 'Successfully completed Senior Secondary (Class 12). Ready for Transfer Certificate & Migration.',
      };
    }
  }

  // 2. Attendance Shortfall Check
  if (!attendancePassed) {
    return {
      enrollmentId: candidate.enrollmentId,
      studentId: candidate.studentId,
      studentName: candidate.studentName,
      fromClass: candidate.currentClass,
      toClass: candidate.currentClass,
      targetSection: candidate.currentSection,
      status: 'DETAINED',
      reason: `Attendance shortage (${candidate.attendancePercentage}% < required ${minAttendance}%). Disqualified under CBSE Rule 13.`,
    };
  }

  // 3. Academic Failure Checks
  if (candidate.failedSubjectsCount > 1) {
    return {
      enrollmentId: candidate.enrollmentId,
      studentId: candidate.studentId,
      studentName: candidate.studentName,
      fromClass: candidate.currentClass,
      toClass: candidate.currentClass,
      targetSection: candidate.currentSection,
      status: 'DETAINED',
      reason: `Failed in ${candidate.failedSubjectsCount} subjects. Essential repeat required per CBSE guidelines.`,
    };
  }

  if (candidate.failedSubjectsCount === 1) {
    return {
      enrollmentId: candidate.enrollmentId,
      studentId: candidate.studentId,
      studentName: candidate.studentName,
      fromClass: candidate.currentClass,
      toClass: candidate.currentClass,
      targetSection: candidate.currentSection,
      status: 'COMPARTMENT',
      reason: 'Eligible for Compartmental Supplementary Examination in July 2025.',
    };
  }

  // 4. Clean Promotion
  return {
    enrollmentId: candidate.enrollmentId,
    studentId: candidate.studentId,
    studentName: candidate.studentName,
    fromClass: candidate.currentClass,
    toClass: nextClass,
    targetSection: targetSection,
    status: 'PROMOTED',
    reason: `Cleared all subjects with ${candidate.academicPercentage}% marks and ${candidate.attendancePercentage}% attendance. Promoted to ${nextClass}.`,
  };
}

/**
 * Executes a simulated batch session rollover for a cohort of students
 */
export function executeSessionRollover(
  candidates: PromotionCandidate[],
  fromSession: string = '2024-2025',
  toSession: string = '2025-2026'
): SessionRolloverSummary {
  const decisions = candidates.map((c) => evaluateStudentPromotion(c));

  const promotedCount = decisions.filter((d) => d.status === 'PROMOTED' || d.status === 'PROMOTED_WITH_GRACE').length;
  const graduatedCount = decisions.filter((d) => d.status === 'GRADUATED_ALUMNI').length;
  const compartmentCount = decisions.filter((d) => d.status === 'COMPARTMENT').length;
  const detainedCount = decisions.filter((d) => d.status === 'DETAINED').length;

  return {
    fromSession,
    toSession,
    totalCandidates: candidates.length,
    promotedCount,
    graduatedCount,
    compartmentCount,
    detainedCount,
    decisions,
  };
}
