import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { TimetableBuilder } from '@/components/modules/timetable/timetable-builder';

export default async function TimetablePage() {
  const auth = await getVerifiedAuthContext();
  const slots = await repository.getTimetableSlots(auth.tenantId, 'sec-10-a');
  const employees = await repository.getEmployees(auth.tenantId);

  const teacherNames = employees.map((e) => e.full_name);
  const subjects = [
    'Mathematics Standard',
    'Science & Technology',
    'English Communicative',
    'Social Science',
    'Hindi Course-A',
    'Information Technology',
    'Physical Education',
    'Art & Craft',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Master Timetable & Period Scheduler
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Zero-conflict scheduling across teacher availability, room capacity, and bell periods.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Conflict Detection Active
          </Badge>
          <Badge variant="default">
            Class 10 - Section A
          </Badge>
        </div>
      </div>

      {/* Interactive Builder */}
      <TimetableBuilder
        initialSlots={slots}
        teachers={teacherNames}
        subjects={subjects}
      />
    </div>
  );
}
