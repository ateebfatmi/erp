/**
 * VidyaOS - CBSE Inclusive Education & Multi-Disciplinary Resource Room Hub
 * Complies with CBSE Affiliation By-Laws Appendix IX, RPwD Act 2016 (Section 16),
 * and Rehabilitation Council of India (RCI) Staffing Mandates.
 */

export type SpecialistRole =
  | 'SPECIAL_EDUCATOR_RCI'
  | 'SPEECH_AND_LANGUAGE_PATHOLOGIST'
  | 'OCCUPATIONAL_THERAPIST'
  | 'CLINICAL_PSYCHOLOGIST'
  | 'REMEDIAL_ACADEMIC_TUTOR';

export interface AlliedSpecialist {
  id: string;
  name: string;
  role: SpecialistRole;
  rciRegistrationNo?: string; // RCI Central Rehabilitation Register Number
  qualification: string;
  contactEmail: string;
  availableDays: string[];
  maxDailyCaseload: number;
  currentCaseload: number;
  isFullTime: boolean;
}

export type EquipmentCategory =
  | 'SENSORY_REGULATION'
  | 'VISUAL_ASSISTIVE'
  | 'HEARING_ASSISTIVE'
  | 'MOTOR_AND_ERGONOMIC'
  | 'COGNITIVE_SOFTWARE';

export interface SensoryEquipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  serialNumber: string;
  storageLocation: string; // e.g. "Sensory Pod Alpha", "Assistive Tech Bay"
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE_REQUIRED' | 'UNDER_SANITIZATION';
  assignedStudentId?: string;
  assignedStudentName?: string;
  lastSanitizedAt: string;
  targetAccommodations: string[];
}

export type TherapyType =
  | 'SPEECH_ARTICULATION'
  | 'SENSORY_INTEGRATION'
  | 'FINE_MOTOR_AND_HANDWRITING'
  | 'REMEDIAL_DYSLEXIA_PHONICS'
  | 'DYSCALCULIA_MULTISENSORY_MATH'
  | 'BEHAVIORAL_AND_EMOTIONAL_REGULATION'
  | 'SOCIAL_COMMUNICATION_GROUP';

export type StudentArousalState =
  | 'HYPO_AROUSED_LETHARGIC'
  | 'OPTIMAL_ENGAGED'
  | 'HYPER_AROUSED_RESTLESS'
  | 'SENSORY_OVERWHELMED';

export interface TherapySessionLog {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  specialistId: string;
  specialistName: string;
  specialistRole: SpecialistRole;
  therapyType: TherapyType;
  sessionDate: string;
  durationMinutes: number;
  arousalStateBefore: StudentArousalState;
  arousalStateAfter: StudentArousalState;
  sensoryToolsUsed: string[];
  clinicalObservations: string;
  nextStepsForClassroomTeacher: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface ResourceRoomAuditReport {
  overallComplianceScore: number; // 0 to 100
  complianceGrade: 'A_EXEMPLARY' | 'B_COMPLIANT' | 'C_DEFICIT';
  rciSpecialistStaffed: boolean;
  accessibleInfrastructureVerified: boolean;
  sensoryEquipmentAvailabilityRate: number; // percentage
  weeklyTherapyHoursDelivered: number;
  statutoryGaps: string[];
}

/**
 * Evaluates school's compliance with CBSE RPwD Resource Room mandates.
 */
export function evaluateResourceRoomCompliance(
  specialists: AlliedSpecialist[],
  equipment: SensoryEquipment[],
  recentSessions: TherapySessionLog[]
): ResourceRoomAuditReport {
  const gaps: string[] = [];

  // Check 1: Must have at least 1 RCI-registered Special Educator
  const hasRciSpecialEducator = specialists.some(
    (s) => s.role === 'SPECIAL_EDUCATOR_RCI' && Boolean(s.rciRegistrationNo)
  );
  if (!hasRciSpecialEducator) {
    gaps.push('Mandatory RCI-certified Special Educator not registered on staff.');
  }

  // Check 2: Multi-disciplinary coverage (Speech or Occupational therapy)
  const hasSpeechOrOT = specialists.some(
    (s) =>
      s.role === 'SPEECH_AND_LANGUAGE_PATHOLOGIST' ||
      s.role === 'OCCUPATIONAL_THERAPIST'
  );
  if (!hasSpeechOrOT) {
    gaps.push('Allied speech/occupational therapy support not currently provisioned.');
  }

  // Check 3: Minimum equipment coverage across sensory & motor domains
  const categoriesPresent = new Set(equipment.map((e) => e.category));
  if (categoriesPresent.size < 3) {
    gaps.push('Sensory room equipment deficit: requires at least 3 distinct assistive categories.');
  }

  const functionalEquipment = equipment.filter((e) => e.status !== 'MAINTENANCE_REQUIRED').length;
  const sensoryEquipmentAvailabilityRate =
    equipment.length > 0 ? Math.round((functionalEquipment / equipment.length) * 100) : 0;

  // Check 4: Weekly therapy hours
  const weeklyHours = Math.round(
    recentSessions
      .filter((s) => s.status === 'Completed')
      .reduce((acc, s) => acc + s.durationMinutes, 0) / 60
  );

  if (weeklyHours < 5) {
    gaps.push('Weekly pull-out therapeutic instruction below CBSE recommended 5-hour benchmark.');
  }

  // Calculate composite compliance score (0-100)
  let score = 40; // baseline for operating room
  if (hasRciSpecialEducator) score += 25;
  if (hasSpeechOrOT) score += 15;
  if (sensoryEquipmentAvailabilityRate >= 80) score += 10;
  if (weeklyHours >= 5) score += 10;

  score = Math.min(100, score);

  let complianceGrade: 'A_EXEMPLARY' | 'B_COMPLIANT' | 'C_DEFICIT' = 'C_DEFICIT';
  if (score >= 85) {
    complianceGrade = 'A_EXEMPLARY';
  } else if (score >= 65) {
    complianceGrade = 'B_COMPLIANT';
  }

  return {
    overallComplianceScore: score,
    complianceGrade,
    rciSpecialistStaffed: hasRciSpecialEducator,
    accessibleInfrastructureVerified: true,
    sensoryEquipmentAvailabilityRate,
    weeklyTherapyHoursDelivered: weeklyHours,
    statutoryGaps: gaps,
  };
}

/**
 * Checks out a sensory tool to a student or marks it returned.
 */
export function toggleEquipmentAssignment(
  equipmentList: SensoryEquipment[],
  equipmentId: string,
  studentId?: string,
  studentName?: string
): SensoryEquipment[] {
  return equipmentList.map((eq) => {
    if (eq.id === equipmentId) {
      if (eq.status === 'AVAILABLE' && studentId) {
        return {
          ...eq,
          status: 'IN_USE',
          assignedStudentId: studentId,
          assignedStudentName: studentName || 'Assigned Student',
        };
      } else {
        return {
          ...eq,
          status: 'AVAILABLE',
          assignedStudentId: undefined,
          assignedStudentName: undefined,
          lastSanitizedAt: new Date().toISOString().split('T')[0],
        };
      }
    }
    return eq;
  });
}

export const INITIAL_SPECIALISTS: AlliedSpecialist[] = [
  {
    id: 'SPEC-01',
    name: 'Mrs. Suman Lata, M.Ed (Spl Ed)',
    role: 'SPECIAL_EDUCATOR_RCI',
    rciRegistrationNo: 'RCI-CRR-A54921',
    qualification: 'M.Ed Special Education (Learning Disabilities), Lady Irwin College',
    contactEmail: 'suman.lata@vidyaos-school.edu.in',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    maxDailyCaseload: 6,
    currentCaseload: 4,
    isFullTime: true,
  },
  {
    id: 'SPEC-02',
    name: 'Dr. Rohan Mathur, MASLP',
    role: 'SPEECH_AND_LANGUAGE_PATHOLOGIST',
    rciRegistrationNo: 'RCI-CRR-B88412',
    qualification: 'Master of Audiology & Speech-Language Pathology (MASLP), AIISH Mysore',
    contactEmail: 'rohan.speech@vidyaos-school.edu.in',
    availableDays: ['Tue', 'Thu', 'Sat'],
    maxDailyCaseload: 5,
    currentCaseload: 3,
    isFullTime: false,
  },
  {
    id: 'SPEC-03',
    name: 'Ms. Priya D’Souza, BOT (Sensory Integration)',
    role: 'OCCUPATIONAL_THERAPIST',
    qualification: 'Bachelor of Occupational Therapy (BOT), Certified SI Specialist',
    contactEmail: 'priya.ot@vidyaos-school.edu.in',
    availableDays: ['Mon', 'Wed', 'Fri'],
    maxDailyCaseload: 6,
    currentCaseload: 5,
    isFullTime: true,
  },
];

export const INITIAL_EQUIPMENT: SensoryEquipment[] = [
  {
    id: 'EQ-01',
    name: 'Deep Pressure Sensory Compression Vest (Medium)',
    category: 'SENSORY_REGULATION',
    serialNumber: 'SN-SENS-771',
    storageLocation: 'Sensory Pod Alpha (Ground Floor)',
    status: 'IN_USE',
    assignedStudentId: 'CWSN-2024-002',
    assignedStudentName: 'Devansh Kulkarni',
    lastSanitizedAt: '2026-11-20',
    targetAccommodations: ['ADHD Proprioceptive Input', 'Classroom Restlessness Calming'],
  },
  {
    id: 'EQ-02',
    name: 'C-Pen Audio Reader & Text-to-Speech OCR Scanner',
    category: 'VISUAL_ASSISTIVE',
    serialNumber: 'SN-CPEN-104',
    storageLocation: 'Assistive Tech Bay Locker 2',
    status: 'AVAILABLE',
    lastSanitizedAt: '2026-11-22',
    targetAccommodations: ['Dyslexia Word Decoding', 'Independent Board Exam Reading'],
  },
  {
    id: 'EQ-03',
    name: 'Phonak Roger Touchscreen FM Hearing Transmitter & Pen',
    category: 'HEARING_ASSISTIVE',
    serialNumber: 'SN-FM-902',
    storageLocation: 'Speech Therapy Lab Bay 1',
    status: 'AVAILABLE',
    lastSanitizedAt: '2026-11-23',
    targetAccommodations: ['Auditory Processing Disorder', 'Classroom Background Noise Suppression'],
  },
  {
    id: 'EQ-04',
    name: 'Ergonomic Slanted Writing Slope Board & Silicone Pencil Grips',
    category: 'MOTOR_AND_ERGONOMIC',
    serialNumber: 'SN-WRIT-332',
    storageLocation: 'Remedial Room Desk 4',
    status: 'IN_USE',
    assignedStudentId: 'CWSN-2024-001',
    assignedStudentName: 'Aarav Sharma',
    lastSanitizedAt: '2026-11-18',
    targetAccommodations: ['Dysgraphia Hand Fatigue', 'Cerebral Palsy Fine Motor Support'],
  },
  {
    id: 'EQ-05',
    name: 'Multi-Sensory Interactive Bubble Tube & Fiber Optic Calming Pod',
    category: 'SENSORY_REGULATION',
    serialNumber: 'SN-POD-001',
    storageLocation: 'Sensory Sanctuary Room 102',
    status: 'AVAILABLE',
    lastSanitizedAt: '2026-11-24',
    targetAccommodations: ['Autism Spectrum De-escalation', 'Anxiety & Sensory Meltdown Recovery'],
  },
];

export const INITIAL_THERAPY_SESSIONS: TherapySessionLog[] = [
  {
    id: 'TH-01',
    studentId: 'CWSN-2024-002',
    studentName: 'Devansh Kulkarni',
    grade: 'Class 4-B',
    specialistId: 'SPEC-03',
    specialistName: 'Ms. Priya D’Souza',
    specialistRole: 'OCCUPATIONAL_THERAPIST',
    therapyType: 'SENSORY_INTEGRATION',
    sessionDate: '2026-11-22',
    durationMinutes: 45,
    arousalStateBefore: 'HYPER_AROUSED_RESTLESS',
    arousalStateAfter: 'OPTIMAL_ENGAGED',
    sensoryToolsUsed: ['Deep Pressure Compression Vest', 'Sensory Balance Board'],
    clinicalObservations: 'Candidate arrived restless following lunch break. 15 minutes of linear swinging and joint compression brought arousal state down to optimal baseline. Completed 20 minutes of fine motor pegboard drills.',
    nextStepsForClassroomTeacher: 'Permit 3-minute walking break before second-half math period. Keep compression vest on during independent writing.',
    status: 'Completed',
  },
  {
    id: 'TH-02',
    studentId: 'CWSN-2024-001',
    studentName: 'Aarav Sharma',
    grade: 'Class 9-A',
    specialistId: 'SPEC-01',
    specialistName: 'Mrs. Suman Lata',
    specialistRole: 'SPECIAL_EDUCATOR_RCI',
    therapyType: 'REMEDIAL_DYSLEXIA_PHONICS',
    sessionDate: '2026-11-23',
    durationMinutes: 50,
    arousalStateBefore: 'OPTIMAL_ENGAGED',
    arousalStateAfter: 'OPTIMAL_ENGAGED',
    sensoryToolsUsed: ['C-Pen Audio Reader', 'Orton-Gillingham Multisensory Flashcards'],
    clinicalObservations: 'Worked on syllable division rules for multisyllabic science vocabulary (photosynthesis, chlorophyll). Candidate decoded 18/20 words accurately with audio scanning support.',
    nextStepsForClassroomTeacher: 'Provide printed glossary of difficult chapter keywords with bold phonemic cues prior to unit tests.',
    status: 'Completed',
  },
  {
    id: 'TH-03',
    studentId: 'CWSN-2024-003',
    studentName: 'Rhea Sen',
    grade: 'Class 7-C',
    specialistId: 'SPEC-02',
    specialistName: 'Dr. Rohan Mathur',
    specialistRole: 'SPEECH_AND_LANGUAGE_PATHOLOGIST',
    therapyType: 'SPEECH_ARTICULATION',
    sessionDate: '2026-11-24',
    durationMinutes: 40,
    arousalStateBefore: 'HYPO_AROUSED_LETHARGIC',
    arousalStateAfter: 'OPTIMAL_ENGAGED',
    sensoryToolsUsed: ['Roger FM Hearing System', 'Visual Speech Mirror'],
    clinicalObservations: 'Targeted bilabial consonant blends in conversational pace. Vocal volume calibrated to 65 dB in mock classroom noise simulation.',
    nextStepsForClassroomTeacher: 'Wear the FM lapel transmitter facing the student during group presentations.',
    status: 'Completed',
  },
];
