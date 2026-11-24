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
  User,
  Printer,
  Sparkles,
  CheckCircle2,
  Backpack,
} from 'lucide-react';

interface PeriodSlot {
  periodNum: number;
  timeRange: string;
  subject: string;
  teacher: string;
  room: string;
  isRecess?: boolean;
}

const SCHEDULE_DATA: Record<string, PeriodSlot[]> = {
  Monday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', subject: 'Mathematics Standard', teacher: 'Ms. Priya Sen', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', subject: 'Science (Physics)', teacher: 'Dr. Vivek Saxena', room: 'CV Raman Physics Lab' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', subject: 'English Lang & Lit', teacher: 'Ms. Ananya Roy', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', subject: 'Mid-Morning Recess', teacher: 'Cafeteria & Sports Court', room: 'Campus Quad', isRecess: true },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', subject: 'Social Science (History)', teacher: 'Mr. Arvind Joshi', room: 'Room 204' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', subject: 'Hindi Course-A', teacher: 'Mrs. Sunita Tiwari', room: 'Room 204' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', subject: 'Information Technology', teacher: 'Mr. Rohan Desai', room: 'Turing Computer Lab 2' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', subject: 'Physical Education / Games', teacher: 'Coach R. Rathore', room: 'School Sports Complex' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', subject: 'Library & Reading Hour', teacher: 'Mrs. Neha Chawla', room: 'Central Library' },
  ],
  Tuesday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', subject: 'Science (Chemistry)', teacher: 'Dr. Neha Kulkarni', room: 'Chemistry Lab' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', subject: 'Mathematics Standard', teacher: 'Ms. Priya Sen', room: 'Room 204' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', subject: 'Social Science (Geography)', teacher: 'Mr. Arvind Joshi', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', subject: 'Mid-Morning Recess', teacher: 'Cafeteria & Sports Court', room: 'Campus Quad', isRecess: true },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', subject: 'English Lang & Lit', teacher: 'Ms. Ananya Roy', room: 'Room 204' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', subject: 'Mathematics Lab Activity', teacher: 'Ms. Priya Sen', room: 'Aryabhata Math Lab' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', subject: 'Hindi Course-A', teacher: 'Mrs. Sunita Tiwari', room: 'Room 204' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', subject: 'Visual Arts & Craft', teacher: 'Mr. Somnath Pal', room: 'Art Studio 1' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', subject: 'Self Study / Mentorship', teacher: 'Ms. Priya Sen', room: 'Room 204' },
  ],
  Wednesday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', subject: 'Mathematics Standard', teacher: 'Ms. Priya Sen', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', subject: 'Science (Biology)', teacher: 'Dr. Vivek Saxena', room: 'Biology Lab' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', subject: 'English Lang & Lit', teacher: 'Ms. Ananya Roy', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', subject: 'Mid-Morning Recess', teacher: 'Cafeteria & Sports Court', room: 'Campus Quad', isRecess: true },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', subject: 'Social Science (Civics)', teacher: 'Mr. Arvind Joshi', room: 'Room 204' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', subject: 'Hindi Course-A', teacher: 'Mrs. Sunita Tiwari', room: 'Room 204' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', subject: 'Information Technology', teacher: 'Mr. Rohan Desai', room: 'Turing Computer Lab 2' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', subject: 'Robotics & STEM Lab', teacher: 'Mr. Aditya Sharma', room: 'Atal Tinkering Lab (ATL)' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', subject: 'Remedial Problem Solving', teacher: 'Faculty Members', room: 'Room 204' },
  ],
  Thursday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', subject: 'Science (Physics Practical)', teacher: 'Dr. Vivek Saxena', room: 'Physics Lab' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', subject: 'Science (Physics Practical)', teacher: 'Dr. Vivek Saxena', room: 'Physics Lab' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', subject: 'Mathematics Standard', teacher: 'Ms. Priya Sen', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', subject: 'Mid-Morning Recess', teacher: 'Cafeteria & Sports Court', room: 'Campus Quad', isRecess: true },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', subject: 'English Lang & Lit', teacher: 'Ms. Ananya Roy', room: 'Room 204' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', subject: 'Social Science (Economics)', teacher: 'Mr. Arvind Joshi', room: 'Room 204' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', subject: 'Hindi Course-A', teacher: 'Mrs. Sunita Tiwari', room: 'Room 204' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', subject: 'Physical Education / Games', teacher: 'Coach R. Rathore', room: 'Sports Complex' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', subject: 'Class Teacher Discussion', teacher: 'Ms. Priya Sen', room: 'Room 204' },
  ],
  Friday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', subject: 'Mathematics Standard', teacher: 'Ms. Priya Sen', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', subject: 'English Lang & Lit', teacher: 'Ms. Ananya Roy', room: 'Room 204' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', subject: 'Science (Chemistry)', teacher: 'Dr. Neha Kulkarni', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', subject: 'Mid-Morning Recess', teacher: 'Cafeteria & Sports Court', room: 'Campus Quad', isRecess: true },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', subject: 'Social Science', teacher: 'Mr. Arvind Joshi', room: 'Room 204' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', subject: 'Hindi Course-A', teacher: 'Mrs. Sunita Tiwari', room: 'Room 204' },
    { periodNum: 6, timeRange: '12:30 - 01:15 PM', subject: 'Music / Vocal Arts', teacher: 'Pandit S. Sen', room: 'Music Hall' },
    { periodNum: 7, timeRange: '01:15 - 01:55 PM', subject: 'Information Technology', teacher: 'Mr. Rohan Desai', room: 'Turing Computer Lab 2' },
    { periodNum: 8, timeRange: '01:55 - 02:30 PM', subject: 'Weekend Assembly & Clubs', teacher: 'Activity Incharges', room: 'Main Auditorium' },
  ],
  Saturday: [
    { periodNum: 1, timeRange: '08:20 - 09:05 AM', subject: 'Special CBSE Doubt Clearing', teacher: 'Ms. Priya Sen', room: 'Room 204' },
    { periodNum: 2, timeRange: '09:05 - 09:50 AM', subject: 'Science Olympiad Coaching', teacher: 'Dr. Vivek Saxena', room: 'Room 204' },
    { periodNum: 3, timeRange: '09:50 - 10:35 AM', subject: 'Social Science Map Work', teacher: 'Mr. Arvind Joshi', room: 'Room 204' },
    { periodNum: 0, timeRange: '10:35 - 11:00 AM', subject: 'Mid-Morning Recess', teacher: 'Cafeteria', room: 'Campus Quad', isRecess: true },
    { periodNum: 4, timeRange: '11:00 - 11:45 AM', subject: 'Debate & Public Speaking', teacher: 'Ms. Ananya Roy', room: 'Audio-Visual Hall' },
    { periodNum: 5, timeRange: '11:45 - 12:30 PM', subject: 'Sports Club & Matches', teacher: 'Coach R. Rathore', room: 'Football Ground' },
  ],
};

const BAG_PACKING_GUIDE: Record<string, string[]> = {
  Monday: ['NCERT Math Vol 1 & Register', 'Physics Lab Manual', 'English First Flight', 'Social Science History Notebook', 'Computer Practical File', 'Sports Uniform'],
  Tuesday: ['Chemistry Record Book & Apron', 'Math Lab Geometry Kit', 'Geography Map Book', 'English Footprints Without Feet', 'Art Sketchbook (A3)'],
  Wednesday: ['NCERT Math Vol 1', 'Biology Practical Record', 'Economics Textbook', 'Hindi Sanchayan', 'ATL Robotics Kit'],
  Thursday: ['Physics Lab Manual & Apron', 'Math Register', 'Civics Notebook', 'Hindi Sparsh', 'Sports Shoes & Kit'],
  Friday: ['NCERT Math Vol 1', 'Chemistry Textbook', 'English Register', 'Music Notebook', 'IT Practical Journal'],
  Saturday: ['Olympiad Practice Book', 'Map Work Workbook', 'Debate Notes & Reference Sheets'],
};

export function StudentTimetableView() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const daySlots = SCHEDULE_DATA[selectedDay] || SCHEDULE_DATA.Monday;
  const bagItems = BAG_PACKING_GUIDE[selectedDay] || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Class 10-A Weekly Routine & Bell Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Academic Session 2024-25 &bull; Standard 8-period timetable with laboratory rotations.
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
            Print Weekly Routine
          </Button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Object.keys(SCHEDULE_DATA).map((day) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Period Timeline for Selected Day */}
        <div className="lg:col-span-2 space-y-3">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  {selectedDay}&apos;s Bell Schedule & Periods
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Assembly commences at 08:00 AM sharp in Central Courtyard.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {daySlots.filter((s) => !s.isRecess).length} Academic Periods
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {daySlots.map((slot, idx) => {
                  if (slot.isRecess) {
                    return (
                      <div key={idx} className="p-3 bg-amber-50/60 flex items-center justify-between text-amber-900 font-semibold border-y border-amber-200/50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>{slot.subject} ({slot.timeRange})</span>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                          Break
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
                          <p className="font-bold text-sm text-slate-900">{slot.subject}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3 text-slate-400" />
                              {slot.teacher}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {slot.room}
                            </span>
                          </div>
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

        {/* Right Col: Bag Packing Checklist */}
        <div>
          <Card className="border-slate-200 shadow-xs bg-slate-50/50">
            <CardHeader className="p-4 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Backpack className="h-4 w-4 text-indigo-600" />
                {selectedDay} Bag Packing Guide
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Recommended books, kits, and lab stationery for today&apos;s lectures.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {bagItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
