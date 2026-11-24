import { describe, it, expect } from 'vitest';
import {
  calculateBhashaBadge,
  calculateEBSBCompliance,
  formatPillarTitle,
  INITIAL_STATE_PAIRING,
  INITIAL_EBSB_ACTIVITIES,
  INITIAL_STUDENT_BHASHA_LOGS,
} from '../ebsb';

describe('Ek Bharat Shreshtha Bharat (EBSB) & Bhasha Sangam Hub', () => {
  it('awards correct Bhasha Sangam badge levels based on sentences mastered', () => {
    expect(calculateBhashaBadge(85)).toBe('Bhasha Champion');
    expect(calculateBhashaBadge(75)).toBe('Bhasha Champion');
    expect(calculateBhashaBadge(50)).toBe('Bhasha Mitra');
    expect(calculateBhashaBadge(35)).toBe('Bhasha Mitra');
    expect(calculateBhashaBadge(20)).toBe('Linguistic Explorer');
  });

  it('calculates CBSE annual EBSB compliance report and student reach', () => {
    const report = calculateEBSBCompliance(INITIAL_EBSB_ACTIVITIES, INITIAL_STUDENT_BHASHA_LOGS);

    // Initial completed activities cover 4 distinct pillars (bhasha, cuisine, folk dance, indigenous sports)
    expect(report.pillarsCoveredCount).toBe(4);
    expect(report.totalPillars).toBe(6);
    expect(report.pillarCoveragePercentage).toBe(67); // 4/6
    expect(report.totalActivitiesConducted).toBe(4);
    expect(report.totalStudentReach).toBe(420 + 185 + 140 + 95); // 840 student participations
    expect(report.bhashaMasteryAveragePercentage).toBeGreaterThan(50);
    expect(['Exemplary', 'Active']).toContain(report.cbsePortalStatus);
  });

  it('formats all EBSB pillars with descriptive human-readable titles', () => {
    expect(formatPillarTitle('bhasha_sangam')).toBe('Bhasha Sangam (100 Sentences)');
    expect(formatPillarTitle('cuisine_food')).toBe('Traditional Cuisine & Culinary Heritage');
    expect(formatPillarTitle('indigenous_sports')).toBe('Traditional & Indigenous Sports');
    expect(formatPillarTitle('virtual_exchange')).toBe('Partner School Virtual Video Exchange');
  });

  it('verifies statutory state pairing information between Delhi and Sikkim', () => {
    expect(INITIAL_STATE_PAIRING.hostState).toContain('Delhi');
    expect(INITIAL_STATE_PAIRING.pairedState).toBe('Sikkim');
    expect(INITIAL_STATE_PAIRING.pairedCapital).toBe('Gangtok');
    expect(INITIAL_STATE_PAIRING.officialLanguages).toContain('Nepali');
    expect(INITIAL_STATE_PAIRING.partnerSchoolName).toContain('Tadong');
  });
});
