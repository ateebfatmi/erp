/**
 * VidyaOS - NEP 2020 10 Bagless Days & Vocational Skill Hub
 * Compliant with NEP 2020 Para 4.26, NCF-SE Middle Stage, and CBSE Circular Acad-66/2020
 */

export type VocationalCategory =
  | 'pottery_clay'
  | 'carpentry_wood'
  | 'organic_farming'
  | 'electronics_circuit'
  | 'local_textiles'
  | 'culinary_nutrition'
  | 'coding_robotics'
  | 'heritage_monument';

export interface BaglessDaySession {
  id: string;
  sessionNumber: number; // 1 to 10
  grade: string; // 'Class 6' | 'Class 7' | 'Class 8'
  section: string;
  scheduledDate: string;
  vocationalCategory: VocationalCategory;
  craftTitle: string;
  masterArtisanTrainer: string;
  venueType: 'campus_workshop' | 'artisan_studio' | 'local_field_site';
  venueAddress: string;
  safetyGearChecklist: string[];
  enrolledCount: number;
  attendedCount: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  reflectionSubmissionCount: number;
  teacherSupervisor: string;
}

export interface SkillObservationRubric {
  manualDexterity: number; // 1 - 5
  toolSafety: number; // 1 - 5
  creativityAndDesign: number; // 1 - 5
  collaboration: number; // 1 - 5
}

export interface StudentSkillLog {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  sessionId: string;
  sessionTitle: string;
  craftCreated: string;
  safetyGearAdhered: boolean;
  selfReflectionRating: number; // 1 - 5
  studentReflectionText: string;
  skillObservationRubric: SkillObservationRubric;
  totalRubricScore: number; // out of 20
  performanceGrade: 'A+' | 'A' | 'B' | 'C';
  certificateGenerated: boolean;
  certificateCode?: string;
}

export interface GradeProgress {
  grade: string;
  completedDays: number;
  totalTargetDays: number; // Statutory 10 days
  hoursLogged: number; // 6 hours per day
  compliancePercentage: number;
  status: 'on_track' | 'needs_attention' | 'mandate_achieved';
}

export function formatVocationalCategory(cat: VocationalCategory): string {
  switch (cat) {
    case 'pottery_clay':
      return 'Terracotta & Clay Modeling';
    case 'carpentry_wood':
      return 'Woodcraft & Carpentry Joinery';
    case 'organic_farming':
      return 'Organic Gardening & Composting';
    case 'electronics_circuit':
      return 'Basic Electronics & Soldering';
    case 'local_textiles':
      return 'Traditional Weaving & Block Printing';
    case 'culinary_nutrition':
      return 'Culinary Arts & Millet Nutrition';
    case 'coding_robotics':
      return 'Robotics & Micro:bit Prototyping';
    case 'heritage_monument':
      return 'Monument Survey & Heritage Sketching';
  }
}

/**
 * Calculates student rubric composite score and assign performance grade band
 */
export function calculateStudentVocationalRubric(rubric: SkillObservationRubric): {
  totalRubricScore: number;
  performanceGrade: 'A+' | 'A' | 'B' | 'C';
} {
  const total =
    Math.min(5, Math.max(1, rubric.manualDexterity)) +
    Math.min(5, Math.max(1, rubric.toolSafety)) +
    Math.min(5, Math.max(1, rubric.creativityAndDesign)) +
    Math.min(5, Math.max(1, rubric.collaboration));

  let grade: 'A+' | 'A' | 'B' | 'C' = 'C';
  if (total >= 18) grade = 'A+';
  else if (total >= 15) grade = 'A';
  else if (total >= 11) grade = 'B';
  else grade = 'C';

  return { totalRubricScore: total, performanceGrade: grade };
}

/**
 * Calculates grade-level statutory 10-day compliance per CBSE rules
 */
export function calculateGradeProgress(
  sessions: BaglessDaySession[],
  grade: string
): GradeProgress {
  const completed = sessions.filter(
    (s) => s.grade === grade && s.status === 'completed'
  ).length;
  const target = 10;
  const hours = completed * 6; // 6 hours per statutory bagless day
  const pct = Math.round((completed / target) * 100);

  let status: GradeProgress['status'] = 'needs_attention';
  if (completed >= 10) {
    status = 'mandate_achieved';
  } else if (completed >= 6) {
    status = 'on_track';
  }

  return {
    grade,
    completedDays: completed,
    totalTargetDays: target,
    hoursLogged: hours,
    compliancePercentage: pct,
    status,
  };
}

/**
 * Generates unique statutory certificate code
 */
export function generateVocationalCertificateCode(studentId: string, sessionNumber: number): string {
  const cleanId = studentId.replace(/[^A-Za-z0-9]/g, '');
  return `VOS-NEP-BAG-2026-D${sessionNumber}-${cleanId}`;
}

export const INITIAL_BAGLESS_SESSIONS: BaglessDaySession[] = [
  {
    id: 'bag-001',
    sessionNumber: 1,
    grade: 'Class 6',
    section: 'A',
    scheduledDate: '2026-08-12',
    vocationalCategory: 'pottery_clay',
    craftTitle: 'Terracotta Pottery & Hand-Building Wheel Basics',
    masterArtisanTrainer: 'Shri Ram Prasad Prajapati (State Master Potter)',
    venueType: 'campus_workshop',
    venueAddress: 'School Central Amphitheatre & Pottery Shed',
    safetyGearChecklist: [
      'Cotton work apron',
      'Protective canvas sleeves',
      'Non-slip rubber wash basin',
      'First-aid antiseptic rinse kit',
    ],
    enrolledCount: 38,
    attendedCount: 38,
    status: 'completed',
    reflectionSubmissionCount: 38,
    teacherSupervisor: 'Smt. Kavita Sharma (Middle School Art Lead)',
  },
  {
    id: 'bag-002',
    sessionNumber: 2,
    grade: 'Class 6',
    section: 'A',
    scheduledDate: '2026-09-18',
    vocationalCategory: 'organic_farming',
    craftTitle: 'Seed Ball Making, Vermicomposting & Native Soil Prep',
    masterArtisanTrainer: 'Dr. Rameshwar Dayal (ICAR Krishi Vigyan Kendra)',
    venueType: 'campus_workshop',
    venueAddress: 'School Botanical Garden & Eco-Club Nursery',
    safetyGearChecklist: [
      'Gardening nitrile gloves',
      'Sun hats',
      'Disinfected trowels',
      'Handwash sanitization station',
    ],
    enrolledCount: 38,
    attendedCount: 37,
    status: 'completed',
    reflectionSubmissionCount: 37,
    teacherSupervisor: 'Shri Akhilesh Yadav (Biology Teacher)',
  },
  {
    id: 'bag-003',
    sessionNumber: 3,
    grade: 'Class 6',
    section: 'A',
    scheduledDate: '2026-10-21',
    vocationalCategory: 'local_textiles',
    craftTitle: 'Traditional Wooden Block Printing with Natural Vegetable Dyes',
    masterArtisanTrainer: 'Ustad Mohammed Irfan (National Award Weaver)',
    venueType: 'campus_workshop',
    venueAddress: 'Activity Hall 2',
    safetyGearChecklist: [
      'Waterproof aprons',
      'Natural turmeric & indigo dye vats',
      'Cotton swatch test boards',
    ],
    enrolledCount: 38,
    attendedCount: 38,
    status: 'completed',
    reflectionSubmissionCount: 38,
    teacherSupervisor: 'Ms. Sunita Rao (Craft In-Charge)',
  },
  {
    id: 'bag-004',
    sessionNumber: 4,
    grade: 'Class 6',
    section: 'A',
    scheduledDate: '2026-11-14',
    vocationalCategory: 'carpentry_wood',
    craftTitle: 'Eco-Friendly Birdhouse Construction & Wood Joinery',
    masterArtisanTrainer: 'Master Carpenter Shri Balram Vishwakarma',
    venueType: 'campus_workshop',
    venueAddress: 'Vocational Design Studio B',
    safetyGearChecklist: [
      'ANSI certified safety goggles',
      'Cut-resistant gloves',
      'Sanding dust masks',
      'Safe hand rasps & clamp vices',
    ],
    enrolledCount: 38,
    attendedCount: 38,
    status: 'completed',
    reflectionSubmissionCount: 36,
    teacherSupervisor: 'Shri Devender Negi',
  },
  {
    id: 'bag-005',
    sessionNumber: 5,
    grade: 'Class 6',
    section: 'A',
    scheduledDate: '2026-12-04',
    vocationalCategory: 'coding_robotics',
    craftTitle: 'BBC Micro:bit Interactive Badge & Motion Sensor Programming',
    masterArtisanTrainer: 'Er. Tanmay Rastogi (STEM Innovation Lab)',
    venueType: 'campus_workshop',
    venueAddress: 'Atal Tinkering Lab (ATL)',
    safetyGearChecklist: [
      'Static-safe wristbands',
      'Low-voltage battery packs (3V)',
      'Alligator clip patch leads',
    ],
    enrolledCount: 38,
    attendedCount: 0,
    status: 'scheduled',
    reflectionSubmissionCount: 0,
    teacherSupervisor: 'Dr. Meenakshi Joshi',
  },
  {
    id: 'bag-006',
    sessionNumber: 1,
    grade: 'Class 7',
    section: 'B',
    scheduledDate: '2026-08-20',
    vocationalCategory: 'electronics_circuit',
    craftTitle: 'Solar Torch Assembly & Breadboard Circuit Architecture',
    masterArtisanTrainer: 'Er. Pradeep Verma (Solar Energy Trainer)',
    venueType: 'campus_workshop',
    venueAddress: 'Physics Lab Annex',
    safetyGearChecklist: [
      'Thermal solder stands',
      'Eye protection glasses',
      'Fume exhaust mini-fans',
    ],
    enrolledCount: 36,
    attendedCount: 36,
    status: 'completed',
    reflectionSubmissionCount: 36,
    teacherSupervisor: 'Dr. Rajesh Sharma',
  },
  {
    id: 'bag-007',
    sessionNumber: 2,
    grade: 'Class 7',
    section: 'B',
    scheduledDate: '2026-09-25',
    vocationalCategory: 'culinary_nutrition',
    craftTitle: 'Traditional Millet Baking, Microgreen Sprouting & Kitchen Hygiene',
    masterArtisanTrainer: 'Chef Meera Nambiar (Culinary Heritage Guild)',
    venueType: 'campus_workshop',
    venueAddress: 'Home Science Demonstration Kitchen',
    safetyGearChecklist: [
      'Chef hats & clean cotton aprons',
      'Heat-resistant oven mitts',
      'Hand sanitizers & clean hairnets',
    ],
    enrolledCount: 36,
    attendedCount: 36,
    status: 'completed',
    reflectionSubmissionCount: 36,
    teacherSupervisor: 'Smt. Ananya Sen',
  },
  {
    id: 'bag-008',
    sessionNumber: 1,
    grade: 'Class 8',
    section: 'C',
    scheduledDate: '2026-09-10',
    vocationalCategory: 'heritage_monument',
    craftTitle: 'Heritage Architecture Survey & Architectural Pencil Sketching',
    masterArtisanTrainer: 'Ar. Subhash Bose (INTACH Heritage Conservation)',
    venueType: 'local_field_site',
    venueAddress: 'Qutub Minar Archaeological Complex, Mehrauli',
    safetyGearChecklist: [
      'Parental travel NOC verified',
      'First-aid pouch with escort',
      'Architectural clipboards & water flasks',
    ],
    enrolledCount: 35,
    attendedCount: 35,
    status: 'completed',
    reflectionSubmissionCount: 35,
    teacherSupervisor: 'Shri Vikram Malhotra',
  },
];

export const INITIAL_STUDENT_SKILL_LOGS: StudentSkillLog[] = [
  {
    id: 'log-001',
    studentId: 'STU-0601',
    studentName: 'Aarav Malhotra',
    grade: 'Class 6',
    section: 'A',
    sessionId: 'bag-001',
    sessionTitle: 'Terracotta Pottery & Hand-Building Wheel Basics',
    craftCreated: 'Traditional Floral Terracotta Diya with Decorative Fluted Rim',
    safetyGearAdhered: true,
    selfReflectionRating: 5,
    studentReflectionText:
      'Learning to center the wet clay on the potter wheel taught me that balance requires calm hands. I loved smoothing the clay using natural river sponge.',
    skillObservationRubric: {
      manualDexterity: 5,
      toolSafety: 5,
      creativityAndDesign: 4,
      collaboration: 5,
    },
    totalRubricScore: 19,
    performanceGrade: 'A+',
    certificateGenerated: true,
    certificateCode: 'VOS-NEP-BAG-2026-D1-STU0601',
  },
  {
    id: 'log-002',
    studentId: 'STU-0604',
    studentName: 'Ananya Deshmukh',
    grade: 'Class 6',
    section: 'A',
    sessionId: 'bag-004',
    sessionTitle: 'Eco-Friendly Birdhouse Construction & Wood Joinery',
    craftCreated: 'Cedar Wood Nesting Bird Box with Perch and Sloped Rain Roof',
    safetyGearAdhered: true,
    selfReflectionRating: 4,
    studentReflectionText:
      'Using the wooden rasp and sandpaper made the wood completely smooth. I made sure to wear my safety goggles whenever cutting or sanding.',
    skillObservationRubric: {
      manualDexterity: 4,
      toolSafety: 5,
      creativityAndDesign: 4,
      collaboration: 4,
    },
    totalRubricScore: 17,
    performanceGrade: 'A',
    certificateGenerated: true,
    certificateCode: 'VOS-NEP-BAG-2026-D4-STU0604',
  },
  {
    id: 'log-003',
    studentId: 'STU-0708',
    studentName: 'Manan Kapoor',
    grade: 'Class 7',
    section: 'B',
    sessionId: 'bag-006',
    sessionTitle: 'Solar Torch Assembly & Breadboard Circuit Architecture',
    craftCreated: 'Rechargeable 3V Mini LED Solar Lantern with Light Sensor Switch',
    safetyGearAdhered: true,
    selfReflectionRating: 5,
    studentReflectionText:
      'Connecting the photovoltaic solar panel to the miniature breadboard switch helped me understand how green energy powers lights without fossil fuels.',
    skillObservationRubric: {
      manualDexterity: 5,
      toolSafety: 5,
      creativityAndDesign: 5,
      collaboration: 4,
    },
    totalRubricScore: 19,
    performanceGrade: 'A+',
    certificateGenerated: true,
    certificateCode: 'VOS-NEP-BAG-2026-D1-STU0708',
  },
];
