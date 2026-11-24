/**
 * VidyaOS Student Leave & Parent Request Engine
 * Compliant with CBSE Examination Bye-Laws Rule 13 (75% Minimum Attendance Requirement)
 */

export type LeaveType = 'MEDICAL' | 'CASUAL' | 'FAMILY_EVENT' | 'BEREAVEMENT' | 'OUT_OF_STATION';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  rollNo: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isHalfDay: boolean;
  totalDays: number;
  reason: string;
  attachmentName?: string;
  parentContact: string;
  status: LeaveStatus;
  appliedAt: string;
  decidedAt?: string;
  teacherRemarks?: string;
}

export interface EligibilityResult {
  totalWorkingDays: number;
  presentDays: number;
  approvedLeaveDays: number;
  effectiveAttendancePercent: number;
  isEligibleForCbseExams: boolean; // >= 75%
  shortfallDays: number;
}

/**
 * Calculates number of leave days excluding Sundays
 */
export function calculateLeaveDays(startDate: string, endDate: string, isHalfDay: boolean = false): number {
  if (isHalfDay) return 0.5;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return 0;
  }

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    // 0 is Sunday
    if (cur.getDay() !== 0) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return count;
}

/**
 * Validates a leave application before parent submission
 */
export function validateLeaveRequest(data: {
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.startDate) errors.push('Start date is required');
  if (!data.endDate) errors.push('End date is required');

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start > end) {
      errors.push('Start date cannot be after end date');
    }
  }

  if (!data.reason || data.reason.trim().length < 5) {
    errors.push('Please provide a substantive reason (at least 5 characters)');
  }

  if (data.leaveType === 'MEDICAL' && (!data.reason.toLowerCase().includes('fever') && !data.reason.toLowerCase().includes('doctor') && !data.reason.toLowerCase().includes('ill') && !data.reason.toLowerCase().includes('medical') && !data.reason.toLowerCase().includes('sick'))) {
    // Soft reminder or non-blocking, but ensure reason has context
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Processes a teacher's decision on a pending leave request
 */
export function processLeaveDecision(
  request: LeaveRequest,
  decision: 'APPROVE' | 'REJECT',
  remarks?: string
): LeaveRequest {
  return {
    ...request,
    status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
    decidedAt: new Date().toISOString(),
    teacherRemarks: remarks || (decision === 'APPROVE' ? 'Sanctioned by Class Teacher' : 'Rejected - insufficient cause or test period'),
  };
}

/**
 * Evaluates whether student meets CBSE Rule 13 (75% compulsory attendance)
 * Medical leave with certified doctor prescription grants condonation up to 15% (minimum 60%) per CBSE guidelines.
 */
export function checkExamEligibility(
  totalWorkingDays: number,
  presentDays: number,
  approvedLeaveDays: number = 0,
  hasMedicalCertificate: boolean = false
): EligibilityResult {
  if (totalWorkingDays <= 0) {
    return {
      totalWorkingDays: 0,
      presentDays: 0,
      approvedLeaveDays: 0,
      effectiveAttendancePercent: 100,
      isEligibleForCbseExams: true,
      shortfallDays: 0,
    };
  }

  // Base raw percentage
  const rawPercentage = (presentDays / totalWorkingDays) * 100;
  
  // CBSE allows principal condonation of shortage up to 15% for genuine medical cases
  const minimumRequiredPercent = hasMedicalCertificate ? 60 : 75;
  const isEligible = rawPercentage >= minimumRequiredPercent;

  const requiredDays = Math.ceil((minimumRequiredPercent / 100) * totalWorkingDays);
  const shortfallDays = Math.max(0, requiredDays - presentDays);

  return {
    totalWorkingDays,
    presentDays,
    approvedLeaveDays,
    effectiveAttendancePercent: Math.round(rawPercentage * 10) / 10,
    isEligibleForCbseExams: isEligible,
    shortfallDays,
  };
}
