import { describe, it, expect } from 'vitest';
import {
  evaluateStudentPromotion,
  executeSessionRollover,
  PromotionCandidate,
} from '../promotion';

describe('VidyaOS Annual Promotion & Session Rollover Engine', () => {
  it('promotes an eligible Class 10 student to Class 11', () => {
    const candidate: PromotionCandidate = {
      enrollmentId: 'enr-101',
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      currentClass: 'Class 10',
      currentSection: 'Section A',
      rollNo: '14',
      academicPercentage: 88.5,
      failedSubjectsCount: 0,
      attendancePercentage: 94.1,
      hasMedicalCondonation: false,
    };

    const decision = evaluateStudentPromotion(candidate, 'Section A');
    expect(decision.status).toBe('PROMOTED');
    expect(decision.fromClass).toBe('Class 10');
    expect(decision.toClass).toBe('Class 11');
    expect(decision.targetSection).toBe('Section A');
  });

  it('graduates a Class 12 student to ALUMNI batch', () => {
    const senior: PromotionCandidate = {
      enrollmentId: 'enr-120',
      studentId: 'std-120',
      studentName: 'Rohan Deshmukh',
      currentClass: 'Class 12',
      currentSection: 'Section B',
      rollNo: '08',
      academicPercentage: 91.2,
      failedSubjectsCount: 0,
      attendancePercentage: 89.0,
      hasMedicalCondonation: false,
    };

    const decision = evaluateStudentPromotion(senior);
    expect(decision.status).toBe('GRADUATED_ALUMNI');
    expect(decision.toClass).toBe('ALUMNI');
  });

  it('flags a student with 1 failed subject as COMPARTMENT', () => {
    const borderline: PromotionCandidate = {
      enrollmentId: 'enr-102',
      studentId: 'std-102',
      studentName: 'Ananya Verma',
      currentClass: 'Class 10',
      currentSection: 'Section A',
      rollNo: '02',
      academicPercentage: 48.0,
      failedSubjectsCount: 1, // 1 subject failed
      attendancePercentage: 82.0,
      hasMedicalCondonation: false,
    };

    const decision = evaluateStudentPromotion(borderline);
    expect(decision.status).toBe('COMPARTMENT');
    expect(decision.toClass).toBe('Class 10'); // Retained in class pending July supplementary
  });

  it('detains a student with attendance shortage under CBSE Rule 13 without medical condonation', () => {
    const absentee: PromotionCandidate = {
      enrollmentId: 'enr-103',
      studentId: 'std-103',
      studentName: 'Kabir Khan',
      currentClass: 'Class 9',
      currentSection: 'Section B',
      rollNo: '19',
      academicPercentage: 72.0,
      failedSubjectsCount: 0,
      attendancePercentage: 68.0, // < 75%
      hasMedicalCondonation: false,
    };

    const decision = evaluateStudentPromotion(absentee);
    expect(decision.status).toBe('DETAINED');
    expect(decision.reason).toContain('Attendance shortage');
  });

  it('executes cohort batch session rollover and aggregates promotion statistics', () => {
    const cohort: PromotionCandidate[] = [
      {
        enrollmentId: 'e1',
        studentId: 's1',
        studentName: 'Student 1',
        currentClass: 'Class 10',
        currentSection: 'Section A',
        rollNo: '01',
        academicPercentage: 85,
        failedSubjectsCount: 0,
        attendancePercentage: 90,
        hasMedicalCondonation: false,
      },
      {
        enrollmentId: 'e2',
        studentId: 's2',
        studentName: 'Student 2',
        currentClass: 'Class 12',
        currentSection: 'Section A',
        rollNo: '02',
        academicPercentage: 92,
        failedSubjectsCount: 0,
        attendancePercentage: 88,
        hasMedicalCondonation: false,
      },
      {
        enrollmentId: 'e3',
        studentId: 's3',
        studentName: 'Student 3',
        currentClass: 'Class 10',
        currentSection: 'Section A',
        rollNo: '03',
        academicPercentage: 42,
        failedSubjectsCount: 1,
        attendancePercentage: 80,
        hasMedicalCondonation: false,
      },
      {
        enrollmentId: 'e4',
        studentId: 's4',
        studentName: 'Student 4',
        currentClass: 'Class 9',
        currentSection: 'Section A',
        rollNo: '04',
        academicPercentage: 28,
        failedSubjectsCount: 3,
        attendancePercentage: 70,
        hasMedicalCondonation: false,
      },
    ];

    const summary = executeSessionRollover(cohort, '2024-2025', '2025-2026');
    expect(summary.totalCandidates).toBe(4);
    expect(summary.promotedCount).toBe(1);
    expect(summary.graduatedCount).toBe(1);
    expect(summary.compartmentCount).toBe(1);
    expect(summary.detainedCount).toBe(1);
  });
});
