import { describe, it, expect } from 'vitest';
import {
  calculateCompetencyIndex,
  validateHpcCompletion,
  finalizeHolisticProgressCard,
  INITIAL_HPC_RECORDS,
  HolisticProgressCard,
  CompetencyRating,
} from '../holistic-progress';

describe('NEP 2020 Holistic Progress Card (HPC) & 360 Assessment Engine', () => {
  it('calculates PARAKH competency index and classifies overall proficiency', () => {
    const competencies: CompetencyRating[] = [
      {
        domain: 'CRITICAL_THINKING',
        label: 'Critical Thinking',
        level: 'PROFICIENT',
        evidenceOrObservation: 'Superb problem solver',
      },
      {
        domain: 'COMMUNICATION_COLLABORATION',
        label: 'Collaboration',
        level: 'PROFICIENT',
        evidenceOrObservation: 'Team leader',
      },
      {
        domain: 'SCIENTIFIC_INQUIRY',
        label: 'Inquiry',
        level: 'DEVELOPING',
        evidenceOrObservation: 'Growing in lab skills',
      },
      {
        domain: 'CREATIVITY_INNOVATION',
        label: 'Creativity',
        level: 'PROFICIENT',
        evidenceOrObservation: 'Original ideas',
      },
    ];

    // Points: 3 + 3 + 2 + 3 = 11 out of 12 (91.6% -> 92%)
    const index = calculateCompetencyIndex(competencies);
    expect(index.overallScorePercent).toBe(92);
    expect(index.proficientCount).toBe(3);
    expect(index.developingCount).toBe(1);
    expect(index.emergingCount).toBe(0);
    expect(index.overallLevel).toBe('PROFICIENT');
  });

  it('handles emerging competency levels below 55%', () => {
    const competencies: CompetencyRating[] = [
      {
        domain: 'CRITICAL_THINKING',
        label: 'Critical Thinking',
        level: 'EMERGING',
        evidenceOrObservation: 'Needs guidance',
      },
      {
        domain: 'DIGITAL_CITIZENSHIP',
        label: 'Digital Conduct',
        level: 'EMERGING',
        evidenceOrObservation: 'Needs monitoring',
      },
    ];

    // Points: 1 + 1 = 2 out of 6 (33%)
    const index = calculateCompetencyIndex(competencies);
    expect(index.overallScorePercent).toBe(33);
    expect(index.overallLevel).toBe('EMERGING');
  });

  it('validates 360-degree completion across learner, peer, parent, and teacher', () => {
    const completeCard = INITIAL_HPC_RECORDS[0];
    const validation = validateHpcCompletion(completeCard);
    expect(validation.isComplete).toBe(true);
    expect(validation.pendingSections).toHaveLength(0);

    // Incomplete card missing parent observation
    const incompleteCard: HolisticProgressCard = {
      ...completeCard,
      parentObservation: undefined,
    };
    const invalidCheck = validateHpcCompletion(incompleteCard);
    expect(invalidCheck.isComplete).toBe(false);
    expect(invalidCheck.pendingSections).toContain('Parent Home Environment Observations');
  });

  it('finalizes a complete HPC card and blocks an incomplete card', () => {
    const completeCard = INITIAL_HPC_RECORDS[0];
    const res = finalizeHolisticProgressCard(completeCard);
    expect(res.success).toBe(true);
    expect(res.updatedHpc.status).toBe('FINALIZED');

    const incompleteCard: HolisticProgressCard = {
      ...completeCard,
      teacherAnecdotal: undefined,
    };
    const failRes = finalizeHolisticProgressCard(incompleteCard);
    expect(failRes.success).toBe(false);
    expect(failRes.error).toContain('Cannot finalize HPC');
  });
});
