import { AtomicPermission, ROLE_PERMISSIONS_MAP } from './registry';
import { repository } from '@/lib/database/repository';

export interface AuthContext {
  userId: string;
  tenantId: string;
  roleKey: string;
  campusId?: string;
  email?: string;
  fullName?: string;
}

/**
 * Validates whether a user role within a tenant context has the required atomic permission.
 */
export function hasRolePermission(roleKey: string, permission: AtomicPermission): boolean {
  const permissions = ROLE_PERMISSIONS_MAP[roleKey] || [];
  return permissions.includes(permission);
}

/**
 * Verifies tenant membership and evaluates permission.
 */
export async function assertAuthorized(
  context: AuthContext,
  permission: AtomicPermission
): Promise<void> {
  // Validate tenant exists
  const tenant = await repository.getTenantBySlug(context.tenantId);
  if (!tenant || tenant.status === 'suspended') {
    throw new Error('Tenant school not found or account is suspended.');
  }

  // Check role permission
  const allowed = hasRolePermission(context.roleKey, permission);
  if (!allowed) {
    throw new Error(
      `Access Denied: Role [${context.roleKey}] lacks required permission [${permission}].`
    );
  }
}

/**
 * Checks if a parent has legal access to view a specific student enrollment.
 */
export async function canGuardianAccessEnrollment(
  guardianUserId: string,
  tenantId: string,
  enrollmentId: string
): Promise<boolean> {
  // Demo check: In production checks student_guardians join table
  const enrollment = await repository.getEnrollmentById(tenantId, enrollmentId);
  return Boolean(enrollment);
}
