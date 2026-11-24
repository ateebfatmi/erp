/**
 * VidyaOS - CBSE Career Guidance, RIASEC Psychometric Assessment & Entrance Exam Cell
 * Complies with CBSE Guidelines for Guidance & Counseling in Schools and NEP 2020 Clause 4.38.
 */

export type RIASECDimension =
  | 'Realistic'
  | 'Investigative'
  | 'Artistic'
  | 'Social'
  | 'Enterprising'
  | 'Conventional';

export interface RIASECScore {
  dimension: RIASECDimension;
  score: number; // 0 to 50
  description: string;
}

export interface RIASECResult {
  fullCode: string; // e.g. "IRE"
  primary: RIASECDimension;
  secondary: RIASECDimension;
  tertiary: RIASECDimension;
  traitSummary: string;
  recommendedDisciplines: string[];
  careerClusters: string[];
}

export type EntranceExamCode =
  | 'CUET_UG'
  | 'JEE_MAIN'
  | 'JEE_ADVANCED'
  | 'NEET_UG'
  | 'CLAT'
  | 'NATA'
  | 'NDA'
  | 'IPMAT'
  | 'NID_NIFT';

export interface EntranceExamDefinition {
  code: EntranceExamCode;
  fullName: string;
  governingBody: string; // e.g. "NTA (National Testing Agency)", "Consortium of NLUs"
  frequency: string;
  primaryStream: string;
  officialPortal: string;
}

export const ENTRANCE_EXAMS: Record<EntranceExamCode, EntranceExamDefinition> = {
  CUET_UG: {
    code: 'CUET_UG',
    fullName: 'Common University Entrance Test (CUET-UG)',
    governingBody: 'National Testing Agency (NTA)',
    frequency: 'Annual (May-June)',
    primaryStream: 'All Streams (Language + Domain Subjects + General Test)',
    officialPortal: 'https://cuetug.ntaonline.in',
  },
  JEE_MAIN: {
    code: 'JEE_MAIN',
    fullName: 'Joint Entrance Examination Main (JEE Main)',
    governingBody: 'National Testing Agency (NTA)',
    frequency: '2 Sessions (Jan & April)',
    primaryStream: 'Science PCM',
    officialPortal: 'https://jeemain.nta.ac.in',
  },
  JEE_ADVANCED: {
    code: 'JEE_ADVANCED',
    fullName: 'Joint Entrance Examination Advanced (JEE Advanced)',
    governingBody: 'IIT Joint Admission Board (JAB)',
    frequency: 'Annual (May)',
    primaryStream: 'Science PCM (Top 2.5 Lakh JEE Main)',
    officialPortal: 'https://jeeadv.ac.in',
  },
  NEET_UG: {
    code: 'NEET_UG',
    fullName: 'National Eligibility cum Entrance Test (NEET-UG)',
    governingBody: 'National Testing Agency (NTA)',
    frequency: 'Annual (May)',
    primaryStream: 'Science PCB',
    officialPortal: 'https://neet.ntaonline.in',
  },
  CLAT: {
    code: 'CLAT',
    fullName: 'Common Law Admission Test (CLAT)',
    governingBody: 'Consortium of National Law Universities',
    frequency: 'Annual (December)',
    primaryStream: 'All Streams (Humanities / Commerce / Science)',
    officialPortal: 'https://consortiumofnlus.ac.in',
  },
  NATA: {
    code: 'NATA',
    fullName: 'National Aptitude Test in Architecture (NATA)',
    governingBody: 'Council of Architecture (COA)',
    frequency: 'Multiple phases (April-July)',
    primaryStream: 'Science PCM / Mathematics with 50%',
    officialPortal: 'https://nata.in',
  },
  NDA: {
    code: 'NDA',
    fullName: 'National Defence Academy & Naval Academy Examination',
    governingBody: 'Union Public Service Commission (UPSC)',
    frequency: 'Bi-annual (April & September)',
    primaryStream: 'Army (Any Stream) / Air Force & Navy (Physics & Math)',
    officialPortal: 'https://upsc.gov.in',
  },
  IPMAT: {
    code: 'IPMAT',
    fullName: 'Integrated Programme in Management Aptitude Test (IPMAT)',
    governingBody: 'IIM Indore / IIM Rohtak',
    frequency: 'Annual (May)',
    primaryStream: 'Commerce / Humanities / Science',
    officialPortal: 'https://iimidr.ac.in',
  },
  NID_NIFT: {
    code: 'NID_NIFT',
    fullName: 'National Institute of Design & Fashion Technology (DAT/NIFT)',
    governingBody: 'NID & NTA',
    frequency: 'Annual (Jan-Feb)',
    primaryStream: 'Design & Visual Arts (All Streams)',
    officialPortal: 'https://nift.ntaonline.in',
  },
};

export interface EntranceMockScore {
  id: string;
  studentId: string;
  examCode: EntranceExamCode;
  testDate: string;
  scoreObtained: number;
  maximumScore: number;
  percentile: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface UniversityApplication {
  id: string;
  studentId: string;
  universityName: string;
  courseTitle: string;
  country: 'India' | 'Abroad';
  applicationPortal: string;
  deadlineDate: string;
  sopDrafted: boolean;
  lorRequested: boolean;
  lorReceived: boolean;
  entranceScoreUploaded: boolean;
  applicationFeePaid: boolean;
  submissionStatus: 'Drafting' | 'Review_Pending' | 'Submitted' | 'Accepted' | 'Waitlisted';
}

export interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  grade: string; // e.g. "Class 11-A"
  sessionDate: string;
  counselorName: string;
  focusArea: 'Stream_Choice' | 'CUET_Preparation' | 'Exam_Stress' | 'College_Shortlisting' | 'Career_Roadmap';
  discussionNotes: string;
  actionItems: string[];
  parentInvolved: boolean;
  nextFollowUpDate?: string;
  status: 'Scheduled' | 'Completed' | 'Follow_Up_Required';
}

export interface StudentCounselingProfile {
  studentId: string;
  studentName: string;
  grade: string;
  stream: string;
  riasecScores: Record<RIASECDimension, number>;
  targetExams: EntranceExamCode[];
  latestMockScores: EntranceMockScore[];
  counselingHistory: CounselingSession[];
  applications: UniversityApplication[];
}

/**
 * Computes Holland RIASEC code from scores and retrieves career matching recommendations.
 */
export function calculateHollandCode(scores: Record<RIASECDimension, number>): RIASECResult {
  const dimensions: RIASECDimension[] = [
    'Realistic',
    'Investigative',
    'Artistic',
    'Social',
    'Enterprising',
    'Conventional',
  ];

  // Sort dimensions in descending order of scores
  const sorted = [...dimensions].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

  const primary = sorted[0];
  const secondary = sorted[1];
  const tertiary = sorted[2];
  const fullCode = `${primary[0]}${secondary[0]}${tertiary[0]}`.toUpperCase();

  // Career mappings based on Holland profile combinations
  const careerMap: Record<string, { summary: string; disciplines: string[]; clusters: string[] }> = {
    IRE: {
      summary: 'Analytical innovator oriented towards complex technical research and strategic technology leadership.',
      disciplines: ['Computer Science & AI', 'Aerospace Engineering', 'Robotics & Automation', 'Bio-Informatics'],
      clusters: ['Technology R&D', 'Defense & Aerospace', 'Data Science & Algorithm Design'],
    },
    IRA: {
      summary: 'Scientific investigator with strong artistic and spatial design instincts.',
      disciplines: ['Architecture (B.Arch)', 'Industrial Product Design', 'Bio-Medical Animation', 'Human-Computer Interaction'],
      clusters: ['Design & Technology', 'Urban Planning', 'Creative Computation'],
    },
    IAS: {
      summary: 'Intellectual humanist combining analytical research with high empathy and social impact.',
      disciplines: ['Psychology & Cognitive Sciences', 'Public Health', 'Neuroscience', 'Environmental Law'],
      clusters: ['Healthcare & Research', 'Social Policy', 'Higher Education & Academia'],
    },
    SEC: {
      summary: 'Structured communicator thriving in corporate leadership, institutional management, and education.',
      disciplines: ['Business Administration (BBA)', 'Chartered Accountancy', 'Corporate Law', 'Educational Administration'],
      clusters: ['Corporate Strategy', 'Banking & Financial Services', 'Civil Services (UPSC)'],
    },
    ESC: {
      summary: 'Persuasive organizer and entrepreneur who combines high business drive with systematic execution.',
      disciplines: ['Economics & Econometrics', 'Investment Banking & FinTech', 'International Relations', 'Corporate Law'],
      clusters: ['Venture Capital', 'Management Consulting', 'Public Administration'],
    },
    AES: {
      summary: 'Expressive creative thinker dedicated to storytelling, media, visual arts, and cultural impact.',
      disciplines: ['Mass Communication & Journalism', 'Film & Digital Animation', 'Fine Arts & Curation', 'Creative Writing'],
      clusters: ['Media & Entertainment', 'Advertising & Brand Strategy', 'Publishing & Design'],
    },
    RCI: {
      summary: 'Methodical technologist focusing on precision machinery, civil infrastructure, and applied sciences.',
      disciplines: ['Civil & Structural Engineering', 'Logistics & Supply Chain', 'Surveying & Geomatics', 'Aviation Flight Operations'],
      clusters: ['Defense Services', 'Infrastructure & Construction', 'Aviation & Marine'],
    },
  };

  // Fallback if specific 3-letter key isn't in lookup
  const matched = careerMap[fullCode] || {
    summary: `Versatile profile exhibiting primary strength in ${primary} inquiry, supplemented by ${secondary} and ${tertiary} attributes.`,
    disciplines: ['Interdisciplinary Sciences & Humanities', 'Applied Engineering', 'Management Studies', 'Liberal Arts'],
    clusters: ['Professional Services', 'Public Sector & Governance', 'Corporate Management'],
  };

  return {
    fullCode,
    primary,
    secondary,
    tertiary,
    traitSummary: matched.summary,
    recommendedDisciplines: matched.disciplines,
    careerClusters: matched.clusters,
  };
}

/**
 * Evaluates student readiness and diagnostic guidance based on entrance examination mock history.
 */
export function evaluateEntranceExamReadiness(mockTests: EntranceMockScore[]): {
  examCode: EntranceExamCode;
  attemptCount: number;
  averagePercentile: number;
  latestPercentile: number;
  readinessTier: 'High' | 'Moderate' | 'Needs_Reinforcement';
  commonWeakTopics: string[];
  recommendedStrategy: string;
} {
  if (!mockTests || mockTests.length === 0) {
    return {
      examCode: 'CUET_UG',
      attemptCount: 0,
      averagePercentile: 0,
      latestPercentile: 0,
      readinessTier: 'Needs_Reinforcement',
      commonWeakTopics: ['Foundational Concepts', 'Time Management'],
      recommendedStrategy: 'Schedule diagnostic mock exam and initiate mentor counseling.',
    };
  }

  const examCode = mockTests[0].examCode;
  const sorted = [...mockTests].sort(
    (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
  );

  const attemptCount = sorted.length;
  const sumPercentiles = sorted.reduce((acc, m) => acc + m.percentile, 0);
  const averagePercentile = Math.round((sumPercentiles / attemptCount) * 10) / 10;
  const latestPercentile = sorted[0].percentile;

  // Aggregate weak topics
  const weakTopicCounts: Record<string, number> = {};
  sorted.forEach((m) => {
    m.weakTopics.forEach((t) => {
      weakTopicCounts[t] = (weakTopicCounts[t] || 0) + 1;
    });
  });

  const commonWeakTopics = Object.entries(weakTopicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);

  let readinessTier: 'High' | 'Moderate' | 'Needs_Reinforcement' = 'Needs_Reinforcement';
  let recommendedStrategy = '';

  if (latestPercentile >= 90) {
    readinessTier = 'High';
    recommendedStrategy =
      'Focus on full-length speed drills and fine-tune high-order problem solving (HOTS).';
  } else if (latestPercentile >= 70) {
    readinessTier = 'Moderate';
    recommendedStrategy = `Consolidate conceptual understanding in weak areas (${commonWeakTopics.join(', ')}).`;
  } else {
    readinessTier = 'Needs_Reinforcement';
    recommendedStrategy =
      'Schedule remedial doubt-clearing sessions with subject faculty and review NCERT core chapters.';
  }

  return {
    examCode,
    attemptCount,
    averagePercentile,
    latestPercentile,
    readinessTier,
    commonWeakTopics,
    recommendedStrategy,
  };
}

/**
 * Validates readiness of university application dossier for submission.
 */
export function validateUniversityDossier(application: UniversityApplication): {
  isReadyForSubmission: boolean;
  completionPercentage: number;
  pendingItems: string[];
} {
  const pendingItems: string[] = [];

  if (!application.sopDrafted) {
    pendingItems.push('Statement of Purpose (SOP) drafted & approved');
  }
  if (!application.lorRequested) {
    pendingItems.push('Faculty Letter of Recommendation (LOR) requested');
  } else if (!application.lorReceived) {
    pendingItems.push('Faculty Letter of Recommendation (LOR) received & uploaded');
  }
  if (!application.entranceScoreUploaded) {
    pendingItems.push('Official Entrance / Board score scorecard uploaded');
  }
  if (!application.applicationFeePaid) {
    pendingItems.push('Application fee clearance');
  }

  const totalChecks = 4;
  const completedChecks = totalChecks - pendingItems.length;
  const completionPercentage = Math.round((completedChecks / totalChecks) * 100);

  return {
    isReadyForSubmission: pendingItems.length === 0,
    completionPercentage,
    pendingItems,
  };
}

export interface CounselingCellMetrics {
  totalStudentsMonitored: number;
  riasecAssessedCount: number;
  riasecAssessmentCoverageRate: number; // percentage
  counselingSessionsConducted: number;
  activeUniversityApplications: number;
  studentsInHighReadinessTier: number;
  topTargetExams: { examCode: EntranceExamCode; studentCount: number }[];
}

/**
 * Computes institutional summary metrics for school administration and CBSE compliance audit.
 */
export function computeCounselingCellMetrics(
  students: StudentCounselingProfile[]
): CounselingCellMetrics {
  const total = students.length;
  if (total === 0) {
    return {
      totalStudentsMonitored: 0,
      riasecAssessedCount: 0,
      riasecAssessmentCoverageRate: 0,
      counselingSessionsConducted: 0,
      activeUniversityApplications: 0,
      studentsInHighReadinessTier: 0,
      topTargetExams: [],
    };
  }

  const riasecAssessed = students.filter(
    (s) => Object.values(s.riasecScores).some((v) => v > 0)
  ).length;

  const totalSessions = students.reduce(
    (acc, s) => acc + (s.counselingHistory ? s.counselingHistory.length : 0),
    0
  );

  const totalApplications = students.reduce(
    (acc, s) => acc + (s.applications ? s.applications.length : 0),
    0
  );

  let highReadinessCount = 0;
  const examFrequency: Record<EntranceExamCode, number> = {} as any;

  students.forEach((s) => {
    s.targetExams.forEach((e) => {
      examFrequency[e] = (examFrequency[e] || 0) + 1;
    });

    if (s.latestMockScores && s.latestMockScores.length > 0) {
      const evaluation = evaluateEntranceExamReadiness(s.latestMockScores);
      if (evaluation.readinessTier === 'High') {
        highReadinessCount++;
      }
    }
  });

  const topTargetExams = Object.entries(examFrequency)
    .map(([code, count]) => ({ examCode: code as EntranceExamCode, studentCount: count }))
    .sort((a, b) => b.studentCount - a.studentCount);

  return {
    totalStudentsMonitored: total,
    riasecAssessedCount: riasecAssessed,
    riasecAssessmentCoverageRate: Math.round((riasecAssessed / total) * 100),
    counselingSessionsConducted: totalSessions,
    activeUniversityApplications: totalApplications,
    studentsInHighReadinessTier: highReadinessCount,
    topTargetExams,
  };
}

export const INITIAL_COUNSELING_STUDENTS: StudentCounselingProfile[] = [
  {
    studentId: 'STU-11A-042',
    studentName: 'Aarav Sharma',
    grade: 'Class 11-A',
    stream: 'Science PCM',
    riasecScores: {
      Realistic: 42,
      Investigative: 48,
      Artistic: 18,
      Social: 24,
      Enterprising: 32,
      Conventional: 26,
    },
    targetExams: ['JEE_MAIN', 'JEE_ADVANCED', 'CUET_UG'],
    latestMockScores: [
      {
        id: 'MOCK-JEE-01',
        studentId: 'STU-11A-042',
        examCode: 'JEE_MAIN',
        testDate: '2026-10-15',
        scoreObtained: 235,
        maximumScore: 300,
        percentile: 94.2,
        weakTopics: ['Rotational Dynamics', 'Ionic Equilibrium'],
        strongTopics: ['Calculus', 'Electrodynamics', 'Coordinate Geometry'],
      },
      {
        id: 'MOCK-JEE-02',
        studentId: 'STU-11A-042',
        examCode: 'JEE_MAIN',
        testDate: '2026-11-10',
        scoreObtained: 252,
        maximumScore: 300,
        percentile: 96.8,
        weakTopics: ['Thermodynamics'],
        strongTopics: ['Calculus', 'Optics', 'Modern Physics'],
      },
    ],
    counselingHistory: [
      {
        id: 'CS-01',
        studentId: 'STU-11A-042',
        studentName: 'Aarav Sharma',
        grade: 'Class 11-A',
        sessionDate: '2026-11-05',
        counselorName: 'Dr. Meenakshi Sunderam (Lead Career Counselor)',
        focusArea: 'CUET_Preparation',
        discussionNotes: 'Reviewed JEE mock percentile curve. Discussed backup choices in CUET B.Tech / B.Sc Computer Science at Delhi University & BHU.',
        actionItems: ['Focus revision on Ionic Equilibrium', 'Register for CUET Mock in December'],
        parentInvolved: true,
        status: 'Completed',
      },
    ],
    applications: [
      {
        id: 'APP-01',
        studentId: 'STU-11A-042',
        universityName: 'Indian Institute of Technology (IITs via JoSAA)',
        courseTitle: 'B.Tech Computer Science & Artificial Intelligence',
        country: 'India',
        applicationPortal: 'https://josaa.nic.in',
        deadlineDate: '2027-06-15',
        sopDrafted: true,
        lorRequested: true,
        lorReceived: true,
        entranceScoreUploaded: false,
        applicationFeePaid: true,
        submissionStatus: 'Drafting',
      },
    ],
  },
  {
    studentId: 'STU-12B-019',
    studentName: 'Ananya Verma',
    grade: 'Class 12-B',
    stream: 'Commerce with Mathematics',
    riasecScores: {
      Realistic: 14,
      Investigative: 38,
      Artistic: 22,
      Social: 36,
      Enterprising: 47,
      Conventional: 44,
    },
    targetExams: ['CUET_UG', 'IPMAT'],
    latestMockScores: [
      {
        id: 'MOCK-CUET-01',
        studentId: 'STU-12B-019',
        examCode: 'CUET_UG',
        testDate: '2026-11-02',
        scoreObtained: 760,
        maximumScore: 800,
        percentile: 98.4,
        weakTopics: ['Higher Accountancy Ratios'],
        strongTopics: ['Microeconomics', 'Business Studies Case Studies', 'English Comprehension'],
      },
    ],
    counselingHistory: [
      {
        id: 'CS-02',
        studentId: 'STU-12B-019',
        studentName: 'Ananya Verma',
        grade: 'Class 12-B',
        sessionDate: '2026-10-22',
        counselorName: 'Dr. Meenakshi Sunderam (Lead Career Counselor)',
        focusArea: 'College_Shortlisting',
        discussionNotes: 'Shortlisted SRCC, Lady Shri Ram College, and St. Stephen’s for B.Com (Hons) and B.A. Economics (Hons). Reviewed IIM Indore IPMAT prep.',
        actionItems: ['Complete CUET domain mock series', 'Prepare Statement of Motivation for IPMAT Interview'],
        parentInvolved: false,
        status: 'Completed',
      },
    ],
    applications: [
      {
        id: 'APP-02',
        studentId: 'STU-12B-019',
        universityName: 'Shri Ram College of Commerce (SRCC), University of Delhi',
        courseTitle: 'B.Com (Honours)',
        country: 'India',
        applicationPortal: 'https://ugadmission.uod.ac.in',
        deadlineDate: '2026-06-30',
        sopDrafted: true,
        lorRequested: true,
        lorReceived: true,
        entranceScoreUploaded: true,
        applicationFeePaid: true,
        submissionStatus: 'Submitted',
      },
    ],
  },
  {
    studentId: 'STU-12C-008',
    studentName: 'Tanvi Nair',
    grade: 'Class 12-C',
    stream: 'Humanities & Legal Studies',
    riasecScores: {
      Realistic: 12,
      Investigative: 41,
      Artistic: 35,
      Social: 46,
      Enterprising: 42,
      Conventional: 28,
    },
    targetExams: ['CLAT', 'CUET_UG'],
    latestMockScores: [
      {
        id: 'MOCK-CLAT-01',
        studentId: 'STU-12C-008',
        examCode: 'CLAT',
        testDate: '2026-10-28',
        scoreObtained: 96,
        maximumScore: 120,
        percentile: 92.1,
        weakTopics: ['Quantitative Reasoning Speed'],
        strongTopics: ['Legal Reasoning', 'Current Affairs & GK', 'Critical Reading'],
      },
    ],
    counselingHistory: [
      {
        id: 'CS-03',
        studentId: 'STU-12C-008',
        studentName: 'Tanvi Nair',
        grade: 'Class 12-C',
        sessionDate: '2026-11-12',
        counselorName: 'Dr. Meenakshi Sunderam (Lead Career Counselor)',
        focusArea: 'Career_Roadmap',
        discussionNotes: 'Explored National Law Universities (NLSIU Bengaluru, NALSAR Hyderabad). Addressed exam timing strategies for Section E (Math).',
        actionItems: ['Practice 15-minute daily mental math sets', 'Review NLSIU 5-year B.A. LL.B curriculum'],
        parentInvolved: true,
        status: 'Completed',
      },
    ],
    applications: [
      {
        id: 'APP-03',
        studentId: 'STU-12C-008',
        universityName: 'National Law School of India University (NLSIU), Bengaluru',
        courseTitle: 'B.A. LL.B. (Honours)',
        country: 'India',
        applicationPortal: 'https://consortiumofnlus.ac.in',
        deadlineDate: '2026-12-01',
        sopDrafted: true,
        lorRequested: true,
        lorReceived: true,
        entranceScoreUploaded: false,
        applicationFeePaid: true,
        submissionStatus: 'Submitted',
      },
    ],
  },
];
