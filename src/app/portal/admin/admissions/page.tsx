import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, CheckCircle2, Clock, XCircle, ArrowRight, Phone, Mail } from 'lucide-react';

const MOCK_LEADS = [
  {
    id: 'lead-01',
    studentName: 'Vihaan Malhotra',
    targetClass: 'Class 9',
    parentName: 'Sanjay Malhotra',
    parentPhone: '+91 98111 88990',
    parentEmail: 'sanjay.m@gmail.com',
    status: 'applied',
    date: '2026-11-20',
  },
  {
    id: 'lead-02',
    studentName: 'Saanvi Sharma',
    targetClass: 'Class 11 (Science)',
    parentName: 'Dr. Neeraj Sharma',
    parentPhone: '+91 98222 77889',
    parentEmail: 'dr.neeraj@apollo.com',
    status: 'verified',
    date: '2026-11-22',
  },
  {
    id: 'lead-03',
    studentName: 'Kabir Sengupta',
    targetClass: 'Class 6',
    parentName: 'Ananya Sengupta',
    parentPhone: '+91 98333 66778',
    parentEmail: 'ananya.s@tcs.com',
    status: 'approved',
    date: '2026-11-23',
  },
];

export default function AdmissionsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Admissions Desk & Lead Conversion
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, document verifications, admission fees, and one-click enrollment conversion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Academic Session 2026-2027 Inquiries Open</Badge>
        </div>
      </div>

      {/* Applicant Leads Table */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">
            Prospective Applicants Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Target Standard</th>
                  <th className="py-2.5 px-3">Parent Details</th>
                  <th className="py-2.5 px-3">Application Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_LEADS.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {lead.studentName}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {lead.targetClass}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{lead.parentName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{lead.parentPhone}</span> &bull; <span>{lead.parentEmail}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {lead.date}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          lead.status === 'approved'
                            ? 'success'
                            : lead.status === 'verified'
                            ? 'default'
                            : 'warning'
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] gap-1 text-blue-600">
                        Convert to Student <ArrowRight className="h-3 w-3" />
                      </Button>
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
