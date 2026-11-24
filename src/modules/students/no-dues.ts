/**
 * VidyaOS Student Withdrawal & Multi-Department "No Dues" Clearance Engine
 * Manages statutory multi-department sign-offs required prior to CBSE Transfer Certificate (TC) generation.
 */

export type DepartmentKey = 'LIBRARY' | 'ACCOUNTS_FEES' | 'LABORATORIES' | 'SPORTS_HOSTEL';
export type ClearanceStatus = 'APPROVED_CLEAR' | 'BLOCKED_WITH_DUES' | 'PENDING_REVIEW';

export interface DepartmentCheckItem {
  department: DepartmentKey;
  departmentName: string;
  status: ClearanceStatus;
  duesAmountINR: number;
  unreturnedItems: string[];
  signatoryStaff: string;
  signedAt?: string;
  remarks: string;
}

export interface StudentClearanceRecord {
  clearanceId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeSection: string;
  fatherName: string;
  applicationDate: string;
  withdrawalReason: string;
  departments: Record<DepartmentKey, DepartmentCheckItem>;
  overallStatus: 'CLEARED_READY_FOR_TC' | 'ACTION_REQUIRED_DUES_PENDING';
  authorizedForTcGeneration: boolean;
  tcCertificateNumber?: string;
}

/**
 * Creates an initial No Dues application for a student requesting a Transfer Certificate
 */
export function initiateNoDuesApplication(data: {
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeSection: string;
  fatherName: string;
  withdrawalReason: string;
}): StudentClearanceRecord {
  const initialDepartments: Record<DepartmentKey, DepartmentCheckItem> = {
    LIBRARY: {
      department: 'LIBRARY',
      departmentName: 'Central Library',
      status: 'PENDING_REVIEW',
      duesAmountINR: 0,
      unreturnedItems: [],
      signatoryStaff: 'Mrs. Neha Chawla (Head Librarian)',
      remarks: 'Awaiting circulation ledger audit',
    },
    ACCOUNTS_FEES: {
      department: 'ACCOUNTS_FEES',
      departmentName: 'Accounts & Fee Bursar',
      status: 'PENDING_REVIEW',
      duesAmountINR: 0,
      unreturnedItems: [],
      signatoryStaff: 'Mr. Rajesh Verma (Chief Bursar)',
      remarks: 'Awaiting tuition and transport reconciliation',
    },
    LABORATORIES: {
      department: 'LABORATORIES',
      departmentName: 'Science & Computer Laboratories',
      status: 'PENDING_REVIEW',
      duesAmountINR: 0,
      unreturnedItems: [],
      signatoryStaff: 'Dr. Vivek Saxena (Lab In-Charge)',
      remarks: 'Awaiting physics/chemistry kit inspection',
    },
    SPORTS_HOSTEL: {
      department: 'SPORTS_HOSTEL',
      departmentName: 'Sports & Athletics Wing',
      status: 'PENDING_REVIEW',
      duesAmountINR: 0,
      unreturnedItems: [],
      signatoryStaff: 'Coach R. Rathore (Sports Director)',
      remarks: 'Awaiting athletic kit return',
    },
  };

  return {
    clearanceId: `ND-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId: data.studentId,
    studentName: data.studentName,
    admissionNo: data.admissionNo,
    gradeSection: data.gradeSection,
    fatherName: data.fatherName,
    applicationDate: new Date().toISOString(),
    withdrawalReason: data.withdrawalReason,
    departments: initialDepartments,
    overallStatus: 'ACTION_REQUIRED_DUES_PENDING',
    authorizedForTcGeneration: false,
  };
}

/**
 * Updates a department's clearance status (Approved Clear vs Blocked with Dues)
 */
export function updateDepartmentClearance(
  record: StudentClearanceRecord,
  department: DepartmentKey,
  status: ClearanceStatus,
  duesAmountINR: number = 0,
  unreturnedItems: string[] = [],
  remarks?: string
): StudentClearanceRecord {
  const updatedDept: DepartmentCheckItem = {
    ...record.departments[department],
    status,
    duesAmountINR,
    unreturnedItems,
    signedAt: new Date().toISOString(),
    remarks: remarks || (status === 'APPROVED_CLEAR' ? 'Clearance granted. No dues outstanding.' : 'Pending liabilities.'),
  };

  const updatedDepartments = {
    ...record.departments,
    [department]: updatedDept,
  };

  // Evaluate if all 4 departments are APPROVED_CLEAR
  const allClear = Object.values(updatedDepartments).every((d) => d.status === 'APPROVED_CLEAR');

  return {
    ...record,
    departments: updatedDepartments,
    overallStatus: allClear ? 'CLEARED_READY_FOR_TC' : 'ACTION_REQUIRED_DUES_PENDING',
    authorizedForTcGeneration: allClear,
    tcCertificateNumber: allClear ? `TC-CBSE-${new Date().getFullYear()}-${record.admissionNo.slice(-4)}` : undefined,
  };
}

/**
 * Verifies whether the student is legally authorized to download the CBSE Transfer Certificate
 */
export function verifyTcEligibility(record: StudentClearanceRecord): {
  eligible: boolean;
  blockingReasons: string[];
} {
  const blockingReasons: string[] = [];

  for (const dept of Object.values(record.departments)) {
    if (dept.status === 'BLOCKED_WITH_DUES') {
      blockingReasons.push(
        `${dept.departmentName}: Dues outstanding of ₹${dept.duesAmountINR}${dept.unreturnedItems.length > 0 ? ` (${dept.unreturnedItems.join(', ')})` : ''}`
      );
    } else if (dept.status === 'PENDING_REVIEW') {
      blockingReasons.push(`${dept.departmentName}: Department review still pending.`);
    }
  }

  return {
    eligible: blockingReasons.length === 0,
    blockingReasons,
  };
}
