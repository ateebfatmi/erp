import { describe, it, expect } from 'vitest';
import {
  calculateCpdProgress,
  logCpdTraining,
  verifyCpdTraining,
  INITIAL_CPD_RECORDS,
  CpdTrainingRecord,
} from '../cpd';

describe('CBSE Continuous Professional Development (CPD) Engine', () => {
  it('should accurately calculate total hours, CBSE/NISHTHA statutory hours, and percentage completion', () => {
    // Smt. Ananya Sen has 10 (CBSE) + 15 (NISHTHA) + 12 (Inhouse) + 6 (CBSE) = 43 hours
    const progress = calculateCpdProgress('tch-01', INITIAL_CPD_RECORDS);

    expect(progress.totalHoursCompleted).toBe(43);
    expect(progress.statutoryCbseNishthaHours).toBe(31); // 10 + 15 + 6 = 31 >= 25
    expect(progress.inHouseAndMoocHours).toBe(12);
    expect(progress.percentageCompleted).toBe(86); // 43 / 50 = 86%
    expect(progress.isCompliant).toBe(false); // needs 7 more hours to reach 50
    expect(progress.hoursNeededForCompliance).toBe(7);
  });

  it('should mark a faculty member compliant when achieving >= 50 total hours and >= 25 CBSE/NISHTHA hours', () => {
    const compliantRecords: CpdTrainingRecord[] = [
      {
        id: 'c1',
        teacherId: 'tch-comp',
        teacherName: 'Teacher Compliant',
        designation: 'TGT Science',
        programTitle: 'CBSE CoE Modules 1-3',
        organizingAgency: 'CBSE_COE_ONLINE',
        theme: 'PEDAGOGY_AND_LESSON_PLANNING',
        completionDate: '2024-05-10',
        durationHours: 30, // >= 25
        certificateNumber: 'CBSE-001',
        status: 'VERIFIED_BY_PRINCIPAL',
      },
      {
        id: 'c2',
        teacherId: 'tch-comp',
        teacherName: 'Teacher Compliant',
        designation: 'TGT Science',
        programTitle: 'In-house Teaching Workshop',
        organizingAgency: 'IN_HOUSE_SCHOOL_WORKSHOP',
        theme: 'EXPERIENTIAL_AND_ART_INTEGRATED_LEARNING',
        completionDate: '2024-06-15',
        durationHours: 20,
        certificateNumber: 'INHOUSE-002',
        status: 'VERIFIED_BY_PRINCIPAL',
      },
    ];

    const progress = calculateCpdProgress('tch-comp', compliantRecords);
    expect(progress.totalHoursCompleted).toBe(50);
    expect(progress.statutoryCbseNishthaHours).toBe(30);
    expect(progress.isCompliant).toBe(true);
    expect(progress.percentageCompleted).toBe(100);
    expect(progress.hoursNeededForCompliance).toBe(0);
  });

  it('should validate and log new CPD certificate submission with duration limits', () => {
    const newLog = logCpdTraining({
      teacherId: 'tch-01',
      teacherName: 'Smt. Ananya Sen',
      designation: 'PGT Mathematics',
      programTitle: 'Advanced Calculus Pedagogy by IIM Kozhikode',
      organizingAgency: 'UNIVERSITY_MOOC',
      theme: 'PEDAGOGY_AND_LESSON_PLANNING',
      completionDate: '2024-11-20',
      durationHours: 10,
      certificateNumber: 'MOOC-IIMK-2024-88',
    });

    expect(newLog.id).toContain('CPD-');
    expect(newLog.status).toBe('SUBMITTED');
    expect(newLog.durationHours).toBe(10);

    expect(() =>
      logCpdTraining({
        teacherId: 'tch-01',
        teacherName: 'Smt. Ananya Sen',
        designation: 'PGT Mathematics',
        programTitle: 'Invalid',
        organizingAgency: 'CBSE_COE_ONLINE',
        theme: 'CYBER_SAFETY_AND_DIGITAL_LITERACY',
        completionDate: '2024-11-20',
        durationHours: 0, // invalid <= 0
        certificateNumber: 'CERT-01',
      })
    ).toThrowError(/between 1 and 50 hours/);
  });

  it('should allow principal to verify or reject CPD records with remarks', () => {
    const verified = verifyCpdTraining(
      INITIAL_CPD_RECORDS,
      'CPD-90115',
      'VERIFIED_BY_PRINCIPAL',
      'Certificate verified against CBSE Portal.'
    );

    const record = verified.find((r) => r.id === 'CPD-90115');
    expect(record?.status).toBe('VERIFIED_BY_PRINCIPAL');
    expect(record?.principalRemarks).toBe('Certificate verified against CBSE Portal.');
  });
});
