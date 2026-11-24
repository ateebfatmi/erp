/**
 * VidyaOS Campus Security Desk & Gatepass Management Engine
 * Implements POCSO Safety Standards, Visitor Identity Verification & Student Early Departure Authorizations
 */

export type VisitorType = 'PARENT' | 'VENDOR' | 'GOVT_INSPECTOR' | 'INTERVIEWEE' | 'GUEST';
export type VisitorStatus = 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPIRED';

export interface VisitorPass {
  passId: string;
  badgeNumber: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: VisitorType;
  purpose: string;
  hostName: string; // Person/Teacher to meet
  hostDepartment: string;
  vehicleNumber?: string;
  checkInTime: string; // ISO
  checkOutTime?: string;
  status: VisitorStatus;
  governmentIdType?: 'AADHAAR' | 'DRIVING_LICENSE' | 'PAN' | 'PASSPORT';
}

export type ExitReason = 'DOCTOR_APPOINTMENT' | 'FAMILY_EMERGENCY' | 'SICKNESS_INFIRMARY' | 'INTER_SCHOOL_TOURNAMENT';
export type GatepassStatus = 'ISSUED_PENDING_EXIT' | 'EXITED_CAMPUS' | 'CANCELLED';

export interface StudentEarlyGatepass {
  gatepassId: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  admissionNo: string;
  reason: ExitReason;
  detailedCause: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  authorizedByTeacher: string;
  authorizedByPrincipal: boolean;
  issuedAt: string;
  actualExitTime?: string;
  status: GatepassStatus;
  securityGuardOnDuty: string;
}

/**
 * Validates and creates a new Visitor Entry Pass
 */
export function createVisitorPass(data: {
  visitorName: string;
  visitorPhone: string;
  visitorType: VisitorType;
  purpose: string;
  hostName: string;
  hostDepartment: string;
  vehicleNumber?: string;
  badgeNumber?: string;
}): VisitorPass {
  if (!data.visitorName || data.visitorName.trim().length < 3) {
    throw new Error('Valid visitor name is required');
  }

  const phoneDigits = data.visitorPhone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    throw new Error('Valid 10-digit phone number is required for visitor verification');
  }

  const badge = data.badgeNumber || `VIS-${Math.floor(100 + Math.random() * 900)}`;

  return {
    passId: `VP-${Date.now()}`,
    badgeNumber: badge,
    visitorName: data.visitorName.trim(),
    visitorPhone: data.visitorPhone.trim(),
    visitorType: data.visitorType,
    purpose: data.purpose,
    hostName: data.hostName,
    hostDepartment: data.hostDepartment,
    vehicleNumber: data.vehicleNumber?.toUpperCase(),
    checkInTime: new Date().toISOString(),
    status: 'CHECKED_IN',
  };
}

/**
 * Issues an authorized Student Early Departure Gate Pass
 */
export function issueStudentEarlyGatepass(data: {
  studentId: string;
  studentName: string;
  gradeSection: string;
  admissionNo: string;
  reason: ExitReason;
  detailedCause: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  authorizedByTeacher: string;
  authorizedByPrincipal?: boolean;
}): StudentEarlyGatepass {
  if (!data.guardianName || data.guardianName.trim().length < 2) {
    throw new Error('Authorized guardian name is mandatory for student early exit');
  }

  return {
    gatepassId: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId: data.studentId,
    studentName: data.studentName,
    gradeSection: data.gradeSection,
    admissionNo: data.admissionNo,
    reason: data.reason,
    detailedCause: data.detailedCause,
    guardianName: data.guardianName,
    guardianRelation: data.guardianRelation,
    guardianPhone: data.guardianPhone,
    authorizedByTeacher: data.authorizedByTeacher,
    authorizedByPrincipal: data.authorizedByPrincipal ?? true,
    issuedAt: new Date().toISOString(),
    status: 'ISSUED_PENDING_EXIT',
    securityGuardOnDuty: 'Head Guard Baljit Singh (Gate 1)',
  };
}

/**
 * Validates gate departure when perimeter security checks the student pass
 */
export function confirmStudentExit(pass: StudentEarlyGatepass): StudentEarlyGatepass {
  if (pass.status !== 'ISSUED_PENDING_EXIT') {
    throw new Error(`Gatepass ${pass.gatepassId} is already ${pass.status} and cannot be processed again.`);
  }

  if (!pass.authorizedByTeacher) {
    throw new Error('Student early exit requires teacher authorization.');
  }

  return {
    ...pass,
    status: 'EXITED_CAMPUS',
    actualExitTime: new Date().toISOString(),
  };
}
