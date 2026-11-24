import { describe, it, expect } from 'vitest';
import {
  calculateStudentVocationalRubric,
  calculateGradeProgress,
  generateVocationalCertificateCode,
  formatVocationalCategory,
  INITIAL_BAGLESS_SESSIONS,
  BaglessDaySession,
} from '../bagless-days';

describe('NEP 2020 10 Bagless Days & Vocational Skill Hub', () => {
  it('calculates student vocational rubric score and performance grade band', () => {
    // 5 + 5 + 4 + 5 = 19 -> A+
    const high = calculateStudentVocationalRubric({
      manualDexterity: 5,
      toolSafety: 5,
      creativityAndDesign: 4,
      collaboration: 5,
    });
    expect(high.totalRubricScore).toBe(19);
    expect(high.performanceGrade).toBe('A+');

    // 4 + 4 + 4 + 4 = 16 -> A
    const mid = calculateStudentVocationalRubric({
      manualDexterity: 4,
      toolSafety: 4,
      creativityAndDesign: 4,
      collaboration: 4,
    });
    expect(mid.totalRubricScore).toBe(16);
    expect(mid.performanceGrade).toBe('A');

    // 3 + 3 + 3 + 3 = 12 -> B
    const bGrade = calculateStudentVocationalRubric({
      manualDexterity: 3,
      toolSafety: 3,
      creativityAndDesign: 3,
      collaboration: 3,
    });
    expect(bGrade.totalRubricScore).toBe(12);
    expect(bGrade.performanceGrade).toBe('B');

    // 2 + 2 + 2 + 2 = 8 -> C
    const cGrade = calculateStudentVocationalRubric({
      manualDexterity: 2,
      toolSafety: 2,
      creativityAndDesign: 2,
      collaboration: 2,
    });
    expect(cGrade.totalRubricScore).toBe(8);
    expect(cGrade.performanceGrade).toBe('C');
  });

  it('calculates grade-level statutory 10-day compliance and hours logged', () => {
    // Class 6 has 4 completed sessions in INITIAL_BAGLESS_SESSIONS
    const progressClass6 = calculateGradeProgress(INITIAL_BAGLESS_SESSIONS, 'Class 6');
    expect(progressClass6.completedDays).toBe(4);
    expect(progressClass6.totalTargetDays).toBe(10);
    expect(progressClass6.hoursLogged).toBe(24); // 4 * 6
    expect(progressClass6.compliancePercentage).toBe(40);
    expect(progressClass6.status).toBe('needs_attention');

    // Test completed mandate simulation (10 sessions)
    const simulatedSessions: BaglessDaySession[] = Array.from({ length: 10 }, (_, i) => ({
      id: `sim-${i}`,
      sessionNumber: i + 1,
      grade: 'Class 8',
      section: 'A',
      scheduledDate: '2026-11-01',
      vocationalCategory: 'pottery_clay',
      craftTitle: 'Test Craft',
      masterArtisanTrainer: 'Trainer',
      venueType: 'campus_workshop',
      venueAddress: 'Campus',
      safetyGearChecklist: [],
      enrolledCount: 30,
      attendedCount: 30,
      status: 'completed',
      reflectionSubmissionCount: 30,
      teacherSupervisor: 'Supervisor',
    }));

    const progressClass8 = calculateGradeProgress(simulatedSessions, 'Class 8');
    expect(progressClass8.completedDays).toBe(10);
    expect(progressClass8.hoursLogged).toBe(60);
    expect(progressClass8.compliancePercentage).toBe(100);
    expect(progressClass8.status).toBe('mandate_achieved');
  });

  it('generates unique statutory vocational certificate code', () => {
    const code = generateVocationalCertificateCode('STU-0601', 1);
    expect(code).toBe('VOS-NEP-BAG-2026-D1-STU0601');
  });

  it('formats vocational categories accurately per CBSE terminology', () => {
    expect(formatVocationalCategory('pottery_clay')).toBe('Terracotta & Clay Modeling');
    expect(formatVocationalCategory('carpentry_wood')).toBe('Woodcraft & Carpentry Joinery');
    expect(formatVocationalCategory('coding_robotics')).toBe('Robotics & Micro:bit Prototyping');
    expect(formatVocationalCategory('culinary_nutrition')).toBe('Culinary Arts & Millet Nutrition');
  });
});
