import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CheckCircle2, UserX, Clock, CalendarDays, Filter, Radio } from 'lucide-react';
import { markClassAttendanceAction } from '@/modules/attendance/actions';
import { RfidGateSimulator } from '@/components/modules/attendance/rfid-gate-simulator';

export default async function AttendancePage() {
  const auth = await getVerifiedAuthContext();
  const enrollments = await repository.getEnrollments(auth.tenantId, { sectionId: 'sec-10-a' });
  const todayStr = '2026-11-24';
  const attendanceList = await repository.getAttendanceByDate(auth.tenantId, todayStr, 'sec-10-a');

  const presentCount = attendanceList.filter((a) => a.status === 'present').length;
  const absentCount = attendanceList.filter((a) => a.status === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-emerald-600" />
            Class Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section-wise daily register with instant parent absence notifications via WhatsApp.
          </p>
        </div>

        {/* Date & Section Indicator */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs py-1 px-3">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            24 Nov 2026
          </Badge>
          <Badge variant="default" className="text-xs py-1 px-3">
            Class 10 - Section A
          </Badge>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-medium text-slate-500">Total Enrolled</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{enrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-medium text-slate-500">Present</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{presentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-medium text-slate-500">Absent</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{absentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-medium text-slate-500">Attendance Rate</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {enrollments.length > 0 ? Math.round((presentCount / enrollments.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hardware Gate Turnstile & Biometric Stream */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
          Physical Gate Turnstiles & Biometric RFID Stream
        </h2>
        <RfidGateSimulator />
      </div>

      {/* Attendance Sheet */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            Daily Attendance Register — Class 10A
          </CardTitle>
          <span className="text-xs text-slate-500 font-mono">
            Date: {todayStr}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <form
            action={async (formData) => {
              'use server';
              const records = enrollments.map((enr) => {
                const status = (formData.get(`status_${enr.id}`) as any) || 'present';
                const remarks = (formData.get(`remarks_${enr.id}`) as string) || '';
                return {
                  enrollmentId: enr.id,
                  status,
                  remarks,
                };
              });

              await markClassAttendanceAction({
                attendanceDate: todayStr,
                records,
              });
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Status Today</th>
                    <th className="py-2.5 px-3">Remarks / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map((enr) => {
                    const currentAtt = attendanceList.find((a) => a.enrollment_id === enr.id);
                    const defaultStatus = currentAtt?.status || 'present';

                    return (
                      <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          #{enr.roll_number || 'N/A'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {enr.student?.full_name}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {enr.student?.admission_number}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            name={`status_${enr.id}`}
                            defaultValue={defaultStatus}
                            className="text-xs h-8 px-2 border border-slate-200 rounded-md bg-white text-slate-800 font-medium"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late Arrival</option>
                            <option value="half_day">Half Day</option>
                            <option value="excused">Excused Leave</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            name={`remarks_${enr.id}`}
                            defaultValue={currentAtt?.remarks || ''}
                            placeholder="Optional note (e.g. sick leave)"
                            className="w-full text-xs px-2 py-1 border border-slate-200 rounded-md bg-white"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end">
              <Button type="submit" size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Attendance & Trigger Alerts</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
