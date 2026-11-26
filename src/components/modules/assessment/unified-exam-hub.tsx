'use client';

import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Sparkles,
  BookOpen,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BoardLOCManager } from '@/components/modules/assessment/board-loc-manager';
import { HolisticProgressManager } from '@/components/modules/assessment/holistic-progress-manager';
import { QuestionBankManager } from '@/components/modules/assessment/question-bank-manager';
import { AdmitCardManager } from '@/components/modules/assessment/admit-card-manager';

export type ExamTabId = 'grading' | 'loc' | 'hpc' | 'question-bank' | 'admit-cards';

interface ExamTerm {
  id: string;
  name: string;
  weightage_percent: number;
  is_published: boolean;
}

interface StudentEnrollment {
  id: string;
  student?: {
    full_name: string;
    admission_number: string;
  };
}

interface ExamMark {
  id: string;
  subject_name?: string;
  max_marks?: number;
  marks_obtained: number;
}

interface UnifiedExamHubProps {
  initialTab?: ExamTabId;
  examTerms?: ExamTerm[];
  sampleStudent?: StudentEnrollment;
  marks?: ExamMark[];
}

export function UnifiedExamHub({
  initialTab = 'grading',
  examTerms = [
    { id: 'term-1', name: 'Term 1 Mid-Term Examination', weightage_percent: 20, is_published: true },
    { id: 'term-2', name: 'Term 1 Final Examination', weightage_percent: 30, is_published: true },
    { id: 'term-3', name: 'Term 2 Periodic Test', weightage_percent: 10, is_published: false },
    { id: 'term-4', name: 'Annual Board Model Assessment', weightage_percent: 40, is_published: false },
  ],
  sampleStudent = {
    id: 'stud-101',
    student: {
      full_name: 'Aarav Mehta',
      admission_number: 'ADM-2024-001',
    },
  },
  marks = [
    { id: 'm-1', subject_name: 'English Communicative (101)', max_marks: 80, marks_obtained: 74 },
    { id: 'm-2', subject_name: 'Mathematics Standard (041)', max_marks: 80, marks_obtained: 78 },
    { id: 'm-3', subject_name: 'Science & Lab Practices (086)', max_marks: 80, marks_obtained: 71 },
    { id: 'm-4', subject_name: 'Social Sciences (087)', max_marks: 80, marks_obtained: 69 },
    { id: 'm-5', subject_name: 'Information Technology (402)', max_marks: 50, marks_obtained: 48 },
  ],
}: UnifiedExamHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabs: SubTabItem[] = [
    {
      id: 'grading',
      label: 'CBSE Grading & Report Cards',
      icon: Award,
      badge: `${examTerms.length} Terms`,
    },
    {
      id: 'loc',
      label: 'Board LOC Pariksha Sangam',
      icon: ShieldCheck,
      badge: 'CBSE Ready',
    },
    {
      id: 'hpc',
      label: '360° Holistic Progress (HPC)',
      icon: Sparkles,
      badge: 'PARAKH',
    },
    {
      id: 'question-bank',
      label: 'Question Bank & Blueprints',
      icon: BookOpen,
      badge: 'Bloom Tax.',
    },
    {
      id: 'admit-cards',
      label: 'Admit Cards & Hall Tickets',
      icon: FileText,
      badge: 'Active',
    },
  ];

  // Grade calculation helpers
  const totalMax = marks.reduce((acc, m) => acc + (m.max_marks || 80), 0);
  const totalObtained = marks.reduce((acc, m) => acc + m.marks_obtained, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0';

  const getGrade = (pct: number) => {
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E (Essential Repeat)';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              Examination & Academic Assessment Suite
            </h1>
            <Badge variant="indigo" className="text-[11px] font-semibold py-0.5">
              CBSE & NEP 2020 Compliant
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Unified examination desk: manage term evaluation schemas, Board LOC candidate verification,
            PARAKH 360° Holistic Progress Cards (HPC), Bloom&apos;s Taxonomy question banks, and QR-verified admit cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/documents/report-card/aarav" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Sample CBSE Report Card (PDF)</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Grading & Term Evaluation */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          {/* Terms Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {examTerms.map((term) => (
              <Card key={term.id} className="border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-slate-900 truncate">
                    {term.name}
                  </CardTitle>
                  <Badge variant={term.is_published ? 'success' : 'secondary'} className="text-[10px]">
                    {term.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-slate-500">Weightage:</span>
                    <span className="font-bold text-slate-800">{term.weightage_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${term.weightage_percent * 2}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gradebook Sample Sheet */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-600" />
                  Mid-Term Marks Sheet — {sampleStudent?.student?.full_name} ({sampleStudent?.student?.admission_number})
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Class 10 - Section A &bull; CBSE Standard Evaluation &bull; 9-Point Grading Scale (A1 to E)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Overall Aggregate</span>
                  <span className="text-sm font-bold text-slate-900">
                    {totalObtained} / {totalMax} ({percentage}%)
                  </span>
                </div>
                <Badge variant="indigo" className="text-xs px-2.5 py-1 font-semibold">
                  Grade: {getGrade(Number(percentage))}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Subject</th>
                      <th className="py-3 px-4 font-semibold text-center">Max Marks</th>
                      <th className="py-3 px-4 font-semibold text-center">Passing Marks</th>
                      <th className="py-3 px-4 font-semibold text-center">Marks Obtained</th>
                      <th className="py-3 px-4 font-semibold text-center">Percentage</th>
                      <th className="py-3 px-4 font-semibold text-center">CBSE Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {marks.map((m) => {
                      const max = m.max_marks || 80;
                      const pct = Math.round((m.marks_obtained / max) * 100);
                      const passing = Math.ceil(max * 0.33);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {m.subject_name}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600 font-mono">
                            {max}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono">
                            {passing}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-indigo-600 font-mono">
                            {m.marks_obtained}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700 font-medium">
                            {pct}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="outline" className="font-semibold text-xs border-indigo-200 text-indigo-700 bg-indigo-50/50">
                              {getGrade(pct)}
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
        </div>
      )}

      {/* Tab 2: Board LOC Pariksha Sangam */}
      {activeTab === 'loc' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Pariksha Sangam Validation:</strong> Candidate details, UDISE+ PEN, subject selection, and fee liability audits are synced.
              </span>
            </div>
            <Badge className="bg-blue-600 text-white text-[10px]">Portal Synced</Badge>
          </div>
          <BoardLOCManager />
        </div>
      )}

      {/* Tab 3: Holistic Progress Card (HPC) */}
      {activeTab === 'hpc' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                <strong>PARAKH 360° HPC Standard:</strong> Self-reflection, peer review, and competency milestones tracking.
              </span>
            </div>
            <Badge className="bg-indigo-600 text-white text-[10px]">CBSE Mandate</Badge>
          </div>
          <HolisticProgressManager role="admin" />
        </div>
      )}

      {/* Tab 4: Question Bank & Blueprints */}
      {activeTab === 'question-bank' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Bloom&apos;s Taxonomy Alignment:</strong> Categorized by Remember, Understand, Apply, Analyze, Evaluate, Create.
              </span>
            </div>
            <Badge className="bg-amber-600 text-white text-[10px]">Circular Acad-05/2017</Badge>
          </div>
          <QuestionBankManager />
        </div>
      )}

      {/* Tab 5: Admit Cards & Hall Tickets */}
      {activeTab === 'admit-cards' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Cryptographic Verification:</strong> All generated admit cards contain verifiable QR codes with no-dues clearance checks.
              </span>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">QR Verification</Badge>
          </div>
          <AdmitCardManager role="admin" />
        </div>
      )}
    </div>
  );
}
