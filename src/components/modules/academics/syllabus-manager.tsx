'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  Sparkles,
  BarChart3,
  FileText,
  Layers,
  GraduationCap,
} from 'lucide-react';
import {
  SyllabusUnit,
  LessonPlan,
  INITIAL_CBSE_SYLLABUS,
  calculateSyllabusProgress,
  filterSyllabusUnits,
} from '@/modules/academics/syllabus';

interface Props {
  role?: 'teacher' | 'admin';
}

export function SyllabusManager({ role = 'teacher' }: Props) {
  const [units, setUnits] = useState<SyllabusUnit[]>(INITIAL_CBSE_SYLLABUS);
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 'ALL'>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'plans' | 'newPlan'>('syllabus');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Lesson Plans State
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([
    {
      id: 'lp-01',
      unitId: 'syl-phy-04',
      topic: 'LCR Series Circuit Resonance & Quality Factor (Q)',
      plannedDate: '2024-11-26',
      learningObjectives: 'Students will derive resonance frequency ω₀ = 1/√(LC) and analyze sharp impedance drop in series AC circuits.',
      pedagogicalApproach: 'Inquiry-based laboratory simulation using PhET interactive AC circuit builder.',
      teachingAids: 'Interactive Smartboard, Digital Oscilloscope, LCR component kit.',
      status: 'APPROVED',
    },
    {
      id: 'lp-02',
      unitId: 'syl-mat-03',
      topic: 'Applications of Derivatives — Rate of Change & Maxima Minima',
      plannedDate: '2024-11-27',
      learningObjectives: 'Students will construct optimization models for maximum volume containers under fixed surface area constraints.',
      pedagogicalApproach: 'Problem-solving collaborative groups using real-world packaging case studies.',
      teachingAids: 'Graphing calculators, 3D cardboard templates.',
      status: 'APPROVED',
    },
  ]);

  // New Lesson Plan Form State
  const [newTopic, setNewTopic] = useState('');
  const [newUnitId, setNewUnitId] = useState('syl-phy-04');
  const [newDate, setNewDate] = useState('2024-11-29');
  const [newObjectives, setNewObjectives] = useState('');
  const [newPedagogy, setNewPedagogy] = useState('');
  const [newAids, setNewAids] = useState('');

  const filteredUnits = filterSyllabusUnits(units, selectedTerm, selectedSubject);
  const summary = calculateSyllabusProgress(units);

  const handleIncrementPeriod = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const nextCompleted = Math.min(u.allocatedPeriods, u.completedPeriods + 1);
        const isDone = nextCompleted === u.allocatedPeriods;
        return {
          ...u,
          completedPeriods: nextCompleted,
          status: isDone ? 'COMPLETED' : u.status === 'LAGGING' && nextCompleted >= u.allocatedPeriods * 0.9 ? 'IN_PROGRESS' : u.status,
        };
      })
    );
    const targetUnit = units.find((u) => u.id === unitId);
    setFeedback(`Logged 1 instructional period for ${targetUnit?.title}. Teaching diary updated.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic || !newObjectives) return;

    const plan: LessonPlan = {
      id: `lp-${Date.now()}`,
      unitId: newUnitId,
      topic: newTopic,
      plannedDate: newDate,
      learningObjectives: newObjectives,
      pedagogicalApproach: newPedagogy || 'NEP 2020 Experiential & Competency-based discussion',
      teachingAids: newAids || 'Textbook, NCERT Exemplar & Smart Classroom display',
      status: role === 'admin' ? 'APPROVED' : 'DRAFT',
    };

    setLessonPlans([plan, ...lessonPlans]);
    setNewTopic('');
    setNewObjectives('');
    setNewPedagogy('');
    setNewAids('');
    setActiveTab('plans');
    setFeedback(`Lesson plan for "${plan.topic}" submitted successfully. Status: ${plan.status}.`);
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

      {/* Curriculum Velocity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overall Progress</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary.overallPercentage}%</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {summary.totalCompleted} / {summary.totalAllocated} Periods Taught
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Units Completed</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{summary.completedUnitsCount}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">100% syllabus verified</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Lagging Units</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">{summary.laggingUnitsCount}</h3>
              <p className="text-[11px] text-rose-500 mt-0.5">Extra periods required</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Lesson Plans</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{lessonPlans.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">NEP 2020 pedagogy logged</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'syllabus' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('syllabus')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Layers className="h-3.5 w-3.5" />
            Curriculum Tracker ({filteredUnits.length} Units)
          </Button>

          <Button
            variant={activeTab === 'plans' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('plans')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            Lesson Plans ({lessonPlans.length})
          </Button>

          <Button
            variant={activeTab === 'newPlan' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('newPlan')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Draft Lesson Plan
          </Button>
        </div>

        {activeTab === 'syllabus' && (
          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Subjects</option>
              <option value="042">Physics (042)</option>
              <option value="041">Mathematics (041)</option>
            </select>

            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value === 'ALL' ? 'ALL' : (Number(e.target.value) as 1 | 2))}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Terms</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: SYLLABUS UNITS TRACKER */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUnits.map((u) => {
              const pct = Math.round((u.completedPeriods / u.allocatedPeriods) * 100);

              return (
                <Card key={u.id} className="border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px] font-mono text-slate-700 bg-slate-50">
                            {u.subjectName} ({u.subjectCode})
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            Term {u.term}
                          </Badge>
                          <Badge
                            className={`text-[10px] font-semibold ${
                              u.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.status === 'LAGGING'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-slate-900 leading-snug">
                          {u.title}
                        </CardTitle>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold font-mono text-slate-900 block">
                          {pct}%
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {u.completedPeriods}/{u.allocatedPeriods} Periods
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct === 100
                            ? 'bg-emerald-500'
                            : u.status === 'LAGGING'
                            ? 'bg-rose-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Target Milestone: <strong className="text-slate-700">{u.targetCompletionDate}</strong></span>
                      {u.status === 'LAGGING' && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Lagging Behind
                        </span>
                      )}
                    </div>

                    {/* NEP 2020 Competencies */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        NEP 2020 Learning Competencies
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {u.nepCompetencies.map((comp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]"
                          >
                            • {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Class 12-A Roster</span>
                      <Button
                        size="sm"
                        disabled={u.completedPeriods >= u.allocatedPeriods}
                        onClick={() => handleIncrementPeriod(u.id)}
                        className="text-xs h-7 bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        Log Period ({u.completedPeriods + 1}/{u.allocatedPeriods})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LESSON PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonPlans.map((lp) => {
              const unit = units.find((u) => u.id === lp.unitId);

              return (
                <Card key={lp.id} className="border-slate-200 hover:border-slate-300 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] font-mono text-slate-600">
                            {unit?.subjectName || 'Subject'}
                          </Badge>
                          <Badge
                            className={`text-[10px] font-semibold ${
                              lp.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {lp.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-slate-900 leading-snug">
                          {lp.topic}
                        </CardTitle>
                      </div>
                      <span className="text-xs font-mono text-slate-500 shrink-0">
                        {lp.plannedDate}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs text-slate-700">
                    <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                      <span className="font-semibold block text-blue-900 mb-0.5">Learning Objectives:</span>
                      <p className="text-blue-800 leading-relaxed">{lp.learningObjectives}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Pedagogical Approach: </span>
                      <span>{lp.pedagogicalApproach}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Teaching Aids: </span>
                      <span>{lp.teachingAids}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DRAFT LESSON PLAN */}
      {activeTab === 'newPlan' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Draft Competency-Based Lesson Plan (NEP 2020)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Construct instructional objectives, pedagogical design, and smart aids aligned with CBSE circular guidelines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLessonPlan} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Topic / Concept *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Wave Optics: Young's Double Slit Experiment & Fringe Width Derivation"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Syllabus Unit *
                  </label>
                  <select
                    value={newUnitId}
                    onChange={(e) => setNewUnitId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.subjectName}: {u.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learning Objectives (Competency & Bloom's Taxonomy) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Students will be able to demonstrate... derive mathematical formulation... evaluate..."
                  value={newObjectives}
                  onChange={(e) => setNewObjectives(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pedagogical Strategy
                  </label>
                  <Input
                    placeholder="e.g. Flipped classroom, hands-on lab experimentation, peer puzzle"
                    value={newPedagogy}
                    onChange={(e) => setNewPedagogy(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teaching Aids & Smart Tools
                  </label>
                  <Input
                    placeholder="e.g. Optical bench, sodium lamp, GeoGebra simulation"
                    value={newAids}
                    onChange={(e) => setNewAids(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('syllabus')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Save Lesson Plan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
