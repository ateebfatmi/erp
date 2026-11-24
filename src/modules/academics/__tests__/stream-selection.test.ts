import { describe, it, expect } from 'vitest';
import {
  evaluateStreamEligibility,
  validateSubjectCombination,
  INITIAL_STREAM_BASKETS,
} from '../stream-selection';

describe('NEP 2020 Senior Secondary Stream & Career Engine', () => {
  it('approves Science PCM for high-scoring student meeting 75% thresholds', () => {
    const scores = {
      math: 88,
      science: 84,
      english: 90,
      socialScience: 82,
      aggregatePercent: 86,
    };

    const result = evaluateStreamEligibility(scores, 'SCIENCE_PCM');
    expect(result.eligible).toBe(true);
    expect(result.shortfallReasons).toHaveLength(0);
  });

  it('rejects Science PCM if Mathematics score is below 75% cutoff and suggests alternatives', () => {
    const scores = {
      math: 68, // Below 75%
      science: 82,
      english: 85,
      socialScience: 78,
      aggregatePercent: 78.2,
    };

    const result = evaluateStreamEligibility(scores, 'SCIENCE_PCM');
    expect(result.eligible).toBe(false);
    expect(result.shortfallReasons[0]).toContain('MATH');
    // Student has 82% Science, so SCIENCE_PCB and COMMERCE_WITH_MATH/HUMANITIES should be recommended
    expect(result.recommendedAlternatives).toContain('SCIENCE_PCB');
    expect(result.recommendedAlternatives).toContain('COMMERCE_WITH_MATH');
    expect(result.recommendedAlternatives).toContain('HUMANITIES');
  });

  it('evaluates Commerce with Math against 65% Math cutoff', () => {
    const passingScores = {
      math: 70,
      science: 60,
      english: 75,
      socialScience: 80,
      aggregatePercent: 71.2,
    };

    const passResult = evaluateStreamEligibility(passingScores, 'COMMERCE_WITH_MATH');
    expect(passResult.eligible).toBe(true);

    const failingScores = {
      math: 58, // Below 65%
      science: 60,
      english: 75,
      socialScience: 80,
      aggregatePercent: 68.2,
    };

    const failResult = evaluateStreamEligibility(failingScores, 'COMMERCE_WITH_MATH');
    expect(failResult.eligible).toBe(false);
    expect(failResult.recommendedAlternatives).toContain('COMMERCE_WITHOUT_MATH');
  });

  it('validates elective choices adhering to max allowed constraints', () => {
    // Science PCM allows 1 elective
    const validPcm = validateSubjectCombination('SCIENCE_PCM', ['Computer Science (Python)']);
    expect(validPcm.valid).toBe(true);

    const tooMany = validateSubjectCombination('SCIENCE_PCM', [
      'Computer Science (Python)',
      'Physical Education',
    ]);
    expect(tooMany.valid).toBe(false);
    expect(tooMany.error).toContain('exactly 1');

    // Humanities allows 2 electives
    const validHum = validateSubjectCombination('HUMANITIES', ['Economics', 'Psychology']);
    expect(validHum.valid).toBe(true);
  });
});
