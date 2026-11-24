import React from 'react';
import { Calendar, Radio } from 'lucide-react';
import { StudentAttendanceView } from '@/components/modules/attendance/student-attendance-view';

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            My Attendance & Gate Biometric Record
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal RFID turnstile punches, CBSE Rule 13 compliance clearance, and monthly attendance heatmap.
          </p>
        </div>
      </div>

      {/* Main Interactive Student Attendance Suite */}
      <StudentAttendanceView />
    </div>
  );
}
