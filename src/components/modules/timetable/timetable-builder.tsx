'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimetableSlot } from '@/lib/database/types';
import { checkTimetableConflict } from '@/modules/timetable/conflict-checker';
import { Calendar, Clock, MapPin, UserCheck, Plus, AlertTriangle, CheckCircle2, X } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function TimetableBuilder({
  initialSlots,
  teachers,
  subjects,
}: {
  initialSlots: TimetableSlot[];
  teachers: string[];
  subjects: string[];
}) {
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('monday');
  const [slots, setSlots] = useState<TimetableSlot[]>(initialSlots);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [periodNumber, setPeriodNumber] = useState(4);
  const [subjectName, setSubjectName] = useState(subjects[0] || 'Mathematics Standard');
  const [teacherName, setTeacherName] = useState(teachers[0] || 'Mrs. Sunita Deshmukh');
  const [roomNumber, setRoomNumber] = useState('Room 302');

  // Realtime conflict check
  const conflict = checkTimetableConflict(slots, {
    sectionId: 'sec-10-a',
    dayOfWeek: selectedDay,
    periodNumber,
    teacherName,
    roomNumber,
  });

  const handleAddSlot = () => {
    if (conflict.hasConflict) return;

    const newSlot: TimetableSlot = {
      id: `slot-${Date.now()}`,
      tenant_id: '22222222-2222-2222-2222-222222222222',
      academic_session_id: 'session-2025-2026',
      section_id: 'sec-10-a',
      period_number: periodNumber,
      period_name: `Period ${periodNumber}`,
      start_time: `${7 + periodNumber}:00`,
      end_time: `${7 + periodNumber}:45`,
      day_of_week: selectedDay,
      subject_name: subjectName,
      teacher_name: teacherName,
      room_number: roomNumber,
    };

    setSlots([...slots.filter((s) => !(s.day_of_week === selectedDay && s.period_number === periodNumber)), newSlot]);
    setIsModalOpen(false);
  };

  const currentDaySlots = slots
    .filter((s) => s.day_of_week === selectedDay)
    .sort((a, b) => a.period_number - b.period_number);

  return (
    <div className="space-y-6">
      {/* Day Selector Tabs & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" /> Allocate Period
        </Button>
      </div>

      {/* Grid of Periods */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold capitalize flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            {selectedDay} Schedule — Class 10 (Section A)
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {currentDaySlots.length} Periods Configured
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          {currentDaySlots.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No periods scheduled for {selectedDay}. Click "Allocate Period" to add subjects and faculty.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentDaySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="text-[10px] font-bold">
                      {slot.period_name}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900 truncate">
                    {slot.subject_name}
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                    <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{slot.teacher_name}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{slot.room_number}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allocate Period Modal with Real-time Conflict Validation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white shadow-xl border-slate-200">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Allocate Period Slot</CardTitle>
                <p className="text-xs text-slate-500 capitalize">{selectedDay} &bull; Class 10A</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Period Number</label>
                <select
                  value={periodNumber}
                  onChange={(e) => setPeriodNumber(Number(e.target.value))}
                  className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                    <option key={p} value={p}>Period {p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assigned Teacher</label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Classroom / Lab</label>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* Real-time Conflict Alert Box */}
              {conflict.hasConflict ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{conflict.message}</span>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Teacher and room are available with zero timetable clashes!
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={conflict.hasConflict}
                  onClick={handleAddSlot}
                  className="text-xs bg-blue-600 hover:bg-blue-700 gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Save Slot Allocation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
