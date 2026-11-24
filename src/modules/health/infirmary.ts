/**
 * VidyaOS Student Health & School Infirmary / OPD Clinic Engine
 * Compliant with CBSE Health & Physical Activity Card (Circular Acad-10/2019)
 */

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type BmiCategory = 'UNDERWEIGHT' | 'HEALTHY_WEIGHT' | 'OVERWEIGHT' | 'OBESE';
export type TriageLevel = 'ROUTINE' | 'MODERATE_OBSERVATION' | 'EMERGENCY_TRANSFER';

export interface StudentHealthCard {
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeSection: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  bloodGroup: BloodGroup;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: BmiCategory;
  visionLeft: string; // e.g. "6/6"
  visionRight: string; // e.g. "6/6"
  wearsGlasses: boolean;
  dentalHygiene: 'NORMAL' | 'CARIES_DETECTED' | 'ORTHODONTIC_CARE';
  chronicConditions: string[]; // e.g. ["Asthma", "Peanut Allergy"]
  regularMedications?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  lastCheckedDate: string;
}

export interface InfirmaryVisitRecord {
  visitId: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  timestamp: string; // ISO
  chiefComplaint: string; // e.g. "High grade fever & chills", "Blunt knee impact in football"
  temperatureF: number;
  pulseRateBpm: number;
  triageLevel: TriageLevel;
  firstAidGiven: string; // e.g. "Paracetamol 250mg oral, Cold sponge, 45 min bed rest"
  attendingNurse: string;
  bedAssigned?: string;
  parentNotified: boolean;
  status: 'UNDER_OBSERVATION' | 'DISCHARGED_TO_CLASS' | 'SENT_HOME_WITH_PARENT' | 'HOSPITAL_TRANSFERRED';
  dischargeNotes?: string;
}

/**
 * Calculates BMI and classifies according to Indian Pediatric (IAP) & WHO cutoffs
 */
export function calculateBmiAndCategory(weightKg: number, heightCm: number): { bmi: number; category: BmiCategory } {
  if (weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, category: 'HEALTHY_WEIGHT' };
  }

  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let category: BmiCategory = 'HEALTHY_WEIGHT';
  if (bmi < 18.5) {
    category = 'UNDERWEIGHT';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'HEALTHY_WEIGHT';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    category = 'OVERWEIGHT';
  } else {
    category = 'OBESE';
  }

  return { bmi, category };
}

/**
 * Assesses triage urgency for a school infirmary clinic visit
 */
export function evaluateInfirmaryTriage(
  complaint: string,
  temperatureF: number,
  chronicConditions: string[] = []
): { triage: TriageLevel; requiresImmediateParentCall: boolean; alertReason?: string } {
  const lowerComplaint = complaint.toLowerCase();

  const isRespiratoryEmergency =
    (lowerComplaint.includes('breathing') || lowerComplaint.includes('asthma') || lowerComplaint.includes('wheezing') || lowerComplaint.includes('shortness')) &&
    chronicConditions.some((c) => c.toLowerCase().includes('asthma'));

  // Emergency triggers: severe asthma attack, head injury, high fever > 102F, loss of consciousness
  if (
    lowerComplaint.includes('unconscious') ||
    lowerComplaint.includes('seizure') ||
    lowerComplaint.includes('fracture') ||
    isRespiratoryEmergency ||
    temperatureF >= 102.0
  ) {
    return {
      triage: 'EMERGENCY_TRANSFER',
      requiresImmediateParentCall: true,
      alertReason: `Critical symptom detected: "${complaint}" (Temp: ${temperatureF}°F). Immediate parental intimation & hospital transport standby mandatory.`,
    };
  }

  // Moderate observation: fever between 100F and 101.9F, sports sprain, vomiting
  if (
    temperatureF >= 100.0 ||
    lowerComplaint.includes('vomit') ||
    lowerComplaint.includes('sprain') ||
    lowerComplaint.includes('dizziness')
  ) {
    return {
      triage: 'MODERATE_OBSERVATION',
      requiresImmediateParentCall: true,
      alertReason: `Elevated vital signs / observation required: ${complaint} (${temperatureF}°F).`,
    };
  }

  // Routine: mild headache, minor scrape, paper cut
  return {
    triage: 'ROUTINE',
    requiresImmediateParentCall: false,
  };
}

/**
 * Aggregates school-wide health indicators for CBSE Annual Quality Audit
 */
export function aggregateSchoolHealthIndicators(cards: StudentHealthCard[]) {
  const total = cards.length;
  if (total === 0) {
    return { total: 0, healthyWeightPercent: 100, spectaclesPercent: 0, withAllergiesCount: 0 };
  }

  const healthyCount = cards.filter((c) => c.bmiCategory === 'HEALTHY_WEIGHT').length;
  const spectaclesCount = cards.filter((c) => c.wearsGlasses).length;
  const allergyCount = cards.filter((c) => c.chronicConditions.length > 0).length;

  return {
    total,
    healthyWeightPercent: Math.round((healthyCount / total) * 100),
    spectaclesPercent: Math.round((spectaclesCount / total) * 100),
    withAllergiesCount: allergyCount,
  };
}
