/**
 * VidyaOS - NITI Aayog Atal Innovation Mission (AIM) & CBSE Atal Tinkering Lab (ATL) Engine
 * Complies with NITI Aayog ATL Operational Guidelines, Monthly PFR (Periodic Feedback Report) Mandates,
 * and CBSE STEM & Tinkering Curriculum Framework (Grades 6–12).
 */

export type AtlPackageCategory =
  | 'P1_ELECTRONICS_DEVELOPMENT'
  | 'P2_RAPID_PROTOTYPING_3D_PRINTING'
  | 'P3_MECHANICAL_POWER_TOOLS'
  | 'P4_SENSORS_IOT_ACTUATORS';

export interface AtlEquipmentItem {
  id: string;
  name: string;
  packageCategory: AtlPackageCategory;
  quantityTotal: number;
  quantityFunctional: number;
  specifications: string;
  safetyInstruction: string;
  status: 'IN_STOCK' | 'DEPLETED' | 'MAINTENANCE_REQUIRED';
}

export type PrototypeStage =
  | 'IDEATION_AND_DESIGN'
  | 'BREADBOARD_PROOF_OF_CONCEPT'
  | 'FUNCTIONAL_PROTOTYPE'
  | 'FIELD_TESTED'
  | 'EXHIBITION_READY';

export type InnovationTheme =
  | 'AGRITECH_AND_FARMING'
  | 'CLEAN_ENERGY_AND_ENVIRONMENT'
  | 'ASSISTIVE_TECH_HEALTHCARE'
  | 'SMART_MOBILITY_AND_SAFETY'
  | 'EDTECH_AND_ROBOTICS';

export interface AtlProject {
  id: string;
  title: string;
  theme: InnovationTheme;
  leadStudentId: string;
  leadStudentName: string;
  grade: string;
  teamMembers: string[];
  facultyMentorName: string;
  industryMentorName?: string;
  synopsis: string;
  componentsUsed: string[];
  stage: PrototypeStage;
  submittedForAtlMarathon: boolean;
  patentOrIpPotential: boolean;
  lastUpdatedDate: string;
  mentorFeedback?: string;
}

export interface MentorOfChangeSession {
  id: string;
  sessionDate: string;
  mentorName: string;
  mentorOrganization: string; // e.g. "ISRO / IIT Delhi / Intel"
  topicCovered: string;
  participatingStudentCount: number;
  durationMinutes: number;
  keyInsights: string;
  studentProjectsReviewed: string[];
}

export interface AtlHealthReport {
  overallLabHealthScore: number; // 0 to 100
  healthTier: 'PLATINUM_INNOVATION_HUB' | 'GOLD_COMPLIANT' | 'SILVER_NEEDS_ACCELERATION';
  totalActiveProjects: number;
  exhibitionReadyProjectsCount: number;
  marathonSubmissionsCount: number;
  monthlyStudentEngagementCount: number;
  monthlyTinkeringHoursDelivered: number;
  aimBenchmarkMonthlyHoursMet: boolean; // Benchmark: >= 60 hours
  aimBenchmarkStudentReachMet: boolean; // Benchmark: >= 250 students
  equipmentFunctionalRatio: number; // percentage
  complianceAlerts: string[];
}

/**
 * Evaluates NITI Aayog ATL Lab operational health and monthly PFR performance.
 */
export function evaluateAtlLabHealth(
  inventory: AtlEquipmentItem[],
  projects: AtlProject[],
  sessions: MentorOfChangeSession[],
  monthlyStudentEngagement: number = 280,
  monthlyHoursDelivered: number = 72
): AtlHealthReport {
  const alerts: string[] = [];

  // Check 1: NITI Aayog AIM Monthly hours benchmark (>= 60 hrs)
  const aimBenchmarkMonthlyHoursMet = monthlyHoursDelivered >= 60;
  if (!aimBenchmarkMonthlyHoursMet) {
    alerts.push('Monthly lab tinkering hours below NITI Aayog 60-hour benchmark.');
  }

  // Check 2: Monthly student engagement reach (>= 250 students)
  const aimBenchmarkStudentReachMet = monthlyStudentEngagement >= 250;
  if (!aimBenchmarkStudentReachMet) {
    alerts.push('Monthly student lab engagement reach below NITI Aayog 250-student threshold.');
  }

  // Check 3: Functional equipment ratio
  const totalItems = inventory.reduce((acc, i) => acc + i.quantityTotal, 0);
  const functionalItems = inventory.reduce((acc, i) => acc + i.quantityFunctional, 0);
  const equipmentFunctionalRatio =
    totalItems > 0 ? Math.round((functionalItems / totalItems) * 100) : 0;
  if (equipmentFunctionalRatio < 85) {
    alerts.push(`Equipment functionality (${equipmentFunctionalRatio}%) is below 85% operational standard.`);
  }

  // Check 4: Package diversity (All 4 AIM packages must have functional equipment)
  const activePackages = new Set(
    inventory.filter((i) => i.quantityFunctional > 0).map((i) => i.packageCategory)
  );
  if (activePackages.size < 4) {
    alerts.push('Lab lacks functional equipment in one or more of the 4 mandatory AIM packages.');
  }

  // Count project milestones
  const exhibitionReady = projects.filter(
    (p) => p.stage === 'FIELD_TESTED' || p.stage === 'EXHIBITION_READY'
  ).length;
  const marathonSubmissions = projects.filter((p) => p.submittedForAtlMarathon).length;

  // Composite Score calculation (0 to 100)
  let score = 40; // baseline for operational lab
  if (aimBenchmarkMonthlyHoursMet) score += 15;
  if (aimBenchmarkStudentReachMet) score += 15;
  if (equipmentFunctionalRatio >= 85) score += 10;
  if (activePackages.size === 4) score += 10;
  if (marathonSubmissions >= 2) score += 10;

  score = Math.min(100, score);

  let healthTier: 'PLATINUM_INNOVATION_HUB' | 'GOLD_COMPLIANT' | 'SILVER_NEEDS_ACCELERATION' =
    'SILVER_NEEDS_ACCELERATION';
  if (score >= 85) {
    healthTier = 'PLATINUM_INNOVATION_HUB';
  } else if (score >= 65) {
    healthTier = 'GOLD_COMPLIANT';
  }

  return {
    overallLabHealthScore: score,
    healthTier,
    totalActiveProjects: projects.length,
    exhibitionReadyProjectsCount: exhibitionReady,
    marathonSubmissionsCount: marathonSubmissions,
    monthlyStudentEngagementCount: monthlyStudentEngagement,
    monthlyTinkeringHoursDelivered: monthlyHoursDelivered,
    aimBenchmarkMonthlyHoursMet,
    aimBenchmarkStudentReachMet,
    equipmentFunctionalRatio,
    complianceAlerts: alerts,
  };
}

/**
 * Updates project prototype stage and appends mentor guidance.
 */
export function updateProjectStage(
  projects: AtlProject[],
  projectId: string,
  newStage: PrototypeStage,
  mentorFeedback?: string
): AtlProject[] {
  return projects.map((p) => {
    if (p.id === projectId) {
      return {
        ...p,
        stage: newStage,
        mentorFeedback: mentorFeedback !== undefined ? mentorFeedback : p.mentorFeedback,
        lastUpdatedDate: new Date().toISOString().split('T')[0],
      };
    }
    return p;
  });
}

export const INITIAL_ATL_INVENTORY: AtlEquipmentItem[] = [
  {
    id: 'ATL-EQ-01',
    name: 'Arduino UNO R3 & Mega 2560 Microcontroller Kits',
    packageCategory: 'P1_ELECTRONICS_DEVELOPMENT',
    quantityTotal: 25,
    quantityFunctional: 24,
    specifications: 'ATmega328P, 14 Digital I/O Pins, 6 Analog Inputs, USB Interface',
    safetyInstruction: 'Ensure 5V DC regulated power; avoid shorting VCC to GND on breadboards.',
    status: 'IN_STOCK',
  },
  {
    id: 'ATL-EQ-02',
    name: 'Flashforge Guider IIs Commercial FDM 3D Printer',
    packageCategory: 'P2_RAPID_PROTOTYPING_3D_PRINTING',
    quantityTotal: 2,
    quantityFunctional: 2,
    specifications: 'Build Volume 280 x 250 x 300 mm, Extruder 300°C, HEPA Air Filtration',
    safetyInstruction: 'Hot nozzle hazard (up to 240°C); operate only under faculty supervision.',
    status: 'IN_STOCK',
  },
  {
    id: 'ATL-EQ-03',
    name: 'Digital Temperature-Controlled Soldering Stations (60W)',
    packageCategory: 'P3_MECHANICAL_POWER_TOOLS',
    quantityTotal: 12,
    quantityFunctional: 11,
    specifications: 'ESD Safe, Adjustable 200°C-480°C, Ceramic Heating Core, Sponge Stand',
    safetyInstruction: 'Always wear safety goggles and work under fume extractor hoods.',
    status: 'IN_STOCK',
  },
  {
    id: 'ATL-EQ-04',
    name: 'Ultrasonic Distance (HC-SR04) & PIR Motion Sensor Array',
    packageCategory: 'P4_SENSORS_IOT_ACTUATORS',
    quantityTotal: 40,
    quantityFunctional: 38,
    specifications: 'Operating Voltage 5V, Detection Angle 15°, Range 2cm - 400cm',
    safetyInstruction: 'Handle sensitive ceramic transducer faces with care.',
    status: 'IN_STOCK',
  },
  {
    id: 'ATL-EQ-05',
    name: 'ESP32 Dual-Core Wi-Fi & Bluetooth IoT SoC Modules',
    packageCategory: 'P1_ELECTRONICS_DEVELOPMENT',
    quantityTotal: 20,
    quantityFunctional: 19,
    specifications: '240 MHz Tensilica LX6, Integrated Antenna, Deep Sleep 5uA',
    safetyInstruction: '3.3V Logic Level only; 5V inputs will damage GPIO pins.',
    status: 'IN_STOCK',
  },
];

export const INITIAL_ATL_PROJECTS: AtlProject[] = [
  {
    id: 'PROJ-ATL-01',
    title: 'Smart Soil Moisture Sensor & Automated Drip Irrigation Node',
    theme: 'AGRITECH_AND_FARMING',
    leadStudentId: 'STU-10B-014',
    leadStudentName: 'Vihaan Agarwal',
    grade: 'Class 10-B',
    teamMembers: ['Vihaan Agarwal', 'Ishaan Malhotra', 'Diya Sen'],
    facultyMentorName: 'Mr. Arvind Saxena (ATL In-Charge)',
    industryMentorName: 'Dr. Alok Verma (Scientist, ICAR)',
    synopsis: 'Solar-powered capacitive moisture sensor that triggers solenoid water valves via ESP32 telemetry, conserving 42% water compared to manual irrigation.',
    componentsUsed: ['ESP32', 'Capacitive Moisture Sensor', '12V Solenoid Valve', '10W Solar Panel'],
    stage: 'FIELD_TESTED',
    submittedForAtlMarathon: true,
    patentOrIpPotential: true,
    lastUpdatedDate: '2026-11-15',
    mentorFeedback: 'Field trials in school herb garden show exceptional calibration accuracy. Prepared for National Science Exhibition.',
  },
  {
    id: 'PROJ-ATL-02',
    title: 'AI Smart Assistive Blind Walking Stick with Haptic Vibrators',
    theme: 'ASSISTIVE_TECH_HEALTHCARE',
    leadStudentId: 'STU-09A-033',
    leadStudentName: 'Meera Nambiar',
    grade: 'Class 9-A',
    teamMembers: ['Meera Nambiar', 'Rohan Pillai'],
    facultyMentorName: 'Mr. Arvind Saxena (ATL In-Charge)',
    industryMentorName: 'Ms. Shalini Iyer (Embedded Engineer, Intel)',
    synopsis: 'Lightweight ergonomic walking stick integrating ultrasonic obstacle sensors and water puddle detection probes with haptic pulse feedback.',
    componentsUsed: ['Arduino Nano', 'HC-SR04 Ultrasonic', 'Water Puddle Sensor', 'Coin Vibration Motors'],
    stage: 'FUNCTIONAL_PROTOTYPE',
    submittedForAtlMarathon: true,
    patentOrIpPotential: false,
    lastUpdatedDate: '2026-11-20',
    mentorFeedback: 'Obstacle detection up to 1.5m works reliably. Team is currently 3D printing a water-resistant handle enclosure.',
  },
  {
    id: 'PROJ-ATL-03',
    title: 'Classroom IoT Air Quality Index (AQI) Monitor & Auto-Exhaust',
    theme: 'CLEAN_ENERGY_AND_ENVIRONMENT',
    leadStudentId: 'STU-11A-042',
    leadStudentName: 'Aarav Sharma',
    grade: 'Class 11-A',
    teamMembers: ['Aarav Sharma', 'Tanmay Joshi'],
    facultyMentorName: 'Mr. Arvind Saxena (ATL In-Charge)',
    synopsis: 'Monitors PM2.5, PM10, and CO2 in science laboratories and triggers auxiliary ventilation fans when thresholds exceed WHO standards.',
    componentsUsed: ['PMS5003 Laser Dust Sensor', 'MQ-135 Gas Sensor', 'Arduino UNO', 'OLED Display'],
    stage: 'BREADBOARD_PROOF_OF_CONCEPT',
    submittedForAtlMarathon: false,
    patentOrIpPotential: false,
    lastUpdatedDate: '2026-11-18',
    mentorFeedback: 'Breadboard circuit calibrated against reference ambient monitor. Proceeding to PCB design.',
  },
];

export const INITIAL_MOC_SESSIONS: MentorOfChangeSession[] = [
  {
    id: 'MOC-01',
    sessionDate: '2026-11-08',
    mentorName: 'Ms. Shalini Iyer',
    mentorOrganization: 'Senior Embedded Firmware Architect, Intel India',
    topicCovered: 'Rapid Prototyping with MicroPython and Low-Power IoT Sensors',
    participatingStudentCount: 42,
    durationMinutes: 90,
    keyInsights: 'Demonstrated deep sleep state optimization for battery-operated field sensors. Guided 3 student teams on decoupling capacitors.',
    studentProjectsReviewed: ['PROJ-ATL-01', 'PROJ-ATL-02'],
  },
  {
    id: 'MOC-02',
    sessionDate: '2026-10-25',
    mentorName: 'Mr. Prateek Bansal',
    mentorOrganization: 'Founder, Robotics & AI Edutech Labs',
    topicCovered: 'CAD 3D Modeling (Autodesk Fusion 360) for Mechanical Grippers',
    participatingStudentCount: 38,
    durationMinutes: 120,
    keyInsights: 'Hands-on CAD session teaching parametric sketches, tolerance allowances for 3D printed snap-fits, and filament shrinkage compensation.',
    studentProjectsReviewed: ['PROJ-ATL-02'],
  },
];
