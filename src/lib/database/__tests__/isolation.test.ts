import { describe, it, expect } from 'vitest';
import { repository } from '@/lib/database/repository';

describe('Multi-Tenant Data Isolation Test Suite', () => {
  const tenantA = 'tenant-dpga-delhi';
  const tenantB = 'tenant-other-school-b';

  it('prevents tenant B from accessing tenant A student enrollments', async () => {
    const enrollmentsA = await repository.getEnrollments(tenantA);
    expect(enrollmentsA.length).toBeGreaterThan(0);

    const enrollmentsB = await repository.getEnrollments(tenantB);
    expect(enrollmentsB.length).toBe(0);
  });

  it('prevents tenant B from accessing tenant A fee transactions', async () => {
    const transactionsA = await repository.getFeeTransactions(tenantA);
    expect(transactionsA.length).toBeGreaterThan(0);

    const transactionsB = await repository.getFeeTransactions(tenantB);
    expect(transactionsB.length).toBe(0);
  });

  it('prevents tenant B from accessing tenant A employees', async () => {
    const employeesA = await repository.getEmployees(tenantA);
    expect(employeesA.length).toBeGreaterThan(0);

    const employeesB = await repository.getEmployees(tenantB);
    expect(employeesB.length).toBe(0);
  });
});
