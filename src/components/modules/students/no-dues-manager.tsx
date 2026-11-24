'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  AlertTriangle,
  Building,
  BookOpen,
  CreditCard,
  FlaskConical,
  Trophy,
  Plus,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  StudentClearanceRecord,
  DepartmentKey,
  initiateNoDuesApplication,
  updateDepartmentClearance,
  verifyTcEligibility,
} from '@/modules/students/no-dues';

const INITIAL_CLEARANCES: StudentClearanceRecord[] = [
  {
    clearanceId: 'ND-2024-001',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    admissionNo: 'DPS-2024-0412',
    gradeSection: 'Grade 10-A',
    fatherName: 'Sanjay Mehta',
    applicationDate: '2024-11-20T10:00:00+05:30',
    withdrawalReason: 'Parent corporate transfer to Bengaluru HQ',
    departments: {
      LIBRARY: {
        department: 'LIBRARY',
        departmentName: 'Library Desk',
        status: 'APPROVED_CLEAR',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Mrs. Neha Chawla',
        signedAt: '2024-11-21T11:00:00+05:30',
        remarks: 'All 3 borrowed titles returned; zero library fines.',
      },
      ACCOUNTS_FEES: {
        department: 'ACCOUNTS_FEES',
        departmentName: 'Fee Accounts',
        status: 'APPROVED_CLEAR',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Mr. Rajesh Verma',
        signedAt: '2024-11-22T14:30:00+05:30',
        remarks: 'All 4 quarters tuition and transport fees cleared.',
      },
      LABORATORIES: {
        department: 'LABORATORIES',
        departmentName: 'Science Labs',
        status: 'APPROVED_CLEAR',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Dr. Vivek Saxena',
        signedAt: '2024-11-22T16:00:00+05:30',
        remarks: 'Physics/Chemistry optical kits checked; no breakages.',
      },
      SPORTS_HOSTEL: {
        department: 'SPORTS_HOSTEL',
        departmentName: 'Sports Wing',
        status: 'APPROVED_CLEAR',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Coach R. Rathore',
        signedAt: '2024-11-23T09:15:00+05:30',
        remarks: 'Athletic kit and basketball jersey accounted for.',
      },
    },
    overallStatus: 'CLEARED_READY_FOR_TC',
    authorizedForTcGeneration: true,
    tcCertificateNumber: 'TC-CBSE-2024-0412',
  },
  {
    clearanceId: 'ND-2024-002',
    studentId: 'std-103',
    studentName: 'Rohan Mehra',
    admissionNo: 'DPS-2024-0414',
    gradeSection: 'Grade 10-A',
    fatherName: 'Deepak Mehra',
    applicationDate: '2024-11-22T11:30:00+05:30',
    withdrawalReason: 'Relocation to international schooling',
    departments: {
      LIBRARY: {
        department: 'LIBRARY',
        departmentName: 'Library Desk',
        status: 'BLOCKED_WITH_DUES',
        duesAmountINR: 120,
        unreturnedItems: ['NCERT Exemplar Class 10 Math'],
        signatoryStaff: 'Mrs. Neha Chawla',
        signedAt: '2024-11-23T10:00:00+05:30',
        remarks: '1 title overdue by 24 days (fine ₹120). Book not yet handed in.',
      },
      ACCOUNTS_FEES: {
        department: 'ACCOUNTS_FEES',
        departmentName: 'Fee Accounts',
        status: 'APPROVED_CLEAR',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Mr. Rajesh Verma',
        signedAt: '2024-11-23T15:00:00+05:30',
        remarks: 'Tuition paid in full.',
      },
      LABORATORIES: {
        department: 'LABORATORIES',
        departmentName: 'Science Labs',
        status: 'PENDING_REVIEW',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Dr. Vivek Saxena',
        remarks: 'Chemistry locker inspection pending.',
      },
      SPORTS_HOSTEL: {
        department: 'SPORTS_HOSTEL',
        departmentName: 'Sports Wing',
        status: 'APPROVED_CLEAR',
        duesAmountINR: 0,
        unreturnedItems: [],
        signatoryStaff: 'Coach R. Rathore',
        signedAt: '2024-11-24T08:30:00+05:30',
        remarks: 'No kit outstanding.',
      },
    },
    overallStatus: 'ACTION_REQUIRED_DUES_PENDING',
    authorizedForTcGeneration: false,
  },
];

export function NoDuesManager() {
  const [clearances, setClearances] = useState<StudentClearanceRecord[]>(INITIAL_CLEARANCES);
  const [feedback, setFeedback] = useState<string | null>(null);

  const clearedCount = clearances.filter((c) => c.authorizedForTcGeneration).length;
  const pendingCount = clearances.filter((c) => !c.authorizedForTcGeneration).length;

  const handleGrantDepartmentClearance = (clearanceId: string, dept: DepartmentKey) => {
    setClearances((prev) =>
      prev.map((c) => {
        if (c.clearanceId !== clearanceId) return c;
        return updateDepartmentClearance(c, dept, 'APPROVED_CLEAR', 0, [], 'All liabilities cleared and signed off.');
      })
    );
    setFeedback(`Department clearance granted for ${dept}.`);
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
          <Badge variant="success">Updated</Badge>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-amber-600" />
            Student Withdrawal &amp; &ldquo;No Dues&rdquo; Clearance Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CBSE Transfer Certificate (TC) issuance requires mandatory clearance across Library, Accounts, Science Labs, and Sports Wings.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Pending Clearances</p>
              <p className="text-xl font-bold text-slate-900">{pendingCount} Applications</p>
              <p className="text-[10px] text-slate-500">Awaiting department sign-offs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Ready for TC</p>
              <p className="text-xl font-bold text-emerald-700">{clearedCount} Fully Cleared</p>
              <p className="text-[10px] text-slate-500">Official certificate unlocked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Statutory Gate</p>
              <p className="text-sm font-bold text-slate-900">4-Way Audit Enforced</p>
              <p className="text-[10px] text-slate-500">Zero liability requirement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">TC Format</p>
              <p className="text-sm font-bold text-slate-900">CBSE Standard Vector</p>
              <p className="text-[10px] text-slate-500">pdf-lib generated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Active TC Applications &amp; Departmental Clearances
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Each department must grant clearance before the official CBSE Transfer Certificate can be downloaded.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Student &amp; Cause</th>
                  <th className="py-2.5 px-2 text-center">Library</th>
                  <th className="py-2.5 px-2 text-center">Accounts</th>
                  <th className="py-2.5 px-2 text-center">Labs</th>
                  <th className="py-2.5 px-2 text-center">Sports</th>
                  <th className="py-2.5 px-3 text-center">TC Readiness</th>
                  <th className="py-2.5 px-3 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clearances.map((c) => {
                  const check = verifyTcEligibility(c);
                  return (
                    <tr key={c.clearanceId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{c.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.admissionNo} &bull; {c.gradeSection} &bull; S/O {c.fatherName}
                        </span>
                        <span className="text-[11px] text-slate-600 block mt-0.5 italic">
                          &ldquo;{c.withdrawalReason}&rdquo;
                        </span>
                      </td>

                      {/* Library */}
                      <td className="py-3 px-2 text-center">
                        {c.departments.LIBRARY.status === 'APPROVED_CLEAR' ? (
                          <Badge variant="success" className="text-[9px]">Clear</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="destructive" className="text-[9px]">Dues</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[9px] h-5 px-1 block mx-auto"
                              onClick={() => handleGrantDepartmentClearance(c.clearanceId, 'LIBRARY')}
                            >
                              Sign Off
                            </Button>
                          </div>
                        )}
                      </td>

                      {/* Accounts */}
                      <td className="py-3 px-2 text-center">
                        {c.departments.ACCOUNTS_FEES.status === 'APPROVED_CLEAR' ? (
                          <Badge variant="success" className="text-[9px]">Clear</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="destructive" className="text-[9px]">Dues</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[9px] h-5 px-1 block mx-auto"
                              onClick={() => handleGrantDepartmentClearance(c.clearanceId, 'ACCOUNTS_FEES')}
                            >
                              Sign Off
                            </Button>
                          </div>
                        )}
                      </td>

                      {/* Labs */}
                      <td className="py-3 px-2 text-center">
                        {c.departments.LABORATORIES.status === 'APPROVED_CLEAR' ? (
                          <Badge variant="success" className="text-[9px]">Clear</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-[9px] text-amber-700 bg-amber-50">Pending</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[9px] h-5 px-1 block mx-auto"
                              onClick={() => handleGrantDepartmentClearance(c.clearanceId, 'LABORATORIES')}
                            >
                              Sign Off
                            </Button>
                          </div>
                        )}
                      </td>

                      {/* Sports */}
                      <td className="py-3 px-2 text-center">
                        {c.departments.SPORTS_HOSTEL.status === 'APPROVED_CLEAR' ? (
                          <Badge variant="success" className="text-[9px]">Clear</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-[9px] text-amber-700 bg-amber-50">Pending</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[9px] h-5 px-1 block mx-auto"
                              onClick={() => handleGrantDepartmentClearance(c.clearanceId, 'SPORTS_HOSTEL')}
                            >
                              Sign Off
                            </Button>
                          </div>
                        )}
                      </td>

                      {/* TC Readiness */}
                      <td className="py-3 px-3 text-center">
                        {c.authorizedForTcGeneration ? (
                          <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="h-4 w-4" /> Ready
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-amber-700 font-semibold text-xs">
                            <Lock className="h-3.5 w-3.5" /> Locked
                          </div>
                        )}
                      </td>

                      {/* Download Link */}
                      <td className="py-3 px-3 text-right">
                        {c.authorizedForTcGeneration ? (
                          <a
                            href={`/api/documents/transfer-certificate/${c.studentId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              size="sm"
                              className="text-[11px] h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 ml-auto"
                            >
                              <Download className="h-3 w-3" />
                              Print CBSE TC
                            </Button>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Clearance Incomplete
                          </span>
                        )}
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
