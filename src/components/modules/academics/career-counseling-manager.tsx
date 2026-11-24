'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  GraduationCap,
  Target,
  FileCheck2,
  Calendar,
  User,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Printer,
  TrendingUp,
  Brain,
  Award,
  ChevronRight,
  School,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RIASECDimension,
  calculateHollandCode,
  evaluateEntranceExamReadiness,
  validateUniversityDossier,
  computeCounselingCellMetrics,
  INITIAL_COUNSELING_STUDENTS,
  StudentCounselingProfile,
  EntranceExamCode,
  ENTRANCE_EXAMS,
  EntranceMockScore,
  UniversityApplication,
  CounselingSession,
} from '@/modules/academics/career-counseling';

interface CareerCounselingManagerProps {
  role?: 'admin' | 'student';
}

export function CareerCounselingManager({ role = 'admin' }: CareerCounselingManagerProps) {
  const [students, setStudents] = useState<StudentCounselingProfile[]>(INITIAL_COUNSELING_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    role === 'student' ? INITIAL_COUNSELING_STUDENTS[0].studentId : INITIAL_COUNSELING_STUDENTS[0].studentId
  );
  const [activeTab, setActiveTab] = useState<'riasec' | 'entrance' | 'dossier' | 'sessions'>('riasec');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog / Modal Form states
  const [showAddMockModal, setShowAddMockModal] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);

  // Form inputs for new mock
  const [mockExamCode, setMockExamCode] = useState<EntranceExamCode>('CUET_UG');
  const [mockDate, setMockDate] = useState('2026-11-20');
  const [mockScore, setMockScore] = useState('720');
  const [mockMaxScore, setMockMaxScore] = useState('800');
  const [mockPercentile, setMockPercentile] = useState('95.5');
  const [mockWeakTopics, setMockWeakTopics] = useState('Complex Integration, Fluid Mechanics');
  const [mockStrongTopics, setMockStrongTopics] = useState('Organic Chemistry, Modern Physics');

  // Form inputs for new university application
  const [appUniName, setAppUniName] = useState('');
  const [appCourse, setAppCourse] = useState('');
  const [appCountry, setAppCountry] = useState<'India' | 'Abroad'>('India');
  const [appPortal, setAppPortal] = useState('https://cuetug.ntaonline.in');
  const [appDeadline, setAppDeadline] = useState('2027-05-30');

  // Form inputs for counseling session
  const [sessionCounselor, setSessionCounselor] = useState('Dr. Meenakshi Sunderam');
  const [sessionFocus, setSessionFocus] = useState<CounselingSession['focusArea']>('CUET_Preparation');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionActionItems, setSessionActionItems] = useState('Complete Mock Series 3, Review weak topics');
  const [sessionParentInvolved, setSessionParentInvolved] = useState(false);

  // Derived metrics
  const metrics = useMemo(() => computeCounselingCellMetrics(students), [students]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.studentId === selectedStudentId) || students[0],
    [students, selectedStudentId]
  );

  const hollandResult = useMemo(
    () => calculateHollandCode(selectedStudent.riasecScores),
    [selectedStudent.riasecScores]
  );

  const entranceEvaluation = useMemo(
    () => evaluateEntranceExamReadiness(selectedStudent.latestMockScores),
    [selectedStudent.latestMockScores]
  );

  // Handle score change in RIASEC sliders
  const handleScoreChange = (dimension: RIASECDimension, value: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === selectedStudentId) {
          return {
            ...s,
            riasecScores: {
              ...s.riasecScores,
              [dimension]: value,
            },
          };
        }
        return s;
      })
    );
  };

  // Toggle application checklist item
  const handleToggleChecklistItem = (appId: string, field: keyof UniversityApplication) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === selectedStudentId) {
          return {
            ...s,
            applications: s.applications.map((app) => {
              if (app.id === appId) {
                return {
                  ...app,
                  [field]: !app[field],
                };
              }
              return app;
            }),
          };
        }
        return s;
      })
    );
  };

  // Add mock score submit
  const handleAddMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMock: EntranceMockScore = {
      id: `MOCK-${Date.now()}`,
      studentId: selectedStudentId,
      examCode: mockExamCode,
      testDate: mockDate,
      scoreObtained: Number(mockScore),
      maximumScore: Number(mockMaxScore),
      percentile: Number(mockPercentile),
      weakTopics: mockWeakTopics.split(',').map((t) => t.trim()).filter(Boolean),
      strongTopics: mockStrongTopics.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === selectedStudentId) {
          return {
            ...s,
            latestMockScores: [newMock, ...s.latestMockScores],
          };
        }
        return s;
      })
    );
    setShowAddMockModal(false);
  };

  // Add university application submit
  const handleAddAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUniName || !appCourse) return;

    const newApp: UniversityApplication = {
      id: `APP-${Date.now()}`,
      studentId: selectedStudentId,
      universityName: appUniName,
      courseTitle: appCourse,
      country: appCountry,
      applicationPortal: appPortal || 'https://ugadmission.uod.ac.in',
      deadlineDate: appDeadline,
      sopDrafted: false,
      lorRequested: false,
      lorReceived: false,
      entranceScoreUploaded: false,
      applicationFeePaid: false,
      submissionStatus: 'Drafting',
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === selectedStudentId) {
          return {
            ...s,
            applications: [...s.applications, newApp],
          };
        }
        return s;
      })
    );
    setAppUniName('');
    setAppCourse('');
    setShowAddAppModal(false);
  };

  // Add counseling session submit
  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: CounselingSession = {
      id: `CS-${Date.now()}`,
      studentId: selectedStudentId,
      studentName: selectedStudent.studentName,
      grade: selectedStudent.grade,
      sessionDate: new Date().toISOString().split('T')[0],
      counselorName: sessionCounselor,
      focusArea: sessionFocus,
      discussionNotes: sessionNotes || 'Standard developmental counseling and target exam alignment session.',
      actionItems: sessionActionItems.split(',').map((item) => item.trim()).filter(Boolean),
      parentInvolved: sessionParentInvolved,
      status: 'Completed',
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === selectedStudentId) {
          return {
            ...s,
            counselingHistory: [newSession, ...s.counselingHistory],
          };
        }
        return s;
      })
    );
    setSessionNotes('');
    setShowAddSessionModal(false);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stream.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Statutory Citation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-indigo-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/40 text-xs py-0.5">
              CBSE Statutory Guidance Cell
            </Badge>
            <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-xs py-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              NEP 2020 Clause 4.38
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-400" />
            Adolescent Career Guidance & Entrance Exam Counseling Cell
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-3xl">
            Administer Holland RIASEC psychometric interest batteries, track national entrance examinations (CUET, JEE, NEET, CLAT), monitor university dossiers, and maintain statutory career counseling logs.
          </p>
        </div>
        <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Dossier
          </Button>
        </div>
      </div>

      {/* Institutional KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">RIASEC Coverage</p>
              <h3 className="text-lg font-bold text-slate-900">{metrics.riasecAssessmentCoverageRate}%</h3>
              <p className="text-[11px] text-slate-400">{metrics.riasecAssessedCount}/{metrics.totalStudentsMonitored} Assessed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">High Readiness Tier</p>
              <h3 className="text-lg font-bold text-emerald-600">{metrics.studentsInHighReadinessTier} Students</h3>
              <p className="text-[11px] text-slate-400">&gt; 90th Percentile Mocks</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <School className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">University Dossiers</p>
              <h3 className="text-lg font-bold text-slate-900">{metrics.activeUniversityApplications} Active</h3>
              <p className="text-[11px] text-slate-400">CUET, IITs, DU, NLUs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Counseling Sessions</p>
              <h3 className="text-lg font-bold text-slate-900">{metrics.counselingSessionsConducted} Completed</h3>
              <p className="text-[11px] text-slate-400">1-on-1 Guidance Logs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Selector Toolbar (for Admin Role) */}
      {role === 'admin' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search candidate by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Active Student:</span>
            {filteredStudents.map((s) => (
              <button
                key={s.studentId}
                onClick={() => setSelectedStudentId(s.studentId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 flex items-center gap-1.5 ${
                  s.studentId === selectedStudentId
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>{s.studentName}</span>
                <span className="text-[10px] opacity-75">({s.grade})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Student Profile Identity Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm border-2 border-indigo-200 shrink-0">
            {selectedStudent.studentName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{selectedStudent.studentName}</h2>
              <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                {selectedStudent.studentId}
              </Badge>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                {selectedStudent.grade}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject Stream: <span className="font-semibold text-slate-700">{selectedStudent.stream}</span> • Target Exams: {selectedStudent.targetExams.map((e) => ENTRANCE_EXAMS[e]?.code || e).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <Badge className="bg-indigo-600 text-white font-mono text-sm px-3 py-1 border-0">
            Holland Code: {hollandResult.fullCode}
          </Badge>
          <div className="text-right text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{hollandResult.primary}</span> dominant
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('riasec')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'riasec'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Brain className="h-4 w-4" />
          RIASEC Psychometric Battery
        </button>
        <button
          onClick={() => setActiveTab('entrance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'entrance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="h-4 w-4" />
          National Entrance Exams & Mocks
        </button>
        <button
          onClick={() => setActiveTab('dossier')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'dossier'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <School className="h-4 w-4" />
          University Applications & LORs
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'sessions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Counseling Sessions Log
        </button>
      </div>

      {/* TAB 1: RIASEC Psychometric Assessment */}
      {activeTab === 'riasec' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Interactive Interest Battery */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-slate-200 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-indigo-600" />
                        Holland RIASEC Interest Hexagon Breakdown
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Adjust dimension scores (0-50) derived from CBSE standardized 90-item adolescent interest inventory.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      Code: {hollandResult.fullCode}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {(
                    [
                      { key: 'Realistic', label: 'Realistic (R) - Practical, Mechanical, Physical', desc: 'Working with hands, tools, machinery, and outdoor environments' },
                      { key: 'Investigative', label: 'Investigative (I) - Analytical, Scientific, Abstract', desc: 'Solving mathematical, scientific problems and intellectual inquiry' },
                      { key: 'Artistic', label: 'Artistic (A) - Creative, Expressive, Original', desc: 'Visual arts, music, design, literature, and unstructured expression' },
                      { key: 'Social', label: 'Social (S) - Helping, Teaching, Collaborative', desc: 'Mentoring, counseling, healthcare, and social development' },
                      { key: 'Enterprising', label: 'Enterprising (E) - Leadership, Persuasive, Ambitious', desc: 'Entrepreneurship, public speaking, negotiation, and strategy' },
                      { key: 'Conventional', label: 'Conventional (C) - Organized, Detail-Oriented, Data', desc: 'Financial accounting, compliance, data systems, and structured tasks' },
                    ] as { key: RIASECDimension; label: string; desc: string }[]
                  ).map((item) => {
                    const score = selectedStudent.riasecScores[item.key] || 0;
                    const percent = Math.min(100, Math.round((score / 50) * 100));

                    return (
                      <div key={item.key} className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                          <span className="text-xs font-mono font-bold text-indigo-700">{score} / 50 ({percent}%)</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={score}
                            onChange={(e) => handleScoreChange(item.key, Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percent >= 80 ? 'bg-indigo-600' : percent >= 50 ? 'bg-blue-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Holland Interpretation & Career Matches */}
            <div className="space-y-4">
              <Card className="border-indigo-100 bg-indigo-50/40 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    Psychometric Trait Synthesis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-indigo-100">
                    <p className="text-slate-700 leading-relaxed">
                      {hollandResult.traitSummary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Recommended Higher Ed Disciplines:
                    </h4>
                    <div className="space-y-1.5">
                      {hollandResult.recommendedDisciplines.map((disc, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2 rounded-md border border-indigo-100 text-slate-700 flex items-center gap-2 text-xs"
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{disc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" />
                      High-Fit Career Clusters:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {hollandResult.careerClusters.map((cluster, idx) => (
                        <Badge
                          key={idx}
                          className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs py-1"
                        >
                          {cluster}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: National Entrance Examinations & Mock Test Tracker */}
      {activeTab === 'entrance' && (
        <div className="space-y-6">
          {/* Target Exam Readiness Diagnostic Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
                    Target: {entranceEvaluation.examCode}
                  </Badge>
                  <Badge
                    className={
                      entranceEvaluation.readinessTier === 'High'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : entranceEvaluation.readinessTier === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                    }
                  >
                    Readiness: {entranceEvaluation.readinessTier.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Performance Diagnostic & NCERT Chapter Strategic Plan
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {entranceEvaluation.recommendedStrategy}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center min-w-[90px]">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Latest Mocks</p>
                  <p className="text-lg font-bold text-indigo-600">{entranceEvaluation.latestPercentile}%ile</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center min-w-[90px]">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Total Attempts</p>
                  <p className="text-lg font-bold text-slate-800">{entranceEvaluation.attemptCount}</p>
                </div>
                <Button
                  onClick={() => setShowAddMockModal(true)}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Log Mock Score
                </Button>
              </div>
            </div>

            {entranceEvaluation.commonWeakTopics.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Priority Chapters Needing Revision:
                </span>
                {entranceEvaluation.commonWeakTopics.map((topic, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs text-rose-700 border-rose-200 bg-rose-50">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Mock Test Score History Table */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  Candidate Mock Test Score History
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Standardized full-length and sectional test series performance.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Exam Code</TableHead>
                    <TableHead className="text-xs">Test Date</TableHead>
                    <TableHead className="text-xs">Score / Max</TableHead>
                    <TableHead className="text-xs">Percentile</TableHead>
                    <TableHead className="text-xs">Weak Chapters</TableHead>
                    <TableHead className="text-xs">Strong Chapters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedStudent.latestMockScores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-xs text-slate-500">
                        No mock scores recorded yet. Click &quot;Log Mock Score&quot; to add.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedStudent.latestMockScores.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-semibold text-xs text-slate-800">
                          {m.examCode}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{m.testDate}</TableCell>
                        <TableCell className="text-xs font-mono font-medium text-slate-800">
                          {m.scoreObtained} / {m.maximumScore}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-indigo-600 font-mono">
                          {m.percentile}%
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-wrap gap-1">
                            {m.weakTopics.map((w, i) => (
                              <span key={i} className="text-[11px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100">
                                {w}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-wrap gap-1">
                            {m.strongTopics.map((s, i) => (
                              <span key={i} className="text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                                {s}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: University Application Dossiers & LORs */}
      {activeTab === 'dossier' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <School className="h-4 w-4 text-indigo-600" />
                Target Higher Education Institutions & Application Dossiers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor admission portals, application deadlines, SOP reviews, and faculty Letters of Recommendation (LOR).
              </p>
            </div>
            <Button
              onClick={() => setShowAddAppModal(true)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Target University
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedStudent.applications.map((app) => {
              const dossierCheck = validateUniversityDossier(app);

              return (
                <Card key={app.id} className="border-slate-200 shadow-xs flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px]">
                            {app.country}
                          </Badge>
                          <Badge
                            className={
                              app.submissionStatus === 'Submitted'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                                : 'bg-amber-100 text-amber-800 border-amber-200 text-[10px]'
                            }
                          >
                            {app.submissionStatus}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-900">
                          {app.universityName}
                        </CardTitle>
                        <CardDescription className="text-xs text-indigo-700 font-medium mt-0.5">
                          {app.courseTitle}
                        </CardDescription>
                      </div>

                      <a
                        href={app.applicationPortal}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                        title="Open Official Portal"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Dossier Readiness</span>
                        <span className="font-bold text-indigo-600 font-mono">
                          {dossierCheck.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${dossierCheck.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Interactive Checklist Items */}
                    <div className="space-y-2 bg-slate-50/70 p-3 rounded-lg border border-slate-100 text-xs">
                      <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider mb-1.5">
                        Statutory Dossier Checklist
                      </p>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={app.sopDrafted}
                          onChange={() => handleToggleChecklistItem(app.id, 'sopDrafted')}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span className={app.sopDrafted ? 'text-slate-700 line-through opacity-70' : 'text-slate-800'}>
                          Statement of Purpose (SOP) Drafted & Vetted
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={app.lorRequested}
                          onChange={() => handleToggleChecklistItem(app.id, 'lorRequested')}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span className={app.lorRequested ? 'text-slate-700 line-through opacity-70' : 'text-slate-800'}>
                          Faculty Letter of Recommendation (LOR) Requested
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={app.lorReceived}
                          onChange={() => handleToggleChecklistItem(app.id, 'lorReceived')}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span className={app.lorReceived ? 'text-slate-700 line-through opacity-70' : 'text-slate-800'}>
                          Faculty LOR Received & Uploaded
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={app.entranceScoreUploaded}
                          onChange={() => handleToggleChecklistItem(app.id, 'entranceScoreUploaded')}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span className={app.entranceScoreUploaded ? 'text-slate-700 line-through opacity-70' : 'text-slate-800'}>
                          Entrance / Board Marks Card Uploaded
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={app.applicationFeePaid}
                          onChange={() => handleToggleChecklistItem(app.id, 'applicationFeePaid')}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span className={app.applicationFeePaid ? 'text-slate-700 line-through opacity-70' : 'text-slate-800'}>
                          Portal Application Fee Paid
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Deadline: {app.deadlineDate}
                      </span>
                      {dossierCheck.isReadyForSubmission ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Final Submit
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">
                          {dossierCheck.pendingItems.length} items pending
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Counseling Sessions Log */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                Statutory Career Guidance & 1-on-1 Mentorship Logs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confidential session summaries, student-counselor dialogues, parent involvement, and actionable next steps.
              </p>
            </div>
            <Button
              onClick={() => setShowAddSessionModal(true)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Schedule Guidance Session
            </Button>
          </div>

          <div className="space-y-3">
            {selectedStudent.counselingHistory.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-slate-300">
                <p className="text-xs text-slate-500">
                  No counseling sessions logged yet for this candidate.
                </p>
              </Card>
            ) : (
              selectedStudent.counselingHistory.map((cs) => (
                <Card key={cs.id} className="border-slate-200 shadow-xs">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                          {cs.focusArea.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-800">
                          {cs.counselorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Session Date: {cs.sessionDate}</span>
                        {cs.parentInvolved && (
                          <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 bg-blue-50">
                            Parent Present
                          </Badge>
                        )}
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                          {cs.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-2">
                      <p>
                        <span className="font-semibold text-slate-900">Discussion Notes: </span>
                        {cs.discussionNotes}
                      </p>

                      <div>
                        <span className="font-semibold text-slate-900">Agreed Action Items:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                          {cs.actionItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal / Dialog: Log Mock Score */}
      {showAddMockModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-600" />
                Log National Entrance Mock Test Score
              </h3>
              <button
                onClick={() => setShowAddMockModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Target Entrance Examination</label>
                <select
                  value={mockExamCode}
                  onChange={(e) => setMockExamCode(e.target.value as EntranceExamCode)}
                  className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                >
                  {Object.keys(ENTRANCE_EXAMS).map((code) => (
                    <option key={code} value={code}>
                      {ENTRANCE_EXAMS[code as EntranceExamCode].fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Test Date</label>
                  <Input
                    type="date"
                    value={mockDate}
                    onChange={(e) => setMockDate(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Percentile Achieved (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={mockPercentile}
                    onChange={(e) => setMockPercentile(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Score Obtained</label>
                  <Input
                    type="number"
                    value={mockScore}
                    onChange={(e) => setMockScore(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Maximum Marks</label>
                  <Input
                    type="number"
                    value={mockMaxScore}
                    onChange={(e) => setMockMaxScore(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Priority Chapters Needing Revision (comma-separated)</label>
                <Input
                  value={mockWeakTopics}
                  onChange={(e) => setMockWeakTopics(e.target.value)}
                  placeholder="e.g. Ionic Equilibrium, Magnetism"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Strong Proficiency Areas (comma-separated)</label>
                <Input
                  value={mockStrongTopics}
                  onChange={(e) => setMockStrongTopics(e.target.value)}
                  placeholder="e.g. Calculus, Optics"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMockModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                >
                  Save Mock Result
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Dialog: Add University Application */}
      {showAddAppModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <School className="h-4 w-4 text-indigo-600" />
                Add Target University Application Dossier
              </h3>
              <button
                onClick={() => setShowAddAppModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAppSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">University / Institute Name</label>
                <Input
                  value={appUniName}
                  onChange={(e) => setAppUniName(e.target.value)}
                  placeholder="e.g. Delhi University / IIT Delhi / NLU Bangalore"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Course / Degree Program</label>
                <Input
                  value={appCourse}
                  onChange={(e) => setAppCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science / B.Com (Hons) / B.A. LL.B."
                  className="text-xs h-8"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Region</label>
                  <select
                    value={appCountry}
                    onChange={(e) => setAppCountry(e.target.value as any)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    <option value="India">India (Central/State/Deemed)</option>
                    <option value="Abroad">Abroad (USA/UK/Canada/Singapore)</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Submission Deadline</label>
                  <Input
                    type="date"
                    value={appDeadline}
                    onChange={(e) => setAppDeadline(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Admission Portal URL</label>
                <Input
                  value={appPortal}
                  onChange={(e) => setAppPortal(e.target.value)}
                  placeholder="https://..."
                  className="text-xs h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAppModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                >
                  Create Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Dialog: Schedule Counseling Session */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                Log 1-on-1 Career Guidance Session
              </h3>
              <button
                onClick={() => setShowAddSessionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSessionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Lead Counselor Name</label>
                <Input
                  value={sessionCounselor}
                  onChange={(e) => setSessionCounselor(e.target.value)}
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Session Primary Focus Area</label>
                <select
                  value={sessionFocus}
                  onChange={(e) => setSessionFocus(e.target.value as any)}
                  className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                >
                  <option value="CUET_Preparation">CUET & Entrance Examination Alignment</option>
                  <option value="Stream_Choice">NEP Senior Secondary Subject Baskets</option>
                  <option value="College_Shortlisting">Higher Education College Shortlisting</option>
                  <option value="Exam_Stress">Adolescent Exam Anxiety & Time Management</option>
                  <option value="Career_Roadmap">Long-term Career Roadmap & Industry Trends</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Counselor Confidential Observations & Discussion Notes</label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Record summary of counseling conversation..."
                  className="w-full border rounded-lg p-2 text-xs border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Agreed Action Items (comma-separated)</label>
                <Input
                  value={sessionActionItems}
                  onChange={(e) => setSessionActionItems(e.target.value)}
                  placeholder="e.g. Complete CUET mock series, Review Ionic Equilibrium"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sessionParentInvolved}
                    onChange={(e) => setSessionParentInvolved(e.target.checked)}
                    className="rounded text-indigo-600 h-3.5 w-3.5"
                  />
                  <span className="font-medium text-slate-700">Parents Participated in Session</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSessionModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                >
                  Save Session Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
