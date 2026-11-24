'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  Sparkles,
  FileText,
  Printer,
  XCircle,
  Briefcase,
  Users,
} from 'lucide-react';
import {
  FacultyLeaveType,
  FacultyLeaveApplication,
  SubstitutionOrder,
  TeacherProfile,
  FACULTY_ROSTER,
  MOCK_TIMETABLE_SLOTS,
  calculateFacultyLeaveBalance,
  generateAutomatedSubstitutions,
} from '@/modules/academics/substitution';

interface Props {
  role?: 'teacher' | 'admin';
  currentTeacherId?: string;
}

export function SubstitutionManager({ role = 'teacher', currentTeacherId = 'tch-01' }: Props) {
  // Leave Applications State
  const [leaves, setLeaves] = useState<FacultyLeaveApplication[]>([
    {
      id: 'lv-01',
      teacherId: 'tch-01',
      teacherName: 'Smt. Ananya Sen',
      leaveType: 'CASUAL_LEAVE',
      startDate: '2024-11-20',
      endDate: '2024-11-21',
      reason: 'Family wedding celebration in Jaipur',
      status: 'APPROVED',
      appliedAt: '2024-11-15',
    },
    {
      id: 'lv-02',
      teacherId: 'tch-01',
      teacherName: 'Smt. Ananya Sen',
      leaveType: 'MEDICAL_LEAVE',
      startDate: '2024-10-01',
      endDate: '2024-10-03',
      reason: 'Viral fever & acute respiratory congestion',
      status: 'APPROVED',
      appliedAt: '2024-09-30',
    },
    {
      id: 'lv-03',
      teacherId: 'tch-03',
      teacherName: 'Dr. V. K. Saxena',
      leaveType: 'ON_DUTY_CBSE',
      startDate: '2024-11-28',
      endDate: '2024-11-29',
      reason: 'Appointed as CBSE Center Superintendent for Regional Olympiad',
      status: 'PENDING',
      appliedAt: '2024-11-24',
    },
  ]);

  // Daily Arrangement Orders State
  const [substitutions, setSubstitutions] = useState<SubstitutionOrder[]>([
    {
      id: 'sub-01',
      date: '2024-11-25',
      periodNo: 1,
      absentTeacherId: 'tch-01',
      absentTeacherName: 'Smt. Ananya Sen',
      substituteTeacherId: 'tch-06',
      substituteTeacherName: 'Smt. Kavita Sharma',
      classGrade: 10,
      section: 'A',
      subject: 'Mathematics',
      notes: 'Subject Specialist Arrangement (Mathematics)',
      status: 'ACKNOWLEDGED',
    },
    {
      id: 'sub-02',
      date: '2024-11-25',
      periodNo: 3,
      absentTeacherId: 'tch-01',
      absentTeacherName: 'Smt. Ananya Sen',
      substituteTeacherId: 'tch-02',
      substituteTeacherName: 'Dr. R. Ramanujan',
      classGrade: 12,
      section: 'A',
      subject: 'Mathematics',
      notes: 'Senior Secondary Study Hall Supervision',
      status: 'ASSIGNED',
    },
  ]);

  // Leave Application Form (Teacher)
  const [applyType, setApplyType] = useState<FacultyLeaveType>('CASUAL_LEAVE');
  const [applyStartDate, setApplyStartDate] = useState('2024-12-05');
  const [applyEndDate, setApplyEndDate] = useState('2024-12-05');
  const [applyReason, setApplyReason] = useState('');

  // Daily Absentee Selection (Admin)
  const [selectedAbsentId, setSelectedAbsentId] = useState('tch-01');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Balances for Current Teacher
  const teacherApproved = leaves.filter((l) => l.teacherId === currentTeacherId && l.status === 'APPROVED');
  const balances = calculateFacultyLeaveBalance(teacherApproved);

  // Subsitutions assigned to current teacher
  const myAssignedSubs = substitutions.filter((s) => s.substituteTeacherId === currentTeacherId);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyReason) return;

    const currentTeacher = FACULTY_ROSTER.find((t) => t.id === currentTeacherId);
    const newLeave: FacultyLeaveApplication = {
      id: `lv-${Date.now()}`,
      teacherId: currentTeacherId,
      teacherName: currentTeacher?.name || 'Faculty Member',
      leaveType: applyType,
      startDate: applyStartDate,
      endDate: applyEndDate,
      reason: applyReason,
      status: 'PENDING',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    setLeaves([newLeave, ...leaves]);
    setApplyReason('');
    setFeedback(`Leave application submitted for approval. Timetable department alerted.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleApproveLeave = (leaveId: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: 'APPROVED' } : l))
    );
    const lv = leaves.find((l) => l.id === leaveId);
    setFeedback(`Leave application for ${lv?.teacherName} APPROVED. Statutory quota adjusted.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRunArrangement = () => {
    const absentTeacher = FACULTY_ROSTER.find((t) => t.id === selectedAbsentId);
    if (!absentTeacher) return;

    const todayStr = '2024-11-25';
    const newOrders = generateAutomatedSubstitutions(
      [{ id: absentTeacher.id, name: absentTeacher.name }],
      todayStr,
      'MONDAY',
      MOCK_TIMETABLE_SLOTS,
      FACULTY_ROSTER
    );

    setSubstitutions(newOrders);
    setFeedback(`Generated ${newOrders.length} period substitutions for ${absentTeacher.name}. SMS dispatches queued.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-emerald-600 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TEACHER MODE VIEW */}
      {role === 'teacher' && (
        <div className="space-y-6">
          {/* Statutory 7th CPC Leave Balances */}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              My Statutory Leave Balances (Academic Session 2024-25)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Casual Leave (CL)</span>
                    <Badge variant="outline" className="text-[10px] font-mono">8 Total</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {balances.CASUAL_LEAVE.remaining} <span className="text-xs font-normal text-slate-500">days left</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{balances.CASUAL_LEAVE.used} days availed</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Earned Leave (EL)</span>
                    <Badge variant="outline" className="text-[10px] font-mono">12 Total</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {balances.EARNED_LEAVE.remaining} <span className="text-xs font-normal text-slate-500">days left</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{balances.EARNED_LEAVE.used} days availed</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Medical Leave (ML)</span>
                    <Badge variant="outline" className="text-[10px] font-mono">20 Total</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {balances.MEDICAL_LEAVE.remaining} <span className="text-xs font-normal text-slate-500">days left</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{balances.MEDICAL_LEAVE.used} days availed</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">CBSE On-Duty (OD)</span>
                    <Badge variant="outline" className="text-[10px] font-mono">15 Total</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                    {balances.ON_DUTY_CBSE.remaining} <span className="text-xs font-normal text-slate-500">days left</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{balances.ON_DUTY_CBSE.used} days availed</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Active Period Substitutions Assigned to Me */}
          {myAssignedSubs.length > 0 && (
            <Card className="border-indigo-200 bg-indigo-50/40 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Periods Assigned to You as Substitute (Today)
                </CardTitle>
                <CardDescription className="text-xs text-indigo-800">
                  You have been assigned the following lecture arrangements due to peer absence:
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {myAssignedSubs.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-white rounded-lg border border-indigo-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className="bg-indigo-600 text-white font-mono text-[11px]">
                          Period {sub.periodNo}
                        </Badge>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            Class {sub.classGrade}-{sub.section} • {sub.subject}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            Substituting for: {sub.absentTeacherName} ({sub.notes})
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-700 bg-emerald-50 text-[10px]">
                        {sub.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apply Leave Form & Leave Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-slate-200 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-600" />
                  Apply for Faculty Leave
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Submit digital leave application for Principal sanction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApplyLeave} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Leave Type *</label>
                    <select
                      value={applyType}
                      onChange={(e) => setApplyType(e.target.value as any)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="CASUAL_LEAVE">Casual Leave (CL)</option>
                      <option value="EARNED_LEAVE">Earned Leave (EL)</option>
                      <option value="MEDICAL_LEAVE">Medical Leave (ML)</option>
                      <option value="ON_DUTY_CBSE">CBSE On-Duty (OD)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">From *</label>
                      <Input
                        type="date"
                        required
                        value={applyStartDate}
                        onChange={(e) => setApplyStartDate(e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">To *</label>
                      <Input
                        type="date"
                        required
                        value={applyEndDate}
                        onChange={(e) => setApplyEndDate(e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Reason *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Specify reason for absence..."
                      value={applyReason}
                      onChange={(e) => setApplyReason(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Submit Leave Application
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Leave History Table */}
            <Card className="border-slate-200 lg:col-span-2">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  My Leave Application History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-3">Reason</th>
                        <th className="py-2.5 px-3">Applied</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaves.filter((l) => l.teacherId === currentTeacherId).map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {l.leaveType.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {l.startDate} to {l.endDate}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 truncate max-w-[180px]">
                            {l.reason}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                            {l.appliedAt}
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge
                              className={`text-[10px] ${
                                l.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : l.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {l.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ADMIN MODE VIEW */}
      {role === 'admin' && (
        <div className="space-y-6">
          {/* Arrangement Matrix Generator */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Automated Period Substitution Engine (Arrangement Register)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Algorithms scan the master timetable, locate free periods, prioritize subject peers, and generate balanced substitution orders.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedAbsentId}
                    onChange={(e) => setSelectedAbsentId(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    {FACULTY_ROSTER.map((f) => (
                      <option key={f.id} value={f.id}>
                        Absent: {f.name} ({f.department})
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={handleRunArrangement}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate Substitutions
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Substitution Orders Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Absent Teacher</th>
                      <th className="py-2.5 px-3">Assigned Substitute</th>
                      <th className="py-2.5 px-3">Optimization Logic</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {substitutions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">
                          Period {sub.periodNo}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          Class {sub.classGrade}-{sub.section}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{sub.subject}</td>
                        <td className="py-3 px-3 text-rose-600 font-medium">
                          {sub.absentTeacherName}
                        </td>
                        <td className="py-3 px-3 text-emerald-700 font-bold">
                          {sub.substituteTeacherName}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {sub.notes}
                        </td>
                        <td className="py-3 px-3">
                          <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                            {sub.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Generating official printable daily Arrangement Slip PDF with Principal signature line.')}
                  className="text-xs h-8 flex items-center gap-1.5 text-slate-700"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Daily Arrangement Register
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Faculty Leave Sanction Queue */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-600" />
                Faculty Leave Sanction & Approval Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Faculty Member</th>
                      <th className="py-2.5 px-3">Leave Category</th>
                      <th className="py-2.5 px-3">From - To</th>
                      <th className="py-2.5 px-3">Reason</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Sanction Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaves.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {l.teacherName}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {l.leaveType.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {l.startDate} to {l.endDate}
                        </td>
                        <td className="py-3 px-3 text-slate-500">{l.reason}</td>
                        <td className="py-3 px-3">
                          <Badge
                            className={`text-[10px] ${
                              l.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : l.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {l.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {l.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleApproveLeave(l.id)}
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setLeaves((prev) =>
                                    prev.map((item) =>
                                      item.id === l.id ? { ...item, status: 'REJECTED' } : item
                                    )
                                  );
                                }}
                                className="h-7 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
