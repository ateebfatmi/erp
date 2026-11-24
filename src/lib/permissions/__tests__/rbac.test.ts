import { describe, it, expect } from 'vitest';
import { hasRolePermission, assertAuthorized } from '../evaluator';

describe('RBAC & Multi-Tenancy Permission Evaluator', () => {
  it('allows school_admin to manage students, fees, and attendance', () => {
    expect(hasRolePermission('school_admin', 'students:create')).toBe(true);
    expect(hasRolePermission('school_admin', 'fees:collect')).toBe(true);
    expect(hasRolePermission('school_admin', 'attendance:mark')).toBe(true);
    expect(hasRolePermission('school_admin', 'payroll:process')).toBe(true);
  });

  it('restricts teacher role from collecting fees and running payroll', () => {
    expect(hasRolePermission('teacher', 'attendance:mark')).toBe(true);
    expect(hasRolePermission('teacher', 'homework:create')).toBe(true);
    expect(hasRolePermission('teacher', 'fees:collect')).toBe(false);
    expect(hasRolePermission('teacher', 'payroll:process')).toBe(false);
  });

  it('restricts parent role to read-only views of attendance and fees', () => {
    expect(hasRolePermission('parent', 'fees:view')).toBe(true);
    expect(hasRolePermission('parent', 'fees:collect')).toBe(false);
    expect(hasRolePermission('parent', 'students:create')).toBe(false);
  });

  it('throws authorization error when asserting unauthorized permission', async () => {
    const parentContext = {
      userId: 'usr-parent-1',
      tenantId: 'tenant-dpga-delhi',
      roleKey: 'parent',
    };

    await expect(
      assertAuthorized(parentContext, 'payroll:process')
    ).rejects.toThrow(/Access Denied/);
  });

  it('rejects access if tenant school does not exist', async () => {
    const invalidTenantContext = {
      userId: 'usr-admin-1',
      tenantId: 'non-existent-tenant-xyz',
      roleKey: 'school_admin',
    };

    await expect(
      assertAuthorized(invalidTenantContext, 'students:view')
    ).rejects.toThrow(/Tenant school not found/);
  });
});
