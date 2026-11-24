'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Zap,
  Radio,
  FileCheck,
} from 'lucide-react';

const MOCK_PUNCHES = [
  { date: '25 Nov 2024', time: '07:48 AM', gate: 'Main North Gate Turnstile #2', type: 'ENTRY', status: 'ON_TIME' },
  { date: '24 Nov 2024', time: '07:44 AM', gate: 'Main North Gate Turnstile #1', type: 'ENTRY', status: 'ON_TIME' },
  { date: '23 Nov 2024', time: '07:51 AM', gate: 'West Bus Bay Gate Turnstile #3', type: 'ENTRY', status: 'ON_TIME' },
  { date: '22 Nov 2024', time: '08:12 AM', gate: 'Main North Gate Turnstile #2', type: 'ENTRY', status: 'LATE' },
  { date: '21 Nov 2024', time: '07:45 AM', gate: 'Main North Gate Turnstile #1', type: 'ENTRY', status: 'ON_TIME' },
  { date: '20 Nov 2024', time: '—', gate: 'Medical Leave Sanctioned', type: 'LEAVE', status: 'APPROVED_LEAVE' },
];

const NOVEMBER_DAYS = [
  { day: 1, status: 'P', time: '07:45 AM' },
  { day: 2, status: 'P', time: '07:48 AM' },
  { day: 3, status: 'SUN', time: 'Sunday' },
  { day: 4, status: 'P', time: '07:42 AM' },
  { day: 5, status: 'P', time: '07:50 AM' },
  { day: 6, status: 'P', time: '07:44 AM' },
  { day: 7, status: 'P', time: '07:52 AM' },
  { day: 8, status: 'P', time: '07:49 AM' },
  { day: 9, status: 'P', time: '07:46 AM' },
  { day: 10, status: 'SUN', time: 'Sunday' },
  { day: 11, status: 'P', time: '07:47 AM' },
  { day: 12, status: 'L', time: 'Sanctioned Leave' },
  { day: 13, status: 'L', time: 'Sanctioned Leave' },
  { day: 14, status: 'P', time: '07:50 AM' },
  { day: 15, status: 'P', time: '07:45 AM' },
  { day: 16, status: 'P', time: '07:44 AM' },
  { day: 17, status: 'SUN', time: 'Sunday' },
  { day: 18, status: 'P', time: '07:48 AM' },
  { day: 19, status: 'P', time: '07:46 AM' },
  { day: 20, status: 'L', time: 'Approved Sick Leave' },
  { day: 21, status: 'P', time: '07:45 AM' },
  { day: 22, status: 'LATE', time: '08:12 AM (Late)' },
  { day: 23, status: 'P', time: '07:51 AM' },
  { day: 24, status: 'P', time: '07:44 AM' },
  { day: 25, status: 'P', time: '07:48 AM' },
];

export function StudentAttendanceView() {
  const totalWorkingDays = 204;
  const daysPresent = 192;
  const approvedLeaves = 10;
  const unexcusedAbsence = 2;
  const attendancePercent = ((daysPresent / totalWorkingDays) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Compliance Banner */}
      <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold">CBSE Rule 13 Examination Clearance: Granted</h2>
          </div>
          <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
            Your cumulative attendance of <strong>{attendancePercent}%</strong> comfortably satisfies the statutory CBSE 75% minimum threshold required for Board Examination Roll Number & Admit Card generation.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-emerald-200 block font-semibold">Attendance YTD</span>
          <span className="text-3xl font-black">{attendancePercent}%</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Working Days</p>
              <p className="text-xl font-bold text-slate-900">{totalWorkingDays} Days</p>
              <p className="text-[10px] text-slate-500">Academic Session 2024-25</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Present In School</p>
              <p className="text-xl font-bold text-slate-900">{daysPresent} Days</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Physical biometric turnout</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Sanctioned Leaves</p>
              <p className="text-xl font-bold text-slate-900">{approvedLeaves} Days</p>
              <p className="text-[10px] text-slate-500">Medical / Doctor approved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Unexcused Absences</p>
              <p className="text-xl font-bold text-slate-900">{unexcusedAbsence} Days</p>
              <p className="text-[10px] text-slate-500">Parent intimation dispatched</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Attendance Calendar Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Monthly Muster Heatmap — November 2024
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Visual daily roll call log generated from RFID turnstile swipes.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
                </span>
                <span className="flex items-center gap-1 font-medium text-purple-700">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Leave
                </span>
                <span className="flex items-center gap-1 font-medium text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Late
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {NOVEMBER_DAYS.map((d) => (
                  <div
                    key={d.day}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between h-18 transition-all ${
                      d.status === 'P'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : d.status === 'L'
                        ? 'bg-purple-50/60 border-purple-200 text-purple-950'
                        : d.status === 'LATE'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Nov {d.day}</span>
                      <span className="text-[10px] font-mono font-bold">
                        {d.status === 'SUN' ? 'SUN' : d.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate mt-1">
                      {d.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Live RFID Gate Swipe Log */}
        <div>
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
                  Live RFID Gate Log
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Smart ID Card: <span className="font-mono text-slate-700">RFID-84920</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Sensor #2
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {MOCK_PUNCHES.map((punch, idx) => (
                  <div key={idx} className="p-3.5 space-y-1 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{punch.date}</span>
                      <Badge
                        variant={
                          punch.status === 'ON_TIME'
                            ? 'success'
                            : punch.status === 'LATE'
                            ? 'warning'
                            : 'outline'
                        }
                        className="text-[9px] py-0"
                      >
                        {punch.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-mono text-slate-600 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {punch.time} &bull; {punch.gate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
