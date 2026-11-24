'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  Send,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  LeaveRequest,
  LeaveType,
  calculateLeaveDays,
  validateLeaveRequest,
  checkExamEligibility,
} from '@/modules/attendance/leave';

const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: 'LV-2024-001',
    studentId: 'STD-101',
    studentName: 'Aarav Sharma',
    gradeSection: 'Grade 10-A',
    rollNo: '14',
    leaveType: 'MEDICAL',
    startDate: '2024-11-12',
    endDate: '2024-11-13',
    isHalfDay: false,
    totalDays: 2,
    reason: 'Acute seasonal flu and doctor-advised rest',
    attachmentName: 'dr_gupta_prescription.pdf',
    parentContact: '+91 98100 12345',
    status: 'APPROVED',
    appliedAt: '2024-11-11T18:30:00Z',
    decidedAt: '2024-11-12T07:45:00Z',
    teacherRemarks: 'Sanctioned by Class Teacher (Ms. Priya Sen). Medical cert received.',
  },
  {
    id: 'LV-2024-002',
    studentId: 'STD-101',
    studentName: 'Aarav Sharma',
    gradeSection: 'Grade 10-A',
    rollNo: '14',
    leaveType: 'FAMILY_EVENT',
    startDate: '2024-10-04',
    endDate: '2024-10-04',
    isHalfDay: true,
    totalDays: 0.5,
    reason: 'Elder sister wedding pre-ceremony',
    parentContact: '+91 98100 12345',
    status: 'APPROVED',
    appliedAt: '2024-10-02T10:00:00Z',
    decidedAt: '2024-10-03T08:00:00Z',
    teacherRemarks: 'Approved for second half.',
  },
];

export function ParentLeaveManager() {
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('MEDICAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Child statistics
  const totalWorkingDays = 110;
  const presentDays = 94;
  const approvedLeaveDays = requests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.totalDays, 0);

  const eligibility = checkExamEligibility(totalWorkingDays, presentDays, approvedLeaveDays, false);

  const calculatedDays = startDate && endDate ? calculateLeaveDays(startDate, endDate, isHalfDay) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeaveRequest({ startDate, endDate, leaveType, reason });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const newRequest: LeaveRequest = {
      id: `LV-2024-${Math.floor(100 + Math.random() * 900)}`,
      studentId: 'STD-101',
      studentName: 'Aarav Sharma',
      gradeSection: 'Grade 10-A',
      rollNo: '14',
      leaveType,
      startDate,
      endDate,
      isHalfDay,
      totalDays: calculatedDays,
      reason,
      parentContact: '+91 98100 12345',
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    };

    setRequests([newRequest, ...requests]);
    setFeedback(`Leave application submitted successfully for ${newRequest.totalDays} day(s). Notification dispatched to Class Teacher.`);
    setShowForm(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    setErrors([]);

    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Submitted</Badge>
        </div>
      )}

      {/* CBSE Rule 13 Attendance Compliance Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Attendance YTD</p>
              <p className="text-xl font-bold text-slate-900">{eligibility.effectiveAttendancePercent}%</p>
              <p className="text-[10px] text-slate-500">{presentDays} of {totalWorkingDays} working days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${eligibility.isEligibleForCbseExams ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">CBSE Rule 13 (75% Gate)</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-slate-900">
                  {eligibility.isEligibleForCbseExams ? 'Eligible' : 'Shortfall Alert'}
                </span>
                <Badge variant={eligibility.isEligibleForCbseExams ? 'success' : 'destructive'} className="text-[9px] py-0">
                  {eligibility.isEligibleForCbseExams ? 'Above 75%' : `${eligibility.shortfallDays} days short`}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Sanctioned Leaves</p>
              <p className="text-xl font-bold text-slate-900">{approvedLeaveDays} Days</p>
              <p className="text-[10px] text-slate-500">Official medical & casual</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Quick Action</p>
              <p className="text-xs text-slate-600 mt-0.5">Need student absence?</p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowForm(!showForm)}
              className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {showForm ? 'Close Form' : 'Apply Leave'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Application Form */}
      {showForm && (
        <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <CardHeader className="p-4 border-b border-indigo-100">
            <CardTitle className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              New Student Leave Application
            </CardTitle>
            <CardDescription className="text-xs text-indigo-700">
              Submitted requests are routed directly to Aarav's Class Teacher for immediate authorization.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
                  {errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="MEDICAL">Medical / Illness</option>
                    <option value="CASUAL">Casual / Personal</option>
                    <option value="FAMILY_EVENT">Family Function</option>
                    <option value="BEREAVEMENT">Bereavement</option>
                    <option value="OUT_OF_STATION">Out of Station Travel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="halfDay"
                  checked={isHalfDay}
                  onChange={(e) => setIsHalfDay(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="halfDay" className="text-xs text-slate-700 font-medium">
                  Half-day leave only (afternoon session)
                </label>
                {calculatedDays > 0 && (
                  <span className="ml-auto text-xs font-semibold text-indigo-700">
                    Net Working Leave: {calculatedDays} day(s)
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Reason</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., Suffering from high fever since yesterday evening, resting under pediatrician observation."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  <Send className="h-3 w-3" />
                  Submit to Class Teacher
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* History of Leave Applications */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Leave Application History
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Real-time audit log of all leaves requested and their teacher approvals.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {requests.length} Applications
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Application Ref & Type</th>
                  <th className="py-2.5 px-3">Duration & Dates</th>
                  <th className="py-2.5 px-3">Days</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{req.id}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {req.leaveType.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {req.startDate} to {req.endDate}
                      {req.isHalfDay && <span className="text-[10px] text-amber-600 block">(Half Day)</span>}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {req.totalDays}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="py-3 px-3">
                      {req.status === 'APPROVED' && (
                        <Badge variant="success" className="text-[10px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </Badge>
                      )}
                      {req.status === 'PENDING' && (
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                      {req.status === 'REJECTED' && (
                        <Badge variant="destructive" className="text-[10px] flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" /> Rejected
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic text-[11px]">
                      {req.teacherRemarks || 'Awaiting teacher review'}
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
