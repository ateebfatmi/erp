import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, CreditCard, Sparkles, ShieldAlert, ArrowUpRight, Plus, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const MOCK_TENANTS_LIST = [
  {
    id: 't-dpga',
    name: 'Delhi Public Global Academy',
    slug: 'dpga',
    affiliation: 'CBSE',
    plan: 'Growth Plan',
    students: 2150,
    campuses: 2,
    status: 'active',
    arr: 149999,
  },
  {
    id: 't-sjs',
    name: "St. Joseph's International Academy",
    slug: 'stjoseph',
    affiliation: 'ICSE',
    plan: 'Enterprise Trust Tier',
    students: 4800,
    campuses: 4,
    status: 'active',
    arr: 299999,
  },
  {
    id: 't-kvs',
    name: 'Kendriya Modern Model School',
    slug: 'kmms',
    affiliation: 'State Board',
    plan: 'Starter Plan',
    students: 650,
    campuses: 1,
    status: 'trial',
    arr: 49999,
  },
];

export default function PlatformDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Platform Super Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global tenant provisioning, SaaS subscription revenue, database health, and quota management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/onboarding">
            <Button size="sm" className="gap-1.5 bg-blue-600">
              <Plus className="h-4 w-4" /> Provision New School
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Partner Schools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">48 Schools</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">42 Active &bull; 6 Onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Active Students Managed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">84,520</div>
            <p className="text-[11px] text-slate-500 mt-1">Across 78 Campuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Annual Recurring Revenue (ARR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹72,40,000</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">+24% YoY Growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Database Cluster SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">99.98%</div>
            <p className="text-[11px] text-slate-500 mt-1">Supabase PostgreSQL</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Directory */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Institutional Tenants & Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">School Name</th>
                  <th className="py-2.5 px-3">Subdomain</th>
                  <th className="py-2.5 px-3">Affiliation</th>
                  <th className="py-2.5 px-3">Subscription Tier</th>
                  <th className="py-2.5 px-3">Enrolled Students</th>
                  <th className="py-2.5 px-3">Annual Value</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_TENANTS_LIST.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {t.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-blue-600">
                      {t.slug}.platformdomain.com
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline">{t.affiliation}</Badge>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {t.plan}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {t.students} students ({t.campuses} campuses)
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatCurrency(t.arr)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={t.status === 'active' ? 'success' : 'warning'}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
