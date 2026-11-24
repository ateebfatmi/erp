/**
 * VidyaOS - CBSE Hubs of Learning (HoL) Collaborative Cluster Desk
 * Compliant with CBSE Circular No. Aff-12/2019 & NEP 2020 School Complex Mandate
 */

export type HubRole = 'lead_collaborator' | 'partner_school';

export interface MemberSchool {
  id: string;
  schoolName: string;
  cbseAffiliationNo: string;
  principalName: string;
  contactEmail: string;
  contactPhone: string;
  role: HubRole;
  distanceKm: number;
}

export interface SharedResourceBooking {
  id: string;
  facilityName: string;
  hostSchoolId: string;
  hostSchoolName: string;
  requestingSchoolId: string;
  requestingSchoolName: string;
  bookingDate: string;
  timeSlot: string;
  delegationSize: number;
  purpose: string;
  safetyNOCConfirmed: boolean;
  status: 'requested' | 'approved' | 'completed' | 'declined';
}

export interface PreBoardModeration {
  id: string;
  subject: string;
  boardClass: 'Class 10' | 'Class 12';
  blueprintStatus: 'aligned_cbse' | 'needs_revision';
  difficultyDistribution: {
    easyPercentage: number;
    averagePercentage: number;
    hotsPercentage: number;
  };
  moderatorSchools: string[];
  status: 'draft' | 'under_moderation' | 'approved_for_print';
  moderationRemarks: string;
}

export interface TeacherPeerObservation {
  id: string;
  observerTeacherName: string;
  observerSchoolName: string;
  hostTeacherName: string;
  hostSchoolName: string;
  subject: string;
  grade: string;
  observationDate: string;
  pedagogyDomain: 'inquiry' | 'experiential' | 'art_integrated' | 'tech_blended';
  reflectionNotes: string;
  bestPracticeShared: string;
}

export interface HubCluster {
  id: string;
  clusterCode: string;
  clusterName: string;
  cbseRegion: string;
  leadSchoolName: string;
  memberSchools: MemberSchool[];
  quarterlyMeetingCount: number;
}

export interface HubVitalityIndex {
  score: number; // 0 - 100
  rating: 'Exemplary' | 'Active' | 'Developing';
  breakdown: {
    meetings: number;
    resources: number;
    moderations: number;
    observations: number;
  };
}

/**
 * Validates Pre-Board examination blueprint against CBSE standard difficulty curve
 */
export function validatePreBoardBlueprint(dist: {
  easyPercentage: number;
  averagePercentage: number;
  hotsPercentage: number;
}): { isBalanced: boolean; message: string } {
  const total = dist.easyPercentage + dist.averagePercentage + dist.hotsPercentage;
  if (total !== 100) {
    return {
      isBalanced: false,
      message: `Total percentage must equal 100% (currently ${total}%).`,
    };
  }

  // CBSE target: Easy 25-35%, Average 45-55%, HOTS 15-25%
  const easyOk = dist.easyPercentage >= 25 && dist.easyPercentage <= 35;
  const avgOk = dist.averagePercentage >= 45 && dist.averagePercentage <= 55;
  const hotsOk = dist.hotsPercentage >= 15 && dist.hotsPercentage <= 25;

  if (easyOk && avgOk && hotsOk) {
    return {
      isBalanced: true,
      message: 'Curriculum blueprint strictly conforms to CBSE 30:50:20 standard difficulty distribution.',
    };
  }

  return {
    isBalanced: false,
    message: 'Difficulty curve deviates from CBSE norm (Expected: Easy 25-35%, Average 45-55%, HOTS 15-25%).',
  };
}

/**
 * Calculates Composite CBSE Hubs of Learning Vitality Score
 */
export function calculateHubCollaborativeScore(
  cluster: HubCluster,
  bookings: SharedResourceBooking[],
  observations: TeacherPeerObservation[],
  moderations: PreBoardModeration[]
): HubVitalityIndex {
  // 1. Meetings (25 pts max - CBSE expects 4 quarterly meetings = 6.25 pts each)
  const meetingScore = Math.min(25, cluster.quarterlyMeetingCount * 6.25);

  // 2. Resource Sharing (25 pts max - completed bookings)
  const completedBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'approved').length;
  const resourceScore = Math.min(25, completedBookings * 8);

  // 3. Pre-Board Joint Moderations (25 pts max)
  const approvedModerations = moderations.filter((m) => m.status === 'approved_for_print').length;
  const moderationScore = Math.min(25, approvedModerations * 12.5);

  // 4. Peer Observations (25 pts max)
  const observationScore = Math.min(25, observations.length * 8);

  const totalScore = Math.round(meetingScore + resourceScore + moderationScore + observationScore);

  let rating: HubVitalityIndex['rating'] = 'Developing';
  if (totalScore >= 80) rating = 'Exemplary';
  else if (totalScore >= 50) rating = 'Active';

  return {
    score: totalScore,
    rating,
    breakdown: {
      meetings: Math.round(meetingScore),
      resources: Math.round(resourceScore),
      moderations: Math.round(moderationScore),
      observations: Math.round(observationScore),
    },
  };
}

export const INITIAL_HUB_CLUSTER: HubCluster = {
  id: 'hol-cluster-01',
  clusterCode: 'CBSE-HOL-DL-042',
  clusterName: 'South-West Delhi Hubs of Learning Cluster #42',
  cbseRegion: 'Delhi West Regional Office',
  leadSchoolName: 'Vidya Mandir Senior Secondary School (Lead Collaborator School - LCS)',
  quarterlyMeetingCount: 3,
  memberSchools: [
    {
      id: 'sch-01',
      schoolName: 'Vidya Mandir Senior Secondary School',
      cbseAffiliationNo: '2130045',
      principalName: 'Dr. Rajesh Sharma',
      contactEmail: 'principal@vidyamandir.edu.in',
      contactPhone: '+91 98100 11223',
      role: 'lead_collaborator',
      distanceKm: 0,
    },
    {
      id: 'sch-02',
      schoolName: 'St. Xavier Public School',
      cbseAffiliationNo: '2130089',
      principalName: 'Fr. Thomas Anthony',
      contactEmail: 'principal@stxavierdelhi.edu.in',
      contactPhone: '+91 98101 22334',
      role: 'partner_school',
      distanceKm: 3.2,
    },
    {
      id: 'sch-03',
      schoolName: 'DAV Centenary Public School',
      cbseAffiliationNo: '2130142',
      principalName: 'Smt. Sarojini Grover',
      contactEmail: 'dav.centenary@davcmc.in',
      contactPhone: '+91 98102 33445',
      role: 'partner_school',
      distanceKm: 4.8,
    },
    {
      id: 'sch-04',
      schoolName: 'Kendriya Vidyalaya No. 2, Cantt',
      cbseAffiliationNo: '2100012',
      principalName: 'Shri R.K. Meena',
      contactEmail: 'kv2cantt@kvsedu.gov.in',
      contactPhone: '+91 98103 44556',
      role: 'partner_school',
      distanceKm: 5.5,
    },
    {
      id: 'sch-05',
      schoolName: 'Tagore International Modern School',
      cbseAffiliationNo: '2130219',
      principalName: 'Dr. Neeta Ganguly',
      contactEmail: 'principal@tagoremodern.edu.in',
      contactPhone: '+91 98104 55667',
      role: 'partner_school',
      distanceKm: 6.1,
    },
  ],
};

export const INITIAL_RESOURCE_BOOKINGS: SharedResourceBooking[] = [
  {
    id: 'res-001',
    facilityName: 'Atal Tinkering Lab (ATL) & Robotics Hub',
    hostSchoolId: 'sch-01',
    hostSchoolName: 'Vidya Mandir Senior Secondary School',
    requestingSchoolId: 'sch-02',
    requestingSchoolName: 'St. Xavier Public School',
    bookingDate: '2026-11-28',
    timeSlot: '09:30 AM - 12:30 PM',
    delegationSize: 28,
    purpose: 'Hands-on 3D printing and Arduino drone sensor workshop for Grade 9 students.',
    safetyNOCConfirmed: true,
    status: 'approved',
  },
  {
    id: 'res-002',
    facilityName: 'Synthetic 400m Track & Olympic Field',
    hostSchoolId: 'sch-04',
    hostSchoolName: 'Kendriya Vidyalaya No. 2, Cantt',
    requestingSchoolId: 'sch-01',
    requestingSchoolName: 'Vidya Mandir Senior Secondary School',
    bookingDate: '2026-11-18',
    timeSlot: '07:30 AM - 10:30 AM',
    delegationSize: 45,
    purpose: 'Pre-Cluster athletic heats and relay handover coaching.',
    safetyNOCConfirmed: true,
    status: 'completed',
  },
  {
    id: 'res-003',
    facilityName: 'Advanced Biotechnology & Chromatography Lab',
    hostSchoolId: 'sch-01',
    hostSchoolName: 'Vidya Mandir Senior Secondary School',
    requestingSchoolId: 'sch-03',
    requestingSchoolName: 'DAV Centenary Public School',
    bookingDate: '2026-12-05',
    timeSlot: '10:00 AM - 01:00 PM',
    delegationSize: 32,
    purpose: 'Class 12 Board Biology DNA gel electrophoresis practical experiments.',
    safetyNOCConfirmed: true,
    status: 'requested',
  },
];

export const INITIAL_PREBOARD_MODERATIONS: PreBoardModeration[] = [
  {
    id: 'mod-001',
    subject: 'Mathematics (Standard 041)',
    boardClass: 'Class 10',
    blueprintStatus: 'aligned_cbse',
    difficultyDistribution: {
      easyPercentage: 30,
      averagePercentage: 50,
      hotsPercentage: 20,
    },
    moderatorSchools: [
      'Vidya Mandir Senior Secondary School',
      'DAV Centenary Public School',
      'Kendriya Vidyalaya No. 2',
    ],
    status: 'approved_for_print',
    moderationRemarks:
      'Verified against CBSE Sample Question Paper 2026-27. Balanced assertion-reasoning questions and case-based studies.',
  },
  {
    id: 'mod-002',
    subject: 'Physics (042)',
    boardClass: 'Class 12',
    blueprintStatus: 'aligned_cbse',
    difficultyDistribution: {
      easyPercentage: 28,
      averagePercentage: 52,
      hotsPercentage: 20,
    },
    moderatorSchools: [
      'Vidya Mandir Senior Secondary School',
      'St. Xavier Public School',
      'Tagore International Modern School',
    ],
    status: 'approved_for_print',
    moderationRemarks:
      'Joint committee vetted ray optics and electromagnetic induction numerical problems. High clarity.',
  },
  {
    id: 'mod-003',
    subject: 'Social Science (087)',
    boardClass: 'Class 10',
    blueprintStatus: 'needs_revision',
    difficultyDistribution: {
      easyPercentage: 40,
      averagePercentage: 45,
      hotsPercentage: 15,
    },
    moderatorSchools: [
      'DAV Centenary Public School',
      'Vidya Mandir Senior Secondary School',
    ],
    status: 'under_moderation',
    moderationRemarks:
      'History nationalism section contains too many direct factual recall items; increase source-based analytical items.',
  },
];

export const INITIAL_PEER_OBSERVATIONS: TeacherPeerObservation[] = [
  {
    id: 'obs-001',
    observerTeacherName: 'Smt. Vandana Nair',
    observerSchoolName: 'Vidya Mandir Senior Secondary School',
    hostTeacherName: 'Shri K.S. Rao (PGT Chemistry)',
    hostSchoolName: 'St. Xavier Public School',
    subject: 'Chemistry',
    grade: 'Class 11',
    observationDate: '2026-10-24',
    pedagogyDomain: 'inquiry',
    reflectionNotes:
      'Superb use of interactive PhET molecular simulation to explain orbital hybridization and dipole moments.',
    bestPracticeShared:
      'Student molecular model building using colored clay balls and toothpicks for spatial bonding comprehension.',
  },
  {
    id: 'obs-002',
    observerTeacherName: 'Shri Akhilesh Yadav',
    observerSchoolName: 'Vidya Mandir Senior Secondary School',
    hostTeacherName: 'Smt. Preeti Bhattacharya',
    hostSchoolName: 'DAV Centenary Public School',
    subject: 'Science (Biology)',
    grade: 'Class 9',
    observationDate: '2026-11-08',
    pedagogyDomain: 'experiential',
    reflectionNotes:
      'Students prepared fresh onion peel and cheek cell slides on individual compound microscopes.',
    bestPracticeShared:
      'Laminated step-by-step staining flowchart placed on each laboratory workbench.',
  },
];
