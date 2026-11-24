/**
 * VidyaOS - NEP 2020 Holistic Progress Card (HPC) & 360-Degree Evaluation Engine
 * Compliant with NCERT PARAKH Framework for Multidimensional Student Assessment.
 */

export type CompetencyLevel = 'EMERGING' | 'DEVELOPING' | 'PROFICIENT';

export type CompetencyDomain =
  | 'CRITICAL_THINKING'
  | 'COMMUNICATION_COLLABORATION'
  | 'SCIENTIFIC_INQUIRY'
  | 'CREATIVITY_INNOVATION'
  | 'EMOTIONAL_RESILIENCE'
  | 'DIGITAL_CITIZENSHIP';

export interface CompetencyRating {
  domain: CompetencyDomain;
  label: string;
  level: CompetencyLevel;
  evidenceOrObservation: string;
}

export interface SelfAssessmentRecord {
  favoriteLearningExperience: string;
  challengeOvercome: string;
  personalGoalForNextTerm: string;
  confidenceRating: number; // 1-5
  selfValues: string[];
}

export interface PeerAssessmentRecord {
  peerStudentId: string;
  peerStudentName: string;
  teamworkFeedback: string;
  appreciationNotes: string;
  peerRating: number; // 1-5
}

export interface ParentObservationRecord {
  homeHabitsObservation: string;
  hobbiesAndCreativePursuits: string;
  screenTimeBalanceRating: 'BALANCED' | 'MODERATE' | 'NEEDS_REGULATION';
  parentSignOff: boolean;
  signedAt: string;
}

export interface TeacherAnecdotalRecord {
  teacherId: string;
  teacherName: string;
  classSection: string;
  anecdotalNotes: string;
  keyStrengthsObserved: string[];
  recommendedFocusAreas: string[];
  overallHolisticSummary: string;
}

export interface HolisticProgressCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeSection: string;
  academicSession: string;
  term: 'TERM_1' | 'TERM_2';
  competencies: CompetencyRating[];
  selfAssessment?: SelfAssessmentRecord;
  peerAssessment?: PeerAssessmentRecord;
  parentObservation?: ParentObservationRecord;
  teacherAnecdotal?: TeacherAnecdotalRecord;
  status: 'DRAFT' | 'READY_FOR_PARENT_SIGN' | 'FINALIZED';
}

const LEVEL_WEIGHTS: Record<CompetencyLevel, number> = {
  EMERGING: 1,
  DEVELOPING: 2,
  PROFICIENT: 3,
};

/**
 * Calculates quantitative competency index from qualitative PARAKH 21st-century descriptors.
 */
export function calculateCompetencyIndex(competencies: CompetencyRating[]): {
  overallScorePercent: number;
  proficientCount: number;
  developingCount: number;
  emergingCount: number;
  overallLevel: CompetencyLevel;
} {
  if (competencies.length === 0) {
    return {
      overallScorePercent: 0,
      proficientCount: 0,
      developingCount: 0,
      emergingCount: 0,
      overallLevel: 'EMERGING',
    };
  }

  let totalPoints = 0;
  let proficientCount = 0;
  let developingCount = 0;
  let emergingCount = 0;

  for (const comp of competencies) {
    totalPoints += LEVEL_WEIGHTS[comp.level] || 1;
    if (comp.level === 'PROFICIENT') proficientCount++;
    else if (comp.level === 'DEVELOPING') developingCount++;
    else emergingCount++;
  }

  const maxPoints = competencies.length * 3;
  const overallScorePercent = Math.round((totalPoints / maxPoints) * 100);

  let overallLevel: CompetencyLevel = 'DEVELOPING';
  if (overallScorePercent >= 80) {
    overallLevel = 'PROFICIENT';
  } else if (overallScorePercent < 55) {
    overallLevel = 'EMERGING';
  }

  return {
    overallScorePercent,
    proficientCount,
    developingCount,
    emergingCount,
    overallLevel,
  };
}

/**
 * Validates whether all 4 pillars of the 360-degree assessment are populated before finalization.
 */
export function validateHpcCompletion(hpc: HolisticProgressCard): {
  isComplete: boolean;
  pendingSections: string[];
} {
  const pendingSections: string[] = [];

  if (!hpc.competencies || hpc.competencies.length < 4) {
    pendingSections.push('Teacher 21st-Century Competency Descriptors (minimum 4 domains required)');
  }

  if (!hpc.selfAssessment || !hpc.selfAssessment.favoriteLearningExperience) {
    pendingSections.push("Learner Self-Assessment & Voice");
  }

  if (!hpc.peerAssessment || !hpc.peerAssessment.teamworkFeedback) {
    pendingSections.push("Peer Collaborative Assessment");
  }

  if (!hpc.parentObservation || !hpc.parentObservation.homeHabitsObservation) {
    pendingSections.push("Parent Home Environment Observations");
  }

  if (!hpc.teacherAnecdotal || !hpc.teacherAnecdotal.anecdotalNotes) {
    pendingSections.push("Class Teacher Anecdotal Behavioral Narrative");
  }

  return {
    isComplete: pendingSections.length === 0,
    pendingSections,
  };
}

/**
 * Finalizes the HPC card and locks it for digital publication and CBSE inspection.
 */
export function finalizeHolisticProgressCard(
  hpc: HolisticProgressCard
): { updatedHpc: HolisticProgressCard; success: boolean; error?: string } {
  const validation = validateHpcCompletion(hpc);
  if (!validation.isComplete) {
    return {
      updatedHpc: hpc,
      success: false,
      error: `Cannot finalize HPC: Incomplete sections [${validation.pendingSections.join(', ')}]`,
    };
  }

  return {
    updatedHpc: {
      ...hpc,
      status: 'FINALIZED',
    },
    success: true,
  };
}

export const INITIAL_HPC_RECORDS: HolisticProgressCard[] = [
  {
    id: 'hpc-001',
    studentId: 'stu-01',
    studentName: 'Aarav Mehta',
    admissionNo: 'DPGA/2021/1042',
    gradeSection: 'Class 10-A',
    academicSession: '2025-26',
    term: 'TERM_1',
    competencies: [
      {
        domain: 'CRITICAL_THINKING',
        label: 'Critical Thinking & Problem Formulation',
        level: 'PROFICIENT',
        evidenceOrObservation:
          'Identified alternative hypothesis during physics optics lab experiment with prism refraction.',
      },
      {
        domain: 'COMMUNICATION_COLLABORATION',
        label: 'Communication & Active Listening in Teams',
        level: 'PROFICIENT',
        evidenceOrObservation:
          'Led Inter-House debating group; articulated rebuttals with poise and respected opposite viewpoints.',
      },
      {
        domain: 'SCIENTIFIC_INQUIRY',
        label: 'Inquiry & Evidence-Based Reasoning',
        level: 'PROFICIENT',
        evidenceOrObservation:
          'Applied scientific methodology rigorously in Atal Tinkering Lab robotics sensor calibration.',
      },
      {
        domain: 'CREATIVITY_INNOVATION',
        label: 'Originality & Aesthetic Expression',
        level: 'DEVELOPING',
        evidenceOrObservation:
          'Designed creative wireframes for social impact website; encouraged to explore more design typography.',
      },
      {
        domain: 'EMOTIONAL_RESILIENCE',
        label: 'Self-Regulation & Empathy Towards Peers',
        level: 'PROFICIENT',
        evidenceOrObservation:
          'Demonstrated calm problem-solving when group project hardware malfunctioned; mentored junior teammate.',
      },
      {
        domain: 'DIGITAL_CITIZENSHIP',
        label: 'Responsible Online Conduct & Cyber Hygiene',
        level: 'PROFICIENT',
        evidenceOrObservation:
          'Adheres strictly to school ICT ethical usage policies; cited open-source references accurately in coding.',
      },
    ],
    selfAssessment: {
      favoriteLearningExperience:
        'Building the automated plant watering system using Arduino in Atal Tinkering Lab.',
      challengeOvercome:
        'Overcoming initial stage fright during the Hindi elocution competition.',
      personalGoalForNextTerm:
        'Improve my speed in solving Class 10 trigonometry problems without making calculation errors.',
      confidenceRating: 5,
      selfValues: ['Curiosity', 'Kindness', 'Perseverance'],
    },
    peerAssessment: {
      peerStudentId: 'stu-02',
      peerStudentName: 'Diya Sharma',
      teamworkFeedback:
        'Aarav is an exceptional project partner. He always makes sure every teammate understands their part.',
      appreciationNotes:
        'Helped debug our group Python program late evening before submission day.',
      peerRating: 5,
    },
    parentObservation: {
      homeHabitsObservation:
        'Reads non-fiction books regularly before bed. Maintains personal study schedule without parental reminders.',
      hobbiesAndCreativePursuits:
        'Passionate about chess, cycling with friends, and building small electronic kits.',
      screenTimeBalanceRating: 'BALANCED',
      parentSignOff: true,
      signedAt: '2024-11-20',
    },
    teacherAnecdotal: {
      teacherId: 'tch-01',
      teacherName: 'Smt. Ananya Sen (Class Teacher)',
      classSection: 'Class 10-A',
      anecdotalNotes:
        'Aarav is an intellectually curious and respectful scholar. He naturally bridges peer discussions and embodies exemplary leadership in scholastic and co-scholastic arenas.',
      keyStrengthsObserved: [
        'Analytical Rigor',
        'Empathetic Peer Collaboration',
        'Autonomous Work Ethic',
      ],
      recommendedFocusAreas: [
        'Creative Writing and Descriptive Essay Elaboration',
      ],
      overallHolisticSummary:
        'Outstanding holistic performance across cognitive, affective, and psychomotor domains.',
    },
    status: 'FINALIZED',
  },
];
