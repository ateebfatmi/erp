import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, BookOpen, CalendarCheck, Clock, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Student Learning Workspace
            </h1>
            <Badge variant="default">Aarav Mehta &bull; Roll #01</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Class 10 - Section A &bull; Delhi Public Global Academy (Main Campus)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">AY 2025-2026 Regular Enrolled</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">96.2%</div>
            <p className="text-[11px] text-slate-500 mt-1">Present Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Homework Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">1 Task</div>
            <p className="text-[11px] text-slate-500 mt-1">Quadratic Equations (25 Nov)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Mid-Term Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">A1 (92.5%)</div>
            <p className="text-[11px] text-slate-500 mt-1">Grade Point: 9.8</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Periods Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">6 Periods</div>
            <p className="text-[11px] text-slate-500 mt-1">Next: Physics Practical</p>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Schedule & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                My Daily Timetable Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      Period 1 (08:00 - 08:45 AM): Mathematics Standard
                    </span>
                    <span className="text-slate-500">Teacher: Mrs. Sunita Deshmukh &bull; Room 302</span>
                  </div>
                  <Badge variant="success">Attended</Badge>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      Period 2 (08:45 - 09:30 AM): Science (Physics Lab)
                    </span>
                    <span className="text-slate-500">Teacher: Dr. Rajeshwar Sharma &bull; Physics Lab 1</span>
                  </div>
                  <Badge variant="success">Attended</Badge>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      Period 3 (09:45 - 10:30 AM): English Communicative
                    </span>
                    <span className="text-slate-500">Teacher: Ms. Priya Menon &bull; Room 302</span>
                  </div>
                  <Badge variant="default">Current Period</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Student Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/portal/student/homework" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <FileText className="h-4 w-4 text-amber-600" /> Pending Homework Tasks
                </Button>
              </Link>
              <Link href="/portal/student/results" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <Award className="h-4 w-4 text-blue-600" /> CBSE Mid-Term Report Card
                </Button>
              </Link>
              <Link href="/portal/student/timetable" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" /> Weekly Timetable
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
