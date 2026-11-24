import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

const MOCK_AUDIT_LOGS = [
  { id: 'aud-1', tenant: 'Delhi Public Global Academy', action: 'fee:collected', actor: 'Chief Bursar (emp-003)', ip: '103.21.144.12', time: '10 mins ago' },
  { id: 'aud-2', tenant: 'Delhi Public Global Academy', action: 'student:admitted', actor: 'Admission Desk (usr-admin-1)', ip: '103.21.144.12', time: '45 mins ago' },
  { id: 'aud-3', tenant: "St. Joseph's International Academy", action: 'payroll:processed', actor: 'HR Director', ip: '49.204.110.85', time: '2 hours ago' },
  { id: 'aud-4', tenant: 'Kendriya Modern Model School', action: 'tenant:trial_activated', actor: 'Platform System', ip: '127.0.0.1', time: '5 hours ago' },
];

export default function PlatformAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            Global Platform Audit & Security Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable security event logs tracking financial mutations, administrative changes, and DPDP compliance actions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">Security Trails Across All Tenants</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">School Tenant</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Actor Identity</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{log.tenant}</td>
                    <td className="py-3 px-3 font-mono font-medium text-blue-600">{log.action}</td>
                    <td className="py-3 px-3 text-slate-700">{log.actor}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{log.ip}</td>
                    <td className="py-3 px-3 text-slate-500">{log.time}</td>
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
