'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertCircle,
  UserCheck,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  LeaveRequest,
  processLeaveDecision,
} from '@/modules/attendance/leave';

interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'LATE';
  timeIn?: string;
}

const INITIAL_ROSTER: StudentRosterItem[] = [
  { id: 'std-101', name: 'Aarav Sharma', rollNo: '14', status: 'ON_LEAVE' },
  { id: 'std-102', name: 'Ananya Deshmukh', rollNo: '01', status: 'PRESENT', timeIn: '07:48 AM' },
  { id: 'std-103', name: 'Rohan Mehra', rollNo: '02', status: 'PRESENT', timeIn: '07:52 AM' },
  { id: 'std-104', name: 'Diya Patel', rollNo: '03', status: 'PRESENT', timeIn: '07:55 AM' },
  { id: 'std-105', name: 'Kabir Khan', rollNo: '04', status: 'LATE', timeIn: '08:14 AM' },
  { id: 'std-106', name: 'Sanya Gupta', rollNo: '05', status: 'ABSENT' },
  { id: 'std-107', name: 'Arjun Verma', rollNo: '06', status: 'PRESENT', timeIn: '07:44 AM' },
  { id: 'std-108', name: 'Zara Siddiqui', rollNo: '07', status: 'PRESENT', timeIn: '07:50 AM' },
];

const INITIAL_TEACHER_INBOX: LeaveRequest[] = [
  {
    id: 'LV-2024-003',
    studentId: 'std-106',
    studentName: 'Sanya Gupta',
    gradeSection: 'Grade 10-A',
    rollNo: '05',
    leaveType: 'MEDICAL',
    startDate: '2024-11-25',
    endDate: '2024-11-26',
    isHalfDay: false,
    totalDays: 2,
    reason: 'Severe migraine headache and medical checkup appointment.',
    parentContact: '+91 98112 34567',
    status: 'PENDING',
    appliedAt: '2024-11-24T20:15:00Z',
  },
  {
    id: 'LV-2024-004',
    studentId: 'std-105',
    studentName: 'Kabir Khan',
    gradeSection: 'Grade 10-A',
    rollNo: '04',
    leaveType: 'OUT_OF_STATION',
    startDate: '2024-11-28',
    endDate: '2024-11-29',
    isHalfDay: false,
    totalDays: 2,
    reason: 'State Level Inter-School Debate Tournament representation in Chandigarh.',
    parentContact: '+91 98223 45678',
    status: 'PENDING',
    appliedAt: '2024-11-24T18:00:00Z',
  },
];

export function TeacherAttendanceManager() {
  const [roster, setRoster] = useState<StudentRosterItem[]>(INITIAL_ROSTER);
  const [inbox, setInbox] = useState<LeaveRequest[]>(INITIAL_TEACHER_INBOX);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pendingLeaves = inbox.filter((i) => i.status === 'PENDING');
  const presentCount = roster.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const onLeaveCount = roster.filter((r) => r.status === 'ON_LEAVE').length;

  const handleDecision = (request: LeaveRequest, decision: 'APPROVE' | 'REJECT') => {
    const updated = processLeaveDecision(request, decision);
    setInbox((prev) => prev.map((item) => (item.id === request.id ? updated : item)));

    if (decision === 'APPROVE') {
      // Automatically update roster status to ON_LEAVE
      setRoster((prev) =>
        prev.map((s) => (s.id === request.studentId ? { ...s, status: 'ON_LEAVE' } : s))
      );
      setFeedback(`Leave sanctioned for ${request.studentName}. Roster updated to 'On Approved Leave'.`);
    } else {
      setFeedback(`Leave request from ${request.studentName} marked as Rejected.`);
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  const handleSetStudentStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'LATE') => {
    setRoster((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, status, timeIn: status === 'PRESENT' ? '07:55 AM' : undefined }
          : s
      )
    );
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) =>
      prev.map((s) => (s.status === 'ON_LEAVE' ? s : { ...s, status: 'PRESENT', timeIn: '07:55 AM' }))
    );
    setFeedback('All eligible students marked PRESENT.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePublishRollCall = () => {
    setFeedback(`Daily Muster Roll finalized! ${presentCount} Present, ${absentCount} Absent, ${onLeaveCount} on Leave. Automated attendance SMS sent to absent parents.`);
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Action Notification */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Updated</Badge>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Class Section</p>
              <p className="text-lg font-bold text-slate-900">Grade 10-A</p>
              <p className="text-[10px] text-slate-500">{roster.length} Enrolled Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Present Today</p>
              <p className="text-lg font-bold text-slate-900">{presentCount}</p>
              <p className="text-[10px] text-slate-500">{Math.round((presentCount / roster.length) * 100)}% Physical Turnout</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Pending Leaves</p>
              <p className="text-lg font-bold text-slate-900">{pendingLeaves.length} Requests</p>
              <p className="text-[10px] text-slate-500">Require Teacher Sanction</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Unexcused Absences</p>
              <p className="text-lg font-bold text-slate-900">{absentCount}</p>
              <p className="text-[10px] text-slate-500">Pending Parent Alert</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 1: PARENT LEAVE APPLICATION APPROVAL INBOX */}
      {pendingLeaves.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/20 shadow-xs">
          <CardHeader className="p-4 border-b border-amber-200 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-amber-950 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Action Required: Parent Leave Applications ({pendingLeaves.length})
              </CardTitle>
              <CardDescription className="text-xs text-amber-800">
                Approving automatically sanctions the absence and marks student on leave in the muster roll.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
              Direct Parent Feed
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {pendingLeaves.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.studentName}</span>
                    <span className="text-xs font-mono text-slate-500">Roll #{req.rollNo}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {req.leaveType.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic">&ldquo;{req.reason}&rdquo;</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Period: {req.startDate} to {req.endDate} ({req.totalDays} days) • Parent Contact: {req.parentContact}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDecision(req, 'REJECT')}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                    onClick={() => handleDecision(req, 'APPROVE')}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve Leave
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SECTION 2: DAILY MUSTER ROLL */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Daily Class Attendance Muster Roll
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllPresent}
              className="text-xs h-8 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Mark All Present
            </Button>
            <Button
              size="sm"
              onClick={handlePublishRollCall}
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Finalize & Dispatch SMS
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Time In</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Muster Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{student.rollNo}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{student.timeIn || '—'}</td>
                    <td className="py-3 px-3">
                      {student.status === 'PRESENT' && (
                        <Badge variant="success" className="text-[10px]">Present</Badge>
                      )}
                      {student.status === 'ABSENT' && (
                        <Badge variant="destructive" className="text-[10px]">Absent</Badge>
                      )}
                      {student.status === 'ON_LEAVE' && (
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                          On Approved Leave
                        </Badge>
                      )}
                      {student.status === 'LATE' && (
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                          Late Arrival
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => handleSetStudentStatus(student.id, 'PRESENT')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded ${
                            student.status === 'PRESENT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStudentStatus(student.id, 'LATE')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded ${
                            student.status === 'LATE' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStudentStatus(student.id, 'ABSENT')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded ${
                            student.status === 'ABSENT' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStudentStatus(student.id, 'ON_LEAVE')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded ${
                            student.status === 'ON_LEAVE' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
