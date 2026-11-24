import { describe, it, expect } from 'vitest';
import {
  getCbseGradeAndPoint,
  computeSubjectScore,
  calculateCumulativeCGPA,
  StudentSubjectScore,
} from '../cbse-grading';

describe('VidyaOS CBSE 9-Point Grading Engine', () => {
  it('correctly maps scores to CBSE 9-point grades and grade points', () => {
    expect(getCbseGradeAndPoint(95)).toEqual({ grade: 'A1', gradePoint: 10.0 });
    expect(getCbseGradeAndPoint(85)).toEqual({ grade: 'A2', gradePoint: 9.0 });
    expect(getCbseGradeAndPoint(75)).toEqual({ grade: 'B1', gradePoint: 8.0 });
    expect(getCbseGradeAndPoint(65)).toEqual({ grade: 'B2', gradePoint: 7.0 });
    expect(getCbseGradeAndPoint(55)).toEqual({ grade: 'C1', gradePoint: 6.0 });
    expect(getCbseGradeAndPoint(45)).toEqual({ grade: 'C2', gradePoint: 5.0 });
    expect(getCbseGradeAndPoint(35)).toEqual({ grade: 'D', gradePoint: 4.0 });
    expect(getCbseGradeAndPoint(25)).toEqual({ grade: 'E', gradePoint: 0.0 });
  });

  it('aggregates Internal Assessment (20) and Theory (80) correctly', () => {
    const studentScore: StudentSubjectScore = {
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      rollNo: '14',
      subjectCode: '041',
      subjectName: 'Mathematics Standard',
      internalAssessment: {
        periodicTest: 4.5,
        multipleAssessment: 4.0,
        portfolio: 4.5,
        subjectEnrichment: 5.0,
      },
      theoryMarks: 74,
    };

    const computed = computeSubjectScore(studentScore);
    expect(computed.internalTotal).toBe(18); // 4.5 + 4 + 4.5 + 5
    expect(computed.theoryMarks).toBe(74);
    expect(computed.grandTotal).toBe(92);
    expect(computed.grade).toBe('A1');
    expect(computed.gradePoint).toBe(10.0);
    expect(computed.status).toBe('PASSED');
  });

  it('computes Cumulative Grade Point Average (CGPA) and Indicative Percentage per CBSE formula (CGPA * 9.5)', () => {
    const subjects = [
      computeSubjectScore({
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        rollNo: '14',
        subjectCode: '184',
        subjectName: 'English Language & Literature',
        internalAssessment: { periodicTest: 5, multipleAssessment: 4, portfolio: 5, subjectEnrichment: 4 },
        theoryMarks: 72,
      }), // 18 + 72 = 90 -> A2 (9.0)
      computeSubjectScore({
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        rollNo: '14',
        subjectCode: '041',
        subjectName: 'Mathematics Standard',
        internalAssessment: { periodicTest: 5, multipleAssessment: 5, portfolio: 5, subjectEnrichment: 5 },
        theoryMarks: 75,
      }), // 20 + 75 = 95 -> A1 (10.0)
      computeSubjectScore({
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        rollNo: '14',
        subjectCode: '086',
        subjectName: 'Science',
        internalAssessment: { periodicTest: 4, multipleAssessment: 4, portfolio: 4, subjectEnrichment: 4 },
        theoryMarks: 65,
      }), // 16 + 65 = 81 -> A2 (9.0)
      computeSubjectScore({
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        rollNo: '14',
        subjectCode: '087',
        subjectName: 'Social Science',
        internalAssessment: { periodicTest: 4, multipleAssessment: 5, portfolio: 4, subjectEnrichment: 5 },
        theoryMarks: 68,
      }), // 18 + 68 = 86 -> A2 (9.0)
      computeSubjectScore({
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        rollNo: '14',
        subjectCode: '002',
        subjectName: 'Hindi Course-A',
        internalAssessment: { periodicTest: 4, multipleAssessment: 4, portfolio: 5, subjectEnrichment: 5 },
        theoryMarks: 70,
      }), // 18 + 70 = 88 -> A2 (9.0)
    ];

    const result = calculateCumulativeCGPA(subjects);
    // Grade points: 9 + 10 + 9 + 9 + 9 = 46 / 5 = 9.20
    expect(result.cgpa).toBe(9.2);
    // Indicative % = 9.2 * 9.5 = 87.4%
    expect(result.indicativePercentage).toBe(87.4);
    expect(result.overallResult).toBe('PASSED');
  });

  it('identifies Compartment when theory is below minimum 26 marks out of 80', () => {
    const borderline = computeSubjectScore({
      studentId: 'std-102',
      studentName: 'Test Student',
      rollNo: '20',
      subjectCode: '041',
      subjectName: 'Mathematics',
      internalAssessment: { periodicTest: 5, multipleAssessment: 5, portfolio: 5, subjectEnrichment: 5 }, // 20/20 IA
      theoryMarks: 20, // Failed theory (< 26)
    });

    expect(borderline.status).toBe('COMPARTMENT');
  });
});
