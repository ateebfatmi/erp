import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, CreditCard, CalendarCheck, BookOpen, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default async function ParentDashboardPage() {
  const auth = await getVerifiedAuthContext();
  const enrollments = await repository.getEnrollments(auth.tenantId);
  const child = enrollments[0]; // Aarav Mehta
  const feeAllocations = child ? await repository.getFeeAllocations(auth.tenantId, child.id) : [];
  const unpaidDues = feeAllocations.filter((a) => a.status === 'unpaid');
  const totalDue = unpaidDues.reduce((acc, a) => acc + (a.due_amount - a.discount_amount - a.paid_amount), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Parent Guardian Portal
            </h1>
            <Badge variant="success">Verified Guardian Account</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Viewing records for child: <span className="font-bold text-slate-800">{child?.student?.full_name}</span> ({child?.student?.admission_number} &bull; {child?.class_name} - {child?.section_name})
          </p>
        </div>

        {/* Child Switcher Pill */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1.5 px-3 font-semibold bg-slate-50 text-slate-800">
            Switch Child: Aarav Mehta (10A)
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Attendance Today */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Today Attendance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <CalendarCheck className="h-6 w-6" /> Present
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Marked at 08:05 AM &bull; 96.2% Annual Attendance
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Fee Dues */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Outstanding Term Dues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {formatCurrency(totalDue)}
            </div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              Quarter 4 Tuition Due: 15 Jan 2027
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Academic Standing */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Latest Mid-Term Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <BookOpen className="h-6 w-6" /> Grade A1 (92.5%)
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rank #3 in Class 10A
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Fee Alert Action & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {totalDue > 0 ? (
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Quarter 4 Academic Tuition Invoice Pending
                  </span>
                  <p className="text-xs text-amber-800">
                    Amount of {formatCurrency(totalDue)} is payable by 15 Jan 2027. Instant online payment via UPI, Credit Card, or NetBanking.
                  </p>
                </div>
                <Link href="/portal/parent/fees">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shrink-0">
                    <CreditCard className="h-4 w-4" />
                    <span>Pay Dues Online</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}

          {/* Child's Daily Periods */}
          <Card>
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Today Timetable Schedule for Aarav
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Period 1 (08:00 - 08:45 AM): Mathematics Standard
                    </span>
                    <span className="text-slate-500">Teacher: Mrs. Sunita Deshmukh &bull; Room 302</span>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Period 2 (08:45 - 09:30 AM): Science & Physics Lab
                    </span>
                    <span className="text-slate-500">Teacher: Dr. Rajeshwar Sharma &bull; Physics Lab 1</span>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Period 3 (09:45 - 10:30 AM): English Communicative
                    </span>
                    <span className="text-slate-500">Teacher: Ms. Priya Menon &bull; Room 302</span>
                  </div>
                  <Badge variant="default">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Portal Shortcuts */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Guardian Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/portal/parent/fees" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" /> View Invoices & Receipts
                </Button>
              </Link>
              <Link href="/portal/parent/reports" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" /> Term Progress Report Card
                </Button>
              </Link>
              <Link href="/portal/parent/attendance" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <CalendarCheck className="h-4 w-4 text-indigo-600" /> Full Attendance Log
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
