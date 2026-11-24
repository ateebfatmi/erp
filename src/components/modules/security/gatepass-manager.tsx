'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck,
  UserCheck,
  DoorOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Car,
  Phone,
  FileCheck,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import {
  VisitorPass,
  StudentEarlyGatepass,
  VisitorType,
  ExitReason,
  createVisitorPass,
  issueStudentEarlyGatepass,
  confirmStudentExit,
} from '@/modules/security/gatepass';

const INITIAL_VISITORS: VisitorPass[] = [
  {
    passId: 'VP-101',
    badgeNumber: 'VIS-402',
    visitorName: 'Rajesh Kulkarni',
    visitorPhone: '+91 98110 99887',
    visitorType: 'PARENT',
    purpose: 'Meeting Class Teacher regarding Olympiad preparation',
    hostName: 'Ms. Priya Sen',
    hostDepartment: 'Mathematics Department',
    vehicleNumber: 'DL-3C-AS-4012',
    checkInTime: '2024-11-25T09:30:00+05:30',
    status: 'CHECKED_IN',
  },
  {
    passId: 'VP-102',
    badgeNumber: 'VIS-403',
    visitorName: 'Dr. Alok Verma',
    visitorPhone: '+91 98200 44332',
    visitorType: 'GOVT_INSPECTOR',
    purpose: 'Directorate of Education Safety & Fire Audit',
    hostName: 'Dr. Rajeshwar Sharma',
    hostDepartment: 'Principal Office',
    vehicleNumber: 'DL-1C-ZZ-1001',
    checkInTime: '2024-11-25T10:00:00+05:30',
    status: 'CHECKED_IN',
  },
  {
    passId: 'VP-103',
    badgeNumber: 'VIS-401',
    visitorName: 'Sunil Sharma',
    visitorPhone: '+91 98112 33445',
    visitorType: 'VENDOR',
    purpose: 'Science Lab Glassware Delivery',
    hostName: 'Mr. Arvind Joshi',
    hostDepartment: 'Science Laboratories',
    vehicleNumber: 'HR-26-AB-9922',
    checkInTime: '2024-11-25T08:45:00+05:30',
    checkOutTime: '2024-11-25T09:20:00+05:30',
    status: 'CHECKED_OUT',
  },
];

const INITIAL_GATEPASSES: StudentEarlyGatepass[] = [
  {
    gatepassId: 'GP-8912',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    gradeSection: 'Grade 10-A',
    admissionNo: 'DPS-2024-0412',
    reason: 'DOCTOR_APPOINTMENT',
    detailedCause: 'Pre-scheduled dental orthodontic consultation',
    guardianName: 'Sanjay Mehta',
    guardianRelation: 'Father',
    guardianPhone: '+91 98110 12345',
    authorizedByTeacher: 'Ms. Priya Sen (Class Teacher)',
    authorizedByPrincipal: true,
    issuedAt: '2024-11-25T11:00:00+05:30',
    status: 'ISSUED_PENDING_EXIT',
    securityGuardOnDuty: 'Head Guard Baljit Singh (Gate 1)',
  },
];

export function GatepassManager() {
  const [activeTab, setActiveTab] = useState<'VISITORS' | 'STUDENT_EXITS'>('VISITORS');
  const [visitors, setVisitors] = useState<VisitorPass[]>(INITIAL_VISITORS);
  const [gatepasses, setGatepasses] = useState<StudentEarlyGatepass[]>(INITIAL_GATEPASSES);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Visitor Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorType, setVisitorType] = useState<VisitorType>('PARENT');
  const [purpose, setPurpose] = useState('');
  const [hostName, setHostName] = useState('Ms. Priya Sen');
  const [hostDept, setHostDept] = useState('Senior Secondary Wing');
  const [vehicleNo, setVehicleNo] = useState('');

  // Student Exit Form State
  const [exitStudentName, setExitStudentName] = useState('Aarav Mehta');
  const [exitReason, setExitReason] = useState<ExitReason>('DOCTOR_APPOINTMENT');
  const [exitGuardianName, setExitGuardianName] = useState('Sanjay Mehta');
  const [exitGuardianRel, setExitGuardianRel] = useState('Father');
  const [exitGuardianPhone, setExitGuardianPhone] = useState('+91 98110 12345');
  const [exitCause, setExitCause] = useState('Doctor appointment confirmed by parent.');

  const activeVisitorsCount = visitors.filter((v) => v.status === 'CHECKED_IN').length;
  const pendingExitCount = gatepasses.filter((g) => g.status === 'ISSUED_PENDING_EXIT').length;

  const handleCheckOutVisitor = (passId: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.passId === passId
          ? { ...v, status: 'CHECKED_OUT', checkOutTime: new Date().toISOString() }
          : v
      )
    );
    setFeedback('Visitor checked out. Badge returned to security desk.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleConfirmExit = (gatepassId: string) => {
    setGatepasses((prev) =>
      prev.map((g) => (g.gatepassId === gatepassId ? confirmStudentExit(g) : g))
    );
    setFeedback('Student exit confirmed at Main Gate. Guardian identity verified.');
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pass = createVisitorPass({
        visitorName,
        visitorPhone,
        visitorType,
        purpose,
        hostName,
        hostDepartment: hostDept,
        vehicleNumber: vehicleNo,
      });

      setVisitors([pass, ...visitors]);
      setFeedback(`Visitor pass #${pass.badgeNumber} issued to ${pass.visitorName}.`);
      setShowVisitorModal(false);
      setVisitorName('');
      setVisitorPhone('');
      setPurpose('');
      setVehicleNo('');
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCreateGatepass = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gp = issueStudentEarlyGatepass({
        studentId: 'std-101',
        studentName: exitStudentName,
        gradeSection: 'Grade 10-A',
        admissionNo: 'DPS-2024-0412',
        reason: exitReason,
        detailedCause: exitCause,
        guardianName: exitGuardianName,
        guardianRelation: exitGuardianRel,
        guardianPhone: exitGuardianPhone,
        authorizedByTeacher: 'Ms. Priya Sen (Class Teacher)',
      });

      setGatepasses([gp, ...gatepasses]);
      setFeedback(`Early Gatepass #${gp.gatepassId} issued for ${gp.studentName}. Verified for Gate 1 security.`);
      setShowExitModal(false);
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Secured</Badge>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-indigo-600" />
            Campus Perimeter Security &amp; Gatepass Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            POCSO Child Safety Compliance &bull; Main Gate Visitor Verification &amp; Authorized Student Early Exit Desk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowVisitorModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Issue Visitor Pass
          </Button>
          <Button
            size="sm"
            onClick={() => setShowExitModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Student Early Exit
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Active Visitors</p>
              <p className="text-xl font-bold text-slate-900">{activeVisitorsCount} On Campus</p>
              <p className="text-[10px] text-slate-500">Badges checked-in</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${pendingExitCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Early Student Exits</p>
              <p className="text-xl font-bold text-slate-900">{pendingExitCount} Pending Gate</p>
              <p className="text-[10px] text-slate-500">Authorized departures</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Perimeter Guard</p>
              <p className="text-sm font-bold text-slate-900">Gate 1: Head Guard Baljit</p>
              <p className="text-[10px] text-emerald-600 font-semibold">CCTV Surveillance Live</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">POCSO Child Safety</p>
              <p className="text-sm font-bold text-slate-900">Strict Guardian Verification</p>
              <p className="text-[10px] text-slate-500">No unescorted exits permitted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('VISITORS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'VISITORS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Visitor Passes &amp; Perimeter Check-in ({visitors.length})
        </button>

        <button
          onClick={() => setActiveTab('STUDENT_EXITS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'STUDENT_EXITS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <LogOut className="h-4 w-4" />
          Student Early Departure Gatepasses ({gatepasses.length})
        </button>
      </div>

      {/* TAB 1: VISITORS */}
      {activeTab === 'VISITORS' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Main Gate Visitor Entry Ledger
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Real-time log of visitors on campus with badge issuance and vehicle tracking.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Badge &amp; Visitor</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Purpose</th>
                    <th className="py-2.5 px-3">Host / Department</th>
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3">Check-in Time</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map((v) => (
                    <tr key={v.passId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{v.visitorName}</span>
                        <span className="text-[10px] font-mono text-indigo-600 font-bold">{v.badgeNumber} &bull; {v.visitorPhone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          {v.visitorType}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                        {v.purpose}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800 block">{v.hostName}</span>
                        <span className="text-[10px] text-slate-400">{v.hostDepartment}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {v.vehicleNumber || '— (Walk-in)'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {new Date(v.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={v.status === 'CHECKED_IN' ? 'success' : 'outline'} className="text-[10px]">
                          {v.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {v.status === 'CHECKED_IN' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-7 px-2 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleCheckOutVisitor(v.passId)}
                          >
                            Check-Out
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: STUDENT EARLY EXITS */}
      {activeTab === 'STUDENT_EXITS' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Student Early Departure Authorizations
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Guardians must verify identity at Gate 1 before student can be released.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Pass Ref &amp; Student</th>
                    <th className="py-2.5 px-3">Class &amp; Adm No</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Escorting Guardian</th>
                    <th className="py-2.5 px-3">Authorization</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Gate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gatepasses.map((g) => (
                    <tr key={g.gatepassId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{g.studentName}</span>
                        <span className="text-[10px] font-mono font-bold text-amber-700">{g.gatepassId}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {g.gradeSection} &bull; {g.admissionNo}
                      </td>
                      <td className="py-3 px-3 text-slate-800">
                        <Badge variant="outline" className="text-[10px] block w-fit mb-0.5">
                          {g.reason.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-[11px] text-slate-500">{g.detailedCause}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-900 block">{g.guardianName} ({g.guardianRelation})</span>
                        <span className="text-[10px] font-mono text-slate-500">{g.guardianPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <span className="text-[11px] font-medium block text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {g.authorizedByTeacher}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={g.status === 'EXITED_CAMPUS' ? 'outline' : 'warning'}
                          className="text-[10px]"
                        >
                          {g.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {g.status === 'ISSUED_PENDING_EXIT' ? (
                          <Button
                            size="sm"
                            className="text-[11px] h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 ml-auto"
                            onClick={() => handleConfirmExit(g.gatepassId)}
                          >
                            <DoorOpen className="h-3 w-3" />
                            Confirm Exit
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Exited</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visitor Modal */}
      {showVisitorModal && (
        <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <CardHeader className="p-4 border-b border-indigo-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-600" />
                Issue Official Campus Visitor Entry Badge
              </CardTitle>
              <CardDescription className="text-xs text-indigo-700">
                Instant identity validation and perimeter badge allocation.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowVisitorModal(false)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleCreateVisitor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Visitor Full Name *</label>
                  <Input
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">10-Digit Mobile *</label>
                  <Input
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+91 98110 00000"
                    className="text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Visitor Category</label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as VisitorType)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="PARENT">Parent / Guardian</option>
                    <option value="VENDOR">Vendor / Contractor</option>
                    <option value="GOVT_INSPECTOR">Government / CBSE Official</option>
                    <option value="INTERVIEWEE">Job Candidate</option>
                    <option value="GUEST">General Guest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Whom to Meet *</label>
                  <Input
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="e.g. Ms. Priya Sen / Principal"
                    className="text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                  <Input
                    value={hostDept}
                    onChange={(e) => setHostDept(e.target.value)}
                    placeholder="e.g. Senior Secondary Wing"
                    className="text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Vehicle Registration No</label>
                  <Input
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="e.g. DL-3C-AS-4012"
                    className="text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Purpose of Visit *</label>
                <Input
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Fee payment inquiry & discussion on student progress"
                  className="text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="text-xs h-8" onClick={() => setShowVisitorModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Print &amp; Allocate Badge
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Student Early Exit Modal */}
      {showExitModal && (
        <Card className="border-amber-200 bg-amber-50/20 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <CardHeader className="p-4 border-b border-amber-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-amber-950 flex items-center gap-2">
                <LogOut className="h-4 w-4 text-amber-600" />
                Authorize Student Early Departure Gatepass
              </CardTitle>
              <CardDescription className="text-xs text-amber-800">
                Requires escorting guardian verification and Class Teacher sign-off.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowExitModal(false)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleCreateGatepass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Student Name &amp; Section</label>
                  <Input value={exitStudentName} onChange={(e) => setExitStudentName(e.target.value)} className="text-xs bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Exit Reason</label>
                  <select
                    value={exitReason}
                    onChange={(e) => setExitReason(e.target.value as ExitReason)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="DOCTOR_APPOINTMENT">Pre-scheduled Doctor Appointment</option>
                    <option value="FAMILY_EMERGENCY">Family Emergency</option>
                    <option value="SICKNESS_INFIRMARY">Sickness (Nurse Recommended Exit)</option>
                    <option value="INTER_SCHOOL_TOURNAMENT">Inter-School Sports / Competition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Escorting Guardian *</label>
                  <Input required value={exitGuardianName} onChange={(e) => setExitGuardianName(e.target.value)} className="text-xs bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                  <Input value={exitGuardianRel} onChange={(e) => setExitGuardianRel(e.target.value)} className="text-xs bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Guardian Contact *</label>
                  <Input required value={exitGuardianPhone} onChange={(e) => setExitGuardianPhone(e.target.value)} className="text-xs bg-white font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Reason / Clinical Remarks</label>
                <Input value={exitCause} onChange={(e) => setExitCause(e.target.value)} className="text-xs bg-white" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="text-xs h-8" onClick={() => setShowExitModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Issue Early Gatepass
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
