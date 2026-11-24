import { describe, it, expect } from 'vitest';
import {
  evaluateCbtSubmission,
  SAMPLE_CBSE_EXAM,
} from '../cbt-engine';

describe('Online CBT Examination & Auto-Grading Engine', () => {
  it('correctly calculates 100% score for all correct answers and awards A1 grade', () => {
    const perfectAnswers: Record<string, string> = {
      q1: 'CaCO3',
      q2: 'Between F and Center of Curvature (C)',
      q3: 'True',
      q4: 'Salivary Amylase',
      q5: 'True',
    };

    const res = evaluateCbtSubmission(SAMPLE_CBSE_EXAM, perfectAnswers);

    expect(res.totalQuestions).toBe(5);
    expect(res.correctCount).toBe(5);
    expect(res.incorrectCount).toBe(0);
    expect(res.negativePenalty).toBe(0);
    expect(res.netScore).toBe(20);
    expect(res.percentage).toBe(100);
    expect(res.cbseGrade).toBe('A1');
    expect(res.isPassed).toBe(true);
  });

  it('correctly deducts negative marking penalty for incorrect responses', () => {
    // 3 correct (12 pts), 2 incorrect (-2 pts) = net 10 pts (50%)
    const mixedAnswers: Record<string, string> = {
      q1: 'CaCO3', // correct (+4)
      q2: 'At Focus (F)', // wrong (-1)
      q3: 'True', // correct (+4)
      q4: 'Lipase', // wrong (-1)
      q5: 'True', // correct (+4)
    };

    const res = evaluateCbtSubmission(SAMPLE_CBSE_EXAM, mixedAnswers);

    expect(res.correctCount).toBe(3);
    expect(res.incorrectCount).toBe(2);
    expect(res.grossMarks).toBe(12);
    expect(res.negativePenalty).toBe(2);
    expect(res.netScore).toBe(10);
    expect(res.percentage).toBe(50);
    expect(res.cbseGrade).toBe('C2');
    expect(res.isPassed).toBe(true);
  });

  it('handles unanswered questions without applying negative penalties', () => {
    // Only 1 answered correctly (+4), remaining 4 unanswered
    const partialAnswers: Record<string, string> = {
      q1: 'CaCO3',
    };

    const res = evaluateCbtSubmission(SAMPLE_CBSE_EXAM, partialAnswers);

    expect(res.correctCount).toBe(1);
    expect(res.incorrectCount).toBe(0);
    expect(res.unansweredCount).toBe(4);
    expect(res.negativePenalty).toBe(0);
    expect(res.netScore).toBe(4);
    expect(res.percentage).toBe(20);
    expect(res.isPassed).toBe(false);
  });
});
