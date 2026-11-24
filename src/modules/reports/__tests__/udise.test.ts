import { describe, it, expect } from 'vitest';
import {
  generateUdiseCensusMetrics,
  serializeUdiseToCsv,
} from '../udise-generator';
import { MOCK_TENANT, MOCK_ENROLLMENTS, MOCK_EMPLOYEES } from '@/lib/database/mock-data';

describe('Statutory U-DISE+ and CBSE Annual Census Engine', () => {
  it('aggregates live student demographic census and computes RTE PTR ratios', () => {
    const metrics = generateUdiseCensusMetrics(MOCK_TENANT, MOCK_ENROLLMENTS, MOCK_EMPLOYEES);

    expect(metrics.schoolUdiseCode).toBe('07010401201');
    expect(metrics.academicYear).toBe('2025-2026');
    expect(metrics.totalStudents).toBeGreaterThan(0);
    expect(metrics.genderParityIndex).toBeGreaterThan(0.5);

    // RTE Act PTR compliance check
    expect(metrics.isPtrCompliant).toBe(true);
    expect(metrics.pupilTeacherRatio).toBeLessThanOrEqual(35);

    // Demographics sum check
    expect(metrics.socialCategory.general).toBeGreaterThan(0);
    expect(metrics.socialCategory.obc).toBeGreaterThan(0);
    expect(metrics.socialCategory.ewsRteQuota).toBeGreaterThan(0);
  });

  it('serializes census parameters into Ministry of Education CSV format', () => {
    const metrics = generateUdiseCensusMetrics(MOCK_TENANT, MOCK_ENROLLMENTS, MOCK_EMPLOYEES);
    const csv = serializeUdiseToCsv(metrics);

    expect(csv).toContain('UDISE_PARAMETER');
    expect(csv).toContain('UDISE_SCHOOL_CODE');
    expect(csv).toContain('PUPIL_TEACHER_RATIO_PTR');
    expect(csv).toContain('RTE_25_PERCENT_EWS_ENROLLMENT');
    expect(csv).toContain('07010401201');
  });
});
