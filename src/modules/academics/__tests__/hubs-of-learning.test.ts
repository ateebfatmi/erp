import { describe, it, expect } from 'vitest';
import {
  validatePreBoardBlueprint,
  calculateHubCollaborativeScore,
  INITIAL_HUB_CLUSTER,
  INITIAL_RESOURCE_BOOKINGS,
  INITIAL_PREBOARD_MODERATIONS,
  INITIAL_PEER_OBSERVATIONS,
} from '../hubs-of-learning';

describe('CBSE Hubs of Learning (HoL) Collaborative Cluster Desk', () => {
  it('validates a balanced Pre-Board examination blueprint conforming to CBSE 30:50:20', () => {
    const balanced = validatePreBoardBlueprint({
      easyPercentage: 30,
      averagePercentage: 50,
      hotsPercentage: 20,
    });
    expect(balanced.isBalanced).toBe(true);
    expect(balanced.message).toContain('strictly conforms to CBSE 30:50:20');
  });

  it('rejects blueprints that do not sum to 100% or deviate from recommended bands', () => {
    const invalidSum = validatePreBoardBlueprint({
      easyPercentage: 30,
      averagePercentage: 50,
      hotsPercentage: 10, // Sum = 90
    });
    expect(invalidSum.isBalanced).toBe(false);
    expect(invalidSum.message).toContain('Total percentage must equal 100%');

    const skewed = validatePreBoardBlueprint({
      easyPercentage: 50, // Too high
      averagePercentage: 35,
      hotsPercentage: 15,
    });
    expect(skewed.isBalanced).toBe(false);
    expect(skewed.message).toContain('Difficulty curve deviates from CBSE norm');
  });

  it('computes composite Hub Vitality Index across meetings, resources, moderations, and observations', () => {
    const vitality = calculateHubCollaborativeScore(
      INITIAL_HUB_CLUSTER,
      INITIAL_RESOURCE_BOOKINGS,
      INITIAL_PEER_OBSERVATIONS,
      INITIAL_PREBOARD_MODERATIONS
    );

    expect(vitality.score).toBeGreaterThan(60);
    expect(['Exemplary', 'Active']).toContain(vitality.rating);
    expect(vitality.breakdown.meetings).toBeGreaterThan(0);
    expect(vitality.breakdown.resources).toBeGreaterThan(0);
    expect(vitality.breakdown.moderations).toBeGreaterThan(0);
    expect(vitality.breakdown.observations).toBeGreaterThan(0);
  });

  it('verifies Lead Collaborator School (LCS) structure and 5-school cluster network', () => {
    expect(INITIAL_HUB_CLUSTER.memberSchools.length).toBe(5);
    const lcs = INITIAL_HUB_CLUSTER.memberSchools.find((s) => s.role === 'lead_collaborator');
    expect(lcs).toBeDefined();
    expect(lcs?.schoolName).toContain('Vidya Mandir');
    expect(INITIAL_HUB_CLUSTER.clusterCode).toBe('CBSE-HOL-DL-042');
  });
});
