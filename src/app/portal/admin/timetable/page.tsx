import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, UserCheck, CheckCircle2 } from 'lucide-react';

export default async function TimetablePage() {
  const auth = await getVerifiedAuthContext();
  const slots = await repository.getTimetableSlots(auth.tenantId, 'sec-10-a');

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
            <CheckCircle2 className="h-3.5 w-3.5" /> Conflict Free
          </Badge>
          <Badge variant="default">
            Class 10 - Section A
          </Badge>
        </div>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">
            Monday Period Schedule — Class 10A (Room 302)
          </CardTitle>
          <p className="text-xs text-slate-500">
            Total 8 Instructional Periods &bull; 45 minutes duration each
          </p>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-[11px] font-bold">
                    {slot.period_name}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {slot.start_time} - {slot.end_time}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-900">
                  {slot.subject_name}
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                  <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span className="truncate">{slot.teacher_name}</span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>{slot.room_number}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
