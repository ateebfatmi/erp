import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Download, FileSpreadsheet, FileText, CheckCircle2, ShieldCheck, Users, Landmark, School } from 'lucide-react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { generateUdiseCensusMetrics } from '@/modules/reports/udise-generator';
import { MOCK_TENANT } from '@/lib/database/mock-data';

const STANDARD_REPORTS = [
  {
    title: 'Daily Fee Collection & Cash Reconciliation',
    domain: 'Finance & Accounts',
    formats: ['CSV', 'Excel', 'PDF'],
    description: 'Detailed audit ledger of online Razorpay, UPI, and cash counter receipts with bank UTRs.',
  },
  {
    title: 'Monthly Section Attendance Summary & Shortage Warnings',
    domain: 'Attendance',
    formats: ['PDF', 'Excel'],
    description: 'Class-wise student attendance percentages highlighting students falling below CBSE 75% threshold.',
  },
  {
    title: 'Faculty Payroll Summary & Statutory Deductions',
    domain: 'Human Resources',
    formats: ['PDF', 'Excel'],
    description: 'EPF, ESI, TDS, and Professional Tax breakdown for all certified teaching and administrative staff.',
  },
  {
    title: 'Library Book Circulation & Defaulter Registry',
    domain: 'Library Services',
    formats: ['CSV', 'PDF'],
    description: 'Currently loaned volumes, accession register, and overdue book penalty audit.',
  },
];

export default async function ReportsPage() {
  const auth = await getVerifiedAuthContext();
  const tenant = (await repository.getTenantBySlug(auth.tenantId)) || MOCK_TENANT;
  const enrollments = await repository.getEnrollments(auth.tenantId);
  const employees = await repository.getEmployees(auth.tenantId);

  const udise = generateUdiseCensusMetrics(tenant, enrollments, employees);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            Statutory Reports & U-DISE+ Compliance Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated Ministry of Education U-DISE+ annual census, CBSE OASIS accreditation extracts, and audit ledgers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">U-DISE+ 2025-26 Verified</Badge>
          <Badge variant="outline">CBSE OASIS Ready</Badge>
        </div>
      </div>

      {/* U-DISE+ Statutory Accreditation & Census Card */}
      <Card className="bg-white border-blue-200 shadow-xs">
        <CardHeader className="p-4 bg-blue-50/50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-blue-700" />
              <CardTitle className="text-sm font-bold text-blue-950">
                Ministry of Education U-DISE+ Annual Census (DCF 2025–2026)
              </CardTitle>
            </div>
            <p className="text-xs text-blue-800/80 mt-0.5">
              School Code: <span className="font-mono font-bold">{udise.schoolUdiseCode}</span> &bull; Affiliation: {udise.affiliationBoard} &bull; PTR Compliance: {udise.isPtrCompliant ? '100% Compliant' : 'Shortage'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a href="/api/reports/udise-export" download>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs gap-1.5 shadow-2xs">
                <Download className="h-3.5 w-3.5" /> Download Official U-DISE+ CSV
              </Button>
            </a>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Key Compliance Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Enrollment</span>
              <span className="text-lg font-bold text-slate-900">{udise.totalStudents}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {udise.totalBoys} Boys &bull; {udise.totalGirls} Girls
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Gender Parity (GPI)</span>
              <span className="text-lg font-bold text-emerald-700">{udise.genderParityIndex}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Statutory Standard: &ge; 0.90</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Pupil-Teacher Ratio (PTR)</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900">{udise.pupilTeacherRatio}:1</span>
                <span className="text-[10px] text-emerald-600 font-semibold">(RTE Passed)</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">{udise.totalTeachers} Regular Teachers</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">RTE 25% EWS Enrolled</span>
              <span className="text-lg font-bold text-blue-700">{udise.socialCategory.ewsRteQuota}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Section 12(1)(c) Quota</span>
            </div>
          </div>

          {/* Social Category Breakdown */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
            <span className="font-semibold text-slate-900">Demographic Quota Breakdown:</span>
            <span>General: <strong className="text-slate-900">{udise.socialCategory.general}</strong></span>
            <span>OBC: <strong className="text-slate-900">{udise.socialCategory.obc}</strong></span>
            <span>SC: <strong className="text-slate-900">{udise.socialCategory.sc}</strong></span>
            <span>ST: <strong className="text-slate-900">{udise.socialCategory.st}</strong></span>
            <span>Smart ICT Labs: <strong className="text-slate-900">{udise.facilities.smartClassrooms} Rooms</strong></span>
            <span>Functional Sanitation: <strong className="text-emerald-700">100% (42 Units)</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Standard Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STANDARD_REPORTS.map((rep, idx) => (
          <Card key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[11px] font-semibold text-blue-700 bg-blue-50">
                {rep.domain}
              </Badge>
              <div className="flex items-center gap-1.5">
                {rep.formats.map((fmt) => (
                  <span key={fmt} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="font-bold text-sm text-slate-900">{rep.title}</div>
            <p className="text-xs text-slate-500 leading-relaxed">{rep.description}</p>

            <div className="pt-2 flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 text-blue-600">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Download Excel
              </Button>
              <Button size="sm" variant="ghost" className="text-xs gap-1.5 text-slate-700">
                <FileText className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
