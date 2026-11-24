'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  CheckCircle2,
  Globe,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  ExternalLink,
  Power,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import {
  TenantAccount,
  SaaSPlanTier,
  SAAS_PLANS,
  validateSubdomainSlug,
  evaluatePlanQuota,
  calculatePlatformMetrics,
} from '@/modules/platform/tenant-management';

const INITIAL_TENANTS: TenantAccount[] = [
  {
    id: 't-dpga',
    name: 'Delhi Public Global Academy',
    subdomain: 'dpga',
    affiliation: 'CBSE',
    planTier: 'GROWTH',
    status: 'ACTIVE',
    currentStudentCount: 2150,
    currentCampusCount: 2,
    storageUsedGB: 45,
    city: 'New Delhi',
    state: 'Delhi',
    primaryContact: '+91 11 4982 0000',
    renewalDate: '2025-04-01',
  },
  {
    id: 't-sjs',
    name: "St. Joseph's International Academy",
    subdomain: 'stjoseph',
    affiliation: 'ICSE',
    planTier: 'ENTERPRISE',
    status: 'ACTIVE',
    currentStudentCount: 4800,
    currentCampusCount: 4,
    storageUsedGB: 180,
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryContact: '+91 80 2555 1234',
    renewalDate: '2025-06-15',
  },
  {
    id: 't-kmms',
    name: 'Kendriya Modern Model School',
    subdomain: 'kmms',
    affiliation: 'CBSE',
    planTier: 'GROWTH',
    status: 'ACTIVE',
    currentStudentCount: 1850,
    currentCampusCount: 2,
    storageUsedGB: 38,
    city: 'Jaipur',
    state: 'Rajasthan',
    primaryContact: '+91 141 2780 999',
    renewalDate: '2025-08-01',
  },
  {
    id: 't-heritage',
    name: 'Heritage Valley Senior Secondary School',
    subdomain: 'heritagevalley',
    affiliation: 'CBSE',
    planTier: 'STARTER',
    status: 'TRIAL',
    currentStudentCount: 420,
    currentCampusCount: 1,
    storageUsedGB: 12,
    city: 'Dehradun',
    state: 'Uttarakhand',
    primaryContact: '+91 135 2640 111',
    renewalDate: '2024-12-31',
  },
];

export function TenantManager() {
  const [tenants, setTenants] = useState<TenantAccount[]>(INITIAL_TENANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | SaaSPlanTier>('ALL');
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Tenant Form state
  const [newName, setNewName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newAffiliation, setNewAffiliation] = useState<'CBSE' | 'ICSE' | 'STATE_BOARD' | 'IB'>('CBSE');
  const [newPlan, setNewPlan] = useState<SaaSPlanTier>('GROWTH');
  const [newCity, setNewCity] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const metrics = calculatePlatformMetrics(tenants);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'ALL' || t.planTier === planFilter;
    return matchesSearch && matchesPlan;
  });

  const handleToggleStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const newStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        return { ...t, status: newStatus };
      })
    );
    setFeedback('Tenant operational status updated.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const slugCheck = validateSubdomainSlug(newSubdomain);
    if (!slugCheck.valid) {
      setFormError(slugCheck.error || 'Invalid subdomain');
      return;
    }

    if (tenants.some((t) => t.subdomain.toLowerCase() === newSubdomain.toLowerCase())) {
      setFormError(`Subdomain "${newSubdomain}" is already claimed by another institution.`);
      return;
    }

    const newTenant: TenantAccount = {
      id: `t-${newSubdomain}`,
      name: newName,
      subdomain: newSubdomain.toLowerCase(),
      affiliation: newAffiliation,
      planTier: newPlan,
      status: 'ACTIVE',
      currentStudentCount: 50,
      currentCampusCount: 1,
      storageUsedGB: 1,
      city: newCity || 'New Delhi',
      state: 'Delhi',
      primaryContact: '+91 98000 00000',
      renewalDate: '2025-11-25',
    };

    setTenants([newTenant, ...tenants]);
    setFeedback(`School "${newName}" provisioned successfully at https://${newSubdomain}.vidyaos.in!`);
    setShowProvisionModal(false);
    setNewName('');
    setNewSubdomain('');
    setNewCity('');
    setFormError(null);

    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Executed</Badge>
        </div>
      )}

      {/* Super Admin SaaS Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Annual Run Rate (ARR)</p>
              <p className="text-xl font-bold text-slate-900">₹{metrics.totalARR.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-500">MRR: ₹{metrics.totalMRR.toLocaleString('en-IN')}/mo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Institutional Tenants</p>
              <p className="text-xl font-bold text-slate-900">{metrics.totalTenants} Schools</p>
              <p className="text-[10px] text-emerald-600 font-semibold">{metrics.activeTenantsCount} Active Contracts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Managed Student Seats</p>
              <p className="text-xl font-bold text-slate-900">{metrics.totalManagedStudents.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-500">Across {metrics.totalActiveCampuses} campuses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Platform Availability</p>
              <p className="text-xl font-bold text-emerald-700">99.99%</p>
              <p className="text-[10px] text-slate-500">SOC-2 & DPDP Compliant</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tenant Management Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              SaaS Multi-Tenant School Directory
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Manage school database workspaces, subscription tiers, and isolated subdomains.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowProvisionModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Onboard School Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by school name, city, or subdomain..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as 'ALL' | SaaSPlanTier)}
                className="text-xs p-1.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="ALL">All SaaS Tiers</option>
                <option value="STARTER">Starter Tier</option>
                <option value="GROWTH">Growth Plan</option>
                <option value="ENTERPRISE">Enterprise Trust</option>
              </select>
            </div>
          </div>

          {/* Provision Modal */}
          {showProvisionModal && (
            <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs animate-in slide-in-from-top-2 duration-200">
              <CardHeader className="p-4 border-b border-indigo-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    Provision New Institutional Tenant
                  </CardTitle>
                  <CardDescription className="text-xs text-indigo-700">
                    Provisions automated PostgreSQL database tenant isolation schema and DNS subdomain route.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowProvisionModal(false)}>
                  Cancel
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleProvisionTenant} className="space-y-4">
                  {formError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Official School Name *</label>
                      <Input
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Cambridge Court World School"
                        className="text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Subdomain Slug *</label>
                      <div className="flex items-center">
                        <Input
                          required
                          value={newSubdomain}
                          onChange={(e) => setNewSubdomain(e.target.value)}
                          placeholder="e.g. cambridgecourt"
                          className="text-xs font-mono bg-white rounded-r-none"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 text-slate-500 text-xs px-2.5 py-1.5 rounded-r-md font-mono">
                          .vidyaos.in
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Education Board</label>
                      <select
                        value={newAffiliation}
                        onChange={(e) => setNewAffiliation(e.target.value as any)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / ISC</option>
                        <option value="STATE_BOARD">State Board</option>
                        <option value="IB">International Baccalaureate (IB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">SaaS Plan Tier</label>
                      <select
                        value={newPlan}
                        onChange={(e) => setNewPlan(e.target.value as SaaSPlanTier)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="GROWTH">Growth Plan (₹1,49,999/yr - 2,500 Seats)</option>
                        <option value="ENTERPRISE">Enterprise Trust (₹2,99,999/yr - 10,000 Seats)</option>
                        <option value="STARTER">Starter Tier (₹49,999/yr - 500 Seats)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">City Location</label>
                      <Input
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="e.g. Jaipur"
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" className="text-xs h-8" onClick={() => setShowProvisionModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Provision School Environment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Tenants Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">School Name & Domain</th>
                  <th className="py-2.5 px-3">Board</th>
                  <th className="py-2.5 px-3">SaaS Subscription</th>
                  <th className="py-2.5 px-3">Student Seat Quota</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTenants.map((t) => {
                  const quota = evaluatePlanQuota(t);
                  const plan = SAAS_PLANS[t.planTier];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{t.name}</span>
                        <a
                          href={`https://${t.subdomain}.vidyaos.in`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          https://{t.subdomain}.vidyaos.in
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>

                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {t.affiliation}
                        </Badge>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{plan.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ₹{plan.annualFeeINR.toLocaleString('en-IN')}/yr
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-semibold text-slate-800">{t.currentStudentCount}</span>
                            <span className="text-slate-400">/ {plan.maxStudents}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                quota.studentUtilizationPercent > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, quota.studentUtilizationPercent)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <Badge
                          variant={t.status === 'ACTIVE' ? 'success' : t.status === 'TRIAL' ? 'default' : 'destructive'}
                          className="text-[10px]"
                        >
                          {t.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-7 px-2"
                            onClick={() => handleToggleStatus(t.id)}
                          >
                            <Power className="h-3 w-3 mr-1 text-slate-500" />
                            {t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </Button>
                          <a href="/portal/admin" target="_blank" rel="noreferrer">
                            <Button size="sm" className="text-[11px] h-7 px-2 bg-slate-900 text-white hover:bg-slate-800">
                              Launch Portal
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
