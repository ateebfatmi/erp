/**
 * CBSE CWSN & Inclusive Education Individualized Education Plan (IEP) Engine
 * Statutory Compliance: Rights of Persons with Disabilities (RPwD) Act 2016,
 * CBSE Examination Bye-Laws Rule 24 & Circular Acad-58/2021, and NEP 2020 Para 6.
 */

export type DisabilityCategory =
  | 'SPECIFIC_LEARNING_DISABILITY_DYSLEXIA'
  | 'AUTISM_SPECTRUM_DISORDER'
  | 'ATTENTION_DEFICIT_HYPERACTIVITY_DISORDER_ADHD'
  | 'VISUAL_IMPAIRMENT_OR_BLINDNESS'
  | 'HEARING_IMPAIRMENT'
  | 'LOCOMOTOR_DISABILITY_OR_CEREBRAL_PALSY'
  | 'SPEECH_AND_LANGUAGE_DISABILITY';

export type CbseExamConcession =
  | 'EXTRA_TIME_20_MIN_PER_HOUR'
  | 'SCRIBE_OR_READER_PERMISSION'
  | 'EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE'
  | 'ALTERNATE_QUESTIONS_IN_LIEU_OF_VISUAL_DIAGRAMS'
  | 'USE_OF_COMPUTER_OR_CALCULATOR_FOR_DYSCALCULIA'
  | 'SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR'
  | 'ALLOWANCE_OF_SENSORY_FIDGET_AND_ASSISTIVE_AIDS';

export type IepGoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'MODIFIED';

export interface IepTermGoal {
  id: string;
  domain: 'READING_LANGUAGE' | 'MATHEMATICS_LOGIC' | 'SOCIAL_EMOTIONAL' | 'MOTOR_SKILLS' | 'EXECUTIVE_FUNCTIONING';
  goalStatement: string;
  baselinePerformance: string;
  targetMilestone: string;
  accommodationsRequired: string[];
  status: IepGoalStatus;
  progressPercentage: number; // 0 to 100
  specialEducatorNotes?: string;
  lastReviewDate: string;
}

export interface CwsnStudentProfile {
  id: string;
  admissionNo: string;
  studentName: string;
  gradeClass: string;
  section: string;
  dob: string;
  disabilityCategory: DisabilityCategory;
  clinicalDiagnosis: string;
  disabilityCertificateNo: string;
  issuingHospitalOrAgency: string;
  specialEducatorInCharge: string;
  counselorInCharge: string;
  eligibleCbseConcessions: CbseExamConcession[];
  classroomAccommodations: string[];
  termGoals: IepTermGoal[];
  lastIepReviewDate: string;
}

/**
 * Evaluates statutory CBSE Examination Bye-Laws Rule 24 concessions based on RPwD disability category
 */
export function evaluateCbseExamConcessions(category: DisabilityCategory): CbseExamConcession[] {
  const commonConcessions: CbseExamConcession[] = ['EXTRA_TIME_20_MIN_PER_HOUR'];

  switch (category) {
    case 'SPECIFIC_LEARNING_DISABILITY_DYSLEXIA':
      return [
        ...commonConcessions,
        'SCRIBE_OR_READER_PERMISSION',
        'EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE',
        'USE_OF_COMPUTER_OR_CALCULATOR_FOR_DYSCALCULIA',
      ];

    case 'AUTISM_SPECTRUM_DISORDER':
      return [
        ...commonConcessions,
        'SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR',
        'ALLOWANCE_OF_SENSORY_FIDGET_AND_ASSISTIVE_AIDS',
        'EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE',
      ];

    case 'VISUAL_IMPAIRMENT_OR_BLINDNESS':
      return [
        ...commonConcessions,
        'SCRIBE_OR_READER_PERMISSION',
        'ALTERNATE_QUESTIONS_IN_LIEU_OF_VISUAL_DIAGRAMS',
        'SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR',
      ];

    case 'HEARING_IMPAIRMENT':
      return [
        ...commonConcessions,
        'EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE',
        'SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR',
      ];

    case 'LOCOMOTOR_DISABILITY_OR_CEREBRAL_PALSY':
      return [
        ...commonConcessions,
        'SCRIBE_OR_READER_PERMISSION',
        'SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR',
      ];

    default:
      return commonConcessions;
  }
}

/**
 * Calculates quantitative progress across an Individualized Education Plan (IEP)
 */
export function calculateIepProgress(goals: IepTermGoal[]): {
  totalGoals: number;
  achievedGoals: number;
  inProgressGoals: number;
  overallProgressPercent: number;
} {
  const total = goals.length;
  if (total === 0) {
    return { totalGoals: 0, achievedGoals: 0, inProgressGoals: 0, overallProgressPercent: 0 };
  }

  const achieved = goals.filter((g) => g.status === 'ACHIEVED').length;
  const inProgress = goals.filter((g) => g.status === 'IN_PROGRESS').length;
  const totalScoreSum = goals.reduce((sum, g) => sum + g.progressPercentage, 0);
  const overallPercent = Math.round(totalScoreSum / total);

  return {
    totalGoals: total,
    achievedGoals: achieved,
    inProgressGoals: inProgress,
    overallProgressPercent: overallPercent,
  };
}

/**
 * Updates a milestone goal within an IEP profile
 */
export function updateIepGoal(
  profile: CwsnStudentProfile,
  goalId: string,
  newStatus: IepGoalStatus,
  progressPercentage: number,
  educatorNotes?: string
): CwsnStudentProfile {
  const updatedGoals = profile.termGoals.map((g) => {
    if (g.id !== goalId) return g;
    return {
      ...g,
      status: newStatus,
      progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
      specialEducatorNotes: educatorNotes || g.specialEducatorNotes,
      lastReviewDate: new Date().toISOString().split('T')[0],
    };
  });

  return {
    ...profile,
    termGoals: updatedGoals,
    lastIepReviewDate: new Date().toISOString().split('T')[0],
  };
}

/**
 * Pre-seeded CWSN Student Profiles
 */
export const INITIAL_CWSN_PROFILES: CwsnStudentProfile[] = [
  {
    id: 'cwsn-01',
    admissionNo: 'ADM-2024-001',
    studentName: 'Aarav Mehta',
    gradeClass: 'Class 10',
    section: 'A',
    dob: '2009-08-14',
    disabilityCategory: 'SPECIFIC_LEARNING_DISABILITY_DYSLEXIA',
    clinicalDiagnosis: 'Mixed Disorder of Scholastic Skills (Dyslexia with Dysgraphia) • NIMHANS Battery 2023',
    disabilityCertificateNo: 'DIS/DEL/2023/88921',
    issuingHospitalOrAgency: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    specialEducatorInCharge: 'Smt. Shalini Mathur (RCI Registered)',
    counselorInCharge: 'Dr. Radhika Sen, Ph.D.',
    eligibleCbseConcessions: [
      'EXTRA_TIME_20_MIN_PER_HOUR',
      'SCRIBE_OR_READER_PERMISSION',
      'EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE',
      'USE_OF_COMPUTER_OR_CALCULATOR_FOR_DYSCALCULIA',
    ],
    classroomAccommodations: [
      'Use of OpenDyslexic high-contrast font worksheets',
      'Audio recording permission for complex physics lectures',
      'Extended time for written unit class tests (15 mins)',
      'Front row seating adjacent to teacher dais',
    ],
    lastIepReviewDate: '2024-11-15',
    termGoals: [
      {
        id: 'g-01',
        domain: 'READING_LANGUAGE',
        goalStatement: 'Improve English reading fluency from 70 words/min to 110 words/min with text-to-speech assistive tools.',
        baselinePerformance: '70 WPM with frequent letter reversal (b/d, p/q)',
        targetMilestone: '110 WPM reading with 85% comprehension accuracy',
        accommodationsRequired: ['Colored overlay sheets', 'Text-to-speech reader'],
        status: 'IN_PROGRESS',
        progressPercentage: 75,
        specialEducatorNotes: 'Aarav demonstrated notable improvement using Kindle OpenDyslexic settings.',
        lastReviewDate: '2024-11-15',
      },
      {
        id: 'g-02',
        domain: 'MATHEMATICS_LOGIC',
        goalStatement: 'Master algebraic quadratic formula substitution without sign transposition errors.',
        baselinePerformance: 'Inverts signs (-b +/- sqrt) when computing discriminant',
        targetMilestone: 'Accurately solve 8 out of 10 quadratic equations independently',
        accommodationsRequired: ['Step-by-step cue card formula sheet', 'Graph paper with enlarged grids'],
        status: 'ACHIEVED',
        progressPercentage: 100,
        specialEducatorNotes: 'Successfully completed term quadratic evaluation with 90% score.',
        lastReviewDate: '2024-11-10',
      },
      {
        id: 'g-03',
        domain: 'EXECUTIVE_FUNCTIONING',
        goalStatement: 'Independently organize assignment submission calendar in digital student portal.',
        baselinePerformance: 'Misses 30% of coursework deadlines due to task disorganization',
        targetMilestone: 'Zero missed assignments over a 6-week academic cycle',
        accommodationsRequired: ['Automated daily push notification reminders', 'Weekly counseling check-in'],
        status: 'IN_PROGRESS',
        progressPercentage: 80,
        specialEducatorNotes: 'Submitted all Science and Math homework on schedule over the past month.',
        lastReviewDate: '2024-11-12',
      },
    ],
  },
  {
    id: 'cwsn-02',
    admissionNo: 'ADM-2024-045',
    studentName: 'Kunal Trivedi',
    gradeClass: 'Class 8',
    section: 'B',
    dob: '2011-03-22',
    disabilityCategory: 'AUTISM_SPECTRUM_DISORDER',
    clinicalDiagnosis: 'High Functioning Autism Spectrum Disorder (Level 1) with Sensory Processing Sensitivity',
    disabilityCertificateNo: 'DIS/UP/2022/44109',
    issuingHospitalOrAgency: 'Safdarjung Hospital, New Delhi',
    specialEducatorInCharge: 'Smt. Shalini Mathur (RCI Registered)',
    counselorInCharge: 'Dr. Radhika Sen, Ph.D.',
    eligibleCbseConcessions: [
      'EXTRA_TIME_20_MIN_PER_HOUR',
      'SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR',
      'ALLOWANCE_OF_SENSORY_FIDGET_AND_ASSISTIVE_AIDS',
      'EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE',
    ],
    classroomAccommodations: [
      'Noise-cancelling headphones permitted during assembly & loud periods',
      'Visual timetable schedule on student desk',
      '5-minute sensory regulation break pass to counselor wellness room',
    ],
    lastIepReviewDate: '2024-11-18',
    termGoals: [
      {
        id: 'g-11',
        domain: 'SOCIAL_EMOTIONAL',
        goalStatement: 'Initiate cooperative group learning tasks during science lab practicals without sensory overwhelm.',
        baselinePerformance: 'Withdraws from lab tables when ambient sound exceeds 65 dB',
        targetMilestone: 'Participate in 40-minute collaborative lab experiment with designated lab partner',
        accommodationsRequired: ['Designated quiet corner bench', 'Advance visual lab instructions'],
        status: 'IN_PROGRESS',
        progressPercentage: 65,
        specialEducatorNotes: 'Kunal successfully completed optics experiment with his partner Rohan.',
        lastReviewDate: '2024-11-18',
      },
    ],
  },
];
