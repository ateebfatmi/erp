'use client';

import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Smile,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Award,
  Plus,
  Send,
  MessageSquare,
  Lock,
  Star,
  BookOpen,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  SHWPModule,
  HealthAmbassador,
  PeerEducator,
  WellnessSession,
  AnonymousQueryBoxItem,
  ALL_SHWP_MODULES,
  INITIAL_HEALTH_AMBASSADORS,
  INITIAL_PEER_EDUCATORS,
  INITIAL_WELLNESS_SESSIONS,
  INITIAL_ANONYMOUS_QUERIES,
  calculateSHWPIndex,
  formatSHWPModule,
} from '@/modules/health/wellness-programme';

interface Props {
  role?: 'admin' | 'teacher' | 'student';
}

export function WellnessManager({ role = 'admin' }: Props) {
  const [sessions, setSessions] = useState<WellnessSession[]>(INITIAL_WELLNESS_SESSIONS);
  const [educators, setEducators] = useState<PeerEducator[]>(INITIAL_PEER_EDUCATORS);
  const [queries, setQueries] = useState<AnonymousQueryBoxItem[]>(INITIAL_ANONYMOUS_QUERIES);
  const [ambassadors] = useState<HealthAmbassador[]>(INITIAL_HEALTH_AMBASSADORS);
  const [activeTab, setActiveTab] = useState<'modules' | 'peers' | 'queries' | 'ambassadors'>('modules');

  // Submit query state (for student or anonymous portal)
  const [queryGrade, setQueryGrade] = useState('Class 10');
  const [queryTheme, setQueryTheme] = useState<SHWPModule>('emotional_wellbeing');
  const [queryText, setQueryText] = useState('');
  const [queryFeedback, setQueryFeedback] = useState<string | null>(null);

  // Counselor response state
  const [respondingQueryId, setRespondingQueryId] = useState<string | null>(null);
  const [counselorReply, setCounselorReply] = useState('');
  const [counselorAction, setCounselorAction] = useState<'addressed_in_class' | 'referred_for_1on1'>('addressed_in_class');

  // New Session state
  const [newModule, setNewModule] = useState<SHWPModule>('healthy_relationships');
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState('Class 10');
  const [newDate, setNewDate] = useState('2026-12-15');
  const [newFacilitator, setNewFacilitator] = useState('Diya Sengupta (Peer Leader) & Smt. Kavita Sharma (HWA)');
  const [newPedagogy, setNewPedagogy] = useState<WellnessSession['pedagogyMode']>('circle_time_discussion');

  const report = calculateSHWPIndex(sessions, educators, queries);

  // Mark session conducted
  const handleMarkConducted = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'conducted', studentAttendance: 68 } : s))
    );
  };

  // Submit new anonymous query
  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    const newQ: AnonymousQueryBoxItem = {
      id: `aq-${Date.now().toString().slice(-4)}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      grade: queryGrade,
      theme: queryTheme,
      queryText: queryText.trim(),
      status: 'pending',
    };

    setQueries((prev) => [newQ, ...prev]);
    setQueryText('');
    setQueryFeedback('Your confidential question has been dropped into the Counselor Box. It will be addressed sensitively.');
    setTimeout(() => setQueryFeedback(null), 6000);
  };

  // Submit counselor reply
  const handleSaveCounselorResponse = (queryId: string) => {
    if (!counselorReply.trim()) return;

    setQueries((prev) =>
      prev.map((q) => {
        if (q.id !== queryId) return q;
        return {
          ...q,
          counselorResponse: counselorReply.trim(),
          status: counselorAction,
          resolvedDate: new Date().toISOString().split('T')[0],
        };
      })
    );
    setRespondingQueryId(null);
    setCounselorReply('');
  };

  // Create new session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: WellnessSession = {
      id: `ws-${Date.now().toString().slice(-4)}`,
      module: newModule,
      sessionTitle: newTitle.trim(),
      targetGrade: newGrade,
      date: newDate,
      facilitators: [newFacilitator],
      pedagogyMode: newPedagogy,
      studentAttendance: 70,
      reflectionNotes: 'Interactive peer engagement session planned.',
      status: 'scheduled',
    };

    setSessions((prev) => [created, ...prev]);
    setNewTitle('');
    setActiveTab('modules');
  };

  return (
    <div className="space-y-6">
      {/* Top Vitality Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-pink-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-pink-800 uppercase tracking-wider">
                Ayushman Bharat Rating
              </p>
              <h3 className="text-2xl font-bold text-pink-950 mt-1 flex items-center gap-1">
                {report.ayushmanBharatStarRating} Stars
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </h3>
              <p className="text-xs text-pink-700 mt-0.5">Health & Wellness School</p>
            </div>
            <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-700">
              <HeartPulse className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                11 Modules Coverage
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">
                {report.coveredModulesCount} / 11 Modules
              </h3>
              <p className="text-xs text-blue-700 mt-0.5">{report.moduleCoveragePercentage}% Curricular Progress</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Peer Educators Active
              </p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{report.peerEducatorCount} Leaders</h3>
              <p className="text-xs text-purple-700 mt-0.5">Adolescent Peer Network</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Student Reach
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">{report.totalStudentReach} Students</h3>
              <p className="text-xs text-emerald-700 mt-0.5">Empowered via Peer Circles</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <Smile className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'modules'
              ? 'border-pink-600 text-pink-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Activity className="h-4 w-4" />
          11 Thematic Modules & Activity Calendar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('peers')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'peers'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          Adolescent Peer Educators Network
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('queries')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'queries'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Confidential Question Box & Counseling Desk
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ambassadors')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ambassadors'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Health Ambassadors & Statutory Certifications
        </button>
      </div>

      {/* TAB 1: THEMATIC MODULES & SESSIONS */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ALL_SHWP_MODULES.map((mod) => {
              const matchingSession = sessions.find((s) => s.module === mod.key);
              const isCovered = matchingSession && matchingSession.status === 'conducted';

              return (
                <div
                  key={mod.key}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCovered
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : matchingSession
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {mod.category}
                    </span>
                    <Badge
                      className={
                        isCovered
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 text-[9px] py-0'
                          : matchingSession
                          ? 'bg-amber-100 text-amber-800 border-amber-300 text-[9px] py-0'
                          : 'bg-slate-100 text-slate-500 border-slate-200 text-[9px] py-0'
                      }
                    >
                      {isCovered ? '✓ Conducted' : matchingSession ? 'Scheduled' : 'Upcoming'}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{mod.title}</h4>

                  {matchingSession ? (
                    <div className="mt-2 text-[11px] text-slate-600 space-y-0.5 pt-2 border-t border-slate-100">
                      <div className="truncate font-medium text-slate-800">{matchingSession.sessionTitle}</div>
                      <div className="text-[10px] text-slate-500">
                        {matchingSession.date} • {matchingSession.targetGrade}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Reach: {matchingSession.studentAttendance} Students
                      </div>
                      {matchingSession.status !== 'conducted' && (role === 'admin' || role === 'teacher') && (
                        <Button
                          size="sm"
                          className="mt-1 h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                          onClick={() => handleMarkConducted(matchingSession.id)}
                        >
                          Mark Session Conducted
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-[10px] text-slate-400 italic">No session scheduled this term</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Schedule Session Form */}
          {(role === 'admin' || role === 'teacher') && (
            <Card className="border-slate-200 shadow-xs max-w-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-pink-600" />
                  Schedule School Health & Wellness Session
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Select Module</label>
                    <select
                      value={newModule}
                      onChange={(e) => setNewModule(e.target.value as any)}
                      className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                    >
                      {ALL_SHWP_MODULES.map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.title} ({m.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Session Title</label>
                    <Input
                      placeholder="e.g. Understanding Boundary Setting & Mutual Peer Respect"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Target Grade</label>
                      <select
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                      >
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                      <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Pedagogy Mode</label>
                      <select
                        value={newPedagogy}
                        onChange={(e) => setNewPedagogy(e.target.value as any)}
                        className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                      >
                        <option value="circle_time_discussion">Circle Time Peer Discussion</option>
                        <option value="roleplay">Empathy Roleplay</option>
                        <option value="case_study">Real-World Case Study</option>
                        <option value="anonymous_question_box">Question Box Inquiry</option>
                        <option value="expert_doctor_talk">Doctor / Counselor Talk</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Facilitator(s)</label>
                      <Input
                        value={newFacilitator}
                        onChange={(e) => setNewFacilitator(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white text-xs">
                    Schedule Activity Session & Add to Calendar
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: ADOLESCENT PEER EDUCATORS */}
      {activeTab === 'peers' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                CBSE Adolescent Peer Educator Leadership Roster (Grades 9–12)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Trained student champions facilitating life skills, mental health support, and gender sensitivity under teacher mentorship
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {educators.map((pe) => (
                  <div
                    key={pe.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{pe.studentName}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {pe.studentId} • {pe.grade}-{pe.section}
                        </span>
                      </div>
                      <Badge
                        className={
                          pe.trainingBadgeLevel === 'Master Peer Leader'
                            ? 'bg-purple-100 text-purple-800 border-purple-300 text-[9px]'
                            : 'bg-amber-100 text-amber-800 border-amber-300 text-[9px]'
                        }
                      >
                        {pe.trainingBadgeLevel}
                      </Badge>
                    </div>

                    <div className="p-2 bg-slate-50 rounded text-[11px] space-y-0.5">
                      <div>
                        <span className="text-slate-400">Assigned Domain:</span>{' '}
                        <strong className="text-slate-800 block truncate">{formatSHWPModule(pe.assignedModule)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Mentor:</span>{' '}
                        <strong className="text-slate-800">{pe.mentorTeacher}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Circles Facilitated:</span>{' '}
                        <strong className="text-emerald-700">{pe.sessionsFacilitated} Sessions</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: CONFIDENTIAL QUERY BOX */}
      {activeTab === 'queries' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submit Query Panel (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <Card className="border-slate-200 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Drop Anonymous Concern into Question Box
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Completely confidential. No names or IPs are logged. Verified by the School Counselor.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {queryFeedback && (
                    <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{queryFeedback}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitQuery} className="space-y-3 text-xs">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">My Grade</label>
                      <select
                        value={queryGrade}
                        onChange={(e) => setQueryGrade(e.target.value)}
                        className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                      >
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Theme</label>
                      <select
                        value={queryTheme}
                        onChange={(e) => setQueryTheme(e.target.value as any)}
                        className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                      >
                        <option value="emotional_wellbeing">Exam Stress / Anxiety</option>
                        <option value="cyber_safety_digital_wellness">Cyberbullying / Online Issues</option>
                        <option value="healthy_relationships">Friendship / Peer Pressure</option>
                        <option value="growing_up_changes">Adolescent Body Changes</option>
                        <option value="nutrition_fitness">Eating Habits / Diet</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        My Question or Concern
                      </label>
                      <textarea
                        rows={4}
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        placeholder="Share what is bothering you or what you would like discussed in class..."
                        className="w-full text-xs rounded-md border border-slate-200 p-2 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Drop Anonymously in Box
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Queries & Counselor Feed (Right 7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-800">
                  Counselor Question Box Log ({queries.length} Queries)
                </span>
              </div>

              {queries.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="text-[9px] bg-slate-50">
                        {q.grade} • {formatSHWPModule(q.theme)}
                      </Badge>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{q.dateSubmitted}</span>
                    </div>
                    <Badge
                      className={
                        q.status === 'addressed_in_class'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]'
                          : q.status === 'referred_for_1on1'
                          ? 'bg-blue-100 text-blue-800 border-blue-300 text-[10px]'
                          : 'bg-amber-100 text-amber-800 border-amber-300 text-[10px]'
                      }
                    >
                      {q.status === 'addressed_in_class'
                        ? '✓ Addressed in Circle'
                        : q.status === 'referred_for_1on1'
                        ? '1-on-1 Scheduled'
                        : 'Pending Review'}
                    </Badge>
                  </div>

                  <p className="text-slate-800 font-medium italic">"{q.queryText}"</p>

                  {q.counselorResponse && (
                    <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-[11px] text-slate-700">
                      <span className="font-bold text-blue-900 block mb-0.5">
                        School Counselor Observation:
                      </span>
                      {q.counselorResponse}
                    </div>
                  )}

                  {(role === 'admin' || role === 'teacher') && q.status === 'pending' && (
                    <div className="pt-2 border-t">
                      {respondingQueryId === q.id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter counselor intervention / class resolution..."
                            value={counselorReply}
                            onChange={(e) => setCounselorReply(e.target.value)}
                            className="text-xs"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={counselorAction}
                              onChange={(e) => setCounselorAction(e.target.value as any)}
                              className="text-xs rounded border border-slate-200 p-1"
                            >
                              <option value="addressed_in_class">Address in Next Circle Time</option>
                              <option value="referred_for_1on1">Schedule 1-on-1 Relaxation Session</option>
                            </select>
                            <Button
                              size="sm"
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7"
                              onClick={() => handleSaveCounselorResponse(q.id)}
                            >
                              Save Resolution
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 text-blue-700 border-blue-200 hover:bg-blue-50"
                          onClick={() => setRespondingQueryId(q.id)}
                        >
                          Record Counselor Intervention
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HEALTH AMBASSADORS & CERTIFICATION */}
      {activeTab === 'ambassadors' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Designated Health & Wellness Ambassadors (HWAs)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Statutory CBSE mandate: Every affiliated school must designate 2 trained faculty members (1 male, 1 female) certified under Ayushman Bharat
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ambassadors.map((hwa) => (
                  <div
                    key={hwa.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{hwa.name}</h4>
                        <span className="text-[10px] text-slate-500">{hwa.designation}</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                        ✓ Ayushman Bharat Certified
                      </Badge>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded text-[11px] space-y-0.5">
                      <div>
                        <span className="text-slate-400">Gender Allocation:</span>{' '}
                        <strong className="capitalize">{hwa.gender} Ambassador (CBSE Compliant)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Certification Date:</span>{' '}
                        <strong>{hwa.trainingDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Helpline / Contact:</span>{' '}
                        <strong className="text-blue-600">{hwa.phone}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
