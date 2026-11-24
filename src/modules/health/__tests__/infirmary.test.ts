import { describe, it, expect } from 'vitest';
import {
  calculateBmiAndCategory,
  evaluateInfirmaryTriage,
  aggregateSchoolHealthIndicators,
  StudentHealthCard,
} from '../infirmary';

describe('VidyaOS Student Health & School Infirmary Engine', () => {
  it('calculates BMI and assigns correct pediatric categories', () => {
    // 55kg, 165cm -> 55 / (1.65^2) = 20.2 (Healthy Weight)
    const healthy = calculateBmiAndCategory(55, 165);
    expect(healthy.bmi).toBe(20.2);
    expect(healthy.category).toBe('HEALTHY_WEIGHT');

    // 40kg, 160cm -> 40 / (1.6^2) = 15.6 (Underweight)
    const under = calculateBmiAndCategory(40, 160);
    expect(under.bmi).toBe(15.6);
    expect(under.category).toBe('UNDERWEIGHT');

    // 75kg, 165cm -> 75 / (1.65^2) = 27.5 (Overweight)
    const over = calculateBmiAndCategory(75, 165);
    expect(over.bmi).toBe(27.5);
    expect(over.category).toBe('OVERWEIGHT');

    // 90kg, 165cm -> 90 / (1.65^2) = 33.1 (Obese)
    const obese = calculateBmiAndCategory(90, 165);
    expect(obese.bmi).toBe(33.1);
    expect(obese.category).toBe('OBESE');
  });

  it('evaluates infirmary triage urgency and triggers parent emergency alerts for acute conditions', () => {
    // High grade fever 102.5F
    const acuteFever = evaluateInfirmaryTriage('Sudden high fever with shivering', 102.5);
    expect(acuteFever.triage).toBe('EMERGENCY_TRANSFER');
    expect(acuteFever.requiresImmediateParentCall).toBe(true);

    // Known Asthmatic with breathing difficulty
    const asthmaAttack = evaluateInfirmaryTriage('Acute breathing shortness after sprint', 98.6, ['Asthma']);
    expect(asthmaAttack.triage).toBe('EMERGENCY_TRANSFER');
    expect(asthmaAttack.requiresImmediateParentCall).toBe(true);

    // Moderate sprain / mild fever 100.8F
    const moderate = evaluateInfirmaryTriage('Ankle twisted during basketball', 100.8);
    expect(moderate.triage).toBe('MODERATE_OBSERVATION');
    expect(moderate.requiresImmediateParentCall).toBe(true);

    // Routine minor scrape
    const routine = evaluateInfirmaryTriage('Small paper cut on index finger', 98.4);
    expect(routine.triage).toBe('ROUTINE');
    expect(routine.requiresImmediateParentCall).toBe(false);
  });

  it('aggregates cohort health statistics for CBSE Annual Quality Assurance', () => {
    const cards: StudentHealthCard[] = [
      {
        studentId: 's1',
        studentName: 'Student 1',
        admissionNo: 'DPS-01',
        gradeSection: 'Grade 10-A',
        gender: 'MALE',
        dob: '2009-04-12',
        bloodGroup: 'O+',
        heightCm: 165,
        weightKg: 55,
        bmi: 20.2,
        bmiCategory: 'HEALTHY_WEIGHT',
        visionLeft: '6/6',
        visionRight: '6/6',
        wearsGlasses: false,
        dentalHygiene: 'NORMAL',
        chronicConditions: [],
        emergencyContact: { name: 'Parent 1', relationship: 'Father', phone: '9811000000' },
        lastCheckedDate: '2024-10-15',
      },
      {
        studentId: 's2',
        studentName: 'Student 2',
        admissionNo: 'DPS-02',
        gradeSection: 'Grade 10-A',
        gender: 'FEMALE',
        dob: '2009-08-20',
        bloodGroup: 'B+',
        heightCm: 158,
        weightKg: 68,
        bmi: 27.2,
        bmiCategory: 'OVERWEIGHT',
        visionLeft: '6/9',
        visionRight: '6/12',
        wearsGlasses: true,
        dentalHygiene: 'CARIES_DETECTED',
        chronicConditions: ['Dust Allergy'],
        emergencyContact: { name: 'Parent 2', relationship: 'Mother', phone: '9822000000' },
        lastCheckedDate: '2024-10-15',
      },
    ];

    const stats = aggregateSchoolHealthIndicators(cards);
    expect(stats.total).toBe(2);
    expect(stats.healthyWeightPercent).toBe(50);
    expect(stats.spectaclesPercent).toBe(50);
    expect(stats.withAllergiesCount).toBe(1);
  });
});
