/**
 * VidyaOS - CBSE Sahodaya School Complex & Inter-School Competition Module
 * Compliant with CBSE Guidelines on Sahodaya School Complexes and Student Off-Campus Safety Norms
 */

export type SahodayaCategory =
  | 'debate'
  | 'mun'
  | 'science_robotics'
  | 'sports_cluster'
  | 'cultural_arts'
  | 'quiz';

export type AgeGroup = 'under_12' | 'under_14' | 'under_17' | 'under_19' | 'open';

export type NOCStatus = 'verified' | 'pending' | 'rejected';

export interface DelegationMember {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  role: string;
  parentConsentNOC: NOCStatus;
  medicalClearance: boolean;
  emergencyPhone: string;
  bloodGroup: string;
}

export interface EscortTeacher {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  phone: string;
  isLeadEscort: boolean;
}

export interface EventResult {
  position?: 'first' | 'second' | 'third' | 'best_delegate' | 'special_mention' | 'participation';
  trophyWon?: string;
  points: number;
  certificateIssued: boolean;
  remarks?: string;
}

export interface SahodayaEvent {
  id: string;
  code: string;
  title: string;
  clusterName: string;
  hostSchool: string;
  venueAddress: string;
  eventDate: string;
  reportingTime: string;
  category: SahodayaCategory;
  ageGroup: AgeGroup;
  status: 'registration' | 'delegation_ready' | 'dispatched' | 'completed' | 'cancelled';
  transportMode: 'school_bus' | 'school_van' | 'direct_parent_drop';
  vehicleNumber?: string;
  delegates: DelegationMember[];
  escorts: EscortTeacher[];
  result?: EventResult;
}

export interface DelegationReadiness {
  isReady: boolean;
  totalDelegates: number;
  verifiedNOCs: number;
  missingNOCs: number;
  missingMedical: number;
  hasLeadEscort: boolean;
  readinessPercentage: number;
  blockingReasons: string[];
}

export interface TrophySummary {
  totalPoints: number;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  specialHonors: number;
  totalParticipations: number;
  categoryBreakdown: Record<SahodayaCategory, number>;
}

export const POSITION_POINTS: Record<NonNullable<EventResult['position']>, number> = {
  first: 10,
  second: 7,
  third: 5,
  best_delegate: 8,
  special_mention: 3,
  participation: 1,
};

export function formatAgeGroup(group: AgeGroup): string {
  switch (group) {
    case 'under_12':
      return 'Sub-Junior (Under 12)';
    case 'under_14':
      return 'Junior (Under 14)';
    case 'under_17':
      return 'Cadet / Inter (Under 17)';
    case 'under_19':
      return 'Senior / Open (Under 19)';
    case 'open':
      return 'All Grades (Open)';
  }
}

export function formatCategory(cat: SahodayaCategory): string {
  switch (cat) {
    case 'debate':
      return 'Parliamentary Debate & Oratory';
    case 'mun':
      return 'Model United Nations (MUN)';
    case 'science_robotics':
      return 'Science & Robotics Olympiad';
    case 'sports_cluster':
      return 'CBSE Sports Cluster Championship';
    case 'cultural_arts':
      return 'Kala Utsav & Performing Arts';
    case 'quiz':
      return 'General Knowledge & Heritage Quiz';
  }
}

/**
 * Validates off-campus safety compliance per CBSE student travel directives:
 * 1. At least 1 delegate
 * 2. 100% parental consent NOCs verified
 * 3. 100% medical clearances verified
 * 4. At least one designated Lead Escort teacher
 */
export function calculateDelegationReadiness(event: SahodayaEvent): DelegationReadiness {
  const total = event.delegates.length;
  if (total === 0) {
    return {
      isReady: false,
      totalDelegates: 0,
      verifiedNOCs: 0,
      missingNOCs: 0,
      missingMedical: 0,
      hasLeadEscort: false,
      readinessPercentage: 0,
      blockingReasons: ['No students assigned to delegation roster'],
    };
  }

  const verifiedNOCs = event.delegates.filter((d) => d.parentConsentNOC === 'verified').length;
  const missingNOCs = total - verifiedNOCs;
  const missingMedical = event.delegates.filter((d) => !d.medicalClearance).length;
  const hasLeadEscort = event.escorts.some((e) => e.isLeadEscort);

  const blockingReasons: string[] = [];
  if (missingNOCs > 0) {
    blockingReasons.push(`${missingNOCs} student(s) pending verified Parental Consent NOC`);
  }
  if (missingMedical > 0) {
    blockingReasons.push(`${missingMedical} student(s) pending School Infirmary medical clearance`);
  }
  if (!hasLeadEscort) {
    blockingReasons.push('No designated Lead Escort Teacher assigned to delegation');
  }

  // Calculate composite readiness: NOCs (40%), Medical (40%), Escort (20%)
  const nocScore = (verifiedNOCs / total) * 40;
  const medScore = ((total - missingMedical) / total) * 40;
  const escortScore = hasLeadEscort ? 20 : 0;
  const readinessPercentage = Math.round(nocScore + medScore + escortScore);

  const isReady = missingNOCs === 0 && missingMedical === 0 && hasLeadEscort;

  return {
    isReady,
    totalDelegates: total,
    verifiedNOCs,
    missingNOCs,
    missingMedical,
    hasLeadEscort,
    readinessPercentage,
    blockingReasons,
  };
}

/**
 * Aggregates overall school performance across all inter-school competitions
 */
export function calculateClusterTrophySummary(events: SahodayaEvent[]): TrophySummary {
  const summary: TrophySummary = {
    totalPoints: 0,
    firstPlaces: 0,
    secondPlaces: 0,
    thirdPlaces: 0,
    specialHonors: 0,
    totalParticipations: 0,
    categoryBreakdown: {
      debate: 0,
      mun: 0,
      science_robotics: 0,
      sports_cluster: 0,
      cultural_arts: 0,
      quiz: 0,
    },
  };

  for (const ev of events) {
    if (!ev.result) continue;
    const pts = ev.result.points;
    summary.totalPoints += pts;
    summary.categoryBreakdown[ev.category] = (summary.categoryBreakdown[ev.category] || 0) + pts;

    if (ev.result.position === 'first') summary.firstPlaces += 1;
    else if (ev.result.position === 'second') summary.secondPlaces += 1;
    else if (ev.result.position === 'third') summary.thirdPlaces += 1;
    else if (ev.result.position === 'best_delegate' || ev.result.position === 'special_mention') {
      summary.specialHonors += 1;
    }
    summary.totalParticipations += 1;
  }

  return summary;
}

/**
 * Initial dataset with realistic CBSE Sahodaya Complex events
 */
export const INITIAL_SAHODAYA_EVENTS: SahodayaEvent[] = [
  {
    id: 'sah-001',
    code: 'SAH-2026-081',
    title: 'Sahodaya Inter-School English Parliamentary Debate',
    clusterName: 'Delhi Central Sahodaya School Complex',
    hostSchool: 'Delhi Public School, R.K. Puram',
    venueAddress: 'Sector XII, R.K. Puram, New Delhi - 110022',
    eventDate: '2026-11-28',
    reportingTime: '08:30 AM',
    category: 'debate',
    ageGroup: 'under_17',
    status: 'delegation_ready',
    transportMode: 'school_van',
    vehicleNumber: 'DL-01-EA-4521',
    delegates: [
      {
        id: 'del-1',
        studentId: 'STU-1021',
        studentName: 'Aarav Sharma',
        grade: 'Class 10',
        section: 'A',
        role: 'Prime Minister (Opening Speaker)',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 98101 23456',
        bloodGroup: 'B+',
      },
      {
        id: 'del-2',
        studentId: 'STU-1024',
        studentName: 'Diya Sengupta',
        grade: 'Class 10',
        section: 'B',
        role: 'Deputy Prime Minister (Rebuttal)',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 98712 34567',
        bloodGroup: 'O+',
      },
      {
        id: 'del-3',
        studentId: 'STU-1029',
        studentName: 'Kabir Varma',
        grade: 'Class 9',
        section: 'A',
        role: 'Government Whip (Summation)',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 99100 87654',
        bloodGroup: 'A+',
      },
    ],
    escorts: [
      {
        id: 'esc-1',
        staffId: 'EMP-T04',
        name: 'Ms. Sunita Rao',
        designation: 'PGT English / Debate Coordinator',
        phone: '+91 98111 22334',
        isLeadEscort: true,
      },
    ],
  },
  {
    id: 'sah-002',
    code: 'SAH-2026-082',
    title: 'North Zone Sahodaya Model United Nations (MUN 2026)',
    clusterName: 'NCR Sahodaya Schools Association',
    hostSchool: 'Modern School, Barakhamba Road',
    venueAddress: 'Barakhamba Road, Connaught Place, New Delhi - 110001',
    eventDate: '2026-12-05',
    reportingTime: '08:00 AM',
    category: 'mun',
    ageGroup: 'under_19',
    status: 'registration',
    transportMode: 'school_bus',
    vehicleNumber: 'DL-1P-CB-9082',
    delegates: [
      {
        id: 'del-4',
        studentId: 'STU-1033',
        studentName: 'Ananya Deshmukh',
        grade: 'Class 11',
        section: 'A',
        role: 'Delegate of France (UNSC)',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 98200 44556',
        bloodGroup: 'AB+',
      },
      {
        id: 'del-5',
        studentId: 'STU-1035',
        studentName: 'Rohan Mehra',
        grade: 'Class 11',
        section: 'B',
        role: 'Delegate of Japan (UNHRC)',
        parentConsentNOC: 'pending',
        medicalClearance: false,
        emergencyPhone: '+91 98311 55667',
        bloodGroup: 'B-',
      },
    ],
    escorts: [
      {
        id: 'esc-2',
        staffId: 'EMP-T08',
        name: 'Mr. Arvind Saxena',
        designation: 'PGT Political Science',
        phone: '+91 98188 77665',
        isLeadEscort: true,
      },
    ],
  },
  {
    id: 'sah-003',
    code: 'SAH-2026-074',
    title: 'CBSE Cluster II Basketball Championship (Boys U-17)',
    clusterName: 'CBSE Regional Cluster II',
    hostSchool: 'The Heritage School, Rohini',
    venueAddress: 'Sector 23, Rohini, Delhi - 110085',
    eventDate: '2026-11-15',
    reportingTime: '07:30 AM',
    category: 'sports_cluster',
    ageGroup: 'under_17',
    status: 'completed',
    transportMode: 'school_bus',
    vehicleNumber: 'DL-1P-CB-9082',
    delegates: [
      {
        id: 'del-6',
        studentId: 'STU-1040',
        studentName: 'Harshvardhan Singh',
        grade: 'Class 10',
        section: 'C',
        role: 'Point Guard / Team Captain',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 99580 11223',
        bloodGroup: 'O+',
      },
      {
        id: 'del-7',
        studentId: 'STU-1042',
        studentName: 'Manan Kapoor',
        grade: 'Class 10',
        section: 'A',
        role: 'Center Forward',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 98104 33221',
        bloodGroup: 'A+',
      },
    ],
    escorts: [
      {
        id: 'esc-3',
        staffId: 'EMP-PE01',
        name: 'Mr. Devender Negi',
        designation: 'Head of Physical Education',
        phone: '+91 98730 99887',
        isLeadEscort: true,
      },
    ],
    result: {
      position: 'first',
      trophyWon: 'CBSE Cluster II Champions Gold Cup',
      points: 10,
      certificateIssued: true,
      remarks: 'Won final against Somerville School 68-54; Qualified for CBSE National Games.',
    },
  },
  {
    id: 'sah-004',
    code: 'SAH-2026-070',
    title: 'Sahodaya Inter-School Robotics & AI Hackathon',
    clusterName: 'Delhi Central Sahodaya School Complex',
    hostSchool: 'Bal Bharati Public School, Pitampura',
    venueAddress: 'Parwana Road, Pitampura, Delhi - 110034',
    eventDate: '2026-11-10',
    reportingTime: '08:45 AM',
    category: 'science_robotics',
    ageGroup: 'under_19',
    status: 'completed',
    transportMode: 'school_van',
    vehicleNumber: 'DL-01-EA-4521',
    delegates: [
      {
        id: 'del-8',
        studentId: 'STU-1051',
        studentName: 'Tanvi Aggarwal',
        grade: 'Class 12',
        section: 'A',
        role: 'AI Model & Computer Vision Lead',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 98115 66778',
        bloodGroup: 'B+',
      },
      {
        id: 'del-9',
        studentId: 'STU-1053',
        studentName: 'Vikramaditya Roy',
        grade: 'Class 12',
        section: 'A',
        role: 'Autonomous Rover Hardware Architect',
        parentConsentNOC: 'verified',
        medicalClearance: true,
        emergencyPhone: '+91 98100 22119',
        bloodGroup: 'O-',
      },
    ],
    escorts: [
      {
        id: 'esc-4',
        staffId: 'EMP-T12',
        name: 'Dr. Meenakshi Joshi',
        designation: 'HOD Computer Science & Robotics',
        phone: '+91 98109 44332',
        isLeadEscort: true,
      },
    ],
    result: {
      position: 'second',
      trophyWon: 'Sahodaya Innovation Silver Plaque',
      points: 7,
      certificateIssued: true,
      remarks: 'Runner-up in Autonomous Agritech Rover category with 94.5% precision score.',
    },
  },
];
