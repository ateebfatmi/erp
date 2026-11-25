/**
 * VidyaOS - CBSE School Disaster Management, Fire Safety NOC & Evacuation Drill Engine
 * Complies with CBSE Affiliation Bye-Laws Appendix II (Clause 2.4.9),
 * National Disaster Management Authority (NDMA) School Safety Policy,
 * and National Building Code (NBC) 2016 Part 4 (Fire and Life Safety).
 */

export type DrillType =
  | 'FIRE_EVACUATION'
  | 'EARTHQUAKE_DROP_COVER_HOLD'
  | 'CHEMISTRY_LAB_HAZMAT'
  | 'FLOOD_OR_CYCLONE_SHELTER';

export type DrillStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface EvacuationMockDrill {
  id: string;
  drillType: DrillType;
  scheduledDate: string;
  drillStartTime: string;
  drillEndTime: string;
  totalOccupantsPresent: number;
  totalEvacuatedSafely: number;
  evacuationDurationSeconds: number; // e.g., 165s = 2m 45s
  safeAssemblyArea: string; // e.g. "Main Athletics Ground - Safe Zone A"
  floorWardensReporting: number;
  unaccountedSimulatedCount: number;
  evaluatorRemarks: string;
  correctiveActionsRequired: string[];
  status: DrillStatus;
}

export type FireEquipmentType =
  | 'ABC_DRY_POWDER'
  | 'CO2_EXTINGUISHER'
  | 'MECHANICAL_FOAM'
  | 'FIRE_HOSE_REEL'
  | 'YARD_HYDRANT'
  | 'SMOKE_DETECTOR_LOOP'
  | 'EMERGENCY_ALARM_PANEL';

export type EquipmentCondition = 'FUNCTIONAL' | 'REFILL_REQUIRED' | 'MAINTENANCE_DUE' | 'CONDEMNED';

export interface FireSafetyEquipment {
  id: string;
  type: FireEquipmentType;
  serialNumber: string;
  capacityOrRating: string; // e.g. "6 Kg", "4.5 Kg CO2", "30 Meter Hose"
  locationFloor: string; // e.g. "Ground Floor Science Block", "Admin 2nd Floor Corridor"
  lastInspectedDate: string;
  nextHydroTestDueDate: string;
  condition: EquipmentCondition;
  pressureGaugeNormal: boolean;
  serviceVendor: string;
}

export type StatutoryCertificateType =
  | 'FIRE_SAFETY_NOC_FORM_5'
  | 'STRUCTURAL_STABILITY_PWD'
  | 'SAFE_DRINKING_WATER_SANITARY';

export interface StatutorySafetyCertificate {
  id: string;
  certificateType: StatutoryCertificateType;
  certificateNumber: string;
  issuingAuthority: string; // e.g. "Delhi Fire Services", "Executive Engineer PWD"
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  pdfDocumentUrl?: string;
}

export interface SDMCMember {
  id: string;
  name: string;
  role:
    | 'CHAIRPERSON_PRINCIPAL'
    | 'FIRE_SAFETY_OFFICER'
    | 'POLICE_CIVIL_DEFENSE_LIAISON'
    | 'MEDICAL_OFFICER'
    | 'PARENT_PTA_REPRESENTATIVE'
    | 'SENIOR_FACULTY_COORDINATOR'
    | 'STUDENT_COUNCIL_HEAD';
  contactPhone: string;
  dutyAssignment: string;
}

export interface DisasterManagementAuditReport {
  overallSafetyIndex: number; // 0 to 100
  complianceGrade: 'A_EXEMPLARY' | 'B_COMPLIANT' | 'C_DEFICIT';
  fireNocValid: boolean;
  structuralStabilityValid: boolean;
  biAnnualMockDrillCompliant: boolean;
  lastMockDrillDaysAgo: number;
  equipmentFunctionalRate: number; // percentage
  averageEvacuationTimeSeconds: number;
  statutoryDeficits: string[];
}

/**
 * Calculates days difference from today.
 */
export function getDaysAgo(dateString: string): number {
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Evaluates whether statutory certificate is valid, expiring within 60 days, or expired.
 */
export function evaluateCertificateStatus(
  expiryDateString: string
): 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' {
  const expiry = new Date(expiryDateString);
  const now = new Date();
  const diffDays = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'EXPIRED';
  if (diffDays <= 60) return 'EXPIRING_SOON';
  return 'VALID';
}

/**
 * Evaluates composite CBSE/NDMA Disaster Management Audit score and identifies statutory gaps.
 */
export function evaluateDisasterSafetyAudit(
  certificates: StatutorySafetyCertificate[],
  equipment: FireSafetyEquipment[],
  drills: EvacuationMockDrill[]
): DisasterManagementAuditReport {
  const gaps: string[] = [];

  // 1. Fire NOC check
  const fireNoc = certificates.find((c) => c.certificateType === 'FIRE_SAFETY_NOC_FORM_5');
  const fireNocValid = fireNoc ? evaluateCertificateStatus(fireNoc.expiryDate) !== 'EXPIRED' : false;
  if (!fireNocValid) {
    gaps.push('Statutory Fire Safety NOC (Form-5) is either expired or missing.');
  }

  // 2. Structural PWD stability check
  const structuralCert = certificates.find((c) => c.certificateType === 'STRUCTURAL_STABILITY_PWD');
  const structuralStabilityValid = structuralCert
    ? evaluateCertificateStatus(structuralCert.expiryDate) !== 'EXPIRED'
    : false;
  if (!structuralStabilityValid) {
    gaps.push('PWD / Registered Structural Stability Certificate requires immediate renewal.');
  }

  // 3. Bi-annual mock drill check (Must have at least one drill within past 180 days)
  const completedDrills = drills.filter((d) => d.status === 'COMPLETED');
  const latestDrill = completedDrills.length > 0
    ? [...completedDrills].sort(
        (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
      )[0]
    : null;

  const lastMockDrillDaysAgo = latestDrill ? getDaysAgo(latestDrill.scheduledDate) : 999;
  const biAnnualMockDrillCompliant = lastMockDrillDaysAgo <= 180;
  if (!biAnnualMockDrillCompliant) {
    gaps.push('Bi-annual evacuation mock drill overdue (mandated every 6 months by CBSE).');
  }

  // 4. Equipment functionality
  const functionalEq = equipment.filter(
    (e) => e.condition === 'FUNCTIONAL' && e.pressureGaugeNormal
  ).length;
  const equipmentFunctionalRate =
    equipment.length > 0 ? Math.round((functionalEq / equipment.length) * 100) : 0;
  if (equipmentFunctionalRate < 90) {
    gaps.push(`Fire safety equipment readiness (${equipmentFunctionalRate}%) is below 90% threshold.`);
  }

  // 5. Evacuation speed benchmark (Benchmark: <= 180 seconds / 3 minutes)
  const avgEvacSeconds =
    completedDrills.length > 0
      ? Math.round(
          completedDrills.reduce((acc, d) => acc + d.evacuationDurationSeconds, 0) /
            completedDrills.length
        )
      : 0;

  if (avgEvacSeconds > 180) {
    gaps.push(
      `Average campus evacuation speed (${Math.floor(avgEvacSeconds / 60)}m ${avgEvacSeconds % 60}s) exceeds statutory 3-minute benchmark.`
    );
  }

  // Calculate composite score (0 to 100)
  let score = 30; // base institutional preparedness
  if (fireNocValid) score += 25;
  if (structuralStabilityValid) score += 15;
  if (biAnnualMockDrillCompliant) score += 15;
  if (equipmentFunctionalRate >= 90) score += 10;
  if (avgEvacSeconds > 0 && avgEvacSeconds <= 180) score += 5;

  score = Math.min(100, score);

  let complianceGrade: 'A_EXEMPLARY' | 'B_COMPLIANT' | 'C_DEFICIT' = 'C_DEFICIT';
  if (score >= 85) {
    complianceGrade = 'A_EXEMPLARY';
  } else if (score >= 65) {
    complianceGrade = 'B_COMPLIANT';
  }

  return {
    overallSafetyIndex: score,
    complianceGrade,
    fireNocValid,
    structuralStabilityValid,
    biAnnualMockDrillCompliant,
    lastMockDrillDaysAgo,
    equipmentFunctionalRate,
    averageEvacuationTimeSeconds: avgEvacSeconds,
    statutoryDeficits: gaps,
  };
}

export const INITIAL_CERTIFICATES: StatutorySafetyCertificate[] = [
  {
    id: 'CERT-01',
    certificateType: 'FIRE_SAFETY_NOC_FORM_5',
    certificateNumber: 'DFS/HQ/School/2025/NOC-4481',
    issuingAuthority: 'Delhi Fire Services (Headquarters, New Delhi)',
    issueDate: '2025-05-10',
    expiryDate: '2028-05-09',
    status: 'VALID',
    pdfDocumentUrl: '/documents/fire-noc-2025.pdf',
  },
  {
    id: 'CERT-02',
    certificateType: 'STRUCTURAL_STABILITY_PWD',
    certificateNumber: 'PWD/EE/BLDG-STAB/2024/782',
    issuingAuthority: 'Office of Executive Engineer, Public Works Department',
    issueDate: '2024-08-15',
    expiryDate: '2027-08-14',
    status: 'VALID',
    pdfDocumentUrl: '/documents/pwd-structural-stability.pdf',
  },
  {
    id: 'CERT-03',
    certificateType: 'SAFE_DRINKING_WATER_SANITARY',
    certificateNumber: 'DJB/ZRO/WTR-TEST/2026/1029',
    issuingAuthority: 'Delhi Jal Board Central Water Testing Laboratory',
    issueDate: '2026-03-01',
    expiryDate: '2027-02-28',
    status: 'VALID',
    pdfDocumentUrl: '/documents/water-sanitary-test.pdf',
  },
];

export const INITIAL_FIRE_EQUIPMENT: FireSafetyEquipment[] = [
  {
    id: 'EQ-FIRE-01',
    type: 'ABC_DRY_POWDER',
    serialNumber: 'FE-ABC-101',
    capacityOrRating: '6 Kg MAP 50%',
    locationFloor: 'Ground Floor Science Block Corridor',
    lastInspectedDate: '2026-11-01',
    nextHydroTestDueDate: '2027-10-31',
    condition: 'FUNCTIONAL',
    pressureGaugeNormal: true,
    serviceVendor: 'Minimax Fire Protection Pvt Ltd',
  },
  {
    id: 'EQ-FIRE-02',
    type: 'CO2_EXTINGUISHER',
    serialNumber: 'FE-CO2-204',
    capacityOrRating: '4.5 Kg IS:15683',
    locationFloor: '1st Floor Computer & Server Room',
    lastInspectedDate: '2026-11-01',
    nextHydroTestDueDate: '2027-08-15',
    condition: 'FUNCTIONAL',
    pressureGaugeNormal: true,
    serviceVendor: 'Minimax Fire Protection Pvt Ltd',
  },
  {
    id: 'EQ-FIRE-03',
    type: 'FIRE_HOSE_REEL',
    serialNumber: 'FHR-01-MAIN',
    capacityOrRating: '30 Meter Thermoplastic Hose 20mm',
    locationFloor: 'Main Administrative Central Staircase',
    lastInspectedDate: '2026-10-15',
    nextHydroTestDueDate: '2028-04-10',
    condition: 'FUNCTIONAL',
    pressureGaugeNormal: true,
    serviceVendor: 'Safex Fire Services',
  },
  {
    id: 'EQ-FIRE-04',
    type: 'MECHANICAL_FOAM',
    serialNumber: 'FE-FOAM-088',
    capacityOrRating: '9 Litre AFFF 3%',
    locationFloor: 'Ground Floor Canteen Kitchen & Pantry',
    lastInspectedDate: '2026-10-20',
    nextHydroTestDueDate: '2027-09-30',
    condition: 'FUNCTIONAL',
    pressureGaugeNormal: true,
    serviceVendor: 'Minimax Fire Protection Pvt Ltd',
  },
  {
    id: 'EQ-FIRE-05',
    type: 'EMERGENCY_ALARM_PANEL',
    serialNumber: 'FAP-ZONE-08',
    capacityOrRating: '8-Zone Addressable Panel with 120dB Hooter',
    locationFloor: 'Security Gate House 1 Master Desk',
    lastInspectedDate: '2026-11-10',
    nextHydroTestDueDate: '2027-11-09',
    condition: 'FUNCTIONAL',
    pressureGaugeNormal: true,
    serviceVendor: 'Honeywell Life Safety',
  },
];

export const INITIAL_MOCK_DRILLS: EvacuationMockDrill[] = [
  {
    id: 'DRILL-2026-02',
    drillType: 'FIRE_EVACUATION',
    scheduledDate: '2026-10-12',
    drillStartTime: '11:15 AM',
    drillEndTime: '11:18 AM',
    totalOccupantsPresent: 1420,
    totalEvacuatedSafely: 1420,
    evacuationDurationSeconds: 152, // 2 minutes 32 seconds
    safeAssemblyArea: 'Main Athletics Ground - Safe Zone A',
    floorWardensReporting: 12,
    unaccountedSimulatedCount: 0,
    evaluatorRemarks: 'Exemplary orderly stairwell evacuation. Chemistry lab gas master valves isolated in 18 seconds. Fire alarm sirens functioned at 118 dB.',
    correctiveActionsRequired: [
      'Ensure junior wing ramp handrails are checked for clear passage',
      'Replace acoustic sounder battery in West wing 2nd floor corridor',
    ],
    status: 'COMPLETED',
  },
  {
    id: 'DRILL-2026-01',
    drillType: 'EARTHQUAKE_DROP_COVER_HOLD',
    scheduledDate: '2026-04-18',
    drillStartTime: '10:00 AM',
    drillEndTime: '10:04 AM',
    totalOccupantsPresent: 1380,
    totalEvacuatedSafely: 1380,
    evacuationDurationSeconds: 168, // 2 minutes 48 seconds
    safeAssemblyArea: 'Main Athletics Ground - Safe Zone A',
    floorWardensReporting: 12,
    unaccountedSimulatedCount: 0,
    evaluatorRemarks: 'Students successfully demonstrated Drop, Cover, and Hold on desks for 45 seconds before orderly evacuation.',
    correctiveActionsRequired: ['Re-train transport drivers on parking clear of overhead power cables during drills'],
    status: 'COMPLETED',
  },
];

export const INITIAL_SDMC_MEMBERS: SDMCMember[] = [
  {
    id: 'SDMC-01',
    name: 'Dr. Sunita Sharma',
    role: 'CHAIRPERSON_PRINCIPAL',
    contactPhone: '+91 98101 23456',
    dutyAssignment: 'Overall Incident Commander & Parent Notification Broadcast Authorization',
  },
  {
    id: 'SDMC-02',
    name: 'Inspector Vikram Singh',
    role: 'FIRE_SAFETY_OFFICER',
    contactPhone: '+91 98765 43210',
    dutyAssignment: 'External Fire Brigade Liaison & Hydrant Water Pressure Verification',
  },
  {
    id: 'SDMC-03',
    name: 'Dr. Rajiv Menon, MBBS',
    role: 'MEDICAL_OFFICER',
    contactPhone: '+91 98234 56789',
    dutyAssignment: 'Infirmary Emergency Triage & First Aid Response Post at Safe Zone A',
  },
  {
    id: 'SDMC-04',
    name: 'Mr. Rajesh Rawat (PGT Physics)',
    role: 'SENIOR_FACULTY_COORDINATOR',
    contactPhone: '+91 99112 33445',
    dutyAssignment: 'Chief Floor Warden & Building Electrical/Gas Isolation Protocol',
  },
];
