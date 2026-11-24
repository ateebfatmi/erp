'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  User,
  Users,
  Heart,
  Home,
  CheckCircle2,
  Printer,
  FileText,
  Star,
  Award,
  Compass,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Send,
  Eye,
  Lock,
} from 'lucide-react';
import {
  HolisticProgressCard,
  INITIAL_HPC_RECORDS,
  calculateCompetencyIndex,
  validateHpcCompletion,
  finalizeHolisticProgressCard,
  CompetencyLevel,
} from '@/modules/assessment/holistic-progress';

interface Props {
  role?: 'teacher' | 'student' | 'admin' | 'parent';
}

export function HolisticProgressManager({ role = 'teacher' }: Props) {
  const [hpc, setHpc] = useState<HolisticProgressCard>(INITIAL_HPC_RECORDS[0]);
  const [activeTab, setActiveTab] = useState<'card' | 'teacher' | 'student' | 'parent'>('card');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Teacher editing state
  const [teacherNotes, setTeacherNotes] = useState<string>(
    hpc.teacherAnecdotal?.anecdotalNotes || ''
  );
  const [overallSummary, setOverallSummary] = useState<string>(
    hpc.teacherAnecdotal?.overallHolisticSummary || ''
  );

  // Student editing state
  const [favoriteExperience, setFavoriteExperience] = useState<string>(
    hpc.selfAssessment?.favoriteLearningExperience || ''
  );
  const [challengeOvercome, setChallengeOvercome] = useState<string>(
    hpc.selfAssessment?.challengeOvercome || ''
  );
  const [nextTermGoal, setNextTermGoal] = useState<string>(
    hpc.selfAssessment?.personalGoalForNextTerm || ''
  );

  // Parent editing state
  const [parentNotes, setParentNotes] = useState<string>(
    hpc.parentObservation?.homeHabitsObservation || ''
  );
  const [hobbies, setHobbies] = useState<string>(
    hpc.parentObservation?.hobbiesAndCreativePursuits || ''
  );

  const competencyIndex = calculateCompetencyIndex(hpc.competencies);
  const validation = validateHpcCompletion(hpc);

  const handleUpdateTeacherNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setHpc((prev) => ({
      ...prev,
      teacherAnecdotal: {
        teacherId: 'tch-01',
        teacherName: 'Smt. Ananya Sen (Class Teacher)',
        classSection: prev.gradeSection,
        anecdotalNotes: teacherNotes,
        keyStrengthsObserved: prev.teacherAnecdotal?.keyStrengthsObserved || [
          'Analytical Rigor',
          'Empathetic Collaboration',
        ],
        recommendedFocusAreas: prev.teacherAnecdotal?.recommendedFocusAreas || [
          'Descriptive Elaboration',
        ],
        overallHolisticSummary: overallSummary,
      },
    }));
    setFeedback('Teacher Anecdotal Behavioral Observation updated successfully!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateStudentReflection = (e: React.FormEvent) => {
    e.preventDefault();
    setHpc((prev) => ({
      ...prev,
      selfAssessment: {
        favoriteLearningExperience: favoriteExperience,
        challengeOvercome,
        personalGoalForNextTerm: nextTermGoal,
        confidenceRating: 5,
        selfValues: ['Curiosity', 'Kindness', 'Perseverance'],
      },
    }));
    setFeedback('Learner Self-Reflection & Voice submitted to Class Teacher.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateParentObservation = (e: React.FormEvent) => {
    e.preventDefault();
    setHpc((prev) => ({
      ...prev,
      parentObservation: {
        homeHabitsObservation: parentNotes,
        hobbiesAndCreativePursuits: hobbies,
        screenTimeBalanceRating: 'BALANCED',
        parentSignOff: true,
        signedAt: new Date().toISOString().split('T')[0],
      },
    }));
    setFeedback('Parent Home Learning Observation saved with digital sign-off.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFinalize = () => {
    const res = finalizeHolisticProgressCard(hpc);
    if (!res.success) {
      setFeedback(res.error || 'Cannot finalize HPC.');
      return;
    }
    setHpc(res.updatedHpc);
    setFeedback('Holistic Progress Card successfully locked & finalized for official publication!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-700 h-7"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {hpc.studentName} ({hpc.admissionNo}) &bull; {hpc.gradeSection}
            </h3>
            <p className="text-xs text-slate-500">
              PARAKH 360° Multidimensional Card &bull; Academic Session {hpc.academicSession}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hpc.status === 'FINALIZED' ? (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Finalized & Stamped
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleFinalize}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Finalize 360° HPC
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="border-slate-300 text-xs flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600" />
            Print Card
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'card'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="h-4 w-4" />
          360° Holistic Card Summary
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'teacher'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="h-4 w-4" />
          Teacher Anecdotal Desk
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'student'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          Learner Voice & Peer Feedback
        </button>
        <button
          onClick={() => setActiveTab('parent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'parent'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Home className="h-4 w-4" />
          Parent Home Observation
        </button>
      </div>

      {/* TAB 1: 360° HOLISTIC CARD SUMMARY */}
      {activeTab === 'card' && (
        <div className="space-y-6">
          {/* Top Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Competency Index</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono text-indigo-700">
                    {competencyIndex.overallScorePercent}%
                  </span>
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-[10px]">
                    {competencyIndex.overallLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Proficient Domains</p>
                <h3 className="text-xl font-bold text-emerald-700 mt-1 font-mono">
                  {competencyIndex.proficientCount} / {hpc.competencies.length}
                </h3>
                <p className="text-[11px] text-slate-400">Exemplary Mastery</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">360° Pillars Status</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">4 / 4 Completed</h3>
                <p className="text-[11px] text-emerald-600 font-medium">
                  Self, Peer, Teacher, Parent
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">PARAKH Framework</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">NEP 2020</h3>
                <p className="text-[11px] text-slate-400">CBSE Circular Acad-10</p>
              </CardContent>
            </Card>
          </div>

          {/* PARAKH 21st-Century Competencies Grid */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                PARAKH 21st-Century Core Competencies & Observable Descriptors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hpc.competencies.map((comp) => (
                  <div
                    key={comp.domain}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{comp.label}</h4>
                      <Badge
                        className={
                          comp.level === 'PROFICIENT'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                            : comp.level === 'DEVELOPING'
                            ? 'bg-blue-100 text-blue-800 border-blue-200 text-[10px]'
                            : 'bg-amber-100 text-amber-800 border-amber-200 text-[10px]'
                        }
                      >
                        {comp.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{comp.evidenceOrObservation}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4 Quadrants: 360-Degree Voice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Learner Voice (Self) */}
            <Card className="border-blue-200 bg-blue-50/20 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  1. Learner Self-Assessment & Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block">Favorite Learning Moment:</strong>
                  <p className="text-slate-600 italic">
                    "{hpc.selfAssessment?.favoriteLearningExperience}"
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900 block">Challenge Overcome:</strong>
                  <p className="text-slate-600 italic">"{hpc.selfAssessment?.challengeOvercome}"</p>
                </div>
                <div>
                  <strong className="text-slate-900 block">Next Term Focus Goal:</strong>
                  <p className="text-slate-600 italic">
                    "{hpc.selfAssessment?.personalGoalForNextTerm}"
                  </p>
                </div>
                <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-slate-500">Core Values:</span>
                  <span className="font-semibold text-blue-800">
                    {hpc.selfAssessment?.selfValues.join(' • ')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 2. Peer Voice */}
            <Card className="border-purple-200 bg-purple-50/20 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  2. Peer Assessment & Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block">
                    Evaluated by Peer:{' '}
                    <span className="text-purple-800">{hpc.peerAssessment?.peerStudentName}</span>
                  </strong>
                  <p className="text-slate-600 italic">
                    "{hpc.peerAssessment?.teamworkFeedback}"
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900 block">Appreciation & Mutual Learning:</strong>
                  <p className="text-slate-600 italic">
                    "{hpc.peerAssessment?.appreciationNotes}"
                  </p>
                </div>
                <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-slate-500">Peer Collaboration Rating:</span>
                  <span className="font-bold text-purple-800 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-purple-600 text-purple-600" />
                    5 / 5
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 3. Parent Voice */}
            <Card className="border-emerald-200 bg-emerald-50/20 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-emerald-600" />
                  3. Parent Home Observation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block">Home Learning Habits:</strong>
                  <p className="text-slate-600 italic">
                    "{hpc.parentObservation?.homeHabitsObservation}"
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900 block">Creative Hobbies & Passions:</strong>
                  <p className="text-slate-600 italic">
                    "{hpc.parentObservation?.hobbiesAndCreativePursuits}"
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-slate-500">Parent Sign-off:</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                    Verified on {hpc.parentObservation?.signedAt}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 4. Teacher Anecdotal Narrative */}
            <Card className="border-amber-200 bg-amber-50/20 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-amber-600" />
                  4. Class Teacher Anecdotal Narrative
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block">
                    Teacher: {hpc.teacherAnecdotal?.teacherName}
                  </strong>
                  <p className="text-slate-600 italic">
                    "{hpc.teacherAnecdotal?.anecdotalNotes}"
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900 block">Key Strengths:</strong>
                  <span className="text-slate-600 font-medium">
                    {hpc.teacherAnecdotal?.keyStrengthsObserved.join(' • ')}
                  </span>
                </div>
                <div className="pt-2 border-t border-amber-100">
                  <span className="text-slate-500 block">Holistic Summary:</span>
                  <span className="font-semibold text-amber-900">
                    {hpc.teacherAnecdotal?.overallHolisticSummary}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER ANECDOTAL DESK */}
      {activeTab === 'teacher' && (
        <Card className="border-slate-200 shadow-xs max-w-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Teacher Anecdotal & Behavioral Observation Desk
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Record qualitative observations on critical thinking, collaborative empathy, and holistic progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateTeacherNotes} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Qualitative Anecdotal Notes
                </label>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  rows={4}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Overall Holistic Term Summary
                </label>
                <Input
                  value={overallSummary}
                  onChange={(e) => setOverallSummary(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs"
              >
                Save Teacher Anecdotal Record
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: LEARNER SELF & PEER REFLECTION */}
      {activeTab === 'student' && (
        <Card className="border-slate-200 shadow-xs max-w-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              Learner Self-Reflection & Peer Assessment
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Students articulate their personal learning milestones and provide constructive peer feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateStudentReflection} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  What was your favorite learning experience this term?
                </label>
                <Input
                  value={favoriteExperience}
                  onChange={(e) => setFavoriteExperience(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Describe a challenge you faced and how you overcame it
                </label>
                <Input
                  value={challengeOvercome}
                  onChange={(e) => setChallengeOvercome(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  What is your primary personal goal for next term?
                </label>
                <Input
                  value={nextTermGoal}
                  onChange={(e) => setNextTermGoal(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs"
              >
                Submit Self-Assessment & Voice
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: PARENT HOME OBSERVATION */}
      {activeTab === 'parent' && (
        <Card className="border-slate-200 shadow-xs max-w-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              Parent Home Environment & Lifestyle Observation
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Parents provide feedback on home study routines, hobbies, and emotional well-being.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateParentObservation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Home Learning Habits & Independent Study Routine
                </label>
                <textarea
                  value={parentNotes}
                  onChange={(e) => setParentNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hobbies, Sports & Creative Passions Pursued at Home
                </label>
                <Input
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs"
              >
                Save Parent Observation with Sign-Off
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
