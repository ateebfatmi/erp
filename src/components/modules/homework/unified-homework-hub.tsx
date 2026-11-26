'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Award,
  BookOpen,
  Send,
  Users,
  Check,
  X,
  FileCheck,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';

export type HomeworkTabId = 'roster' | 'create' | 'evaluations';

export interface HomeworkAssignment {
  id: string;
  title: string;
  className: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  totalStudents: number;
  submittedCount: number;
  evaluatedCount: number;
  description: string;
  status: 'active' | 'closed';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  rollNumber: string;
  submittedAt?: string;
  status: 'submitted' | 'evaluated' | 'late' | 'missing';
  marksObtained?: number;
  maxMarks: number;
  feedback?: string;
}

interface UnifiedHomeworkHubProps {
  initialTab?: HomeworkTabId;
  role?: 'admin' | 'teacher';
}

export function UnifiedHomeworkHub({
  initialTab = 'roster',
  role = 'admin',
}: UnifiedHomeworkHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Homework Assignments
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>([
    {
      id: 'hw-1',
      title: 'Ray Optics & Refraction Numerical Problems',
      className: 'Class 10 - Section A',
      subject: 'Physics',
      assignedDate: '2026-11-25',
      dueDate: '2026-11-28',
      maxMarks: 20,
      totalStudents: 40,
      submittedCount: 36,
      evaluatedCount: 28,
      description: 'Solve NCERT Chapter 10 exercises 10.1 to 10.8 with ray diagrams on graph sheets.',
      status: 'active',
    },
    {
      id: 'hw-2',
      title: 'Quadratic Equations Word Problems Exercise 4.3',
      className: 'Class 10 - Section A',
      subject: 'Mathematics',
      assignedDate: '2026-11-24',
      dueDate: '2026-11-27',
      maxMarks: 25,
      totalStudents: 40,
      submittedCount: 38,
      evaluatedCount: 35,
      description: 'Complete speed, distance and time problems using quadratic formula.',
      status: 'active',
    },
    {
      id: 'hw-3',
      title: 'Formal Letter Writing (Letter to the Editor)',
      className: 'Class 10 - Section B',
      subject: 'English Language',
      assignedDate: '2026-11-22',
      dueDate: '2026-11-25',
      maxMarks: 10,
      totalStudents: 38,
      submittedCount: 38,
      evaluatedCount: 38,
      description: 'Draft a letter highlighting road safety near school zones in 120-150 words.',
      status: 'closed',
    },
  ]);

  // Submissions for currently selected assignment (hw-1)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('hw-1');

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: 'sub-1',
      assignmentId: 'hw-1',
      studentName: 'Aarav Mehta',
      rollNumber: '101',
      submittedAt: '2026-11-26 18:30',
      status: 'evaluated',
      marksObtained: 19,
      maxMarks: 20,
      feedback: 'Excellent ray diagrams with neat scale labeling.',
    },
    {
      id: 'sub-2',
      assignmentId: 'hw-1',
      studentName: 'Diya Sharma',
      rollNumber: '102',
      submittedAt: '2026-11-26 20:15',
      status: 'evaluated',
      marksObtained: 18,
      maxMarks: 20,
      feedback: 'Correct formulas applied; small arithmetic error in Q4.',
    },
    {
      id: 'sub-3',
      assignmentId: 'hw-1',
      studentName: 'Rohan Verma',
      rollNumber: '103',
      submittedAt: '2026-11-27 08:10',
      status: 'submitted',
      maxMarks: 20,
    },
    {
      id: 'sub-4',
      assignmentId: 'hw-1',
      studentName: 'Ananya Iyer',
      rollNumber: '104',
      status: 'missing',
      maxMarks: 20,
    },
  ]);

  // Form State for creating new assignment
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    className: 'Class 10 - Section A',
    subject: 'Physics',
    dueDate: '',
    maxMarks: 20,
    description: '',
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate) return;

    const record: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      title: newAssignment.title,
      className: newAssignment.className,
      subject: newAssignment.subject,
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: newAssignment.dueDate,
      maxMarks: Number(newAssignment.maxMarks) || 20,
      totalStudents: 40,
      submittedCount: 0,
      evaluatedCount: 0,
      description: newAssignment.description,
      status: 'active',
    };

    setAssignments([record, ...assignments]);
    setActiveTab('roster');
    setNewAssignment({
      title: '',
      className: 'Class 10 - Section A',
      subject: 'Physics',
      dueDate: '',
      maxMarks: 20,
      description: '',
    });
  };

  // Evaluation modal state
  const [evaluatingSub, setEvaluatingSub] = useState<StudentSubmission | null>(null);
  const [evalMarks, setEvalMarks] = useState<number>(0);
  const [evalFeedback, setEvalFeedback] = useState<string>('');

  const handleSaveEvaluation = () => {
    if (!evaluatingSub) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === evaluatingSub.id
          ? {
              ...s,
              status: 'evaluated',
              marksObtained: evalMarks,
              feedback: evalFeedback,
            }
          : s
      )
    );
    setEvaluatingSub(null);
  };

  const tabs: SubTabItem[] = [
    {
      id: 'roster',
      label: 'Assignments & Task Roster',
      icon: BookOpen,
      badge: `${assignments.filter((a) => a.status === 'active').length} Active`,
    },
    {
      id: 'create',
      label: 'Assign Homework',
      icon: Plus,
    },
    {
      id: 'evaluations',
      label: 'Submissions & Evaluation Desk',
      icon: CheckCircle2,
      badge: `${submissions.filter((s) => s.status === 'submitted').length} To Grade`,
    },
  ];

  const assignmentColumns: DataTableColumn<HomeworkAssignment>[] = [
    {
      key: 'title',
      header: 'Homework Assignment',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{row.title}</span>
          <span className="text-[10px] text-slate-500 line-clamp-1">{row.description}</span>
          <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 block">
            {row.className} • {row.subject}
          </span>
        </div>
      ),
    },
    {
      key: 'assignedDate',
      header: 'Assigned / Due',
      render: (row) => (
        <div className="text-xs">
          <span className="text-slate-500 block text-[10px]">Assigned: {formatDate(row.assignedDate)}</span>
          <span className="text-slate-900 font-bold block">Due: {formatDate(row.dueDate)}</span>
        </div>
      ),
    },
    {
      key: 'submittedCount',
      header: 'Submission Progress',
      render: (row) => {
        const pct = Math.round((row.submittedCount / row.totalStudents) * 100);
        return (
          <div className="w-36 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>{row.submittedCount}/{row.totalStudents} submitted</span>
              <span className="font-bold">{pct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) =>
        row.status === 'active' ? (
          <Badge variant="success" className="text-[10px]">Open</Badge>
        ) : (
          <Badge variant="secondary" className="text-[10px]">Completed</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Grade Submissions',
      align: 'right',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedAssignmentId(row.id);
            setActiveTab('evaluations');
          }}
          className="h-7 px-2.5 text-xs text-indigo-700 hover:bg-indigo-50 border-indigo-200 font-semibold gap-1"
        >
          <FileCheck className="h-3 w-3" /> Grade ({row.submittedCount - row.evaluatedCount})
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              Academic Homework, Tasks &amp; Evaluation Suite
            </h1>
            <Badge variant="indigo" className="text-[11px] font-semibold py-0.5">
              Continuous Assessment
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Streamline class homework distribution, monitor digital submission statuses, provide rubric-based grades,
            and feed formative assessment data directly into CBSE Holistic Progress Cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab !== 'create' && (
            <Button
              size="sm"
              onClick={() => setActiveTab('create')}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Assign New Homework</span>
            </Button>
          )}
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

      {/* Tab 1: Assignment Roster */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <DataTable
            data={assignments}
            columns={assignmentColumns}
            rowKey="id"
            searchPlaceholder="Search homework by title, subject, or class..."
            exportCsvFilename="homework_roster"
          />
        </div>
      )}

      {/* Tab 2: Create Assignment */}
      {activeTab === 'create' && (
        <Card className="max-w-2xl border-slate-200 shadow-xs bg-white">
          <CardHeader className="border-b border-slate-200 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-600" />
              Create &amp; Distribute Class Homework Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Chapter 4 Quadratic Equations Numerical Problems"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Class &amp; Section *
                  </label>
                  <select
                    value={newAssignment.className}
                    onChange={(e) => setNewAssignment({ ...newAssignment, className: e.target.value })}
                    className="w-full text-xs h-9 px-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Class 10 - Section A">Class 10 - Section A</option>
                    <option value="Class 10 - Section B">Class 10 - Section B</option>
                    <option value="Class 9 - Section A">Class 9 - Section A</option>
                    <option value="Class 11 - Science">Class 11 - Science</option>
                    <option value="Class 12 - Commerce">Class 12 - Commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Curriculum Subject *
                  </label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="w-full text-xs h-9 px-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English Language">English Language</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Submission Due Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maximum Marks *
                  </label>
                  <Input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={newAssignment.maxMarks}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions &amp; Problem References
                </label>
                <textarea
                  rows={4}
                  placeholder="Specify problem numbers, graph requirements, or reference textbook pages..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('roster')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                  Publish to Students
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Submissions & Evaluation Desk */}
      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <span className="font-bold text-xs text-slate-900 block">
                Ray Optics &amp; Refraction Numerical Problems — Class 10-A
              </span>
              <span className="text-[10px] text-slate-500">
                Due: 28-11-2026 &bull; Maximum Marks: 20
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="text-xs font-semibold">
                {submissions.filter((s) => s.status === 'evaluated').length} / {submissions.length} Graded
              </Badge>
            </div>
          </div>

          <DataTable
            data={submissions}
            columns={[
              {
                key: 'rollNumber',
                header: 'Roll #',
                render: (row) => <span className="font-mono font-bold text-slate-700 text-xs">#{row.rollNumber}</span>,
              },
              {
                key: 'studentName',
                header: 'Student Name',
                sortable: true,
                render: (row) => <span className="font-bold text-slate-900 text-xs">{row.studentName}</span>,
              },
              {
                key: 'status',
                header: 'Submission Status',
                render: (row) => {
                  switch (row.status) {
                    case 'evaluated':
                      return <Badge variant="success" className="text-[10px]">Graded ({row.marksObtained}/{row.maxMarks})</Badge>;
                    case 'submitted':
                      return <Badge variant="indigo" className="text-[10px]">Submitted (Needs Review)</Badge>;
                    case 'late':
                      return <Badge variant="warning" className="text-[10px]">Late Submission</Badge>;
                    case 'missing':
                      return <Badge variant="destructive" className="text-[10px]">Missing</Badge>;
                  }
                },
              },
              {
                key: 'submittedAt',
                header: 'Timestamp',
                render: (row) => <span className="font-mono text-xs text-slate-500">{row.submittedAt || '—'}</span>,
              },
              {
                key: 'feedback',
                header: 'Teacher Feedback',
                render: (row) => <span className="text-xs text-slate-600 italic">{row.feedback || '—'}</span>,
              },
              {
                key: 'actions',
                header: 'Action',
                align: 'right',
                render: (row) => (
                  <Button
                    size="sm"
                    variant={row.status === 'evaluated' ? 'outline' : 'default'}
                    onClick={() => {
                      setEvaluatingSub(row);
                      setEvalMarks(row.marksObtained || 18);
                      setEvalFeedback(row.feedback || 'Good attempt; keep improving.');
                    }}
                    className={
                      row.status === 'evaluated'
                        ? 'h-7 px-2.5 text-xs text-slate-700'
                        : 'h-7 px-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold'
                    }
                  >
                    {row.status === 'evaluated' ? 'Edit Grade' : 'Grade Submission'}
                  </Button>
                ),
              },
            ]}
            rowKey="id"
            exportCsvFilename="homework_submissions_grading"
          />
        </div>
      )}

      {/* Grade Submission Modal */}
      {evaluatingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl border-slate-200 animate-in fade-in zoom-in-95">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-indigo-600" />
                Grade Student Submission
              </CardTitle>
              <button onClick={() => setEvaluatingSub(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong>Student:</strong> {evaluatingSub.studentName} (Roll #{evaluatingSub.rollNumber})</div>
                <div><strong>Submission Time:</strong> {evaluatingSub.submittedAt || 'Turned in on paper'}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marks Obtained (out of {evaluatingSub.maxMarks}) *
                </label>
                <Input
                  type="number"
                  min="0"
                  max={evaluatingSub.maxMarks}
                  required
                  value={evalMarks}
                  onChange={(e) => setEvalMarks(Number(e.target.value))}
                  className="text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Formative Feedback Remarks
                </label>
                <textarea
                  rows={3}
                  value={evalFeedback}
                  onChange={(e) => setEvalFeedback(e.target.value)}
                  placeholder="e.g. Well executed ray diagrams; check calculation steps on problem 3..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setEvaluatingSub(null)} className="text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEvaluation} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                  Save Grade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
