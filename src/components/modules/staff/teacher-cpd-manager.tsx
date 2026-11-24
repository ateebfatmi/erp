'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Info,
  PlusCircle,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
  AlertTriangle,
} from 'lucide-react';
import {
  CpdAgencyType,
  CpdProgressSummary,
  CpdTheme,
  CpdTrainingRecord,
  INITIAL_CPD_RECORDS,
  calculateCpdProgress,
  logCpdTraining,
  verifyCpdTraining,
} from '@/modules/staff/cpd';

interface TeacherCpdManagerProps {
  role?: 'teacher' | 'admin';
  currentTeacherId?: string;
  currentTeacherName?: string;
}

const AGENCY_THEMES: Record<CpdAgencyType, { label: string; badge: string }> = {
  CBSE_COE_ONLINE: { label: 'CBSE CoE (Online)', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  CBSE_COE_OFFLINE: { label: 'CBSE CoE (Offline)', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  NCERT_NISHTHA_DIKSHA: { label: 'NCERT NISHTHA (DIKSHA)', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  IN_HOUSE_SCHOOL_WORKSHOP: { label: 'In-House School Workshop', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  UNIVERSITY_MOOC: { label: 'Authorized University MOOC', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
};

export function TeacherCpdManager({
  role = 'teacher',
  currentTeacherId = 'tch-01',
  currentTeacherName = 'Smt. Ananya Sen',
}: TeacherCpdManagerProps) {
  const [records, setRecords] = useState<CpdTrainingRecord[]>(INITIAL_CPD_RECORDS);
  const [activeTab, setActiveTab] = useState<'my-training' | 'admin-compliance'>(
    role === 'admin' ? 'admin-compliance' : 'my-training'
  );

  // New Training Form Modal State
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState<CpdAgencyType>('CBSE_COE_ONLINE');
  const [theme, setTheme] = useState<CpdTheme>('NEP_2020_HOLISTIC_ASSESSMENT');
  const [hours, setHours] = useState(5);
  const [certNo, setCertNo] = useState('');
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);

  const [notification, setNotification] = useState<string | null>(null);

  const teacherProgress: CpdProgressSummary = calculateCpdProgress(currentTeacherId, records);
  const teacherRecords = records.filter((r) => r.teacherId === currentTeacherId);

  const handleLogTraining = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRecord = logCpdTraining({
        teacherId: currentTeacherId,
        teacherName: currentTeacherName,
        designation: 'PGT Mathematics',
        programTitle: title,
        organizingAgency: agency,
        theme,
        completionDate,
        durationHours: Number(hours),
        certificateNumber: certNo,
      });

      setRecords((prev) => [newRecord, ...prev]);
      setIsLoggingModalOpen(false);
      setTitle('');
      setCertNo('');
      setNotification('CPD training log submitted successfully! Awaiting principal endorsement.');
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit training record');
    }
  };

  const handleVerify = (recordId: string, decision: 'VERIFIED_BY_PRINCIPAL' | 'REJECTED') => {
    setRecords((prev) => verifyCpdTraining(prev, recordId, decision));
    setNotification(`Training record ${recordId} has been ${decision === 'VERIFIED_BY_PRINCIPAL' ? 'verified' : 'rejected'}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Statutory Mandate Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white font-mono text-[10px] font-bold">
                NEP 2020 &bull; CBSE Acad-38/2021
              </Badge>
              <Badge className="bg-emerald-500/80 text-white text-[10px] font-semibold">
                Statutory 50-Hour Quota
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Continuous Professional Development (CPD) & Teacher Training
            </h1>
            <p className="text-xs text-blue-200 leading-relaxed">
              Every educator must complete at least <strong>50 hours of CPD</strong> per academic year. A minimum of{' '}
              <strong>25 hours must be conducted by CBSE Centres of Excellence (CoE)</strong> or NCERT NISHTHA on DIKSHA.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {role === 'teacher' && (
              <Button
                size="sm"
                onClick={() => setIsLoggingModalOpen(true)}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs text-xs font-semibold"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Log Training Module</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print OASIS Audit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Role Navigation Tabs if in Admin Mode */}
      {role === 'admin' && (
        <div className="flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('admin-compliance')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'admin-compliance'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="h-4 w-4" />
            School-Wide Faculty Compliance Leaderboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-training')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my-training'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Sample Teacher Drill-Down ({currentTeacherName})
          </button>
        </div>
      )}

      {activeTab === 'my-training' ? (
        <div className="space-y-6">
          {/* Progress Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <span className="text-xs text-slate-500 block font-medium">Total CPD Completed</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{teacherProgress.totalHoursCompleted}</span>
                  <span className="text-xs text-slate-500">/ 50 Hours</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${teacherProgress.percentageCompleted}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {teacherProgress.percentageCompleted}% completed
                </span>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-blue-50/40">
              <CardContent className="p-4">
                <span className="text-xs text-blue-800 block font-medium flex items-center justify-between">
                  <span>CBSE / NISHTHA (Mandatory)</span>
                  <Badge variant="success" className="text-[10px]">Min. 25h</Badge>
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-blue-700">{teacherProgress.statutoryCbseNishthaHours}</span>
                  <span className="text-xs text-blue-600">/ 25 Hours</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-2 block flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Statutory CBSE Criteria Met!
                </span>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <span className="text-xs text-slate-500 block font-medium">In-House & MOOCs</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{teacherProgress.inHouseAndMoocHours}</span>
                  <span className="text-xs text-slate-500">/ 25 Hours</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Collaborative department sessions
                </span>
              </CardContent>
            </Card>

            <Card className={`border-slate-200 ${teacherProgress.isCompliant ? 'bg-emerald-50/50' : 'bg-amber-50/50'}`}>
              <CardContent className="p-4">
                <span className="text-xs text-slate-700 block font-medium">Annual Compliance Status</span>
                <div className="mt-1">
                  {teacherProgress.isCompliant ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <ShieldCheck className="h-3.5 w-3.5" /> 100% CBSE Compliant
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 gap-1 text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> In Progress ({teacherProgress.hoursNeededForCompliance}h Left)
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  {teacherProgress.verifiedHours} hours verified by Principal
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Training Portfolio Table */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  My Statutory CPD Training Records & Certificates &ndash; Academic Session 2024-25
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Logged modules verified against CBSE Centre of Excellence (CoE) and DIKSHA transaction ledgers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Program Title & Theme</th>
                      <th className="py-2.5 px-3">Organizing Agency</th>
                      <th className="py-2.5 px-3">Hours</th>
                      <th className="py-2.5 px-3">Certificate / DIKSHA ID</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      {role === 'admin' && <th className="py-2.5 px-3 text-right">Verification</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teacherRecords.map((rec) => {
                      const agencyTheme = AGENCY_THEMES[rec.organizingAgency];
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{rec.programTitle}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Theme: {rec.theme.replace(/_/g, ' ')}
                            </span>
                            {rec.principalRemarks && (
                              <p className="text-[10px] text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 mt-1 inline-block">
                                Principal: {rec.principalRemarks}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <Badge className={`text-[10px] ${agencyTheme.badge}`}>
                              {agencyTheme.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 font-mono text-sm">
                            {rec.durationHours} hrs
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                            {rec.certificateNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {rec.completionDate}
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={rec.status === 'VERIFIED_BY_PRINCIPAL' ? 'success' : 'outline'}
                              className="text-[10px]"
                            >
                              {rec.status === 'VERIFIED_BY_PRINCIPAL' ? 'VERIFIED' : rec.status}
                            </Badge>
                          </td>
                          {role === 'admin' && (
                            <td className="py-3 px-3 text-right">
                              {rec.status === 'SUBMITTED' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    size="sm"
                                    onClick={() => handleVerify(rec.id, 'VERIFIED_BY_PRINCIPAL')}
                                    className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                  >
                                    Verify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleVerify(rec.id, 'REJECTED')}
                                    className="h-7 text-[10px] text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-mono text-[10px]">Endorsed</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* School-Wide Admin Compliance Overview */
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-200">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Faculty Annual CPD Compliance Roster (CBSE Affiliation Bye-Laws 3.3.h)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Institutional readiness for CBSE OASIS Inspection and Quality Assessment Framework
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Faculty Name & Role</th>
                    <th className="py-2.5 px-3">Total Completed</th>
                    <th className="py-2.5 px-3">CBSE / NISHTHA</th>
                    <th className="py-2.5 px-3">In-House / MOOC</th>
                    <th className="py-2.5 px-3">Progress %</th>
                    <th className="py-2.5 px-3">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {['tch-01', 'tch-02'].map((tId) => {
                    const prog = calculateCpdProgress(tId, records);
                    const teacher = records.find((r) => r.teacherId === tId);
                    return (
                      <tr key={tId} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{teacher?.teacherName}</span>
                          <span className="text-[11px] text-slate-500">{teacher?.designation}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {prog.totalHoursCompleted} / 50 hrs
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-blue-700">
                          {prog.statutoryCbseNishthaHours} / 25 hrs
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {prog.inHouseAndMoocHours} hrs
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${prog.percentageCompleted}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px]">{prog.percentageCompleted}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={prog.isCompliant ? 'success' : 'outline'}>
                            {prog.isCompliant ? 'COMPLIANT' : 'IN_PROGRESS'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Training Modal */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Log Continuous Professional Development (CPD) Module
                </h3>
                <p className="text-xs text-slate-500">
                  Record completed CBSE CoE workshop, NISHTHA module on DIKSHA, or in-house session.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoggingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleLogTraining} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Workshop / Course Program Title *:
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. NEP 2020 Experiential Learning in Classroom"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Organizing Agency *:
                  </label>
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value as CpdAgencyType)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="CBSE_COE_ONLINE">CBSE CoE (Online)</option>
                    <option value="CBSE_COE_OFFLINE">CBSE CoE (Offline Workshop)</option>
                    <option value="NCERT_NISHTHA_DIKSHA">NCERT NISHTHA (DIKSHA)</option>
                    <option value="IN_HOUSE_SCHOOL_WORKSHOP">In-House School Workshop</option>
                    <option value="UNIVERSITY_MOOC">Authorized University MOOC</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    CPD Competency Theme *:
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as CpdTheme)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="NEP_2020_HOLISTIC_ASSESSMENT">NEP 2020 Holistic Assessment</option>
                    <option value="PEDAGOGY_AND_LESSON_PLANNING">Pedagogy & Lesson Planning</option>
                    <option value="INCLUSIVE_EDUCATION_AND_CWSN">Inclusive Education & CWSN</option>
                    <option value="CYBER_SAFETY_AND_DIGITAL_LITERACY">Cyber Safety & Digital Classroom</option>
                    <option value="EXPERIENTIAL_AND_ART_INTEGRATED_LEARNING">Art-Integrated & Experiential</option>
                    <option value="MENTAL_HEALTH_AND_ADOLESCENT_COUNSELING">Mental Health & Well-being</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Duration (Hours) *:
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Completion Date *:
                  </label>
                  <Input
                    type="date"
                    required
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Certificate Serial / DIKSHA Transaction ID *:
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. CBSE/COE-NOIDA/2024/09812 or DIKSHA/NISHTHA/2024/77412"
                  value={certNo}
                  onChange={(e) => setCertNo(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoggingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Submit for Principal Endorsement</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
