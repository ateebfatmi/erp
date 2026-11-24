'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  HeartHandshake,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Printer,
  Edit3,
  BookOpen,
  User,
  Building2,
  ShieldCheck,
  Award,
  AlertCircle,
} from 'lucide-react';
import {
  CwsnStudentProfile,
  IepTermGoal,
  IepGoalStatus,
  INITIAL_CWSN_PROFILES,
  calculateIepProgress,
  updateIepGoal,
} from '@/modules/academics/cwsn-iep';

interface CwsnIepManagerProps {
  role?: 'admin' | 'teacher';
}

export function CwsnIepManager({ role = 'admin' }: CwsnIepManagerProps) {
  const [profiles, setProfiles] = useState<CwsnStudentProfile[]>(INITIAL_CWSN_PROFILES);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(INITIAL_CWSN_PROFILES[0].id);

  // Goal update modal
  const [editingGoal, setEditingGoal] = useState<IepTermGoal | null>(null);
  const [goalStatus, setGoalStatus] = useState<IepGoalStatus>('IN_PROGRESS');
  const [goalProgress, setGoalProgress] = useState(75);
  const [educatorNotes, setEducatorNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const currentProfile = profiles.find((p) => p.id === selectedStudentId) || profiles[0];
  const progressStats = calculateIepProgress(currentProfile.termGoals);

  const handleOpenEditGoal = (goal: IepTermGoal) => {
    setEditingGoal(goal);
    setGoalStatus(goal.status);
    setGoalProgress(goal.progressPercentage);
    setEducatorNotes(goal.specialEducatorNotes || '');
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    const updatedProfile = updateIepGoal(
      currentProfile,
      editingGoal.id,
      goalStatus,
      Number(goalProgress),
      educatorNotes
    );

    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setEditingGoal(null);
    setNotification(`IEP Milestone Goal updated for ${currentProfile.studentName}.`);
    setTimeout(() => setNotification(null), 3500);
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

      {/* Top Banner */}
      <div className="bg-linear-to-r from-teal-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-500 text-white font-mono text-[10px] font-bold">
                RPwD Act 2016 &bull; CBSE Rule 24
              </Badge>
              <Badge className="bg-emerald-500/80 text-white text-[10px] font-semibold">
                NEP 2020 Inclusive Education
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-teal-400" />
              Children with Special Needs (CWSN) & Individualized Education Plan (IEP)
            </h1>
            <p className="text-xs text-teal-200 leading-relaxed">
              Diagnostic clinical profiles, Individualized Education Plans (IEP), term goal milestones, and statutory CBSE Board Examination concessions for inclusive learners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Official IEP</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Student Selector Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase">
                Active Inclusive Learner
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                {currentProfile.studentName} ({currentProfile.admissionNo} &bull; {currentProfile.gradeClass}-{currentProfile.section})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="student-selector" className="text-xs font-medium text-slate-600">Switch Learner:</label>
            <select
              id="student-selector"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="rounded-lg border border-slate-300 py-1.5 px-3 bg-white text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.studentName} ({p.gradeClass} &bull; {p.disabilityCategory.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Profile & Statutory Concessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Clinical Diagnosis & Case Officers */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Clinical Diagnosis & Clinical Authority
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">RPwD Specified Category</span>
                <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-[10px] mt-1">
                  {currentProfile.disabilityCategory.replace(/_/g, ' ')}
                </Badge>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Diagnostic Evaluation</span>
                <p className="text-slate-800 font-medium mt-0.5 leading-snug">
                  {currentProfile.clinicalDiagnosis}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-slate-600">
                <div>
                  <span className="text-slate-400">Govt. Disability Cert No:</span>{' '}
                  <span className="font-mono font-bold text-slate-800">{currentProfile.disabilityCertificateNo}</span>
                </div>
                <div>
                  <span className="text-slate-400">Issuing Hospital:</span>{' '}
                  <span className="font-medium text-slate-800">{currentProfile.issuingHospitalOrAgency}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600">
                <div>
                  <span className="text-slate-400">Special Educator:</span>{' '}
                  <span className="font-bold text-slate-800">{currentProfile.specialEducatorInCharge}</span>
                </div>
                <div>
                  <span className="text-slate-400">School Counselor:</span>{' '}
                  <span className="font-bold text-slate-800">{currentProfile.counselorInCharge}</span>
                </div>
                <div>
                  <span className="text-slate-400">Last Comprehensive Review:</span>{' '}
                  <span className="font-medium text-slate-700">{currentProfile.lastIepReviewDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classroom Accommodations */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Classroom Accommodations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2 text-xs text-slate-700">
                {currentProfile.classroomAccommodations.map((acc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right 2 Columns: CBSE Concessions & IEP Term Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statutory CBSE Concessions */}
          <Card className="border-teal-200 bg-teal-50/20 shadow-xs">
            <CardHeader className="p-4 border-b border-teal-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-teal-950 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-700" />
                  Statutory CBSE Board Examination Concessions (Rule 24)
                </CardTitle>
                <CardDescription className="text-xs text-teal-800">
                  Approved accommodations for Board & Terminal Examinations
                </CardDescription>
              </div>
              <Badge variant="success" className="text-[10px]">
                Pre-Approved by Examination Cell
              </Badge>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentProfile.eligibleCbseConcessions.map((con, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-teal-200 bg-white flex items-center gap-2 text-xs text-slate-800 shadow-2xs"
                  >
                    <Award className="h-4 w-4 text-teal-600 shrink-0" />
                    <span className="font-semibold">{con.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IEP Term Goals & Milestones */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Individualized Education Plan (IEP) &ndash; Term Goal Milestones
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track quarterly developmental milestones and educational accommodations
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Overall IEP Mastery
                  </span>
                  <span className="text-sm font-bold text-teal-700 font-mono">
                    {progressStats.overallProgressPercent}%
                  </span>
                </div>
                <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full"
                    style={{ width: `${progressStats.overallProgressPercent}%` }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {currentProfile.termGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {goal.domain.replace(/_/g, ' ')}
                      </Badge>
                      <Badge
                        variant={goal.status === 'ACHIEVED' ? 'success' : 'default'}
                        className="text-[10px]"
                      >
                        {goal.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {goal.progressPercentage}% Mastery
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditGoal(goal)}
                        className="h-7 text-xs gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" /> Update
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{goal.goalStatement}</h3>
                    <div className="mt-1 text-[11px] text-slate-500 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <strong>Baseline:</strong> {goal.baselinePerformance}
                      </div>
                      <div>
                        <strong>Target Milestone:</strong> {goal.targetMilestone}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        goal.status === 'ACHIEVED' ? 'bg-emerald-600' : 'bg-teal-600'
                      }`}
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>

                  {goal.specialEducatorNotes && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Special Educator Observation:</span>{' '}
                      {goal.specialEducatorNotes}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Milestone Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-teal-600" />
                  Record IEP Milestone Progress &ndash; {editingGoal.domain.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-500">
                  Student: {currentProfile.studentName} ({currentProfile.gradeClass})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Goal Statement:
                </label>
                <p className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
                  {editingGoal.goalStatement}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Progress Status *:
                  </label>
                  <select
                    value={goalStatus}
                    onChange={(e) => setGoalStatus(e.target.value as IepGoalStatus)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ACHIEVED">Achieved</option>
                    <option value="MODIFIED">Modified</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mastery Level (%):
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={goalProgress}
                    onChange={(e) => setGoalProgress(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Special Educator Observation & Intervention Notes:
                </label>
                <textarea
                  rows={3}
                  value={educatorNotes}
                  onChange={(e) => setEducatorNotes(e.target.value)}
                  placeholder="Record student response to assistive tools, reading pace improvements, or clinical accommodations..."
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingGoal(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 cursor-pointer text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save IEP Observation</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
