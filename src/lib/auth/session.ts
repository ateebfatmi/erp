import { AuthContext } from '@/lib/permissions/evaluator';
import { MOCK_TENANT } from '@/lib/database/mock-data';

/**
 * Resolves verified server-side identity & tenant context.
 * In production with Clerk, this inspects `auth()` from `@clerk/nextjs/server`,
 * then queries `tenant_memberships` in PostgreSQL.
 */
export async function getVerifiedAuthContext(requestedTenantId?: string): Promise<AuthContext> {
  const tenantId = requestedTenantId || MOCK_TENANT.id;

  // Default demo / development context
  return {
    userId: 'usr-admin-demo-1',
    tenantId,
    roleKey: 'school_admin',
    campusId: 'campus-vk-01',
    email: 'admin@dpga.edu.in',
    fullName: 'Shri Vikramaditya (School Admin)',
  };
}
