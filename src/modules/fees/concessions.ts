/**
 * CBSE Institutional Fee Concession, Scholarship & Sibling Discount Engine
 * Manages statutory and institutional tuition fee waivers:
 * - Single Girl Child (CBSE Udaan initiative)
 * - Sibling discount policy
 * - Staff ward concession
 * - Merit scholarships (Academic & Sports)
 * - Defense & Paramilitary martyr wards
 * - Multi-stage bursar & Principal sanctioning workflow
 */

export type ConcessionType =
  | 'SIBLING_DISCOUNT'
  | 'SINGLE_GIRL_CHILD'
  | 'STAFF_WARD'
  | 'MERIT_SCHOLARSHIP'
  | 'DEFENSE_MARTYR_WARD'
  | 'FINANCIAL_HARDSHIP';

export type ConcessionStatus = 'APPROVED_ACTIVE' | 'PENDING_SANCTION' | 'REJECTED' | 'EXPIRED';

export interface FeeConcessionApplication {
  id: string;
  admissionNumber: string;
  studentName: string;
  gradeClass: string;
  concessionType: ConcessionType;
  discountPercentage: number;
  originalQuarterlyTuition: number;
  discountedQuarterlyTuition: number;
  quarterlySavings: number;
  annualSavings: number;
  supportingDocDescription: string;
  status: ConcessionStatus;
  sanctionedBy?: string;
  sanctionDate?: string;
  validAcademicYear: string;
  rejectionReason?: string;
  bursarReconciled: boolean;
}

export const DEFAULT_CONCESSION_PERCENTAGES: Record<ConcessionType, number> = {
  SIBLING_DISCOUNT: 20,
  SINGLE_GIRL_CHILD: 50,
  STAFF_WARD: 50,
  MERIT_SCHOLARSHIP: 50,
  DEFENSE_MARTYR_WARD: 100,
  FINANCIAL_HARDSHIP: 30,
};

/**
 * Calculates fee concession and savings amounts
 */
export function calculateFeeConcession(
  originalQuarterlyTuition: number,
  type: ConcessionType,
  customPercent?: number
): {
  discountPercentage: number;
  discountedQuarterlyTuition: number;
  quarterlySavings: number;
  annualSavings: number;
} {
  if (originalQuarterlyTuition <= 0) {
    throw new Error('Original quarterly tuition must be greater than zero');
  }

  const discountPercentage = Math.min(
    100,
    Math.max(0, customPercent ?? DEFAULT_CONCESSION_PERCENTAGES[type])
  );

  const quarterlySavings = Math.round((originalQuarterlyTuition * discountPercentage) / 100);
  const discountedQuarterlyTuition = originalQuarterlyTuition - quarterlySavings;
  const annualSavings = quarterlySavings * 4; // 4 academic quarters per session

  return {
    discountPercentage,
    discountedQuarterlyTuition,
    quarterlySavings,
    annualSavings,
  };
}

/**
 * Creates and submits a new fee concession application
 */
export function createConcessionApplication(params: {
  admissionNumber: string;
  studentName: string;
  gradeClass: string;
  concessionType: ConcessionType;
  originalQuarterlyTuition: number;
  customPercent?: number;
  supportingDocDescription: string;
  validAcademicYear?: string;
  autoApprove?: boolean;
  sanctionedBy?: string;
}): FeeConcessionApplication {
  const calc = calculateFeeConcession(
    params.originalQuarterlyTuition,
    params.concessionType,
    params.customPercent
  );

  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];

  return {
    id: `CNC-${Date.now().toString().slice(-6)}`,
    admissionNumber: params.admissionNumber,
    studentName: params.studentName,
    gradeClass: params.gradeClass,
    concessionType: params.concessionType,
    discountPercentage: calc.discountPercentage,
    originalQuarterlyTuition: params.originalQuarterlyTuition,
    discountedQuarterlyTuition: calc.discountedQuarterlyTuition,
    quarterlySavings: calc.quarterlySavings,
    annualSavings: calc.annualSavings,
    supportingDocDescription: params.supportingDocDescription,
    status: params.autoApprove ? 'APPROVED_ACTIVE' : 'PENDING_SANCTION',
    sanctionedBy: params.autoApprove ? params.sanctionedBy || 'School Bursar & Principal' : undefined,
    sanctionDate: params.autoApprove ? todayIso : undefined,
    validAcademicYear: params.validAcademicYear || '2026-27',
    bursarReconciled: !!params.autoApprove,
  };
}

/**
 * Sanctions an existing fee concession application by Principal / Management Committee
 */
export function sanctionConcessionApplication(
  applications: FeeConcessionApplication[],
  id: string,
  sanctionedBy: string
): FeeConcessionApplication[] {
  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];

  return applications.map((app) =>
    app.id === id
      ? {
          ...app,
          status: 'APPROVED_ACTIVE',
          sanctionedBy,
          sanctionDate: todayIso,
          bursarReconciled: true,
        }
      : app
  );
}

/**
 * Rejects a fee concession application with official auditor reasons
 */
export function rejectConcessionApplication(
  applications: FeeConcessionApplication[],
  id: string,
  rejectionReason: string
): FeeConcessionApplication[] {
  return applications.map((app) =>
    app.id === id
      ? {
          ...app,
          status: 'REJECTED',
          rejectionReason,
        }
      : app
  );
}

/**
 * Pre-seeded Fee Concession Applications
 */
export const INITIAL_CONCESSION_APPLICATIONS: FeeConcessionApplication[] = [
  {
    id: 'CNC-001',
    admissionNumber: 'DPGA/2021/1042',
    studentName: 'Aarav Mehta',
    gradeClass: 'Class 10A',
    concessionType: 'MERIT_SCHOLARSHIP',
    discountPercentage: 50,
    originalQuarterlyTuition: 22500,
    discountedQuarterlyTuition: 11250,
    quarterlySavings: 11250,
    annualSavings: 45000,
    supportingDocDescription: 'Secured 1st Rank in Annual Class 9 Examinations with 97.4% aggregate',
    status: 'APPROVED_ACTIVE',
    sanctionedBy: 'Dr. Anita Roy (Principal)',
    sanctionDate: '2026-04-02',
    validAcademicYear: '2026-27',
    bursarReconciled: true,
  },
  {
    id: 'CNC-002',
    admissionNumber: 'DPGA/2022/1190',
    studentName: 'Ananya Sharma',
    gradeClass: 'Class 7B',
    concessionType: 'SIBLING_DISCOUNT',
    discountPercentage: 20,
    originalQuarterlyTuition: 19500,
    discountedQuarterlyTuition: 15600,
    quarterlySavings: 3900,
    annualSavings: 15600,
    supportingDocDescription: 'Second child enrolled. Elder sibling: Diya Sharma (DPGA/2021/1089, Class 10B)',
    status: 'APPROVED_ACTIVE',
    sanctionedBy: 'Mr. Rajesh Verma (Chief Bursar)',
    sanctionDate: '2026-04-03',
    validAcademicYear: '2026-27',
    bursarReconciled: true,
  },
  {
    id: 'CNC-003',
    admissionNumber: 'DPGA/2023/1304',
    studentName: 'Rhea Chakraborty',
    gradeClass: 'Class 4A',
    concessionType: 'SINGLE_GIRL_CHILD',
    discountPercentage: 50,
    originalQuarterlyTuition: 18000,
    discountedQuarterlyTuition: 9000,
    quarterlySavings: 9000,
    annualSavings: 36000,
    supportingDocDescription: 'First Class Magistrate notarized Single Girl Child affidavit submitted',
    status: 'APPROVED_ACTIVE',
    sanctionedBy: 'School Management Committee (SMC)',
    sanctionDate: '2026-04-04',
    validAcademicYear: '2026-27',
    bursarReconciled: true,
  },
  {
    id: 'CNC-004',
    admissionNumber: 'DPGA/2024/1422',
    studentName: 'Shaurya Singh',
    gradeClass: 'Class 2C',
    concessionType: 'DEFENSE_MARTYR_WARD',
    discountPercentage: 100,
    originalQuarterlyTuition: 16500,
    discountedQuarterlyTuition: 0,
    quarterlySavings: 16500,
    annualSavings: 66000,
    supportingDocDescription: 'Sena Medal / Armed Forces Battle Casualty Certificate from Army HQ',
    status: 'APPROVED_ACTIVE',
    sanctionedBy: 'Chairman & Principal',
    sanctionDate: '2026-04-01',
    validAcademicYear: '2026-27',
    bursarReconciled: true,
  },
  {
    id: 'CNC-005',
    admissionNumber: 'DPGA/2024/1510',
    studentName: 'Vihaan Saxena',
    gradeClass: 'Class 6A',
    concessionType: 'STAFF_WARD',
    discountPercentage: 50,
    originalQuarterlyTuition: 18500,
    discountedQuarterlyTuition: 9250,
    quarterlySavings: 9250,
    annualSavings: 37000,
    supportingDocDescription: 'Ward of Mr. Arvind Saxena (TGT History, Emp Code EMP-003)',
    status: 'PENDING_SANCTION',
    validAcademicYear: '2026-27',
    bursarReconciled: false,
  },
];
