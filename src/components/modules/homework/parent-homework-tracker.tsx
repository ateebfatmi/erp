'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Check,
  UserCheck,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';

export interface WardHomework {
  id: string;
  subject: string;
  subjectCode: string;
  title: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  marksObtained?: number;
  status: 'pending' | 'submitted' | 'evaluated';
  submissionDate?: string;
  instructions: string;
  teacherFeedback?: string;
  parentAcknowledged?: boolean;
}

const INITIAL_WARD_HOMEWORK: WardHomework[] = [
  {
    id: 'hw-01',
    subject: 'Mathematics Standard',
    subjectCode: '041',
    title: 'Quadratic Equations Exercise 4.3 — Speed & Distance Word Problems',
    teacherName: 'Smt. Ananya Sen (PGT Math)',
    assignedDate: '2026-11-25',
    dueDate: '2026-11-28',
    maxMarks: 25,
    status: 'pending',
    instructions: 'Solve NCERT Ex 4.3 questions 1 through 8 showing full quadratic formula calculation steps.',
  },
  {
    id: 'hw-02',
    subject: 'Physics',
    subjectCode: '042',
    title: 'Ray Optics — Convex & Concave Mirror Image Formation Diagrams',
    teacherName: 'Dr. R. Ramanujan (PGT Physics)',
    assignedDate: '2026-11-23',
    dueDate: '2026-11-26',
    maxMarks: 20,
    status: 'submitted',
    submissionDate: '2026-11-25 18:40',
    instructions: 'Draw neat ray diagrams for 6 focal positions of concave mirror on graph paper.',
    parentAcknowledged: true,
  },
  {
    id: 'hw-03',
    subject: 'English Core',
    subjectCode: '301',
    title: 'Formal Letter to Municipal Commissioner: Urban Drainage Congestion',
    teacherName: 'Ms. Clara D’Souza (PGT English)',
    assignedDate: '2026-11-19',
    dueDate: '2026-11-22',
    maxMarks: 15,
    marksObtained: 14,
    status: 'evaluated',
    submissionDate: '2026-11-21 19:15',
    instructions: 'Follow CBSE 2026 writing section guidelines. Limit word count strictly between 120 and 150 words.',
    teacherFeedback: 'Outstanding vocabulary, clean layout, and persuasive arguments. Keep it up!',
    parentAcknowledged: true,
  },
  {
    id: 'hw-04',
    subject: 'Chemistry',
    subjectCode: '043',
    title: 'Electrochemical Cells & Nernst Equation Numerical Calculations',
    teacherName: 'Dr. V. K. Saxena (PGT Chemistry)',
    assignedDate: '2026-11-27',
    dueDate: '2026-12-01',
    maxMarks: 30,
    status: 'pending',
    instructions: 'Calculate cell EMF and equilibrium constants for standard Daniell cell setups.',
  },
  {
    id: 'hw-05',
    subject: 'Social Science (History)',
    subjectCode: '087',
    title: 'The Rise of Nationalism in Europe — Map Work & Timeline',
    teacherName: 'Vikramaditya Singh (PGT History)',
    assignedDate: '2026-11-15',
    dueDate: '2026-11-18',
    maxMarks: 20,
    marksObtained: 19,
    status: 'evaluated',
    submissionDate: '2026-11-17 17:00',
    instructions: 'Mark Congress of Vienna boundaries and summarize Frankfurt Parliament decisions.',
    teacherFeedback: 'Accurate cartographic labeling and concise chronological notes.',
    parentAcknowledged: true,
  },
];

interface ParentHomeworkTrackerProps {
  childName?: string;
  className?: string;
}

export function ParentHomeworkTracker({
  childName = 'Aarav Mehta',
  className = 'Class 10 - Section A',
}: ParentHomeworkTrackerProps) {
  const [homeworkList, setHomeworkList] = useState<WardHomework[]>(INITIAL_WARD_HOMEWORK);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'evaluated'>('all');
  const [signedToday, setSignedToday] = useState(false);
  const [signTimestamp, setSignTimestamp] = useState<string | null>(null);

  const filteredTasks = homeworkList.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const pendingCount = homeworkList.filter((h) => h.status === 'pending').length;
  const submittedCount = homeworkList.filter((h) => h.status === 'submitted').length;
  const evaluatedCount = homeworkList.filter((h) => h.status === 'evaluated').length;

  const totalEvaluatedMarks = homeworkList
    .filter((h) => h.status === 'evaluated' && h.marksObtained !== undefined)
    .reduce((sum, h) => sum + (h.marksObtained || 0), 0);

  const maxEvaluatedMarks = homeworkList
    .filter((h) => h.status === 'evaluated' && h.marksObtained !== undefined)
    .reduce((sum, h) => sum + h.maxMarks, 0);

  const avgGradePercent = maxEvaluatedMarks > 0 ? Math.round((totalEvaluatedMarks / maxEvaluatedMarks) * 100) : 0;

  const handleGuardianSignOff = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSignedToday(true);
    setSignTimestamp(`Today at ${time}`);
    setHomeworkList((prev) => prev.map((h) => ({ ...h, parentAcknowledged: true })));
  };

  const handleAcknowledgeSingle = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((h) => (h.id === id ? { ...h, parentAcknowledged: true } : h))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Ward Homework & Continuous Evaluation Tracker
            </h1>
            <Badge variant="success" className="text-xs">Live Sync</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring daily academic coursework, assignments, and formative teacher evaluations for{' '}
            <span className="font-bold text-slate-800">{childName}</span> ({className}).
          </p>
        </div>

        {/* Guardian Sign-Off Quick Button */}
        <div>
          {signedToday ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Guardian Verified ({signTimestamp})</span>
            </div>
          ) : (
            <Button
              onClick={handleGuardianSignOff}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 flex items-center gap-1.5 shadow-xs"
            >
              <UserCheck className="h-4 w-4" />
              Daily Guardian Sign-Off
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Pending Tasks Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
              <Clock className="h-6 w-6" /> {pendingCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Next deadline: 28 Nov (Math)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Submitted for Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <FileText className="h-6 w-6" /> {submittedCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Physics diagrams under grading
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Evaluated & Graded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" /> {evaluatedCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Teacher remarks available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Formative Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" /> {avgGradePercent}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Grade A1 Standing (CBSE Rubrics)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="text-xs h-8"
        >
          All Coursework ({homeworkList.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
          className="text-xs h-8 text-amber-700 hover:text-amber-800"
        >
          Pending Due ({pendingCount})
        </Button>
        <Button
          variant={filter === 'submitted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('submitted')}
          className="text-xs h-8 text-blue-700 hover:text-blue-800"
        >
          Submitted ({submittedCount})
        </Button>
        <Button
          variant={filter === 'evaluated' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('evaluated')}
          className="text-xs h-8 text-emerald-700 hover:text-emerald-800"
        >
          Graded with Feedback ({evaluatedCount})
        </Button>
      </div>

      {/* Coursework Cards List */}
      <div className="space-y-4">
        {filteredTasks.map((hw) => (
          <Card key={hw.id} className="border-slate-200 hover:border-slate-300 transition-all shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-mono text-slate-700 bg-slate-50">
                      {hw.subject} ({hw.subjectCode})
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        hw.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : hw.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {hw.status.toUpperCase()}
                    </Badge>
                    {hw.parentAcknowledged && (
                      <Badge variant="success" className="text-[10px]">
                        Guardian Acknowledged
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    {hw.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Assigned by {hw.teacherName} on {hw.assignedDate}
                  </CardDescription>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-800 block">
                    {hw.status === 'evaluated' && hw.marksObtained !== undefined
                      ? `${hw.marksObtained} / ${hw.maxMarks} Marks`
                      : `${hw.maxMarks} Marks Weightage`}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center sm:justify-end gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    Due {hw.dueDate}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                <span className="font-semibold block text-slate-900 mb-0.5">Teacher Guidelines:</span>
                {hw.instructions}
              </div>

              {hw.status === 'submitted' && (
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-blue-900 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                    Submitted by {childName} on {hw.submissionDate}
                  </span>
                  <span className="text-blue-700 italic">Under faculty grading</span>
                </div>
              )}

              {hw.status === 'evaluated' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      Evaluated Score: {hw.marksObtained} / {hw.maxMarks} ({Math.round(((hw.marksObtained || 0) / hw.maxMarks) * 100)}%)
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 uppercase">Passed • Exemplary</span>
                  </div>
                  {hw.teacherFeedback && (
                    <p className="text-[11px] text-emerald-800 mt-1">
                      <span className="font-semibold">Teacher Remark:</span> “{hw.teacherFeedback}”
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  NCERT 2026-27 Continuous Comprehensive Evaluation (CCE)
                </span>
                {!hw.parentAcknowledged && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAcknowledgeSingle(hw.id)}
                    className="text-xs h-7 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Acknowledge Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
