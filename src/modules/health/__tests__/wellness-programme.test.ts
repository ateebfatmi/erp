import { describe, it, expect } from 'vitest';
import {
  calculateSHWPIndex,
  formatSHWPModule,
  INITIAL_HEALTH_AMBASSADORS,
  INITIAL_PEER_EDUCATORS,
  INITIAL_WELLNESS_SESSIONS,
  INITIAL_ANONYMOUS_QUERIES,
  ALL_SHWP_MODULES,
} from '../wellness-programme';

describe('CBSE School Health & Wellness Programme (SHWP) & Peer Educator Hub', () => {
  it('calculates module coverage, student reach, query resolution rate, and Ayushman Bharat star rating', () => {
    const report = calculateSHWPIndex(
      INITIAL_WELLNESS_SESSIONS,
      INITIAL_PEER_EDUCATORS,
      INITIAL_ANONYMOUS_QUERIES
    );

    // Initial conducted sessions cover emotional_wellbeing, cyber_safety, substance_misuse (3 modules out of 11)
    expect(report.coveredModulesCount).toBe(3);
    expect(report.totalModulesCount).toBe(11);
    expect(report.moduleCoveragePercentage).toBe(27); // 3/11
    expect(report.peerEducatorCount).toBe(6);
    expect(report.totalStudentReach).toBe(74 + 68 + 65); // 207 students
    expect(report.queryResolutionRate).toBe(67); // 2 out of 3 resolved
    expect([3, 4, 5]).toContain(report.ayushmanBharatStarRating);
  });

  it('verifies all 11 statutory Ayushman Bharat thematic modules exist and format cleanly', () => {
    expect(ALL_SHWP_MODULES.length).toBe(11);
    expect(formatSHWPModule('emotional_wellbeing')).toBe('Emotional Wellbeing & Mental Health');
    expect(formatSHWPModule('substance_misuse_prevention')).toBe(
      'Substance Misuse Prevention (Tobacco/Drugs)'
    );
    expect(formatSHWPModule('cyber_safety_digital_wellness')).toBe(
      'Cyber Safety & Digital Wellbeing'
    );
  });

  it('validates CBSE statutory mandate of 2 Health Ambassadors (1 male, 1 female)', () => {
    expect(INITIAL_HEALTH_AMBASSADORS.length).toBe(2);
    const hasFemale = INITIAL_HEALTH_AMBASSADORS.some((a) => a.gender === 'female');
    const hasMale = INITIAL_HEALTH_AMBASSADORS.some((a) => a.gender === 'male');
    expect(hasFemale).toBe(true);
    expect(hasMale).toBe(true);
  });
});
