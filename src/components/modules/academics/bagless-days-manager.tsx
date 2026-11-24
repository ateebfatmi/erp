'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  Award,
  Users,
  ShieldCheck,
  Star,
  Plus,
  Printer,
  ChevronRight,
  Hammer,
  Palette,
  Sprout,
  Cpu,
  UtensilsCrossed,
  Landmark,
  Scissors,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BaglessDaySession,
  StudentSkillLog,
  VocationalCategory,
  INITIAL_BAGLESS_SESSIONS,
  INITIAL_STUDENT_SKILL_LOGS,
  calculateGradeProgress,
  formatVocationalCategory,
  calculateStudentVocationalRubric,
  generateVocationalCertificateCode,
} from '@/modules/academics/bagless-days';

interface Props {
  role?: 'admin' | 'teacher' | 'student' | 'parent';
}

export function BaglessDaysManager({ role = 'admin' }: Props) {
  const [sessions, setSessions] = useState<BaglessDaySession[]>(INITIAL_BAGLESS_SESSIONS);
  const [skillLogs, setSkillLogs] = useState<StudentSkillLog[]>(INITIAL_STUDENT_SKILL_LOGS);
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 6');
  const [activeTab, setActiveTab] = useState<'schedule' | 'portfolio' | 'schedule_new'>('schedule');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [selectedCertLog, setSelectedCertLog] = useState<StudentSkillLog | null>(null);

  // New Session Form State
  const [formGrade, setFormGrade] = useState<string>('Class 6');
  const [formSection, setFormSection] = useState<string>('A');
  const [formSessionNo, setFormSessionNo] = useState<number>(6);
  const [formDate, setFormDate] = useState<string>('2026-12-18');
  const [formCategory, setFormCategory] = useState<VocationalCategory>('pottery_clay');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formArtisan, setFormArtisan] = useState<string>('');
  const [formVenueType, setFormVenueType] = useState<'campus_workshop' | 'artisan_studio' | 'local_field_site'>('campus_workshop');
  const [formVenueAddress, setFormVenueAddress] = useState<string>('School Central Amphitheatre');
  const [formSafetyGear, setFormSafetyGear] = useState<string>('Aprons, Safety Goggles, First-aid Kit');
  const [formTeacher, setFormTeacher] = useState<string>('Smt. Kavita Sharma (Middle School Art Lead)');

  // Grade Progress Calculation
  const gradeProgress = calculateGradeProgress(sessions, selectedGrade);
  const filteredSessions = sessions.filter((s) => s.grade === selectedGrade);
  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || filteredSessions[0];

  // Mark session completed
  const handleMarkCompleted = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status: 'completed',
          attendedCount: s.enrolledCount,
          reflectionSubmissionCount: s.enrolledCount,
        };
      })
    );
  };

  // Submit new session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formArtisan) return;

    const gearList = formSafetyGear.split(',').map((item) => item.trim()).filter(Boolean);
    const newSession: BaglessDaySession = {
      id: `bag-${Date.now().toString().slice(-4)}`,
      sessionNumber: formSessionNo,
      grade: formGrade,
      section: formSection,
      scheduledDate: formDate,
      vocationalCategory: formCategory,
      craftTitle: formTitle,
      masterArtisanTrainer: formArtisan,
      venueType: formVenueType,
      venueAddress: formVenueAddress,
      safetyGearChecklist: gearList,
      enrolledCount: 38,
      attendedCount: 0,
      status: 'scheduled',
      reflectionSubmissionCount: 0,
      teacherSupervisor: formTeacher,
    };

    setSessions((prev) => [newSession, ...prev]);
    setSelectedGrade(formGrade);
    setSelectedSessionId(newSession.id);
    setActiveTab('schedule');
    setFormTitle('');
    setFormArtisan('');
  };

  const getCategoryIcon = (cat: VocationalCategory) => {
    switch (cat) {
      case 'pottery_clay':
        return <Palette className="h-4 w-4 text-amber-600" />;
      case 'carpentry_wood':
        return <Hammer className="h-4 w-4 text-orange-600" />;
      case 'organic_farming':
        return <Sprout className="h-4 w-4 text-emerald-600" />;
      case 'electronics_circuit':
        return <Cpu className="h-4 w-4 text-blue-600" />;
      case 'local_textiles':
        return <Scissors className="h-4 w-4 text-purple-600" />;
      case 'culinary_nutrition':
        return <UtensilsCrossed className="h-4 w-4 text-rose-600" />;
      case 'coding_robotics':
        return <Cpu className="h-4 w-4 text-cyan-600" />;
      case 'heritage_monument':
        return <Landmark className="h-4 w-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Statutory Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                {selectedGrade} Progress
              </p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">
                {gradeProgress.completedDays} / {gradeProgress.totalTargetDays} Days
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">Statutory NEP 2020 Days</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Vocational Hours Logged
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">
                {gradeProgress.hoursLogged} / 60 Hrs
              </h3>
              <p className="text-xs text-blue-700 mt-0.5">Hands-On Apprenticeship</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Compliance Status
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">
                {gradeProgress.compliancePercentage}%
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                {gradeProgress.status === 'mandate_achieved'
                  ? 'Mandate Achieved'
                  : gradeProgress.status === 'on_track'
                  ? 'On Track'
                  : 'Action Needed'}
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Skill Badges Awarded
              </p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{skillLogs.length}</h3>
              <p className="text-xs text-purple-700 mt-0.5">Artisan Verified Portfolios</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'schedule'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Statutory 10-Day Ledger & Schedule
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'portfolio'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Award className="h-4 w-4" />
          Student Craft Portfolios & Rubrics
        </button>
        {(role === 'admin' || role === 'teacher') && (
          <button
            type="button"
            onClick={() => setActiveTab('schedule_new')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schedule_new'
                ? 'border-purple-600 text-purple-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Plus className="h-4 w-4" />
            Schedule Vocational Day
          </button>
        )}
      </div>

      {/* TAB 1: SCHEDULE & LEDGER */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Grade Selector & Compliance Meter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Middle School Grade:</span>
              <div className="flex gap-1.5">
                {['Class 6', 'Class 7', 'Class 8'].map((grd) => (
                  <button
                    key={grd}
                    type="button"
                    onClick={() => {
                      setSelectedGrade(grd);
                      const matching = sessions.find((s) => s.grade === grd);
                      if (matching) setSelectedSessionId(matching.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedGrade === grd
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {grd}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>10-Day Mandate</span>
                  <span>{gradeProgress.completedDays}/10 Days ({gradeProgress.compliancePercentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      gradeProgress.completedDays >= 10 ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, gradeProgress.compliancePercentage)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Session List (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-700">
                  {filteredSessions.length} Scheduled Sessions for {selectedGrade}
                </span>
                <span className="text-[11px] text-slate-500">Target: 10 Days</span>
              </div>

              {filteredSessions.map((sess) => {
                const isSelected = sess.id === selectedSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => setSelectedSessionId(sess.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                          D{sess.sessionNumber}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {sess.craftTitle}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {formatVocationalCategory(sess.vocationalCategory)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          sess.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                            : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                        }
                      >
                        {sess.status === 'completed' ? 'Completed (6h)' : 'Scheduled'}
                      </Badge>
                    </div>

                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sess.masterArtisanTrainer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{sess.scheduledDate} • {sess.venueAddress}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Session Detail & Safety Checklist (Right 7 cols) */}
            <div className="lg:col-span-7">
              {selectedSession && (
                <div className="space-y-4">
                  <Card className="border-slate-200 shadow-xs">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-1 flex items-center gap-1 w-fit">
                            {getCategoryIcon(selectedSession.vocationalCategory)}
                            Day {selectedSession.sessionNumber} of 10 • {formatVocationalCategory(selectedSession.vocationalCategory)}
                          </Badge>
                          <CardTitle className="text-base font-bold text-slate-900">
                            {selectedSession.craftTitle}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-600 mt-0.5">
                            {selectedSession.grade}-{selectedSession.section} • Scheduled on {selectedSession.scheduledDate} (6 Hours Duration)
                          </CardDescription>
                        </div>
                        {selectedSession.status !== 'completed' && (role === 'admin' || role === 'teacher') && (
                          <Button
                            size="sm"
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                            onClick={() => handleMarkCompleted(selectedSession.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Mark Day Completed
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4 text-xs">
                      {/* Artisan & Venue Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                        <div>
                          <span className="text-slate-400 font-medium block">Master Artisan / Expert Trainer:</span>
                          <span className="font-semibold text-slate-900">{selectedSession.masterArtisanTrainer}</span>
                          <span className="text-slate-500 block text-[11px] mt-0.5">
                            Supervisor: {selectedSession.teacherSupervisor}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Workshop Venue:</span>
                          <span className="font-semibold text-slate-900 capitalize">
                            {selectedSession.venueType.replace('_', ' ')}
                          </span>
                          <span className="text-slate-500 block text-[11px] mt-0.5 truncate">
                            {selectedSession.venueAddress}
                          </span>
                        </div>
                      </div>

                      {/* Safety Gear & Materials Checklist */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          Mandatory Student Safety Gear & Materials Checklist
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedSession.safetyGearChecklist.map((gear, idx) => (
                            <div
                              key={idx}
                              className="p-2 border border-slate-200 rounded-lg bg-white flex items-center gap-2"
                            >
                              <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Check className="h-3 w-3" />
                              </div>
                              <span className="text-[11px] text-slate-700 font-medium">{gear}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Attendance & Reflection Status */}
                      <div className="p-3 border rounded-lg bg-white space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">
                            Student Participation & Reflection Submissions
                          </span>
                          <span className="font-bold text-slate-900">
                            {selectedSession.status === 'completed'
                              ? `${selectedSession.attendedCount} / ${selectedSession.enrolledCount} Attended`
                              : 'Session Scheduled'}
                          </span>
                        </div>
                        {selectedSession.status === 'completed' ? (
                          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium pt-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            100% Student Reflections Logged. Verified by {selectedSession.teacherSupervisor}.
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500">
                            Students will submit hands-on reflective notes upon completing the 6-hour craft workshop.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT PORTFOLIOS */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                NEP 2020 Student Vocational Skill Portfolios & Rubric Scores
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Verified hands-on artifacts, reflective learning journals, and statutory digital skill credentials
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student & Grade</th>
                      <th className="p-3">Workshop & Craft Created</th>
                      <th className="p-3">Self-Reflection</th>
                      <th className="p-3">Skill Rubric Score</th>
                      <th className="p-3 text-right">Certificate Credential</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {skillLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{log.studentName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {log.studentId} • {log.grade}-{log.section}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-medium text-slate-800 line-clamp-1">{log.craftCreated}</div>
                          <div className="text-[10px] text-slate-500">{log.sessionTitle}</div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-0.5 text-amber-500 mb-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < log.selfReflectionRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-600 line-clamp-1 italic">
                            "{log.studentReflectionText}"
                          </p>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              className={
                                log.performanceGrade === 'A+'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                                  : 'bg-blue-100 text-blue-800 border-blue-200 text-[10px]'
                              }
                            >
                              Grade {log.performanceGrade}
                            </Badge>
                            <span className="font-bold text-slate-900 text-xs">
                              {log.totalRubricScore}/20
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            Dexterity {log.skillObservationRubric.manualDexterity}/5 • Safety {log.skillObservationRubric.toolSafety}/5
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedCertLog(log)}
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            View Certificate
                          </Button>
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

      {/* TAB 3: SCHEDULE NEW VOCATIONAL WORKSHOP */}
      {activeTab === 'schedule_new' && (
        <Card className="border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-purple-600" />
              Schedule Statutory Bagless Day Workshop
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Arrange local artisan or vocational practitioner workshop per CBSE Circular Acad-66/2020.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Grade</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Section</label>
                  <Input
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Day Number (1 to 10)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formSessionNo}
                    onChange={(e) => setFormSessionNo(parseInt(e.target.value) || 1)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Craft Workshop Title</label>
                <Input
                  placeholder="e.g. Traditional Handloom Weaving & Cotton Loom Threading"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Vocational Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                  >
                    <option value="pottery_clay">Terracotta & Clay Modeling</option>
                    <option value="carpentry_wood">Woodcraft & Carpentry Joinery</option>
                    <option value="organic_farming">Organic Gardening & Composting</option>
                    <option value="electronics_circuit">Basic Electronics & Soldering</option>
                    <option value="local_textiles">Traditional Weaving & Block Printing</option>
                    <option value="culinary_nutrition">Culinary Arts & Millet Nutrition</option>
                    <option value="coding_robotics">Robotics & Micro:bit Prototyping</option>
                    <option value="heritage_monument">Monument Survey & Heritage Sketching</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date Scheduled</label>
                  <Input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Master Artisan / Practitioner Name
                  </label>
                  <Input
                    placeholder="e.g. Master Weaver Ustad Shamshad Ali"
                    value={formArtisan}
                    onChange={(e) => setFormArtisan(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Teacher Supervisor</label>
                  <Input
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Venue Type</label>
                  <select
                    value={formVenueType}
                    onChange={(e) => setFormVenueType(e.target.value as any)}
                    className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                  >
                    <option value="campus_workshop">On-Campus Workshop Room</option>
                    <option value="artisan_studio">Master Artisan Studio / Guild</option>
                    <option value="local_field_site">Archaeological / Eco Field Site</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Venue Address / Hall</label>
                  <Input
                    value={formVenueAddress}
                    onChange={(e) => setFormVenueAddress(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Safety Gear & Tool Checklist (Comma-separated)
                </label>
                <Input
                  value={formSafetyGear}
                  onChange={(e) => setFormSafetyGear(e.target.value)}
                  placeholder="e.g. Aprons, Safety Goggles, Heat Gloves, First-aid Kit"
                  className="text-xs"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">
                  Schedule Bagless Day Workshop & Initialize Ledger
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* OFFICIAL VOCATIONAL CERTIFICATE MODAL */}
      {selectedCertLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border-4 border-double border-amber-300">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                  CBSE Statutory Vocational Skill Certificate
                </h3>
              </div>
              <button
                onClick={() => setSelectedCertLog(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2 py-3 bg-amber-50/30 rounded-lg p-4">
              <p className="text-[10px] font-mono text-amber-800">
                CREDENTIAL ID: {selectedCertLog.certificateCode}
              </p>
              <h2 className="text-base font-bold text-slate-900">
                Vidya Mandir Senior Secondary School
              </h2>
              <p className="text-[11px] text-slate-600 italic">
                National Education Policy (NEP 2020) Middle Stage Vocational Skill Endorsement
              </p>

              <div className="pt-3 pb-2 text-xs text-slate-800 leading-relaxed">
                This is to certify that{' '}
                <strong className="text-slate-900 underline">{selectedCertLog.studentName}</strong> (
                {selectedCertLog.studentId}), student of{' '}
                <strong>{selectedCertLog.grade}-{selectedCertLog.section}</strong>, has successfully
                completed the 6-hour hands-on vocational immersion module in:
                <div className="mt-2 text-sm font-bold text-amber-900 bg-amber-100/70 p-2 rounded-md">
                  "{selectedCertLog.craftCreated}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-2 border-t border-amber-200">
                <div>
                  <span>Rubric Performance Grade:</span>{' '}
                  <strong className="text-emerald-700 font-bold">{selectedCertLog.performanceGrade} ({selectedCertLog.totalRubricScore}/20)</strong>
                </div>
                <div>
                  <span>Safety Gear Adherence:</span>{' '}
                  <strong className="text-blue-700 font-bold">100% Verified</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <span className="text-[10px] text-slate-400">
                Complies with CBSE Circular Acad-66/2020
              </span>
              <Button
                size="sm"
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => setSelectedCertLog(null)}
              >
                Close Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
