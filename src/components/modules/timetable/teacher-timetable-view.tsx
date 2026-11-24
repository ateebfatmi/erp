'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Users,
  Printer,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Coffee,
  AlertCircle,
} from 'lucide-react';

interface TeacherPeriodSlot {
  periodNum: number;
  timeRange: string;
  type: 'TEACHING' | 'PREP_FREE' | 'SUBSTITUTION' | 'RECESS';
  classSection?: string;
  subject?: string;
  room?: string;
  notes?: string;
}

const TEACHER_SCHEDULE: Record<string, TeacherPeriodSlot[]> = {
  Monday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Mathematics Standard', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', type: 'TEACHING', classSection: 'Grade 9-B', subject: 'Mathematics Foundations', room: 'Room 112' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', type: 'PREP_FREE', notes: 'Lesson Planning & CBSE Term-2 Worksheet Creation' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', type: 'RECESS', notes: 'Mid-Morning Tea & Staff Common Room' },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', type: 'TEACHING', classSection: 'Grade 8-C', subject: 'Remedial Mathematics', room: 'Room 105' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', type: 'PREP_FREE', notes: 'Answer Sheet Correction & Portal Marks Entry' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', type: 'TEACHING', classSection: 'Grade 10-B', subject: 'Aryabhata Math Lab Activity', room: 'Math Lab' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', type: 'PREP_FREE', notes: 'Parent Communication & Leave Approvals' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Class Teacher Mentorship Hour', room: 'Room 204' },
  ],
  Tuesday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', type: 'PREP_FREE', notes: 'Department Curriculum Coordination' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Mathematics Standard', room: 'Room 204' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', type: 'TEACHING', classSection: 'Grade 9-B', subject: 'Mathematics Foundations', room: 'Room 112' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', type: 'RECESS', notes: 'Staff Common Room' },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', type: 'TEACHING', classSection: 'Grade 8-C', subject: 'Remedial Mathematics', room: 'Room 105' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Aryabhata Math Lab Activity', room: 'Math Lab' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', type: 'PREP_FREE', notes: 'Lab Equipment Checking' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', type: 'SUBSTITUTION', classSection: 'Grade 8-B', subject: 'Covering for Mr. Sharma', room: 'Room 104', notes: 'Arranged by Vice Principal' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', type: 'PREP_FREE', notes: 'Staff Dismissal & Gate Duty' },
  ],
  Wednesday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Mathematics Standard', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', type: 'PREP_FREE', notes: 'Question Paper Moderation' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', type: 'TEACHING', classSection: 'Grade 9-B', subject: 'Mathematics Foundations', room: 'Room 112' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', type: 'RECESS', notes: 'Staff Common Room' },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', type: 'PREP_FREE', notes: 'Student Doubt Clearing Desk' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', type: 'TEACHING', classSection: 'Grade 10-B', subject: 'Mathematics Standard', room: 'Room 205' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', type: 'TEACHING', classSection: 'Grade 8-C', subject: 'Remedial Mathematics', room: 'Room 105' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', type: 'PREP_FREE', notes: 'Digital ERP Portal Attendance Sync' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Math Olympiad Club', room: 'Room 204' },
  ],
  Thursday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', type: 'PREP_FREE', notes: 'Syllabus Review' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', type: 'TEACHING', classSection: 'Grade 9-B', subject: 'Mathematics Foundations', room: 'Room 112' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Mathematics Standard', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', type: 'RECESS', notes: 'Staff Common Room' },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', type: 'TEACHING', classSection: 'Grade 10-B', subject: 'Mathematics Standard', room: 'Room 205' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', type: 'PREP_FREE', notes: 'CBSE Sample Paper Solving' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', type: 'TEACHING', classSection: 'Grade 8-C', subject: 'Remedial Mathematics', room: 'Room 105' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', type: 'PREP_FREE', notes: 'Parent Meeting' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Weekly Assembly Incharge', room: 'Room 204' },
  ],
  Friday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Mathematics Standard', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', type: 'PREP_FREE', notes: 'Grading Weekly Unit Tests' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', type: 'TEACHING', classSection: 'Grade 9-B', subject: 'Mathematics Foundations', room: 'Room 112' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', type: 'RECESS', notes: 'Staff Common Room' },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', type: 'TEACHING', classSection: 'Grade 10-B', subject: 'Mathematics Standard', room: 'Room 205' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', type: 'PREP_FREE', notes: 'Staff Meeting' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', type: 'TEACHING', classSection: 'Grade 8-C', subject: 'Remedial Mathematics', room: 'Room 105' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', type: 'PREP_FREE', notes: 'Weekly Progress Review' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'Discipline & House Meeting', room: 'Room 204' },
  ],
  Saturday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', type: 'TEACHING', classSection: 'Grade 10-A', subject: 'CBSE Board Revision Marathon', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', type: 'TEACHING', classSection: 'Grade 10-B', subject: 'CBSE Board Revision Marathon', room: 'Room 205' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', type: 'PREP_FREE', notes: 'Inter-House Quiz Preparation' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', type: 'RECESS', notes: 'Cafeteria' },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', type: 'TEACHING', classSection: 'Senior Wing', subject: 'Inter-House Math Olympiad', room: 'Auditorium' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', type: 'PREP_FREE', notes: 'Weekend Departure' },
  ],
};

export function TeacherTimetableView() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const daySlots = TEACHER_SCHEDULE[selectedDay] || TEACHER_SCHEDULE.Monday;

  const totalAssignedPeriodsWeekly = 26;
  const maxWeeklyCbseNorm = 30;
  const prepPeriodsWeekly = 16;
  const substitutionsThisWeek = 1;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Faculty Teaching Schedule & Diary: Ms. Priya Sen
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            TGT Mathematics &bull; Class Teacher: Grade 10-A &bull; CBSE Workload Compliance Active.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            Print Teacher Diary (PDF)
          </Button>
        </div>
      </div>

      {/* KPI Workload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Weekly Teaching Load</p>
              <p className="text-xl font-bold text-slate-900">{totalAssignedPeriodsWeekly} Periods</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Complies with CBSE norm (&le;{maxWeeklyCbseNorm})</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Prep & Free Periods</p>
              <p className="text-xl font-bold text-slate-900">{prepPeriodsWeekly} Periods</p>
              <p className="text-[10px] text-slate-500">For lesson plans & corrections</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Substitution Duties</p>
              <p className="text-xl font-bold text-slate-900">{substitutionsThisWeek} Active</p>
              <p className="text-[10px] text-slate-500">Tuesday P7 (Grade 8-B)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Assigned Sections</p>
              <p className="text-sm font-bold text-slate-900">10-A, 10-B, 9-B, 8-C</p>
              <p className="text-[10px] text-slate-500">Total 142 Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekday Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Object.keys(TEACHER_SCHEDULE).map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedDay === day
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day Schedule Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              {selectedDay}&apos;s Period Schedule & Classroom Allocations
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Daily period tracker including classroom lectures, laboratory sessions, and prep time.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {daySlots.filter((s) => s.type === 'TEACHING').length} Teaching Lectures Today
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 text-xs">
            {daySlots.map((slot, idx) => {
              if (slot.type === 'RECESS') {
                return (
                  <div key={idx} className="p-3 bg-amber-50/60 flex items-center justify-between text-amber-900 font-semibold border-y border-amber-200/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>{slot.notes} ({slot.timeRange})</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                      Break
                    </Badge>
                  </div>
                );
              }

              if (slot.type === 'PREP_FREE') {
                return (
                  <div key={idx} className="p-3.5 bg-emerald-50/30 flex items-center justify-between gap-3 hover:bg-emerald-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        P{slot.periodNum}
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-950">Free Period &bull; {slot.notes}</span>
                        <span className="text-[11px] text-emerald-700 block font-mono">{slot.timeRange}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-100/80 text-emerald-800 border-emerald-300">
                      Prep Hour
                    </Badge>
                  </div>
                );
              }

              if (slot.type === 'SUBSTITUTION') {
                return (
                  <div key={idx} className="p-3.5 bg-amber-50/40 flex items-center justify-between gap-3 border-l-4 border-amber-400 hover:bg-amber-50/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        P{slot.periodNum}
                      </div>
                      <div>
                        <span className="font-bold text-amber-950">Substitution Duty: {slot.classSection} ({slot.subject})</span>
                        <span className="text-[11px] text-amber-800 block">{slot.room} &bull; {slot.notes} &bull; {slot.timeRange}</span>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-[10px]">
                      Substitution
                    </Badge>
                  </div>
                );
              }

              return (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[9px] uppercase font-semibold text-indigo-500">P</span>
                      <span className="text-sm font-bold leading-none">{slot.periodNum}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{slot.classSection}</span>
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {slot.subject}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        Location: {slot.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-600 text-xs flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{slot.timeRange}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
