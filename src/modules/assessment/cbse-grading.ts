/**
 * VidyaOS CBSE 9-Point Grading & Holistic Progress Card (HPC) Engine
 * Compliant with CBSE Examination Bye-Laws & Circular Acad-05/2017
 */

export type CbseGrade = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D' | 'E';

export interface InternalAssessmentBreakdown {
  periodicTest: number; // Max 5
  multipleAssessment: number; // Max 5
  portfolio: number; // Max 5
  subjectEnrichment: number; // Max 5
}

export interface StudentSubjectScore {
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectCode: string;
  subjectName: string;
  internalAssessment: InternalAssessmentBreakdown;
  theoryMarks: number; // Max 80
}

export interface ComputedSubjectResult {
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectCode: string;
  subjectName: string;
  internalTotal: number; // /20
  theoryMarks: number; // /80
  grandTotal: number; // /100
  grade: CbseGrade;
  gradePoint: number;
  status: 'PASSED' | 'COMPARTMENT' | 'ESSENTIAL_REPEAT';
}

export interface CoScholasticGrade {
  area: 'Work Education' | 'Art Education' | 'Health & Physical Education' | 'Discipline';
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  remarks?: string;
}

export interface StudentReportSummary {
  studentId: string;
  studentName: string;
  admissionNo: string;
  classSection: string;
  subjectResults: ComputedSubjectResult[];
  coScholasticGrades: CoScholasticGrade[];
  cgpa: number;
  indicativePercentage: number;
  overallResult: 'PASSED' | 'COMPARTMENT' | 'ESSENTIAL_REPEAT';
  attendancePercent: number;
  classRank?: number;
}

/**
 * Maps percentage to CBSE 9-Point Grade and Grade Point
 */
export function getCbseGradeAndPoint(marksOutOf100: number): { grade: CbseGrade; gradePoint: number } {
  const rounded = Math.round(marksOutOf100);
  if (rounded >= 91) return { grade: 'A1', gradePoint: 10.0 };
  if (rounded >= 81) return { grade: 'A2', gradePoint: 9.0 };
  if (rounded >= 71) return { grade: 'B1', gradePoint: 8.0 };
  if (rounded >= 61) return { grade: 'B2', gradePoint: 7.0 };
  if (rounded >= 51) return { grade: 'C1', gradePoint: 6.0 };
  if (rounded >= 41) return { grade: 'C2', gradePoint: 5.0 };
  if (rounded >= 33) return { grade: 'D', gradePoint: 4.0 };
  return { grade: 'E', gradePoint: 0.0 };
}

/**
 * Computes individual subject marks, total out of 100, and pass status
 * (Passing rule: minimum 33% overall and in theory)
 */
export function computeSubjectScore(score: StudentSubjectScore): ComputedSubjectResult {
  const ia = score.internalAssessment;
  const clampedPT = Math.min(5, Math.max(0, ia.periodicTest));
  const clampedMA = Math.min(5, Math.max(0, ia.multipleAssessment));
  const clampedPF = Math.min(5, Math.max(0, ia.portfolio));
  const clampedSE = Math.min(5, Math.max(0, ia.subjectEnrichment));

  const internalTotal = Math.round((clampedPT + clampedMA + clampedPF + clampedSE) * 10) / 10;
  const clampedTheory = Math.min(80, Math.max(0, score.theoryMarks));
  const grandTotal = Math.round((internalTotal + clampedTheory) * 10) / 10;

  const { grade, gradePoint } = getCbseGradeAndPoint(grandTotal);

  let status: 'PASSED' | 'COMPARTMENT' | 'ESSENTIAL_REPEAT' = 'PASSED';
  if (grandTotal < 33 || clampedTheory < 26) {
    status = 'COMPARTMENT';
  }

  return {
    studentId: score.studentId,
    studentName: score.studentName,
    rollNo: score.rollNo,
    subjectCode: score.subjectCode,
    subjectName: score.subjectName,
    internalTotal,
    theoryMarks: clampedTheory,
    grandTotal,
    grade,
    gradePoint,
    status,
  };
}

/**
 * Computes Cumulative Grade Point Average (CGPA) and Indicative Percentage
 * per official CBSE formula: Indicative % = CGPA * 9.5
 */
export function calculateCumulativeCGPA(subjects: ComputedSubjectResult[]): {
  cgpa: number;
  indicativePercentage: number;
  overallResult: 'PASSED' | 'COMPARTMENT' | 'ESSENTIAL_REPEAT';
} {
  if (subjects.length === 0) {
    return { cgpa: 0, indicativePercentage: 0, overallResult: 'PASSED' };
  }

  const failedCount = subjects.filter((s) => s.status === 'COMPARTMENT').length;
  let overallResult: 'PASSED' | 'COMPARTMENT' | 'ESSENTIAL_REPEAT' = 'PASSED';
  if (failedCount === 1) {
    overallResult = 'COMPARTMENT';
  } else if (failedCount > 1) {
    overallResult = 'ESSENTIAL_REPEAT';
  }

  const totalPoints = subjects.reduce((sum, s) => sum + s.gradePoint, 0);
  const cgpa = Math.round((totalPoints / subjects.length) * 100) / 100;
  const indicativePercentage = Math.round(cgpa * 9.5 * 10) / 10;

  return {
    cgpa,
    indicativePercentage,
    overallResult,
  };
}
