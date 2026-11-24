'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  StaffAttendanceRecord,
  StaffMusterSummary,
  TerminalType,
  AttendanceStatus,
  INITIAL_STAFF_ATTENDANCE_LOGS,
  processStaffPunch,
  compileStaffMusterRoll,
} from '@/modules/staff/biometric-attendance';
import {
  Fingerprint,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles,
  CalendarCheck,
  FileText,
  AlertCircle,
  Radio,
} from 'lucide-react';

interface StaffAttendanceManagerProps {
  viewMode?: 'admin' | 'teacher';
  currentTeacher?: {
    staffId: string;
    staffName: string;
    department: string;
    designation: string;
  };
}

const STATUS_BADGES: Record<
  AttendanceStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  PRESENT_ON_TIME: {
    label: 'Present (On Time)',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
  },
  LATE_ARRIVAL: {
    label: 'Late Arrival',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30',
  },
  HALF_DAY_LATE: {
    label: 'Half-Day Late',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30',
  },
  ON_DUTY_OD: {
    label: 'On Duty (CBSE / Event)',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-500/30',
  },
  CASUAL_LEAVE: {
    label: 'Casual Leave (CL)',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500/30',
  },
  MEDICAL_LEAVE: {
    label: 'Medical Leave (ML)',
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-500/30',
  },
  ABSENT: {
    label: 'Unexcused Absent',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/30',
  },
};

const MOCK_FACULTY_ROSTER = [
  { staffId: 'EMP-001', staffName: 'Dr. Ramesh Sharma', department: 'Science (Physics)' },
  { staffId: 'EMP-002', staffName: 'Mrs. Sunita Kaul', department: 'Mathematics' },
  { staffId: 'EMP-003', staffName: 'Mr. Arvind Saxena', department: 'Social Science' },
  { staffId: 'EMP-004', staffName: 'Ms. Pooja Bhatia', department: 'Computer Science' },
  { staffId: 'EMP-005', staffName: 'Mr. Vikram Sen', department: 'Physical Education' },
  { staffId: 'EMP-006', staffName: 'Mrs. Deepa Nair', department: 'English & Literature' },
];

export function StaffAttendanceManager({
  viewMode = 'admin',
  currentTeacher = {
    staffId: 'EMP-001',
    staffName: 'Dr. Ramesh Sharma',
    department: 'Science (Physics)',
    designation: 'PGT Senior Teacher',
  },
}: StaffAttendanceManagerProps) {
  const [logs, setLogs] = useState<StaffAttendanceRecord[]>(INITIAL_STAFF_ATTENDANCE_LOGS);
  const [activeTab, setActiveTab] = useState<'today' | 'muster'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Clock-in form state
  const [clockInStaffId, setClockInStaffId] = useState(currentTeacher.staffId);
  const [punchTime, setPunchTime] = useState('07:44');
  const [terminalType, setTerminalType] = useState<TerminalType>('MOBILE_GEOFENCE');
  const [simulateOutOfBounds, setSimulateOutOfBounds] = useState(false);

  // Compile Muster Roll
  const musterRoll = compileStaffMusterRoll(MOCK_FACULTY_ROSTER, logs, '2026-04', 24);

  // Today metrics
  const totalLogged = logs.length;
  const onTimeCount = logs.filter((l) => l.status === 'PRESENT_ON_TIME').length;
  const lateCount = logs.filter((l) => l.status === 'LATE_ARRIVAL' || l.status === 'HALF_DAY_LATE').length;
  const arrangementCount = logs.filter((l) => l.arrangementRequired).length;

  // Filtered today logs
  const filteredLogs = logs.filter((l) => {
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesQuery =
      l.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.staffId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Handle Punch In
  const handleClockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const faculty = MOCK_FACULTY_ROSTER.find((f) => f.staffId === clockInStaffId) || {
      staffId: currentTeacher.staffId,
      staffName: currentTeacher.staffName,
      department: currentTeacher.department,
    };

    try {
      const gpsCoords = simulateOutOfBounds
        ? { lat: 28.6200, lng: 77.3000 } // 10 km away
        : { lat: 28.5701, lng: 77.1902 }; // Inside campus (30m)

      const record = processStaffPunch({
        staffId: faculty.staffId,
        staffName: faculty.staffName,
        department: faculty.department,
        designation: 'Faculty Member',
        date: new Date().toISOString().split('T')[0],
        punchTime24: punchTime,
        terminalType,
        gpsCoords: terminalType === 'MOBILE_GEOFENCE' ? gpsCoords : undefined,
      });

      setLogs([record, ...logs.filter((l) => l.staffId !== record.staffId)]);
      setFeedback(
        `Punch registered for ${record.staffName} at ${record.punchInTime} via ${record.terminalType}. Status: ${record.status.replace(/_/g, ' ')}.`
      );
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Error processing punch');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Biometric AIS-Terminals & Geofence (200m Perimeter)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Faculty & Staff Biometric Attendance Desk</h1>
            <p className="text-sm text-indigo-200/80 max-w-2xl mt-1">
              Real-time thumbprint, facial recognition, and mobile geofenced clock-ins with statutory 3-Late = 1 CL deduction audit.
            </p>
          </div>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-indigo-600/30 text-xs">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'today' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-300 hover:text-white'
              }`}
            >
              Today's Live Clock-Ins
            </button>
            <button
              onClick={() => setActiveTab('muster')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'muster' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-300 hover:text-white'
              }`}
            >
              Monthly Muster Roll ({musterRoll.length})
            </button>
          </div>
        </div>
      </div>

      {/* Live Operational Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Faculty Logged Today</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {totalLogged} / {MOCK_FACULTY_ROSTER.length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Shift: 07:45 AM - 02:15 PM</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>On-Time Morning Arrivals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {onTimeCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Within 10-min grace period</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Late Arrivals Marked</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {lateCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Flagged for CL forfeiture rule</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Period Substitution Alerts</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {arrangementCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {arrangementCount > 0 ? (
              <Link href="/portal/admin/staff/substitution" className="text-indigo-600 underline font-medium">
                Dispatch Substitutions &rarr;
              </Link>
            ) : (
              'All periods covered'
            )}
          </div>
        </div>
      </div>

      {/* Main Tab 1: Live Today's Log & Punch Simulator */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table of Live Punches (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search faculty or dept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['ALL', 'PRESENT_ON_TIME', 'LATE_ARRIVAL', 'HALF_DAY_LATE', 'CASUAL_LEAVE'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {st === 'ALL'
                        ? 'All'
                        : st === 'PRESENT_ON_TIME'
                        ? 'On Time'
                        : st === 'LATE_ARRIVAL'
                        ? 'Late'
                        : st === 'HALF_DAY_LATE'
                        ? 'Half-Day'
                        : 'On Leave'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-3">Staff Code</th>
                      <th className="p-3">Faculty Name & Dept</th>
                      <th className="p-3">Punch Time</th>
                      <th className="p-3">Terminal / Verification</th>
                      <th className="p-3">Attendance Status</th>
                      <th className="p-3">Arrangement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLogs.map((l) => {
                      const badge = STATUS_BADGES[l.status];
                      return (
                        <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-mono font-medium text-foreground">{l.staffId}</td>
                          <td className="p-3">
                            <div className="font-semibold text-foreground">{l.staffName}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {l.department} &bull; {l.designation}
                            </div>
                          </td>
                          <td className="p-3 font-mono font-bold text-foreground">
                            {l.punchInTime || 'No Punch'}
                            {l.lateMinutes > 0 && (
                              <span className="block text-[10px] text-amber-600 font-sans">
                                +{l.lateMinutes} min late
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 text-foreground">
                              {l.terminalType === 'BIOMETRIC_THUMB' && (
                                <Fingerprint className="w-3.5 h-3.5 text-indigo-500" />
                              )}
                              {l.terminalType === 'MOBILE_GEOFENCE' && (
                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                              {l.terminalType === 'FACIAL_RECOGNITION' && (
                                <Radio className="w-3.5 h-3.5 text-blue-500" />
                              )}
                              <span>{l.terminalType.replace(/_/g, ' ')}</span>
                            </div>
                            {l.distanceMetersFromCampus !== undefined && (
                              <span className="text-[10px] text-emerald-600 block">
                                &bull; {l.distanceMetersFromCampus}m from Campus Gate
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="p-3">
                            {l.arrangementRequired ? (
                              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold">
                                Substitution Required
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-[11px]">Normal</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Clock-In Punch Terminal Simulator */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Fingerprint className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-sm text-foreground">Clock-In Punch Terminal</h3>
                  <p className="text-[11px] text-muted-foreground">Biometric terminal or mobile geofenced punch</p>
                </div>
              </div>

              <form onSubmit={handleClockInSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Select Faculty Member:</label>
                  <select
                    value={clockInStaffId}
                    onChange={(e) => setClockInStaffId(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg p-2 text-xs text-foreground focus:outline-none"
                  >
                    {MOCK_FACULTY_ROSTER.map((f) => (
                      <option key={f.staffId} value={f.staffId}>
                        {f.staffName} ({f.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Punch Time (24h):</label>
                    <input
                      type="time"
                      required
                      value={punchTime}
                      onChange={(e) => setPunchTime(e.target.value)}
                      className="w-full bg-muted/50 border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Terminal Device:</label>
                    <select
                      value={terminalType}
                      onChange={(e) => setTerminalType(e.target.value as TerminalType)}
                      className="w-full bg-muted/50 border border-input rounded-lg p-1.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="MOBILE_GEOFENCE">Mobile Geofence (GPS)</option>
                      <option value="BIOMETRIC_THUMB">Biometric Thumb (Gate 1)</option>
                      <option value="FACIAL_RECOGNITION">Face AI (Staff Room)</option>
                      <option value="MANUAL_ADMIN">Manual Sanction</option>
                    </select>
                  </div>
                </div>

                {terminalType === 'MOBILE_GEOFENCE' && (
                  <div className="p-2.5 bg-muted/40 rounded-lg border border-border space-y-1.5">
                    <span className="font-semibold text-foreground block text-[11px]">
                      Campus Perimeter Geofencing (200m Max):
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={simulateOutOfBounds}
                        onChange={(e) => setSimulateOutOfBounds(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>Simulate Outside Campus (10 km away &bull; Should Reject)</span>
                    </label>
                  </div>
                )}

                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-300 rounded-lg text-[11px] space-y-1">
                  <span className="font-bold block">CBSE Service Condition Shift Rules:</span>
                  <p>&bull; 07:45 to 07:55 AM: Punctual arrival (Grace period)</p>
                  <p>&bull; 07:56 to 08:15 AM: Late mark (3 Lates = 0.5 CL deduction)</p>
                  <p>&bull; Beyond 08:15 AM: Half-day penalty & period substitution</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Register Staff Punch</span>
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 text-xs space-y-2">
              <span className="font-bold text-foreground block">Period Substitution Interlock:</span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Teachers arriving after 08:15 AM or on unscheduled leave automatically populate the arrangement matrix before Period 1 bell.
              </p>
              <Link
                href="/portal/admin/staff/substitution"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline"
              >
                <span>Open Arrangement Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Monthly Staff Muster Roll & Late Deduction Audit */}
      {activeTab === 'muster' && (
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-600" />
                Staff Monthly Muster Roll & Leave Deduction Audit &ndash; April 2026
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory monthly muster roll compiled for payroll disbursement (24 Total Working Days).
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Muster Roll</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Staff Code</th>
                  <th className="p-3">Faculty Name & Dept</th>
                  <th className="p-3">Working Days</th>
                  <th className="p-3">Present Days</th>
                  <th className="p-3">Late Marks</th>
                  <th className="p-3">Sanctioned Leaves</th>
                  <th className="p-3">3-Late Penalty (CL)</th>
                  <th className="p-3 text-right">Net Payable Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {musterRoll.map((m) => (
                  <tr key={m.staffId} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-medium text-foreground">{m.staffId}</td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{m.staffName}</div>
                      <div className="text-[11px] text-muted-foreground">{m.department}</div>
                    </td>
                    <td className="p-3 font-mono">{m.totalWorkingDays}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">{m.presentDays}</td>
                    <td className="p-3 font-mono">
                      <span className={m.lateArrivalsCount >= 3 ? 'text-destructive font-bold' : 'text-foreground'}>
                        {m.lateArrivalsCount}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-blue-600">{m.approvedLeavesCount}</td>
                    <td className="p-3 font-mono">
                      {m.statutoryClDeductions > 0 ? (
                        <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive rounded font-bold">
                          -{m.statutoryClDeductions} CL
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-sm text-foreground">
                      {m.netPayableDays} Days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
