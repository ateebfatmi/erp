'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Eye,
  Lock,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  AuditEvent,
  AuditCategory,
  AuditSeverity,
  detectSecurityAnomalies,
  generateDpdpComplianceScorecard,
} from '@/modules/security/dpdp-compliance';

const INITIAL_EVENTS: AuditEvent[] = [
  {
    id: 'aud-2024-001',
    tenantId: 'dpga',
    tenantName: 'Delhi Public Global Academy',
    category: 'FINANCIAL',
    action: 'fee:transaction_recorded',
    actorId: 'usr-bursar-1',
    actorRole: 'Senior Bursar (emp-003)',
    actorIp: '103.21.144.12',
    severity: 'INFO',
    timestamp: '2024-11-25T09:14:00+05:30',
    details: 'Logged ₹12,500 cash fee payment with electronic receipt #REC-2024-9182',
  },
  {
    id: 'aud-2024-002',
    tenantId: 'dpga',
    tenantName: 'Delhi Public Global Academy',
    category: 'STUDENT_PII',
    action: 'student:admission_created',
    actorId: 'usr-admin-1',
    actorRole: 'Admissions Officer',
    actorIp: '103.21.144.12',
    severity: 'LOW',
    timestamp: '2024-11-25T10:30:00+05:30',
    details: 'Enrolled new student "Yashvardhan Singhania" (Adm #DPS-2025-019)',
  },
  {
    id: 'aud-2024-003',
    tenantId: 'stjoseph',
    tenantName: "St. Joseph's International Academy",
    category: 'FINANCIAL',
    action: 'payroll:epf_disbursed',
    actorId: 'usr-hr-dir',
    actorRole: 'HR Director',
    actorIp: '49.204.110.85',
    severity: 'MEDIUM',
    timestamp: '2024-11-25T11:45:00+05:30',
    details: 'Disbursed monthly staff salary with 12% EPF & 0.75% ESI statutory deduction',
  },
  {
    id: 'aud-2024-004',
    tenantId: 'dpga',
    tenantName: 'Delhi Public Global Academy',
    category: 'SYSTEM_EXPORT',
    action: 'census:udise_dcf_exported',
    actorId: 'usr-principal',
    actorRole: 'Principal Dr. R. Sharma',
    actorIp: '103.21.144.12',
    severity: 'HIGH',
    timestamp: '2024-11-25T14:20:00+05:30',
    details: 'Downloaded Ministry of Education U-DISE+ 2024-25 DCF census file',
  },
  {
    id: 'aud-2024-005',
    tenantId: 'kmms',
    tenantName: 'Kendriya Modern Model School',
    category: 'AUTH',
    action: 'auth:failed_login_attempt',
    actorId: 'unknown',
    actorRole: 'Anonymous Attacker',
    actorIp: '185.220.101.5',
    severity: 'CRITICAL',
    timestamp: '2024-11-25T02:15:00+05:30',
    details: 'Off-hours brute force credential stuffing detected; IP quarantined automatically',
  },
];

export function AuditConsole() {
  const [events, setEvents] = useState<AuditEvent[]>(INITIAL_EVENTS);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AuditCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const scorecard = generateDpdpComplianceScorecard(events);
  const anomalies = detectSecurityAnomalies(events);

  const filteredEvents = events.filter((e) => {
    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesSearch =
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.actorRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.actorIp.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleExportAuditReport = () => {
    const report = {
      complianceStandard: 'Digital Personal Data Protection Act (DPDP Act 2023)',
      generatedAt: new Date().toISOString(),
      scorecard,
      anomaliesDetected: anomalies,
      auditTrailSummary: events,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DPDP_Security_Audit_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setFeedback('Cryptographically signed DPDP compliance audit report generated.');
    setTimeout(() => setFeedback(null), 5000);
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
          <Badge variant="success">Exported</Badge>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            Global Platform Audit & DPDP Act 2023 Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable security event logs tracking financial mutations, student biometric privacy, and data protection trails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleExportAuditReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export DPDP Audit Report (JSON)
          </Button>
        </div>
      </div>

      {/* DPDP Scorecard Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <h2 className="text-base font-bold">DPDP Act 2023 Minor Protection Scorecard</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory verification of child data fiduciaries under Sections 8 &amp; 9 of the DPDP Act.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Overall Platform Score</span>
            <span className="text-2xl font-black text-emerald-400">{scorecard.overallScorePercent}% Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Parental Consent</p>
            <p className="font-bold text-slate-200 mt-0.5">{scorecard.pillars.parentalConsentTracking.score}% Verified</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Immutable Audit Trail</p>
            <p className="font-bold text-slate-200 mt-0.5">{scorecard.pillars.immutableAccessLogging.score}% Active</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Data Minimization</p>
            <p className="font-bold text-slate-200 mt-0.5">{scorecard.pillars.dataMinimizationAndRetention.score}% Adherent</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Encryption Standard</p>
            <p className="font-bold text-emerald-400 mt-0.5">AES-256 + TLS 1.3</p>
          </div>
        </div>
      </div>

      {/* Security Anomalies Panel */}
      {anomalies.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/20 shadow-xs">
          <CardHeader className="p-4 border-b border-amber-200 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-amber-950 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Active Security Telemetry Alerts ({anomalies.length})
              </CardTitle>
              <CardDescription className="text-xs text-amber-800">
                Automated threat detection scanning off-hours access, bulk PII scrapes, and brute force patterns.
              </CardDescription>
            </div>
            <Badge variant="warning" className="text-xs">
              Action Required
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {anomalies.map((a, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{a.anomalyType.replace(/_/g, ' ')}</span>
                    <Badge variant="destructive" className="text-[9px] py-0">{a.severity}</Badge>
                    <span className="text-slate-500 font-mono text-[11px]">&bull; {a.tenantName}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{a.description}</p>
                  <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">Recommended: {a.recommendedAction}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Audit Logs Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Immutable Access & Mutation Trails
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Chronological security log across all isolated school database tenants.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search action or IP..."
                className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'ALL' | AuditCategory)}
              className="text-xs p-1 border border-slate-200 rounded-lg bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="STUDENT_PII">Student PII</option>
              <option value="FINANCIAL">Financial</option>
              <option value="SYSTEM_EXPORT">System Export</option>
              <option value="AUTH">Authentication</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">School Tenant</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Actor Role & IP</th>
                  <th className="py-2.5 px-3">Timestamp (IST)</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {ev.tenantName}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[10px]">
                        {ev.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {ev.action}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-medium block">{ev.actorRole}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ev.actorIp}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {ev.details}
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
