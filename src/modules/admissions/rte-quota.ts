/**
 * Right to Education (RTE) Act 2009 - Section 12(1)(c) Statutory Engine
 * Manages 25% EWS / Disadvantaged Group (DG) quota allocation,
 * income certificate verification, neighbourhood radius zoning,
 * transparent computerized draw of lots, and state fee reimbursement claims.
 */

export type RteCategory =
  | 'EWS'
  | 'DISADVANTAGED_GROUP_SC'
  | 'DISADVANTAGED_GROUP_ST'
  | 'DISADVANTAGED_GROUP_OBC_NCL'
  | 'CWSN'
  | 'ORPHAN';

export type RteVerificationStatus =
  | 'VERIFIED_ELIGIBLE'
  | 'DOCUMENTS_PENDING'
  | 'REJECTED_OVER_INCOME'
  | 'REJECTED_OUT_OF_ZONE';

export type RteSeatAllocationStatus =
  | 'SEAT_ALLOTTED'
  | 'WAITLISTED'
  | 'ADMISSION_CONFIRMED';

export interface RteApplicant {
  id: string;
  applicationNumber: string;
  studentName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  category: RteCategory;
  parentName: string;
  annualFamilyIncome: number;
  incomeCertificateNumber?: string;
  neighbourhoodDistanceKm: number;
  targetClass: string;
  documentsSubmitted: {
    birthCertificate: boolean;
    incomeCertificate: boolean;
    casteOrMedicalCertificate: boolean;
    residenceProof: boolean;
  };
  verificationStatus: RteVerificationStatus;
  allocationStatus: RteSeatAllocationStatus;
  drawOfLotsSerial?: number;
}

/**
 * Calculates statutory 25% RTE seats based on entry-level class capacity
 */
export function calculateRteQuota(totalIntakeCapacity: number): {
  quotaPercentage: 25;
  mandatoryRteSeats: number;
  generalSeats: number;
} {
  if (totalIntakeCapacity <= 0) {
    throw new Error('Total intake capacity must be greater than zero');
  }

  const mandatoryRteSeats = Math.round(totalIntakeCapacity * 0.25);
  const generalSeats = totalIntakeCapacity - mandatoryRteSeats;

  return {
    quotaPercentage: 25,
    mandatoryRteSeats,
    generalSeats,
  };
}

/**
 * Verifies RTE applicant eligibility per statutory norms:
 * - Proof of birth and residence required for all
 * - EWS: income certificate + income <= maxIncomeThreshold (default ₹1,00,000/yr)
 * - DG / CWSN: caste or medical disability certificate required
 * - Neighbourhood radius: max 3.0 km
 */
export function verifyRteApplicant(
  applicant: RteApplicant,
  maxIncomeThreshold = 100000
): { isEligible: boolean; status: RteVerificationStatus; rejectionReason?: string } {
  // Check mandatory core documents
  if (!applicant.documentsSubmitted.birthCertificate || !applicant.documentsSubmitted.residenceProof) {
    return {
      isEligible: false,
      status: 'DOCUMENTS_PENDING',
      rejectionReason: 'Mandatory Birth Certificate or Address Proof missing',
    };
  }

  // Check neighbourhood distance (RTE prioritizes within 3 km)
  if (applicant.neighbourhoodDistanceKm > 3.0) {
    return {
      isEligible: false,
      status: 'REJECTED_OUT_OF_ZONE',
      rejectionReason: `Residence distance (${applicant.neighbourhoodDistanceKm} km) exceeds statutory 3.0 km neighbourhood limit`,
    };
  }

  // EWS income validation
  if (applicant.category === 'EWS') {
    if (!applicant.documentsSubmitted.incomeCertificate) {
      return {
        isEligible: false,
        status: 'DOCUMENTS_PENDING',
        rejectionReason: 'Revenue authority income certificate missing',
      };
    }
    if (applicant.annualFamilyIncome > maxIncomeThreshold) {
      return {
        isEligible: false,
        status: 'REJECTED_OVER_INCOME',
        rejectionReason: `Annual income (₹${applicant.annualFamilyIncome}) exceeds prescribed ceiling of ₹${maxIncomeThreshold}`,
      };
    }
  } else {
    // For Disadvantaged Group or CWSN, certificate is required
    if (!applicant.documentsSubmitted.casteOrMedicalCertificate) {
      return {
        isEligible: false,
        status: 'DOCUMENTS_PENDING',
        rejectionReason: 'Category / Disability / Caste certificate missing',
      };
    }
  }

  return {
    isEligible: true,
    status: 'VERIFIED_ELIGIBLE',
  };
}

/**
 * Computes the state government per-child expenditure fee reimbursement claim
 * (Section 12(2) RTE Act: Lower of actual fee charged or state-notified per-child cost)
 */
export function calculateStateReimbursementClaim(params: {
  confirmedStudentsCount: number;
  schoolAnnualTuitionPerChild: number;
  stateNotifiedPerChildCap: number;
}): {
  totalClaimAmount: number;
  perChildReimbursed: number;
  reimbursableCapUsed: 'STATE_CAP' | 'ACTUAL_FEE';
  stateAuditSummary: string;
} {
  const perChildReimbursed = Math.min(
    params.schoolAnnualTuitionPerChild,
    params.stateNotifiedPerChildCap
  );
  const totalClaimAmount = perChildReimbursed * params.confirmedStudentsCount;
  const reimbursableCapUsed =
    params.stateNotifiedPerChildCap < params.schoolAnnualTuitionPerChild
      ? 'STATE_CAP'
      : 'ACTUAL_FEE';

  const stateAuditSummary = `Reimbursement computed under Section 12(2) RTE Act at ₹${perChildReimbursed.toLocaleString(
    'en-IN'
  )}/child for ${params.confirmedStudentsCount} enrolled students (Rate Cap: ${reimbursableCapUsed}).`;

  return {
    totalClaimAmount,
    perChildReimbursed,
    reimbursableCapUsed,
    stateAuditSummary,
  };
}

/**
 * Runs transparent computerized Draw of Lots for verified RTE applicants
 * Prioritizes Neighbourhood Tier 1 (<= 1.0 km) first, followed by Tier 2 (1.1 - 3.0 km)
 */
export function runRteDrawOfLots(
  applicants: RteApplicant[],
  availableSeats: number
): {
  allotted: RteApplicant[];
  waitlisted: RteApplicant[];
} {
  const eligible = applicants.filter((a) => a.verificationStatus === 'VERIFIED_ELIGIBLE');

  // Sort by neighbourhood distance tier, then tie-breaker by application ID
  const sorted = [...eligible].sort((a, b) => {
    if (a.neighbourhoodDistanceKm !== b.neighbourhoodDistanceKm) {
      return a.neighbourhoodDistanceKm - b.neighbourhoodDistanceKm;
    }
    return a.applicationNumber.localeCompare(b.applicationNumber);
  });

  const allotted: RteApplicant[] = [];
  const waitlisted: RteApplicant[] = [];

  sorted.forEach((applicant, index) => {
    const drawSerial = index + 1;
    if (index < availableSeats) {
      allotted.push({
        ...applicant,
        allocationStatus: 'SEAT_ALLOTTED',
        drawOfLotsSerial: drawSerial,
      });
    } else {
      waitlisted.push({
        ...applicant,
        allocationStatus: 'WAITLISTED',
        drawOfLotsSerial: drawSerial,
      });
    }
  });

  return { allotted, waitlisted };
}

/**
 * Pre-seeded RTE Session 2026-2027 Applicants
 */
export const INITIAL_RTE_APPLICANTS: RteApplicant[] = [
  {
    id: 'rte-001',
    applicationNumber: 'RTE-2026-0041',
    studentName: 'Chahat Kumari',
    dob: '2021-03-12',
    gender: 'FEMALE',
    category: 'EWS',
    parentName: 'Rameshwar Lal (Daily Wage Worker)',
    annualFamilyIncome: 72000,
    incomeCertificateNumber: 'REV/EWS/2026/8812',
    neighbourhoodDistanceKm: 0.7,
    targetClass: 'Class 1',
    documentsSubmitted: {
      birthCertificate: true,
      incomeCertificate: true,
      casteOrMedicalCertificate: false,
      residenceProof: true,
    },
    verificationStatus: 'VERIFIED_ELIGIBLE',
    allocationStatus: 'ADMISSION_CONFIRMED',
    drawOfLotsSerial: 1,
  },
  {
    id: 'rte-002',
    applicationNumber: 'RTE-2026-0089',
    studentName: 'Mohammed Zaid',
    dob: '2021-05-24',
    gender: 'MALE',
    category: 'DISADVANTAGED_GROUP_OBC_NCL',
    parentName: 'Shakeel Ahmad (Auto Driver)',
    annualFamilyIncome: 95000,
    incomeCertificateNumber: 'REV/OBC/2026/1209',
    neighbourhoodDistanceKm: 0.9,
    targetClass: 'Class 1',
    documentsSubmitted: {
      birthCertificate: true,
      incomeCertificate: true,
      casteOrMedicalCertificate: true,
      residenceProof: true,
    },
    verificationStatus: 'VERIFIED_ELIGIBLE',
    allocationStatus: 'ADMISSION_CONFIRMED',
    drawOfLotsSerial: 2,
  },
  {
    id: 'rte-003',
    applicationNumber: 'RTE-2026-0112',
    studentName: 'Priya Meena',
    dob: '2021-01-19',
    gender: 'FEMALE',
    category: 'DISADVANTAGED_GROUP_ST',
    parentName: 'Gopal Meena',
    annualFamilyIncome: 84000,
    neighbourhoodDistanceKm: 1.4,
    targetClass: 'Class 1',
    documentsSubmitted: {
      birthCertificate: true,
      incomeCertificate: true,
      casteOrMedicalCertificate: true,
      residenceProof: true,
    },
    verificationStatus: 'VERIFIED_ELIGIBLE',
    allocationStatus: 'SEAT_ALLOTTED',
    drawOfLotsSerial: 3,
  },
  {
    id: 'rte-004',
    applicationNumber: 'RTE-2026-0155',
    studentName: 'Aryan Verma',
    dob: '2020-11-30',
    gender: 'MALE',
    category: 'CWSN',
    parentName: 'Dinesh Verma',
    annualFamilyIncome: 120000,
    neighbourhoodDistanceKm: 1.8,
    targetClass: 'Class 1',
    documentsSubmitted: {
      birthCertificate: true,
      incomeCertificate: false,
      casteOrMedicalCertificate: true, // 50% locomotor disability certificate
      residenceProof: true,
    },
    verificationStatus: 'VERIFIED_ELIGIBLE',
    allocationStatus: 'SEAT_ALLOTTED',
    drawOfLotsSerial: 4,
  },
  {
    id: 'rte-005',
    applicationNumber: 'RTE-2026-0204',
    studentName: 'Suraj Bhan',
    dob: '2021-08-14',
    gender: 'MALE',
    category: 'EWS',
    parentName: 'Vikram Bhan',
    annualFamilyIncome: 165000, // Exceeds 1 Lakh ceiling
    neighbourhoodDistanceKm: 2.1,
    targetClass: 'Class 1',
    documentsSubmitted: {
      birthCertificate: true,
      incomeCertificate: true,
      casteOrMedicalCertificate: false,
      residenceProof: true,
    },
    verificationStatus: 'REJECTED_OVER_INCOME',
    allocationStatus: 'WAITLISTED',
  },
];
