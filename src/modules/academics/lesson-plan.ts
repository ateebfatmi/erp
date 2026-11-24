/**
 * VidyaOS - NEP 2020 Pedagogical Lesson Planner & Micro-Plan Approval Desk
 * Compliant with CBSE Circulars, NCF-SE 2023, and Bloom's Revised Taxonomy
 */

export type BloomLevel =
  | 'remembering'
  | 'understanding'
  | 'applying'
  | 'analyzing'
  | 'evaluating'
  | 'creating';

export type PedagogicalStrategy =
  | 'experiential'
  | 'art_integrated'
  | 'sports_integrated'
  | 'toy_based'
  | 'inquiry_discussion'
  | 'cross_curricular';

export type Skill21stCentury =
  | 'critical_thinking'
  | 'creativity'
  | 'collaboration'
  | 'communication'
  | 'digital_literacy';

export type AssessmentMethod =
  | 'exit_ticket'
  | 'quiz'
  | 'peer_review'
  | 'concept_map'
  | 'oral_questioning'
  | 'rubric_presentation';

export type PlanStatus = 'draft' | 'submitted' | 'approved' | 'revision_requested';

export interface LessonPlan {
  id: string;
  code: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  section: string;
  chapterName: string;
  unitTheme: string;
  targetPeriods: number;
  startDate: string;
  endDate: string;
  learningOutcomes: string[];
  bloomLevels: BloomLevel[];
  pedagogyStrategies: PedagogicalStrategy[];
  skillsTargeted: Skill21stCentury[];
  teachingAidsTLM: string[];
  experientialActivity: string;
  artSportsIntegrationDetails: string;
  inclusiveAdaptationsCWSN: string;
  formativeAssessmentMethod: AssessmentMethod;
  status: PlanStatus;
  submittedDate?: string;
  reviewerName?: string;
  reviewDate?: string;
  reviewerRemarks?: string;
}

export interface NEPComplianceResult {
  score: number; // 0 - 100
  isCompliant: boolean; // >= 75%
  strengths: string[];
  missingElements: string[];
}

export function formatBloomLevel(level: BloomLevel): string {
  switch (level) {
    case 'remembering':
      return 'L1: Remembering (Recall)';
    case 'understanding':
      return 'L2: Understanding (Comprehend)';
    case 'applying':
      return 'L3: Applying (Execute)';
    case 'analyzing':
      return 'L4: Analyzing (Differentiate)';
    case 'evaluating':
      return 'L5: Evaluating (Justify)';
    case 'creating':
      return 'L6: Creating (Design)';
  }
}

export function formatPedagogy(strat: PedagogicalStrategy): string {
  switch (strat) {
    case 'experiential':
      return 'Experiential & Lab Inquiry';
    case 'art_integrated':
      return 'Art-Integrated Learning (CBSE)';
    case 'sports_integrated':
      return 'Sports & Movement-Integrated';
    case 'toy_based':
      return 'Toy-Based / Manipulative Pedagogy';
    case 'inquiry_discussion':
      return 'Socratic Inquiry & Peer Discussion';
    case 'cross_curricular':
      return 'Cross-Curricular Linkage';
  }
}

/**
 * Calculates NEP 2020 & CBSE Pedagogical Compliance Meter:
 * - Learning Outcomes clearly listed (20 pts)
 * - Higher Order Bloom's Cognitive Levels (Applying, Analyzing, Evaluating, Creating) (20 pts)
 * - Art or Sports Integrated Activity included (CBSE Mandatory) (20 pts)
 * - Experiential Learning Hands-on activity documented (20 pts)
 * - CWSN / Inclusive Differentiated Accommodation provided (10 pts)
 * - Formative Exit assessment defined (10 pts)
 */
export function calculateNEPComplianceScore(plan: LessonPlan): NEPComplianceResult {
  let score = 0;
  const strengths: string[] = [];
  const missingElements: string[] = [];

  // 1. Learning Outcomes
  if (plan.learningOutcomes.length > 0 && plan.learningOutcomes.some((lo) => lo.trim().length > 5)) {
    score += 20;
    strengths.push(`${plan.learningOutcomes.length} measurable NCERT Learning Outcomes defined`);
  } else {
    missingElements.push('Missing explicit NCERT Learning Outcome statements');
  }

  // 2. Bloom Higher Order Thinking Skills (HOTS)
  const hotsLevels: BloomLevel[] = ['applying', 'analyzing', 'evaluating', 'creating'];
  const hasHOTS = plan.bloomLevels.some((bl) => hotsLevels.includes(bl));
  if (hasHOTS) {
    score += 20;
    strengths.push("Maps to Higher Order Thinking Skills (Bloom's HOTS L3-L6)");
  } else {
    missingElements.push("Lacks Higher Order Thinking Skills; only relies on Recall/Understanding");
  }

  // 3. CBSE Mandatory Art or Sports Integration
  const hasArtOrSports =
    plan.pedagogyStrategies.includes('art_integrated') ||
    plan.pedagogyStrategies.includes('sports_integrated');
  if (hasArtOrSports && plan.artSportsIntegrationDetails.trim().length > 10) {
    score += 20;
    strengths.push('Meets CBSE statutory Art / Sports integrated pedagogy circular');
  } else {
    missingElements.push('Requires explicit Art or Sports integrated activity details (CBSE Circular)');
  }

  // 4. Experiential Learning
  if (
    plan.pedagogyStrategies.includes('experiential') &&
    plan.experientialActivity.trim().length > 10
  ) {
    score += 20;
    strengths.push('Includes hands-on experiential / real-world discovery activity');
  } else {
    missingElements.push('Hands-on experiential discovery activity description missing or incomplete');
  }

  // 5. Inclusive CWSN Adaptations
  if (plan.inclusiveAdaptationsCWSN.trim().length > 5) {
    score += 10;
    strengths.push('Provides differentiated accommodations for diverse learners & CWSN');
  } else {
    missingElements.push('Missing differentiated instruction notes for slow/gifted/CWSN learners');
  }

  // 6. Formative Assessment
  if (plan.formativeAssessmentMethod) {
    score += 10;
    strengths.push(`Formative diagnostic strategy: ${plan.formativeAssessmentMethod.replace('_', ' ')}`);
  } else {
    missingElements.push('Missing formative diagnostic / exit ticket strategy');
  }

  return {
    score,
    isCompliant: score >= 75,
    strengths,
    missingElements,
  };
}

/**
 * Filter lesson plans by search criteria
 */
export function filterLessonPlans(
  plans: LessonPlan[],
  query: { teacherId?: string; subject?: string; grade?: string; status?: PlanStatus | 'all' }
): LessonPlan[] {
  return plans.filter((plan) => {
    if (query.teacherId && plan.teacherId !== query.teacherId) return false;
    if (query.subject && query.subject !== 'all' && plan.subject !== query.subject) return false;
    if (query.grade && query.grade !== 'all' && plan.grade !== query.grade) return false;
    if (query.status && query.status !== 'all' && plan.status !== query.status) return false;
    return true;
  });
}

/**
 * Approve or request revision on a lesson plan
 */
export function reviewLessonPlan(
  plan: LessonPlan,
  decision: 'approved' | 'revision_requested',
  reviewerName: string,
  remarks: string
): LessonPlan {
  return {
    ...plan,
    status: decision,
    reviewerName,
    reviewDate: new Date().toISOString().split('T')[0],
    reviewerRemarks: remarks,
  };
}

/**
 * Initial standard CBSE lesson plans conforming to NEP 2020
 */
export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-001',
    code: 'LP-2026-SCI-101',
    teacherId: 'EMP-T01',
    teacherName: 'Dr. Rajesh Sharma',
    subject: 'Science (Physics)',
    grade: 'Class 10',
    section: 'A',
    chapterName: 'Light: Reflection & Refraction',
    unitTheme: 'Natural Phenomena & Ray Optics',
    targetPeriods: 6,
    startDate: '2026-11-20',
    endDate: '2026-11-27',
    learningOutcomes: [
      'NCERT LO SCI-10.4: Formulate mirror and lens formulae and calculate image magnification.',
      'NCERT LO SCI-10.5: Draw ray diagrams for concave and convex mirrors across 6 object positions.',
      'Demonstrate real-world application of total internal reflection in optical fibres and periscopes.',
    ],
    bloomLevels: ['understanding', 'applying', 'analyzing', 'creating'],
    pedagogyStrategies: ['experiential', 'art_integrated', 'inquiry_discussion'],
    skillsTargeted: ['critical_thinking', 'collaboration', 'digital_literacy'],
    teachingAidsTLM: [
      'Concave & convex mirrors and optical benches',
      'DIKSHA Ray Optics 3D Simulation app',
      'Laser pointer with smoky water tank for beam refraction',
    ],
    experientialActivity:
      'Students conduct hands-on optical bench focal length verification in physics lab, plotting 1/v vs 1/u graphs on millimeter graph sheets.',
    artSportsIntegrationDetails:
      'Art Integration: Students create illuminated 3D caleidoscopes and miniature shadow puppetry boxes to visualize focal planes.',
    inclusiveAdaptationsCWSN:
      'Tactile high-contrast raised ray-diagram templates and magnified digital display feeds provided for visually impaired students.',
    formativeAssessmentMethod: 'exit_ticket',
    status: 'approved',
    submittedDate: '2026-11-18',
    reviewerName: 'Smt. Vandana Nair (Academic Vice-Principal)',
    reviewDate: '2026-11-19',
    reviewerRemarks:
      'Exemplary pedagogical design. Experiential optical bench activity directly aligns with CBSE Class 10 practical board competencies.',
  },
  {
    id: 'lp-002',
    code: 'LP-2026-MAT-102',
    teacherId: 'EMP-T02',
    teacherName: 'Smt. Ananya Sen',
    subject: 'Mathematics',
    grade: 'Class 10',
    section: 'B',
    chapterName: 'Some Applications of Trigonometry (Heights & Distances)',
    unitTheme: 'Trigonometry & Surveying',
    targetPeriods: 5,
    startDate: '2026-11-24',
    endDate: '2026-11-29',
    learningOutcomes: [
      'NCERT LO MAT-10.8: Calculate height of tall trees, building roofs, and flagpoles using angle of elevation and depression.',
      'Construct a homemade clinometer using a 180° protractor, plumb line, and sighting straw.',
    ],
    bloomLevels: ['applying', 'analyzing', 'evaluating'],
    pedagogyStrategies: ['experiential', 'sports_integrated', 'cross_curricular'],
    skillsTargeted: ['critical_thinking', 'collaboration'],
    teachingAidsTLM: [
      'Protractor clinometers crafted by students',
      '30-meter fiberglass surveyor tape',
      'Smartboard GeoGebra dynamic geometry model',
    ],
    experientialActivity:
      'Outdoor Campus Survey: Students work in pairs with clinometers to measure the heights of the campus school building and basketball hoop.',
    artSportsIntegrationDetails:
      'Sports Integration: Football goalpost angle-of-approach calculation and trajectory flight modeling during physical education periods.',
    inclusiveAdaptationsCWSN:
      'Digital altitude inclinometer mobile app with audio speech readout for orthopedically and visually challenged students.',
    formativeAssessmentMethod: 'concept_map',
    status: 'submitted',
    submittedDate: '2026-11-23',
  },
  {
    id: 'lp-003',
    code: 'LP-2026-SST-081',
    teacherId: 'EMP-T06',
    teacherName: 'Shri Vikram Malhotra',
    subject: 'Social Science',
    grade: 'Class 8',
    section: 'C',
    chapterName: 'The Indian Constitution & Secularism',
    unitTheme: 'Democratic Politics & Civic Life',
    targetPeriods: 4,
    startDate: '2026-12-01',
    endDate: '2026-12-06',
    learningOutcomes: [
      'NCERT LO SST-8.3: Analyze the 6 Fundamental Rights enshrined in Part III of the Constitution of India.',
      'Explain the constitutional vision of Dr. B.R. Ambedkar and the Constituent Assembly debates.',
    ],
    bloomLevels: ['understanding', 'analyzing', 'evaluating'],
    pedagogyStrategies: ['art_integrated', 'inquiry_discussion', 'cross_curricular'],
    skillsTargeted: ['critical_thinking', 'communication', 'collaboration'],
    teachingAidsTLM: [
      'Facsimile print of the Preamble to the Constitution of India',
      'Samvidhan documentary clips (Rajya Sabha TV)',
      'Pocket Constitution booklets',
    ],
    experientialActivity:
      'Mock Constituent Assembly Debate: Students role-play drafting committee members arguing Article 21 Right to Life and Education.',
    artSportsIntegrationDetails:
      'Art Integration: Calligraphy poster designing of the Preamble with Nandalal Bose style traditional borders and motifs.',
    inclusiveAdaptationsCWSN:
      'Bilingual Hindi/English illustrated flashcards and peer-buddy transcription support during mock parliamentary debate.',
    formativeAssessmentMethod: 'rubric_presentation',
    status: 'draft',
  },
  {
    id: 'lp-004',
    code: 'LP-2026-ENG-092',
    teacherId: 'EMP-T04',
    teacherName: 'Ms. Sunita Rao',
    subject: 'English Language & Literature',
    grade: 'Class 9',
    section: 'A',
    chapterName: 'The Road Not Taken by Robert Frost',
    unitTheme: 'Poetry & Decision Making in Life',
    targetPeriods: 3,
    startDate: '2026-11-15',
    endDate: '2026-11-19',
    learningOutcomes: [
      'Analyze poetic devices: metaphor, symbolism, rhyme scheme (ABAAB), and alliteration.',
      'Articulate personal ethical choices through creative introspective writing.',
    ],
    bloomLevels: ['remembering', 'understanding'],
    pedagogyStrategies: ['inquiry_discussion'],
    skillsTargeted: ['communication'],
    teachingAidsTLM: ['NCERT Beehive textbook', 'Audio recording of Robert Frost reading the poem'],
    experientialActivity: '',
    artSportsIntegrationDetails: '',
    inclusiveAdaptationsCWSN: '',
    formativeAssessmentMethod: 'oral_questioning',
    status: 'revision_requested',
    submittedDate: '2026-11-12',
    reviewerName: 'Dr. Rajesh Sharma (HOD Academics)',
    reviewDate: '2026-11-14',
    reviewerRemarks:
      'Please revise to incorporate NEP 2020 mandate: Add an Art Integration activity (e.g. dramatic recitation or visual sketch of diverging roads) and specify CWSN adaptations.',
  },
];
