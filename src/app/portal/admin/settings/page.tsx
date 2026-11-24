import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default async function SchoolSettingsPage() {
  const auth = await getVerifiedAuthContext();
  const tenant = await repository.getTenantBySlug(auth.tenantId);
  const campuses = await repository.getCampuses(auth.tenantId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            School Organization & Multi-Campus Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure CBSE/ICSE board affiliations, branch campuses, academic sessions, and institutional branding.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Tenant ID: {tenant?.id}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Institutional Profile */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-sm font-semibold">
              Institution Identity & Affiliation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Official School Name
              </label>
              <Input defaultValue={tenant?.name} className="text-xs font-semibold" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Board Affiliation
                </label>
                <Input defaultValue={tenant?.affiliation} className="text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Affiliation Number
                </label>
                <Input defaultValue={tenant?.affiliation_number || ''} className="text-xs font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Contact Email
                </label>
                <Input defaultValue={tenant?.primary_email} className="text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Helpline
                </label>
                <Input defaultValue={tenant?.primary_phone} className="text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Headquarters Address
              </label>
              <Input defaultValue={`${tenant?.address}, ${tenant?.city}, ${tenant?.state} - ${tenant?.pincode}`} className="text-xs" />
            </div>

            <div className="pt-2">
              <Button size="sm" className="gap-1.5 bg-blue-600">
                <CheckCircle2 className="h-4 w-4" /> Save Institutional Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Campus Hierarchy */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Registered Physical Campuses ({campuses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {campuses.map((c) => (
              <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{c.name}</span>
                  <Badge variant={c.is_main ? 'success' : 'outline'} className="font-mono text-[10px]">
                    {c.code} {c.is_main ? '(Main Branch)' : ''}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">{c.address}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Phone: {c.phone} &bull; Email: {c.email}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
