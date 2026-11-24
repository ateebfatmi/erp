import { describe, it, expect } from 'vitest';
import {
  validateSubdomainSlug,
  evaluatePlanQuota,
  calculatePlatformMetrics,
  TenantAccount,
} from '../tenant-management';

describe('VidyaOS SaaS Tenant Management Engine', () => {
  it('validates compliant school subdomain slugs', () => {
    expect(validateSubdomainSlug('dpga').valid).toBe(true);
    expect(validateSubdomainSlug('st-josephs-academy').valid).toBe(true);
    expect(validateSubdomainSlug('kvs-delhi-01').valid).toBe(true);
  });

  it('rejects invalid DNS slugs and reserved keywords', () => {
    // Too short
    expect(validateSubdomainSlug('ab').valid).toBe(false);

    // Reserved keyword
    const reserved = validateSubdomainSlug('admin');
    expect(reserved.valid).toBe(false);
    expect(reserved.error).toContain('reserved system keyword');

    // Leading or trailing hyphens
    expect(validateSubdomainSlug('-myschool').valid).toBe(false);
    expect(validateSubdomainSlug('myschool-').valid).toBe(false);

    // Invalid characters (spaces, underscores)
    expect(validateSubdomainSlug('my_school').valid).toBe(false);
    expect(validateSubdomainSlug('my school').valid).toBe(false);
  });

  it('evaluates student seat utilization and triggers warnings near quota', () => {
    const tenant: TenantAccount = {
      id: 't-1',
      name: 'Delhi Public Global Academy',
      subdomain: 'dpga',
      affiliation: 'CBSE',
      planTier: 'GROWTH', // max 2500 students
      status: 'ACTIVE',
      currentStudentCount: 2350, // 94% utilization -> warning
      currentCampusCount: 2,
      storageUsedGB: 45,
      city: 'New Delhi',
      state: 'Delhi',
      primaryContact: '+91 98110 00000',
      renewalDate: '2025-04-01',
    };

    const quota = evaluatePlanQuota(tenant);
    expect(quota.isWithinStudentLimit).toBe(true);
    expect(quota.studentUtilizationPercent).toBe(94);
    expect(quota.requiresUpgradeWarning).toBe(true);
  });

  it('computes platform-wide aggregated ARR, MRR, and student seats', () => {
    const mockTenants: TenantAccount[] = [
      {
        id: 't-1',
        name: 'School One',
        subdomain: 's1',
        affiliation: 'CBSE',
        planTier: 'GROWTH', // 149,999
        status: 'ACTIVE',
        currentStudentCount: 2000,
        currentCampusCount: 2,
        storageUsedGB: 40,
        city: 'Delhi',
        state: 'Delhi',
        primaryContact: '123',
        renewalDate: '2025-01-01',
      },
      {
        id: 't-2',
        name: 'School Two',
        subdomain: 's2',
        affiliation: 'ICSE',
        planTier: 'ENTERPRISE', // 299,999
        status: 'ACTIVE',
        currentStudentCount: 4500,
        currentCampusCount: 4,
        storageUsedGB: 120,
        city: 'Mumbai',
        state: 'Maharashtra',
        primaryContact: '456',
        renewalDate: '2025-02-01',
      },
    ];

    const metrics = calculatePlatformMetrics(mockTenants);
    expect(metrics.totalTenants).toBe(2);
    expect(metrics.activeTenantsCount).toBe(2);
    expect(metrics.totalARR).toBe(149999 + 299999);
    expect(metrics.totalManagedStudents).toBe(6500);
    expect(metrics.totalActiveCampuses).toBe(6);
  });
});
