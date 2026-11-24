/**
 * CBSE POCSO Child Protection & Campus Safety Audit Engine
 * Compliance: POCSO Act 2012, POCSO Rules 2020, CBSE Circular Acad-05/2017,
 * and Supreme Court of India Guidelines on School Safety (W.P. Civil No. 252/2004).
 */

export type CommitteeRole =
  | 'CHAIRPERSON_PRINCIPAL'
  | 'MEMBER_SECRETARY_SENIOR_FEMALE_FACULTY'
  | 'SCHOOL_COUNSELOR_PSYCHOLOGIST'
  | 'PTA_PARENT_REPRESENTATIVE'
  | 'LEGAL_OR_POLICE_CWPO_LIAISON';

export interface CpcMember {
  id: string;
  name: string;
  role: CommitteeRole;
  designation: string;
  contactEmail: string;
  contactPhone: string;
  tenureStartDate: string;
}

export type SafetyIncidentType =
  | 'BULLYING_AND_HARASSMENT'
  | 'CORPORAL_PUNISHMENT'
  | 'POCSO_INAPPROPRIATE_TOUCH_OR_BEHAVIOR'
  | 'CYBER_SAFETY_AND_DIGITAL_ABUSE'
  | 'CAMPUS_INFRASTRUCTURE_HAZARD';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_MANDATORY_REPORTING';

export type IncidentStatus =
  | 'REPORTED'
  | 'PRELIMINARY_INQUIRY'
  | 'ACTION_TAKEN_RESOLVED'
  | 'ESCALATED_TO_SJPU_OR_CWC';

export interface SafetyIncidentReport {
  id: string;
  incidentType: SafetyIncidentType;
  severity: IncidentSeverity;
  isAnonymous: boolean;
  complainantName?: string;
  complainantRole?: 'STUDENT' | 'PARENT' | 'TEACHER' | 'ANONYMOUS';
  studentAffectedName?: string;
  gradeClass?: string;
  incidentDate: string;
  incidentLocation: string; // e.g. "Junior Wing Corridor"
  narrativeDescription: string;
  statutory24HrDeadline: string; // ISO String
  status: IncidentStatus;
  committeeActionNotes?: string;
  resolutionDate?: string;
}

export interface SafetyAuditItem {
  id: string;
  category: 'CCTV_SURVEILLANCE' | 'STAFF_POLICE_VERIFICATION' | 'WASHROOM_AND_PHYSICAL' | 'TRANSPORT_SAFETY' | 'FIRE_AND_DISASTER';
  checkTitle: string;
  mandatoryStandard: string;
  isCompliant: boolean;
  lastAuditedDate: string;
  auditorNotes: string;
}

/**
 * Validates and files a confidential child safety incident report
 */
export function fileSafetyIncident(params: {
  incidentType: SafetyIncidentType;
  severity: IncidentSeverity;
  isAnonymous?: boolean;
  complainantName?: string;
  complainantRole?: SafetyIncidentReport['complainantRole'];
  studentAffectedName?: string;
  gradeClass?: string;
  incidentDate: string;
  incidentLocation: string;
  narrativeDescription: string;
}): SafetyIncidentReport {
  if (params.narrativeDescription.trim().length < 20) {
    throw new Error('Please provide a substantive narrative description (minimum 20 characters)');
  }

  const id = `CPC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  // Under POCSO Section 19, statutory deadline to report critical cases to police/CWC is 24 hours
  const reportTime = new Date();
  const deadline = new Date(reportTime.getTime() + 24 * 60 * 60 * 1000).toISOString();

  return {
    id,
    incidentType: params.incidentType,
    severity: params.severity,
    isAnonymous: !!params.isAnonymous,
    complainantName: params.isAnonymous ? 'Confidential / Anonymous' : params.complainantName,
    complainantRole: params.isAnonymous ? 'ANONYMOUS' : (params.complainantRole || 'STUDENT'),
    studentAffectedName: params.studentAffectedName,
    gradeClass: params.gradeClass,
    incidentDate: params.incidentDate,
    incidentLocation: params.incidentLocation.trim(),
    narrativeDescription: params.narrativeDescription.trim(),
    statutory24HrDeadline: deadline,
    status: 'REPORTED',
  };
}

/**
 * Updates status of an incident investigation
 */
export function updateIncidentStatus(
  incidents: SafetyIncidentReport[],
  incidentId: string,
  newStatus: IncidentStatus,
  actionNotes: string
): SafetyIncidentReport[] {
  return incidents.map((inc) => {
    if (inc.id !== incidentId) return inc;
    return {
      ...inc,
      status: newStatus,
      committeeActionNotes: actionNotes,
      resolutionDate: newStatus === 'ACTION_TAKEN_RESOLVED' ? new Date().toISOString().split('T')[0] : inc.resolutionDate,
    };
  });
}

/**
 * Computes statutory campus safety audit compliance score
 */
export function evaluateCampusSafetyScore(checklist: SafetyAuditItem[]): {
  totalChecks: number;
  compliantChecks: number;
  scorePercentage: number;
  isStatutorilyApproved: boolean;
  criticalGaps: SafetyAuditItem[];
} {
  const total = checklist.length;
  const compliant = checklist.filter((c) => c.isCompliant).length;
  const criticalGaps = checklist.filter((c) => !c.isCompliant);
  const score = total > 0 ? Math.round((compliant / total) * 100) : 0;

  return {
    totalChecks: total,
    compliantChecks: compliant,
    scorePercentage: score,
    isStatutorilyApproved: score >= 90 && criticalGaps.length === 0,
    criticalGaps,
  };
}

/**
 * Pre-seeded Child Protection Committee (CPC) Members
 */
export const INITIAL_CPC_MEMBERS: CpcMember[] = [
  {
    id: 'cpc-01',
    name: 'Dr. Rameshwar Sharma',
    role: 'CHAIRPERSON_PRINCIPAL',
    designation: 'Principal & Head of Institution',
    contactEmail: 'principal@vidyaos.org',
    contactPhone: '+91 98110 01122',
    tenureStartDate: '2024-04-01',
  },
  {
    id: 'cpc-02',
    name: 'Smt. Vandana Saxena',
    role: 'MEMBER_SECRETARY_SENIOR_FEMALE_FACULTY',
    designation: 'Vice Principal & Senior PGT English',
    contactEmail: 'vandana.saxena@vidyaos.org',
    contactPhone: '+91 98110 01133',
    tenureStartDate: '2024-04-01',
  },
  {
    id: 'cpc-03',
    name: 'Dr. Radhika Sen, Ph.D.',
    role: 'SCHOOL_COUNSELOR_PSYCHOLOGIST',
    designation: 'Head of Student Well-being & Counseling',
    contactEmail: 'counselor@vidyaos.org',
    contactPhone: '+91 98110 01144',
    tenureStartDate: '2024-04-01',
  },
  {
    id: 'cpc-04',
    name: 'Shri Rajesh Mehta',
    role: 'PTA_PARENT_REPRESENTATIVE',
    designation: 'PTA Executive Council Member',
    contactEmail: 'rajesh.mehta@pta.vidyaos.org',
    contactPhone: '+91 98200 44102',
    tenureStartDate: '2024-04-01',
  },
  {
    id: 'cpc-05',
    name: 'Inspector Alok Kumar, CWPO',
    role: 'LEGAL_OR_POLICE_CWPO_LIAISON',
    designation: 'Child Welfare Police Officer, Greater Noida',
    contactEmail: 'cwpo.greaternoida@uppolice.gov.in',
    contactPhone: '+91 94544 00192',
    tenureStartDate: '2024-04-01',
  },
];

/**
 * Pre-seeded statutory safety incidents
 */
export const INITIAL_SAFETY_INCIDENTS: SafetyIncidentReport[] = [
  {
    id: 'CPC-2024-0012',
    incidentType: 'BULLYING_AND_HARASSMENT',
    severity: 'MEDIUM',
    isAnonymous: false,
    complainantName: 'Sunita Mehta',
    complainantRole: 'PARENT',
    studentAffectedName: 'Aarav Mehta',
    gradeClass: 'Class 10A',
    incidentDate: '2024-11-18',
    incidentLocation: 'Middle School Basketball Court',
    narrativeDescription: 'Observed repeated verbal taunting and exclusion by two senior students during afternoon sports period.',
    statutory24HrDeadline: '2024-11-19T14:30:00.000Z',
    status: 'ACTION_TAKEN_RESOLVED',
    committeeActionNotes: 'Both students counseled by Dr. Radhika Sen in presence of class teacher. Apology tendered and zero-tolerance policy reiterated.',
    resolutionDate: '2024-11-20',
  },
  {
    id: 'CPC-2024-0014',
    incidentType: 'CAMPUS_INFRASTRUCTURE_HAZARD',
    severity: 'LOW',
    isAnonymous: true,
    complainantName: 'Confidential / Anonymous',
    complainantRole: 'ANONYMOUS',
    incidentDate: '2024-11-21',
    incidentLocation: 'Physics Lab Rear Exit Fire Door',
    narrativeDescription: 'The emergency latch on the rear physics lab door was sticking during morning drills. Needs lubricant and latch adjustment.',
    statutory24HrDeadline: '2024-11-22T09:00:00.000Z',
    status: 'ACTION_TAKEN_RESOLVED',
    committeeActionNotes: 'Estate maintenance team rectified emergency push-bar latch. Verified functional on 2024-11-21.',
    resolutionDate: '2024-11-21',
  },
];

/**
 * Statutory 10-Point Supreme Court & CBSE Safety Audit Checklist
 */
export const INITIAL_SAFETY_CHECKLIST: SafetyAuditItem[] = [
  {
    id: 'chk-01',
    category: 'CCTV_SURVEILLANCE',
    checkTitle: '100% CCTV Surveillance Coverage with 30-Day Backup',
    mandatoryStandard: 'High-definition cameras at entry/exit gates, corridors, playgrounds, and outside washrooms.',
    isCompliant: true,
    lastAuditedDate: '2024-11-15',
    auditorNotes: 'All 84 IP cameras operational with 45-day NVR recording backup.',
  },
  {
    id: 'chk-02',
    category: 'STAFF_POLICE_VERIFICATION',
    checkTitle: 'Police Verification of Non-Teaching Contract Staff',
    mandatoryStandard: 'Mandatory criminal background verification for drivers, conductors, security guards, and peons.',
    isCompliant: true,
    lastAuditedDate: '2024-11-10',
    auditorNotes: 'Police clearance certificates filed for all 28 transport & housekeeping staff.',
  },
  {
    id: 'chk-03',
    category: 'WASHROOM_AND_PHYSICAL',
    checkTitle: 'Segregated Washrooms & Female Attendant Deployment',
    mandatoryStandard: 'Separate washrooms for girls/boys/staff; female attendant stationed outside primary girl washrooms.',
    isCompliant: true,
    lastAuditedDate: '2024-11-12',
    auditorNotes: 'Verified during surprise inspection by Vice Principal.',
  },
  {
    id: 'chk-04',
    category: 'TRANSPORT_SAFETY',
    checkTitle: 'School Bus Supreme Court Mandates (GPS & Speed Governors)',
    mandatoryStandard: 'Functional GPS telematics, speed governors capped at 40 km/h, emergency stop buttons.',
    isCompliant: true,
    lastAuditedDate: '2024-11-14',
    auditorNotes: 'All 6 fleet buses verified with RTO fitness certificates.',
  },
  {
    id: 'chk-05',
    category: 'FIRE_AND_DISASTER',
    checkTitle: 'Fire Safety NOC & Evacuation Signage',
    mandatoryStandard: 'Active Fire NOC from state fire department, ABC powder extinguishers with inspection tags.',
    isCompliant: true,
    lastAuditedDate: '2024-11-01',
    auditorNotes: 'Fire NOC valid through March 2026. Mock drill conducted on 2024-10-18.',
  },
];
