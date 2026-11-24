/**
 * VidyaOS Multi-Tenant SaaS Lifecycle & Governance Engine
 * Manages school provisioning, DNS subdomain validation, and SaaS tier quotas.
 */

export type SaaSPlanTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE';
export type TenantAccountStatus = 'ACTIVE' | 'TRIAL' | 'GRACE_PERIOD' | 'SUSPENDED';

export interface SaaSPlanConfig {
  slug: SaaSPlanTier;
  name: string;
  annualFeeINR: number;
  maxStudents: number;
  maxCampuses: number;
  storageQuotaGB: number;
  features: string[];
}

export interface TenantAccount {
  id: string;
  name: string;
  subdomain: string;
  affiliation: 'CBSE' | 'ICSE' | 'STATE_BOARD' | 'IB';
  planTier: SaaSPlanTier;
  status: TenantAccountStatus;
  currentStudentCount: number;
  currentCampusCount: number;
  storageUsedGB: number;
  city: string;
  state: string;
  primaryContact: string;
  renewalDate: string;
}

export const SAAS_PLANS: Record<SaaSPlanTier, SaaSPlanConfig> = {
  STARTER: {
    slug: 'STARTER',
    name: 'Starter Tier',
    annualFeeINR: 49999,
    maxStudents: 500,
    maxCampuses: 1,
    storageQuotaGB: 25,
    features: ['Student Information System', 'Daily Attendance Tracking', 'Fee Management', 'Offline Receipts'],
  },
  GROWTH: {
    slug: 'GROWTH',
    name: 'Growth Plan',
    annualFeeINR: 149999,
    maxStudents: 2500,
    maxCampuses: 3,
    storageQuotaGB: 100,
    features: ['Razorpay Payment Gateway', 'CBSE 9-Point Examination Studio', 'Staff Indian Payroll & EPF', 'WhatsApp Cloud API Notices'],
  },
  ENTERPRISE: {
    slug: 'ENTERPRISE',
    name: 'Enterprise Trust Tier',
    annualFeeINR: 299999,
    maxStudents: 10000,
    maxCampuses: 10,
    storageQuotaGB: 500,
    features: ['Multi-Campus Unified Database', 'White-Label Custom Domain', 'Bus Fleet GPS Integration', 'Dedicated 24/7 SLA'],
  },
};

export const RESERVED_SUBDOMAINS = new Set([
  'api', 'admin', 'app', 'auth', 'billing', 'cdn', 'dashboard',
  'demo', 'dev', 'docs', 'health', 'mail', 'mcp', 'platform',
  'portal', 'root', 'staging', 'static', 'status', 'support',
  'test', 'vidya', 'vidyaos', 'vpn', 'www',
]);

/**
 * Validates requested subdomain slug according to RFC 1123 DNS standards
 */
export function validateSubdomainSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Subdomain slug is required' };
  }

  const normalized = slug.trim().toLowerCase();

  if (normalized.length < 3) {
    return { valid: false, error: 'Subdomain must be at least 3 characters long' };
  }

  if (normalized.length > 30) {
    return { valid: false, error: 'Subdomain cannot exceed 30 characters' };
  }

  // Must start and end with alphanumeric, can contain hyphens
  const dnsRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!dnsRegex.test(normalized)) {
    return { valid: false, error: 'Subdomain can only contain lowercase letters, numbers, and hyphens (cannot start or end with hyphen)' };
  }

  if (RESERVED_SUBDOMAINS.has(normalized)) {
    return { valid: false, error: `"${normalized}" is a reserved system keyword and cannot be used as a tenant subdomain` };
  }

  return { valid: true };
}

/**
 * Evaluates tenant student and storage capacity against SaaS plan quotas
 */
export function evaluatePlanQuota(tenant: TenantAccount): {
  isWithinStudentLimit: boolean;
  studentUtilizationPercent: number;
  isWithinCampusLimit: boolean;
  storageUtilizationPercent: number;
  requiresUpgradeWarning: boolean;
} {
  const plan = SAAS_PLANS[tenant.planTier];
  const studentUtilization = Math.round((tenant.currentStudentCount / plan.maxStudents) * 100);
  const storageUtilization = Math.round((tenant.storageUsedGB / plan.storageQuotaGB) * 100);

  return {
    isWithinStudentLimit: tenant.currentStudentCount <= plan.maxStudents,
    studentUtilizationPercent: studentUtilization,
    isWithinCampusLimit: tenant.currentCampusCount <= plan.maxCampuses,
    storageUtilizationPercent: storageUtilization,
    requiresUpgradeWarning: studentUtilization >= 90 || storageUtilization >= 90,
  };
}

/**
 * Calculates aggregate SaaS business metrics across all onboarded school tenants
 */
export function calculatePlatformMetrics(tenants: TenantAccount[]) {
  const activeTenants = tenants.filter((t) => t.status === 'ACTIVE' || t.status === 'TRIAL');
  
  const totalARR = activeTenants.reduce((sum, t) => sum + SAAS_PLANS[t.planTier].annualFeeINR, 0);
  const totalMRR = Math.round(totalARR / 12);
  const totalManagedStudents = tenants.reduce((sum, t) => sum + t.currentStudentCount, 0);
  const totalActiveCampuses = tenants.reduce((sum, t) => sum + t.currentCampusCount, 0);

  return {
    totalTenants: tenants.length,
    activeTenantsCount: activeTenants.length,
    totalARR,
    totalMRR,
    totalManagedStudents,
    totalActiveCampuses,
  };
}
