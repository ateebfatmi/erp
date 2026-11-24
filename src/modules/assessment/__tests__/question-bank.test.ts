import { describe, it, expect } from 'vitest';
import {
  calculateCognitiveDistribution,
  generateExamPaperFromBlueprint,
  INITIAL_QUESTION_BANK,
} from '../question-bank';

describe('CBSE Question Bank & Auto Exam Blueprint Generator', () => {
  it('calculates cognitive weightage distribution per Bloom taxonomy guidelines', () => {
    const distribution = calculateCognitiveDistribution(INITIAL_QUESTION_BANK);

    // Total marks = 1 + 1 + 2 + 3 + 5 + 4 = 16 marks
    const totalMarks = Object.values(distribution).reduce((acc, curr) => acc + curr.marks, 0);
    expect(totalMarks).toBe(16);

    expect(distribution.REMEMBERING.marks).toBe(1);
    expect(distribution.UNDERSTANDING.marks).toBe(1);
    expect(distribution.APPLYING.marks).toBe(5); // 2 + 3 = 5
    expect(distribution.ANALYZING_EVALUATING.marks).toBe(9); // 5 + 4 = 9

    // Check percentages sum up to approx 100%
    const totalPercentage = Object.values(distribution).reduce((acc, curr) => acc + curr.percentage, 0);
    expect(totalPercentage).toBeGreaterThanOrEqual(98);
    expect(totalPercentage).toBeLessThanOrEqual(102);
  });

  it('generates standardized CBSE examination paper layout with all 5 sections', () => {
    const paper = generateExamPaperFromBlueprint(
      INITIAL_QUESTION_BANK,
      '041',
      12,
      'Class 12 Pre-Board Mathematics Exam'
    );

    expect(paper.sections.length).toBe(5);
    expect(paper.sections[0].sectionName).toContain('Section A');
    expect(paper.sections[1].sectionName).toContain('Section B');
    expect(paper.sections[2].sectionName).toContain('Section C');
    expect(paper.sections[3].sectionName).toContain('Section D');
    expect(paper.sections[4].sectionName).toContain('Section E');

    expect(paper.generalInstructions.length).toBeGreaterThan(0);
    expect(paper.maxMarks).toBe(16);
    expect(paper.durationMinutes).toBe(180);
  });
});
