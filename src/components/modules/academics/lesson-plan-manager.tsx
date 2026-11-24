'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  Printer,
  ChevronRight,
  Filter,
  FileCheck,
  Award,
  Layers,
  GraduationCap,
  Lightbulb,
  Palette,
  HeartHandshake,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  LessonPlan,
  PlanStatus,
  BloomLevel,
  PedagogicalStrategy,
  Skill21stCentury,
  AssessmentMethod,
  INITIAL_LESSON_PLANS,
  calculateNEPComplianceScore,
  filterLessonPlans,
  reviewLessonPlan,
  formatBloomLevel,
  formatPedagogy,
} from '@/modules/academics/lesson-plan';

interface Props {
  role?: 'teacher' | 'admin';
}

export function LessonPlanManager({ role = 'teacher' }: Props) {
  const [plans, setPlans] = useState<LessonPlan[]>(INITIAL_LESSON_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'catalog' | 'create'>('catalog');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  // Review state
  const [reviewRemarks, setReviewRemarks] = useState('');

  // New Lesson Plan Form State
  const [newSubject, setNewSubject] = useState('Science (Physics)');
  const [newGrade, setNewGrade] = useState('Class 10');
  const [newSection, setNewSection] = useState('A');
  const [newChapter, setNewChapter] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newPeriods, setNewPeriods] = useState(5);
  const [newStartDate, setNewStartDate] = useState('2026-12-01');
  const [newEndDate, setNewEndDate] = useState('2026-12-08');
  const [newOutcome, setNewOutcome] = useState('');
  const [outcomesList, setOutcomesList] = useState<string[]>([
    'NCERT LO: Analyze and calculate real-world physical parameters with high precision.',
  ]);
  const [selectedBlooms, setSelectedBlooms] = useState<BloomLevel[]>([
    'understanding',
    'applying',
    'analyzing',
  ]);
  const [selectedPedagogies, setSelectedPedagogies] = useState<PedagogicalStrategy[]>([
    'experiential',
    'art_integrated',
  ]);
  const [selectedSkills, setSelectedSkills] = useState<Skill21stCentury[]>([
    'critical_thinking',
    'collaboration',
  ]);
  const [newExperiential, setNewExperiential] = useState(
    'Hands-on laboratory bench inquiry with systematic data table recording.'
  );
  const [newArtSports, setNewArtSports] = useState(
    'Art Integration: Visual infographics and thematic model construction per CBSE circular.'
  );
  const [newCWSN, setNewCWSN] = useState(
    'Tactile visual flashcards and buddy system for inclusive differentiated learning.'
  );
  const [newAssessment, setNewAssessment] = useState<AssessmentMethod>('exit_ticket');

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const complianceResult = selectedPlan ? calculateNEPComplianceScore(selectedPlan) : null;

  // Filtered plans
  const filteredPlans = filterLessonPlans(plans, {
    subject: filterSubject,
    status: filterStatus as any,
  }).filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.chapterName.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.teacherName.toLowerCase().includes(term)
    );
  });

  // Calculate live preview compliance for the new form
  const draftFormPlan: LessonPlan = {
    id: 'draft-temp',
    code: 'LP-PREVIEW',
    teacherId: 'TEMP',
    teacherName: 'Teacher',
    subject: newSubject,
    grade: newGrade,
    section: newSection,
    chapterName: newChapter,
    unitTheme: newTheme,
    targetPeriods: newPeriods,
    startDate: newStartDate,
    endDate: newEndDate,
    learningOutcomes: outcomesList,
    bloomLevels: selectedBlooms,
    pedagogyStrategies: selectedPedagogies,
    skillsTargeted: selectedSkills,
    teachingAidsTLM: ['NCERT Textbook', 'Smartboard'],
    experientialActivity: newExperiential,
    artSportsIntegrationDetails: newArtSports,
    inclusiveAdaptationsCWSN: newCWSN,
    formativeAssessmentMethod: newAssessment,
    status: 'draft',
  };
  const liveFormCompliance = calculateNEPComplianceScore(draftFormPlan);

  // Add outcome to list
  const handleAddOutcome = () => {
    if (!newOutcome.trim()) return;
    setOutcomesList((prev) => [...prev, newOutcome.trim()]);
    setNewOutcome('');
  };

  const handleRemoveOutcome = (index: number) => {
    setOutcomesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle Bloom Level
  const handleToggleBloom = (level: BloomLevel) => {
    setSelectedBlooms((prev) =>
      prev.includes(level) ? prev.filter((b) => b !== level) : [...prev, level]
    );
  };

  // Toggle Pedagogy
  const handleTogglePedagogy = (strat: PedagogicalStrategy) => {
    setSelectedPedagogies((prev) =>
      prev.includes(strat) ? prev.filter((s) => s !== strat) : [...prev, strat]
    );
  };

  // Submit plan for approval
  const handleSubmitForApproval = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          status: 'submitted',
          submittedDate: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  // Review plan action (for HOD / Admin)
  const handleReviewAction = (decision: 'approved' | 'revision_requested') => {
    if (!selectedPlan) return;
    const reviewer = role === 'admin' ? 'Dr. Rajesh Sharma (HOD Academics)' : 'Coordinator';
    const updated = reviewLessonPlan(selectedPlan, decision, reviewer, reviewRemarks || 'Reviewed & verified.');

    setPlans((prev) => prev.map((p) => (p.id === selectedPlan.id ? updated : p)));
    setReviewRemarks('');
  };

  // Create Plan submit
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapter.trim()) return;

    const newCode = `LP-2026-${newSubject.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const createdPlan: LessonPlan = {
      id: `lp-${Date.now()}`,
      code: newCode,
      teacherId: 'EMP-T01',
      teacherName: role === 'admin' ? 'Dr. Rajesh Sharma' : 'Smt. Ananya Sen',
      subject: newSubject,
      grade: newGrade,
      section: newSection,
      chapterName: newChapter,
      unitTheme: newTheme || 'Core Pedagogical Curriculum',
      targetPeriods: newPeriods,
      startDate: newStartDate,
      endDate: newEndDate,
      learningOutcomes: outcomesList,
      bloomLevels: selectedBlooms,
      pedagogyStrategies: selectedPedagogies,
      skillsTargeted: selectedSkills,
      teachingAidsTLM: ['NCERT Core Text', 'Interactive Smartboard', 'DIKSHA Portal'],
      experientialActivity: newExperiential,
      artSportsIntegrationDetails: newArtSports,
      inclusiveAdaptationsCWSN: newCWSN,
      formativeAssessmentMethod: newAssessment,
      status: 'submitted',
      submittedDate: new Date().toISOString().split('T')[0],
    };

    setPlans((prev) => [createdPlan, ...prev]);
    setSelectedPlanId(createdPlan.id);
    setActiveTab('catalog');
    setNewChapter('');
    setNewTheme('');
  };

  // Summary Metrics
  const totalCount = plans.length;
  const compliantCount = plans.filter((p) => calculateNEPComplianceScore(p).isCompliant).length;
  const pendingCount = plans.filter((p) => p.status === 'submitted').length;
  const approvedCount = plans.filter((p) => p.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Total Lesson Plans
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">{totalCount}</h3>
              <p className="text-xs text-blue-700 mt-0.5">Active Academic Cycle</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                NEP 2020 Compliant
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">{compliantCount}</h3>
              <p className="text-xs text-emerald-700 mt-0.5">Score ≥ 75% Benchmark</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Pending HOD Review
              </p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">{pendingCount}</h3>
              <p className="text-xs text-amber-700 mt-0.5">Awaiting Verification</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Approved Micro-Plans
              </p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{approvedCount}</h3>
              <p className="text-xs text-purple-700 mt-0.5">Principal / HOD Signed</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
              <FileCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="h-4 w-4" />
          Lesson Plan Catalog & Audit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'create'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus className="h-4 w-4" />
          Create NEP 2020 Micro-Plan
        </button>
      </div>

      {/* TAB 1: CATALOG & AUDIT */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <Input
                placeholder="Search chapter, code or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs max-w-xs"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Subject:
              </span>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
              >
                <option value="all">All Subjects</option>
                <option value="Science (Physics)">Science (Physics)</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Social Science">Social Science</option>
                <option value="English Language & Literature">English</option>
              </select>

              <span className="text-slate-500 ml-2">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="revision_requested">Revision Requested</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Plan List (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-700">
                  {filteredPlans.length} Micro-Plans Listed
                </span>
              </div>

              {filteredPlans.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                const comp = calculateNEPComplianceScore(plan);

                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setShowPrintPreview(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                          {plan.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                          {plan.chapterName}
                        </h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          plan.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                            : plan.status === 'submitted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]'
                            : plan.status === 'revision_requested'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 text-[10px]'
                        }
                      >
                        {plan.status === 'approved'
                          ? 'Approved'
                          : plan.status === 'submitted'
                          ? 'Under Review'
                          : plan.status === 'revision_requested'
                          ? 'Needs Revision'
                          : 'Draft'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      {plan.subject} • {plan.grade}-{plan.section} ({plan.targetPeriods} Periods)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">By {plan.teacherName}</p>

                    {/* NEP Compliance bar */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">NEP 2020 Compliance:</span>
                      <span
                        className={`font-semibold ${
                          comp.isCompliant ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {comp.score}% {comp.isCompliant ? '✓ Compliant' : '⚠ Action Needed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Plan Details & Review Desk (Right 7 cols) */}
            <div className="lg:col-span-7">
              {selectedPlan && (
                <div className="space-y-4">
                  <Card className="border-slate-200 shadow-xs">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <Badge className="bg-slate-100 text-slate-800 border-slate-200 mb-1">
                            {selectedPlan.grade}-{selectedPlan.section} • {selectedPlan.subject}
                          </Badge>
                          <CardTitle className="text-base font-bold text-slate-900">
                            {selectedPlan.chapterName}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-600 mt-0.5">
                            Unit: {selectedPlan.unitTheme} • {selectedPlan.targetPeriods} Periods (
                            {selectedPlan.startDate} to {selectedPlan.endDate})
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setShowPrintPreview(!showPrintPreview)}
                          >
                            <Printer className="h-3.5 w-3.5 mr-1" />
                            {showPrintPreview ? 'Hide Sheet' : 'CBSE Print Sheet'}
                          </Button>
                          {selectedPlan.status === 'draft' && (
                            <Button
                              size="sm"
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleSubmitForApproval(selectedPlan.id)}
                            >
                              <Send className="h-3.5 w-3.5 mr-1" />
                              Submit to HOD
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4 text-xs">
                      {/* Printable CBSE Lesson Sheet */}
                      {showPrintPreview && (
                        <div className="p-4 border-2 border-dashed border-blue-300 bg-blue-50/20 rounded-xl space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                            <div>
                              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                Vidya Mandir Senior Secondary School (CBSE Affiliation No: 2130045)
                              </h4>
                              <p className="text-[10px] text-blue-700">
                                Statutory Pedagogical Micro-Plan Document • Plan Code: {selectedPlan.code}
                              </p>
                            </div>
                            <Badge className="bg-blue-600 text-white text-[10px]">CBSE Rule 13</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500">Teacher:</span>{' '}
                              <strong className="text-slate-800">{selectedPlan.teacherName}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500">Subject & Class:</span>{' '}
                              <strong className="text-slate-800">
                                {selectedPlan.subject} ({selectedPlan.grade}-{selectedPlan.section})
                              </strong>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-700 italic border-t border-blue-200 pt-2">
                            This micro-plan has been drafted in strict adherence to the National Education
                            Policy 2020, focusing on experiential learning, art integration, higher order
                            thinking skills, and inclusive education.
                          </p>
                        </div>
                      )}

                      {/* NEP 2020 Compliance Audit Meter */}
                      {complianceResult && (
                        <div className="p-3.5 border rounded-lg bg-slate-50/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              NEP 2020 & CBSE Statutory Compliance Meter
                            </span>
                            <span
                              className={`font-bold ${
                                complianceResult.isCompliant ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {complianceResult.score}% {complianceResult.isCompliant ? 'Compliant' : 'Deficient'}
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                complianceResult.isCompliant ? 'bg-emerald-600' : 'bg-amber-500'
                              }`}
                              style={{ width: `${complianceResult.score}%` }}
                            />
                          </div>

                          {complianceResult.missingElements.length > 0 && (
                            <div className="pt-1 space-y-1">
                              {complianceResult.missingElements.map((elem, idx) => (
                                <p key={idx} className="text-[11px] text-amber-700 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                  {elem}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Learning Outcomes */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                          NCERT Aligned Learning Outcomes ({selectedPlan.learningOutcomes.length})
                        </h4>
                        <ul className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                          {selectedPlan.learningOutcomes.map((lo, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{lo}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bloom Taxonomy & Pedagogical Strategies */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                            Bloom's Cognitive Levels
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedPlan.bloomLevels.map((lvl) => (
                              <Badge
                                key={lvl}
                                variant="outline"
                                className="bg-blue-50 text-blue-800 border-blue-200 text-[10px]"
                              >
                                {formatBloomLevel(lvl)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Palette className="h-3.5 w-3.5 text-purple-600" />
                            Pedagogy Strategies
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedPlan.pedagogyStrategies.map((strat) => (
                              <Badge
                                key={strat}
                                variant="outline"
                                className="bg-purple-50 text-purple-800 border-purple-200 text-[10px]"
                              >
                                {formatPedagogy(strat)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Experiential & Art/Sports Integration */}
                      <div className="space-y-2">
                        {selectedPlan.experientialActivity && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="font-bold text-slate-800 block text-xs mb-0.5">
                              🧪 Experiential Learning & Hands-On Investigation:
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {selectedPlan.experientialActivity}
                            </p>
                          </div>
                        )}

                        {selectedPlan.artSportsIntegrationDetails && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="font-bold text-slate-800 block text-xs mb-0.5">
                              🎨 CBSE Art / Sports Integrated Pedagogy:
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {selectedPlan.artSportsIntegrationDetails}
                            </p>
                          </div>
                        )}

                        {selectedPlan.inclusiveAdaptationsCWSN && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="font-bold text-slate-800 block text-xs mb-0.5">
                              🤝 Inclusive Education & CWSN Adaptations:
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {selectedPlan.inclusiveAdaptationsCWSN}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Review & Approval Panel */}
                      <div className="p-3.5 border rounded-lg bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-blue-600" />
                            Academic Coordination & HOD Verification
                          </h4>
                          <Badge
                            className={
                              selectedPlan.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : selectedPlan.status === 'revision_requested'
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }
                          >
                            {selectedPlan.status.toUpperCase()}
                          </Badge>
                        </div>

                        {selectedPlan.reviewerName && (
                          <div className="p-2.5 bg-slate-50 rounded-md text-[11px] text-slate-700 space-y-0.5">
                            <div>
                              <strong>Reviewed by:</strong> {selectedPlan.reviewerName} on{' '}
                              {selectedPlan.reviewDate}
                            </div>
                            {selectedPlan.reviewerRemarks && (
                              <div className="italic text-slate-600">
                                "{selectedPlan.reviewerRemarks}"
                              </div>
                            )}
                          </div>
                        )}

                        {role === 'admin' && selectedPlan.status !== 'approved' && (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="text-[11px] font-semibold text-slate-700 block">
                              HOD / Coordinator Pedagogical Feedback:
                            </label>
                            <Input
                              placeholder="Enter constructive remarks, learning outcome alignment, or approval notes..."
                              value={reviewRemarks}
                              onChange={(e) => setReviewRemarks(e.target.value)}
                              className="text-xs"
                            />
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                                onClick={() => handleReviewAction('revision_requested')}
                              >
                                Request Revision
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleReviewAction('approved')}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Approve Lesson Plan
                              </Button>
                            </div>
                          </div>
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

      {/* TAB 2: CREATE NEW MICRO-PLAN */}
      {activeTab === 'create' && (
        <Card className="border-slate-200 shadow-xs max-w-3xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-blue-600" />
                  Draft NEP 2020 Pedagogical Micro-Plan
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Formulate competency-based lesson plan with Bloom HOTS mapping and art/experiential integration.
                </CardDescription>
              </div>
              <Badge
                className={
                  liveFormCompliance.isCompliant
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }
              >
                Live NEP Score: {liveFormCompliance.score}%
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                  >
                    <option value="Science (Physics)">Science (Physics)</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English Language & Literature">English Language & Literature</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Section</label>
                  <Input
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Chapter / Unit Title
                  </label>
                  <Input
                    placeholder="e.g. Carbon and its Compounds"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Unit Theme</label>
                  <Input
                    placeholder="e.g. Chemical Substances & World of the Living"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Periods</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={newPeriods}
                    onChange={(e) => setNewPeriods(parseInt(e.target.value) || 1)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">End Date</label>
                  <Input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Learning Outcomes List */}
              <div className="space-y-2 border p-3 rounded-lg bg-slate-50/50">
                <label className="text-xs font-semibold text-slate-700 block">
                  NCERT Learning Outcomes (LOs)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add measurable outcome (e.g. NCERT LO: Draw covalent bonding in methane...)"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddOutcome}
                    className="text-xs shrink-0"
                  >
                    Add LO
                  </Button>
                </div>
                <ul className="space-y-1">
                  {outcomesList.map((lo, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-200"
                    >
                      <span className="truncate">{lo}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOutcome(idx)}
                        className="text-rose-600 hover:text-rose-800 ml-2 font-bold"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloom Cognitive Levels Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Bloom's Cognitive Levels Targeted:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'remembering',
                      'understanding',
                      'applying',
                      'analyzing',
                      'evaluating',
                      'creating',
                    ] as BloomLevel[]
                  ).map((lvl) => {
                    const isChecked = selectedBlooms.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleToggleBloom(lvl)}
                        className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {formatBloomLevel(lvl)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pedagogical Strategies */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Pedagogical Strategies (NEP 2020 Mandate):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'experiential',
                      'art_integrated',
                      'sports_integrated',
                      'toy_based',
                      'inquiry_discussion',
                      'cross_curricular',
                    ] as PedagogicalStrategy[]
                  ).map((strat) => {
                    const isChecked = selectedPedagogies.includes(strat);
                    return (
                      <button
                        key={strat}
                        type="button"
                        onClick={() => handleTogglePedagogy(strat)}
                        className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-purple-50 border-purple-500 text-purple-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {formatPedagogy(strat)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experiential Learning Activity */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Experiential / Hands-On Investigation Description:
                </label>
                <Input
                  value={newExperiential}
                  onChange={(e) => setNewExperiential(e.target.value)}
                  placeholder="Describe student hands-on lab or field discovery activity..."
                  className="text-xs"
                />
              </div>

              {/* Art / Sports Integration Details */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Art / Sports Integrated Learning Details (CBSE Circular Compliant):
                </label>
                <Input
                  value={newArtSports}
                  onChange={(e) => setNewArtSports(e.target.value)}
                  placeholder="e.g. Visual sketching, puppet role-play, or athletic court geometry..."
                  className="text-xs"
                />
              </div>

              {/* Inclusive CWSN Adaptations */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Inclusive Education & CWSN Adaptations:
                </label>
                <Input
                  value={newCWSN}
                  onChange={(e) => setNewCWSN(e.target.value)}
                  placeholder="e.g. Peer-buddy transcription, large font worksheets, tactile aids..."
                  className="text-xs"
                />
              </div>

              {/* Formative Assessment Method */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Formative Assessment / Exit Ticket Method:
                </label>
                <select
                  value={newAssessment}
                  onChange={(e) => setNewAssessment(e.target.value as AssessmentMethod)}
                  className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                >
                  <option value="exit_ticket">Exit Ticket (Quick 2-question slip)</option>
                  <option value="quiz">Formative Diagnostic Quiz</option>
                  <option value="peer_review">Peer Review & Cooperative Critique</option>
                  <option value="concept_map">Concept Mapping Diagram</option>
                  <option value="oral_questioning">Socratic Oral Questioning</option>
                  <option value="rubric_presentation">Rubric-Scored Student Presentation</option>
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  Save Micro-Plan & Submit for HOD Approval
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
