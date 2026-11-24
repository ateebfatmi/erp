export type AdmissionStatus = 'inquiry' | 'applied' | 'verified' | 'approved' | 'enrolled';

export interface AdmissionLead {
  id: string;
  studentName: string;
  targetClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: AdmissionStatus;
  applicationDate: string;
  entranceScore: number;
  admissionFee: number;
  verificationNotes?: string;
}

export interface AdmissionsMetrics {
  totalLeads: number;
  appliedCount: number;
  verifiedCount: number;
  approvedCount: number;
  enrolledCount: number;
  conversionRate: number;
  projectedRevenue: number;
}

/**
 * Validates and advances lead through the admission lifecycle
 */
export function transitionLeadStatus(
  currentStatus: AdmissionStatus,
  targetStatus: AdmissionStatus
): {
  isValid: boolean;
  message?: string;
} {
  const STAGE_ORDER: Record<AdmissionStatus, number> = {
    inquiry: 0,
    applied: 1,
    verified: 2,
    approved: 3,
    enrolled: 4,
  };

  const currentIdx = STAGE_ORDER[currentStatus];
  const targetIdx = STAGE_ORDER[targetStatus];

  if (targetIdx === currentIdx + 1 || targetIdx === currentIdx) {
    return { isValid: true };
  }

  if (targetIdx > currentIdx + 1) {
    return {
      isValid: false,
      message: `Cannot skip stages. Must verify documents before approval or enrollment.`,
    };
  }

  return { isValid: true };
}

/**
 * Computes pipeline conversion metrics across active admission cycles
 */
export function calculateAdmissionsMetrics(leads: AdmissionLead[]): AdmissionsMetrics {
  const totalLeads = leads.length;
  let applied = 0;
  let verified = 0;
  let approved = 0;
  let enrolled = 0;
  let projectedRev = 0;

  for (const l of leads) {
    if (l.status === 'applied') applied++;
    else if (l.status === 'verified') verified++;
    else if (l.status === 'approved') approved++;
    else if (l.status === 'enrolled') enrolled++;

    if (l.status === 'approved' || l.status === 'enrolled') {
      projectedRev += l.admissionFee;
    }
  }

  const conversionRate = totalLeads > 0 ? Number(((enrolled / totalLeads) * 100).toFixed(1)) : 0;

  return {
    totalLeads,
    appliedCount: applied,
    verifiedCount: verified,
    approvedCount: approved,
    enrolledCount: enrolled,
    conversionRate,
    projectedRevenue: projectedRev,
  };
}
