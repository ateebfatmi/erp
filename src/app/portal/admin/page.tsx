import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  Receipt,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const auth = await getVerifiedAuthContext();
  const analytics = await repository.getDashboardAnalytics(auth.tenantId);
  const tenant = await repository.getTenantBySlug(auth.tenantId);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Executive School Dashboard
            </h1>
            <Badge variant="success">CBSE Affiliated</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {tenant?.name} &bull; Main Campus (Vasant Kunj) &bull; Academic Year 2025-2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/portal/admin/students">
            <Button size="sm" className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              <span>Admit Student</span>
            </Button>
          </Link>
          <Link href="/portal/admin/fees">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Receipt className="h-4 w-4" />
              <span>Collect Fee</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Student Strength
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {analytics.totalStudents}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600 inline" />
              Across 2 Campuses
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Employees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Teaching & Staff
            </CardTitle>
            <Briefcase className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {analytics.totalEmployees}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              100% Biometric Verified
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Today Attendance
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {analytics.todayAttendanceRate}%
            </div>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              3 Classes Marked
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Fee Collections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Term Fee Collected
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(analytics.feeCollectionTotal)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Razorpay & Bank Transfer
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Outstanding Dues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Outstanding Dues
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {formatCurrency(analytics.feePendingTotal)}
            </div>
            <p className="text-[11px] text-amber-600 mt-1 font-medium">
              Quarter 4 Due Jan 15
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Fee Transactions */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Recent Fee Transactions
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Realtime payment settlements with verified receipts
                </p>
              </div>
              <Link href="/portal/admin/fees">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View Ledger <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                    <tr>
                      <th className="py-2.5 px-3">Receipt No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Recorded At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics.recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-blue-600">
                          {tx.receipt_number}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {tx.student_name}
                        </td>
                        <td className="py-3 px-3 uppercase text-[11px] text-slate-600">
                          {tx.payment_method}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {formatCurrency(tx.total_amount)}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="success">Settled</Badge>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {formatDate(tx.recorded_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Administrative Notifications & Quick Links */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BellRing className="h-4 w-4 text-blue-600" />
                School Circulars & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                <span className="font-semibold text-blue-900 block">
                  CBSE Practical Examination Schedule
                </span>
                <p className="text-blue-700 mt-1">
                  Class 10 science laboratory practicals commence Dec 01. Room allocations published.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                <span className="font-semibold text-emerald-900 block">
                  Quarter 4 Fee Invoices Generated
                </span>
                <p className="text-emerald-700 mt-1">
                  Automated Razorpay payment links sent via WhatsApp and Email to 850 registered guardians.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Quick Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/portal/admin/attendance" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Mark Daily Section Attendance
                </Button>
              </Link>
              <Link href="/portal/admin/exams" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <ArrowUpRight className="h-4 w-4 text-blue-600" />
                  Gradebook & Term Marks
                </Button>
              </Link>
              <Link href="/portal/admin/timetable" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <CalendarCheck className="h-4 w-4 text-indigo-600" />
                  View Weekly Timetable Grid
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
