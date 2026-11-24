import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, BookOpen, FileText, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Teacher Faculty Desk
            </h1>
            <Badge variant="default">Mrs. Sunita Deshmukh (PGT Mathematics)</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assigned Class Teacher: Class 10 - Section A &bull; Department of Mathematics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/portal/teacher/attendance">
            <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              <CalendarCheck className="h-4 w-4" />
              <span>Mark Period Attendance</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Assigned Classes Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">4 Periods</div>
            <p className="text-[11px] text-slate-500 mt-1">Next: Period 1 (08:00 AM)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Class 10A Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">38 Students</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">94.7% Present Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Pending Homework Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">6 Submissions</div>
            <p className="text-[11px] text-slate-500 mt-1">Quadratic Equations Task 3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Upcoming Exam Marks Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">Mid-Term</div>
            <p className="text-[11px] text-slate-500 mt-1">CBSE Standard Math (80 Marks)</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Teaching Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Today Teaching Timetable — Monday
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      Period 1: Mathematics Standard (Class 10 - Section A)
                    </span>
                    <span className="text-slate-500">
                      Time: 08:00 AM - 08:45 AM &bull; Room 302
                    </span>
                  </div>
                  <Link href="/portal/teacher/attendance">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      Attendance <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      Period 4: Remedial Mathematics (Class 9 - Section B)
                    </span>
                    <span className="text-slate-500">
                      Time: 10:45 AM - 11:30 AM &bull; Room 204
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs text-slate-500">
                    Scheduled
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Faculty Quick Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/portal/teacher/marks" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" /> Enter Term Marks & Grades
                </Button>
              </Link>
              <Link href="/portal/teacher/homework" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <FileText className="h-4 w-4 text-blue-600" /> Create Homework Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
