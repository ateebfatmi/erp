import { describe, it, expect } from 'vitest';
import {
  evaluateCbseExamConcessions,
  calculateIepProgress,
  updateIepGoal,
  INITIAL_CWSN_PROFILES,
  IepTermGoal,
} from '../cwsn-iep';

describe('CBSE CWSN & Individualized Education Plan (IEP) Engine', () => {
  it('should evaluate statutory CBSE exam concessions based on disability categories', () => {
    const dyslexiaConcessions = evaluateCbseExamConcessions('SPECIFIC_LEARNING_DISABILITY_DYSLEXIA');
    expect(dyslexiaConcessions).toContain('EXTRA_TIME_20_MIN_PER_HOUR');
    expect(dyslexiaConcessions).toContain('SCRIBE_OR_READER_PERMISSION');
    expect(dyslexiaConcessions).toContain('EXEMPTION_FROM_SECOND_OR_THIRD_LANGUAGE');
    expect(dyslexiaConcessions).toContain('USE_OF_COMPUTER_OR_CALCULATOR_FOR_DYSCALCULIA');

    const autismConcessions = evaluateCbseExamConcessions('AUTISM_SPECTRUM_DISORDER');
    expect(autismConcessions).toContain('SEPARATE_QUIET_EXAMINATION_ROOM_ON_GROUND_FLOOR');
    expect(autismConcessions).toContain('ALLOWANCE_OF_SENSORY_FIDGET_AND_ASSISTIVE_AIDS');

    const visualConcessions = evaluateCbseExamConcessions('VISUAL_IMPAIRMENT_OR_BLINDNESS');
    expect(visualConcessions).toContain('ALTERNATE_QUESTIONS_IN_LIEU_OF_VISUAL_DIAGRAMS');
  });

  it('should calculate IEP goal progress metrics accurately', () => {
    const testGoals: IepTermGoal[] = [
      {
        id: '1',
        domain: 'READING_LANGUAGE',
        goalStatement: 'Goal 1',
        baselinePerformance: 'Base',
        targetMilestone: 'Target',
        accommodationsRequired: [],
        status: 'ACHIEVED',
        progressPercentage: 100,
        lastReviewDate: '2024-11-10',
      },
      {
        id: '2',
        domain: 'MATHEMATICS_LOGIC',
        goalStatement: 'Goal 2',
        baselinePerformance: 'Base',
        targetMilestone: 'Target',
        accommodationsRequired: [],
        status: 'IN_PROGRESS',
        progressPercentage: 60,
        lastReviewDate: '2024-11-10',
      },
    ];

    const progress = calculateIepProgress(testGoals);
    expect(progress.totalGoals).toBe(2);
    expect(progress.achievedGoals).toBe(1);
    expect(progress.inProgressGoals).toBe(1);
    expect(progress.overallProgressPercent).toBe(80); // (100 + 60) / 2 = 80
  });

  it('should update milestone goal progress and educator review notes', () => {
    const student = INITIAL_CWSN_PROFILES[0];
    const updated = updateIepGoal(
      student,
      'g-01',
      'ACHIEVED',
      100,
      'Goal accomplished ahead of winter term examinations.'
    );

    const goal = updated.termGoals.find((g) => g.id === 'g-01');
    expect(goal?.status).toBe('ACHIEVED');
    expect(goal?.progressPercentage).toBe(100);
    expect(goal?.specialEducatorNotes).toBe('Goal accomplished ahead of winter term examinations.');
    expect(updated.lastIepReviewDate).toBeDefined();
  });
});
