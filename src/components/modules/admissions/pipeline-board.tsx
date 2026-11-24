'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Download,
  GraduationCap,
  DollarSign,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import {
  AdmissionLead,
  calculateAdmissionsMetrics,
  transitionLeadStatus,
} from '@/modules/admissions/crm';
import { formatCurrency } from '@/lib/utils';

const INITIAL_LEADS: AdmissionLead[] = [
  {
    id: 'lead-01',
    studentName: 'Vihaan Malhotra',
    targetClass: 'Class 9',
    parentName: 'Mr. Sanjay Malhotra',
    parentPhone: '+91 98111 88990',
    parentEmail: 'sanjay.m@gmail.com',
    status: 'approved',
    applicationDate: '2026-11-20',
    entranceScore: 92,
    admissionFee: 54500,
    verificationNotes: 'Class 8 report card & TC verified by admission panel',
  },
  {
    id: 'lead-02',
    studentName: 'Saanvi Sharma',
    targetClass: 'Class 11 (Science)',
    parentName: 'Dr. Neeraj Sharma',
    parentPhone: '+91 98222 77889',
    parentEmail: 'dr.neeraj@apollo.com',
    status: 'verified',
    applicationDate: '2026-11-22',
    entranceScore: 96,
    admissionFee: 58500,
    verificationNotes: 'Olympiad Gold Medalist; entrance aptitude score 96/100',
  },
  {
    id: 'lead-03',
    studentName: 'Kabir Sengupta',
    targetClass: 'Class 6',
    parentName: 'Mrs. Ananya Sengupta',
    parentPhone: '+91 98333 66778',
    parentEmail: 'ananya.s@tcs.com',
    status: 'applied',
    applicationDate: '2026-11-23',
    entranceScore: 84,
    admissionFee: 49500,
  },
];

export function AdmissionsPipelineBoard() {
  const [leads, setLeads] = useState<AdmissionLead[]>(INITIAL_LEADS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const metrics = calculateAdmissionsMetrics(leads);

  const handleAdvanceStage = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          let nextStatus: AdmissionLead['status'] = l.status;
          if (l.status === 'applied') nextStatus = 'verified';
          else if (l.status === 'verified') nextStatus = 'approved';
          else if (l.status === 'approved') nextStatus = 'enrolled';

          const valid = transitionLeadStatus(l.status, nextStatus);
          if (valid.isValid) {
            setFeedback(`Applicant ${l.studentName} advanced to "${nextStatus.toUpperCase()}" stage.`);
            setTimeout(() => setFeedback(null), 3000);
            return { ...l, status: nextStatus };
          }
        }
        return l;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Funnel Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Applicants</span>
          <span className="text-xl font-bold text-slate-900">{metrics.totalLeads} Leads</span>
          <span className="text-[10px] text-slate-500 block">Session 2026–2027</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Documents Verified</span>
          <span className="text-xl font-bold text-blue-600">{metrics.verifiedCount} Applicants</span>
          <span className="text-[10px] text-blue-600 block">Entrance Evaluated</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Principal Approved</span>
          <span className="text-xl font-bold text-emerald-700">{metrics.approvedCount} Offers</span>
          <span className="text-[10px] text-emerald-600 block">Letters Issued</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pipeline Fee Revenue</span>
          <span className="text-xl font-bold text-indigo-700">{formatCurrency(metrics.projectedRevenue)}</span>
          <span className="text-[10px] text-slate-400 block">Projected Inflow</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Main Pipeline Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Applicant Conversion Funnel & Offer Issuance
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Review entrance assessment scores, verify credentials, and issue official admission offers
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Academic Session 2026–27
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Target Standard</th>
                  <th className="py-2.5 px-3">Parent Details</th>
                  <th className="py-2.5 px-3">Entrance Score</th>
                  <th className="py-2.5 px-3">Pipeline Status</th>
                  <th className="py-2.5 px-3">Offer Letter</th>
                  <th className="py-2.5 px-3 text-right">Advance Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{lead.studentName}</div>
                      <div className="text-[10px] text-slate-400">Applied: {lead.applicationDate}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {lead.targetClass}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{lead.parentName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.parentPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <Badge variant="outline" className="font-bold text-blue-700 bg-blue-50 border-blue-200">
                        {lead.entranceScore}%
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          lead.status === 'enrolled'
                            ? 'success'
                            : lead.status === 'approved'
                            ? 'default'
                            : lead.status === 'verified'
                            ? 'outline'
                            : 'warning'
                        }
                        className="capitalize text-[10px]"
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <a href={`/api/documents/admission-letter/${lead.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] gap-1 text-slate-700 hover:text-blue-600 hover:border-blue-300">
                          <Download className="h-3 w-3 text-blue-600" /> Offer Letter PDF
                        </Button>
                      </a>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {lead.status !== 'enrolled' ? (
                        <Button
                          size="sm"
                          onClick={() => handleAdvanceStage(lead.id)}
                          className="h-7 px-2.5 text-[11px] gap-1 bg-slate-900 hover:bg-blue-600 text-white"
                        >
                          {lead.status === 'applied'
                            ? 'Verify Docs'
                            : lead.status === 'verified'
                            ? 'Approve Offer'
                            : 'Complete Enrollment'}{' '}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled in SIS
                        </span>
                      )}
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
