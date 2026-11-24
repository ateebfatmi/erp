/**
 * VidyaOS - CBSE School Health & Wellness Programme (SHWP) & Adolescent Peer Educator Hub
 * Compliant with Ayushman Bharat MoE/MoHFW Guidelines & CBSE Circular Acad-14/2020
 */

export type SHWPModule =
  | 'emotional_wellbeing'
  | 'healthy_relationships'
  | 'gender_equality'
  | 'nutrition_fitness'
  | 'substance_misuse_prevention'
  | 'safety_security_injuries'
  | 'cyber_safety_digital_wellness'
  | 'values_citizenship'
  | 'hygiene_sanitation'
  | 'menstrual_health'
  | 'growing_up_changes';

export interface HealthAmbassador {
  id: string;
  name: string;
  gender: 'male' | 'female';
  designation: string;
  certificationStatus: 'certified' | 'in_training';
  trainingDate: string;
  phone: string;
}

export interface PeerEducator {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  assignedModule: SHWPModule;
  trainingBadgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Master Peer Leader';
  sessionsFacilitated: number;
  mentorTeacher: string;
}

export interface WellnessSession {
  id: string;
  module: SHWPModule;
  sessionTitle: string;
  targetGrade: string;
  date: string;
  facilitators: string[];
  pedagogyMode:
    | 'roleplay'
    | 'circle_time_discussion'
    | 'case_study'
    | 'anonymous_question_box'
    | 'expert_doctor_talk';
  studentAttendance: number;
  reflectionNotes: string;
  status: 'scheduled' | 'conducted';
}

export interface AnonymousQueryBoxItem {
  id: string;
  dateSubmitted: string;
  grade: string;
  theme: SHWPModule;
  queryText: string;
  counselorResponse?: string;
  status: 'pending' | 'addressed_in_class' | 'referred_for_1on1';
  resolvedDate?: string;
}

export interface SHWPVitalityReport {
  coveredModulesCount: number;
  totalModulesCount: number; // 11
  moduleCoveragePercentage: number;
  peerEducatorCount: number;
  totalStudentReach: number;
  queryResolutionRate: number;
  ayushmanBharatStarRating: 3 | 4 | 5;
}

export const ALL_SHWP_MODULES: { key: SHWPModule; title: string; category: string }[] = [
  { key: 'emotional_wellbeing', title: 'Emotional Wellbeing & Mental Health', category: 'Psychosocial' },
  { key: 'healthy_relationships', title: 'Healthy Relationships & Peer Respect', category: 'Interpersonal' },
  { key: 'gender_equality', title: 'Gender Equality & Sensitivity', category: 'Social' },
  { key: 'nutrition_fitness', title: 'Nutrition, Active Fitness & Lifestyle', category: 'Physical' },
  { key: 'substance_misuse_prevention', title: 'Substance Misuse Prevention (Tobacco/Drugs)', category: 'Safety' },
  { key: 'safety_security_injuries', title: 'Safety, Injury Prevention & Safe Touch', category: 'Child Protection' },
  { key: 'cyber_safety_digital_wellness', title: 'Cyber Safety & Digital Wellbeing', category: 'Digital' },
  { key: 'values_citizenship', title: 'Universal Values & Responsible Citizenship', category: 'Ethics' },
  { key: 'hygiene_sanitation', title: 'Personal & Environmental Sanitation', category: 'Public Health' },
  { key: 'menstrual_health', title: 'Menstrual Health Management', category: 'Adolescent Care' },
  { key: 'growing_up_changes', title: 'Physical & Hormonal Changes of Adolescence', category: 'Biological' },
];

export function formatSHWPModule(mod: SHWPModule): string {
  const match = ALL_SHWP_MODULES.find((m) => m.key === mod);
  return match ? match.title : mod.replace(/_/g, ' ');
}

/**
 * Calculates Composite Ayushman Bharat School Health Index
 */
export function calculateSHWPIndex(
  sessions: WellnessSession[],
  educators: PeerEducator[],
  queries: AnonymousQueryBoxItem[]
): SHWPVitalityReport {
  const conducted = sessions.filter((s) => s.status === 'conducted');
  const distinctModules = new Set(conducted.map((s) => s.module));
  const coveredCount = distinctModules.size;
  const totalCount = ALL_SHWP_MODULES.length; // 11
  const coveragePct = Math.round((coveredCount / totalCount) * 100);

  const totalReach = conducted.reduce((acc, s) => acc + s.studentAttendance, 0);

  const totalQueries = queries.length;
  const resolvedQueries = queries.filter((q) => q.status !== 'pending').length;
  const queryRate = totalQueries > 0 ? Math.round((resolvedQueries / totalQueries) * 100) : 100;

  let stars: 3 | 4 | 5 = 3;
  if (coveragePct >= 75 && educators.length >= 6 && queryRate >= 80) {
    stars = 5;
  } else if (coveragePct >= 50 && educators.length >= 4) {
    stars = 4;
  }

  return {
    coveredModulesCount: coveredCount,
    totalModulesCount: totalCount,
    moduleCoveragePercentage: coveragePct,
    peerEducatorCount: educators.length,
    totalStudentReach: totalReach,
    queryResolutionRate: queryRate,
    ayushmanBharatStarRating: stars,
  };
}

export const INITIAL_HEALTH_AMBASSADORS: HealthAmbassador[] = [
  {
    id: 'hwa-01',
    name: 'Smt. Kavita Sharma',
    gender: 'female',
    designation: 'PGT Biology / School Health Ambassador',
    certificationStatus: 'certified',
    trainingDate: '2026-05-18',
    phone: '+91 98111 23456',
  },
  {
    id: 'hwa-02',
    name: 'Shri Devender Negi',
    gender: 'male',
    designation: 'Head of Physical Education / Health Ambassador',
    certificationStatus: 'certified',
    trainingDate: '2026-05-18',
    phone: '+91 98730 99887',
  },
];

export const INITIAL_PEER_EDUCATORS: PeerEducator[] = [
  {
    id: 'pe-01',
    studentId: 'STU-1021',
    studentName: 'Aarav Sharma',
    grade: 'Class 10',
    section: 'A',
    assignedModule: 'emotional_wellbeing',
    trainingBadgeLevel: 'Master Peer Leader',
    sessionsFacilitated: 4,
    mentorTeacher: 'Smt. Kavita Sharma',
  },
  {
    id: 'pe-02',
    studentId: 'STU-1024',
    studentName: 'Diya Sengupta',
    grade: 'Class 10',
    section: 'B',
    assignedModule: 'cyber_safety_digital_wellness',
    trainingBadgeLevel: 'Gold',
    sessionsFacilitated: 3,
    mentorTeacher: 'Dr. Meenakshi Joshi',
  },
  {
    id: 'pe-03',
    studentId: 'STU-1033',
    studentName: 'Ananya Deshmukh',
    grade: 'Class 11',
    section: 'A',
    assignedModule: 'gender_equality',
    trainingBadgeLevel: 'Gold',
    sessionsFacilitated: 3,
    mentorTeacher: 'Smt. Vandana Nair',
  },
  {
    id: 'pe-04',
    studentId: 'STU-1035',
    studentName: 'Rohan Mehra',
    grade: 'Class 11',
    section: 'B',
    assignedModule: 'nutrition_fitness',
    trainingBadgeLevel: 'Silver',
    sessionsFacilitated: 2,
    mentorTeacher: 'Shri Devender Negi',
  },
  {
    id: 'pe-05',
    studentId: 'STU-1040',
    studentName: 'Harshvardhan Singh',
    grade: 'Class 12',
    section: 'A',
    assignedModule: 'substance_misuse_prevention',
    trainingBadgeLevel: 'Master Peer Leader',
    sessionsFacilitated: 5,
    mentorTeacher: 'Shri Devender Negi',
  },
  {
    id: 'pe-06',
    studentId: 'STU-1051',
    studentName: 'Tanvi Aggarwal',
    grade: 'Class 12',
    section: 'A',
    assignedModule: 'menstrual_health',
    trainingBadgeLevel: 'Gold',
    sessionsFacilitated: 3,
    mentorTeacher: 'Smt. Kavita Sharma',
  },
];

export const INITIAL_WELLNESS_SESSIONS: WellnessSession[] = [
  {
    id: 'ws-001',
    module: 'emotional_wellbeing',
    sessionTitle: 'Navigating Board Exam Anxiety & 5-Minute Box Breathing',
    targetGrade: 'Class 10',
    date: '2026-11-12',
    facilitators: ['Aarav Sharma (Peer Educator)', 'Smt. Kavita Sharma (HWA)'],
    pedagogyMode: 'circle_time_discussion',
    studentAttendance: 74,
    reflectionNotes:
      'Students actively practiced diaphragmatic box breathing and mapped cognitive reframing of mock exam stress.',
    status: 'conducted',
  },
  {
    id: 'ws-002',
    module: 'cyber_safety_digital_wellness',
    sessionTitle: 'Digital Footprint, Cyberbullying & Screen Time Boundaries',
    targetGrade: 'Class 9',
    date: '2026-11-19',
    facilitators: ['Diya Sengupta (Peer Educator)', 'Dr. Meenakshi Joshi'],
    pedagogyMode: 'case_study',
    studentAttendance: 68,
    reflectionNotes:
      'Analyzed real-world phishing and impersonation case studies. Introduced the national 1930 cyber fraud helpline.',
    status: 'conducted',
  },
  {
    id: 'ws-003',
    module: 'substance_misuse_prevention',
    sessionTitle: 'Saying NO to E-Cigarettes/Vapes & Resisting Peer Pressure',
    targetGrade: 'Class 11',
    date: '2026-11-26',
    facilitators: ['Harshvardhan Singh (Peer Leader)', 'Shri Devender Negi (HWA)'],
    pedagogyMode: 'roleplay',
    studentAttendance: 65,
    reflectionNotes:
      'Students enacted assertiveness roleplays in refusing nicotine vaping devices and understanding COTPA Act 2003.',
    status: 'conducted',
  },
  {
    id: 'ws-004',
    module: 'nutrition_fitness',
    sessionTitle: 'Millet Superfoods, Hydration & Sleep Hygiene for High Performance',
    targetGrade: 'Class 12',
    date: '2026-12-08',
    facilitators: ['Rohan Mehra (Peer Educator)', 'Visiting Dietitian Dr. Nalini Iyer'],
    pedagogyMode: 'expert_doctor_talk',
    studentAttendance: 70,
    reflectionNotes: 'Focus on balanced micronutrients during revision cycles.',
    status: 'scheduled',
  },
];

export const INITIAL_ANONYMOUS_QUERIES: AnonymousQueryBoxItem[] = [
  {
    id: 'aq-001',
    dateSubmitted: '2026-11-15',
    grade: 'Class 10',
    theme: 'emotional_wellbeing',
    queryText: 'I get panic attacks before math tests and blank out even when I know the steps.',
    counselorResponse:
      'Scheduled 1-on-1 progressive muscle relaxation session with School Counselor. Advised structured 20-min timed practice sets.',
    status: 'referred_for_1on1',
    resolvedDate: '2026-11-17',
  },
  {
    id: 'aq-002',
    dateSubmitted: '2026-11-20',
    grade: 'Class 9',
    theme: 'cyber_safety_digital_wellness',
    queryText: 'Someone created a meme page using photos from our annual day and is tagging students.',
    counselorResponse:
      'Addressed in class cyber safety circle. Cyber cell notified and Instagram handle reported and taken down within 24 hours.',
    status: 'addressed_in_class',
    resolvedDate: '2026-11-21',
  },
  {
    id: 'aq-003',
    dateSubmitted: '2026-11-24',
    grade: 'Class 11',
    theme: 'healthy_relationships',
    queryText: 'How do I tell my friend that their jokes in front of others are making me feel humiliated?',
    status: 'pending',
  },
];
