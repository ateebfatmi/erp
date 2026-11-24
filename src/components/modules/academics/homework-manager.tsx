'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  Eye,
  Download,
} from 'lucide-react';

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  instructions: string;
  totalSubmissions: number;
  totalEnrolled: number;
  status: 'DUE_SOON' | 'GRADED' | 'EVALUATING';
}

const INITIAL_HOMEWORKS: HomeworkItem[] = [
  {
    id: 'hw-1',
    subject: 'Mathematics Standard (041)',
    title: 'Chapter 4: Quadratic Equations — Exercise 4.2 Problem Set',
    dueDate: '2026-11-28',
    instructions: 'Solve questions 1 through 10 from NCERT Textbook. Submit handwritten scans.',
    totalSubmissions: 32,
    totalEnrolled: 38,
    status: 'DUE_SOON',
  },
  {
    id: 'hw-2',
    subject: 'Science (086)',
    title: 'Light Reflection & Refraction — Ray Diagrams Portfolio',
    dueDate: '2026-11-25',
    instructions: 'Draw ray diagrams for concave and convex mirrors across 6 object positions.',
    totalSubmissions: 38,
    totalEnrolled: 38,
    status: 'GRADED',
  },
  {
    id: 'hw-3',
    subject: 'English Lang & Lit (184)',
    title: 'Letter to the Editor: Municipal Waste Management in Smart Cities',
    dueDate: '2026-11-30',
    instructions: 'Format per CBSE 2024-25 writing section rules. Word count: 120-150 words.',
    totalSubmissions: 24,
    totalEnrolled: 38,
    status: 'EVALUATING',
  },
];

export function HomeworkManager() {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>(INITIAL_HOMEWORKS);
  const [selectedReview, setSelectedReview] = useState<HomeworkItem | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics Standard (041)');
  const [newDueDate, setNewDueDate] = useState('2026-12-02');
  const [newInstructions, setNewInstructions] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: HomeworkItem = {
      id: `hw-${Date.now()}`,
      subject: newSubject,
      title: newTitle,
      dueDate: newDueDate,
      instructions: newInstructions || 'Refer to classroom syllabus and notes.',
      totalSubmissions: 0,
      totalEnrolled: 38,
      status: 'DUE_SOON',
    };

    setHomeworks([newItem, ...homeworks]);
    setFeedback(`Assignment "${newTitle}" published to all 38 students and parents!`);
    setNewTitle('');
    setNewInstructions('');

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Published</Badge>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Homework List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Active Classroom Assignments — Grade 10-A
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track student submissions, review digital scans, and award internal marks.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {homeworks.length} Assignments
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {homeworks.map((hw) => (
                  <div key={hw.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{hw.title}</span>
                        <span className="text-[11px] font-semibold text-indigo-700">{hw.subject}</span>
                      </div>
                      <Badge
                        variant={
                          hw.status === 'GRADED'
                            ? 'success'
                            : hw.status === 'DUE_SOON'
                            ? 'warning'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {hw.status === 'GRADED' ? 'Graded' : hw.status === 'DUE_SOON' ? `Due: ${hw.dueDate}` : 'Evaluating'}
                      </Badge>
                    </div>

                    <p className="text-slate-600 text-xs">{hw.instructions}</p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          <strong className="text-slate-800">{hw.totalSubmissions}</strong> of {hw.totalEnrolled} Submitted
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-emerald-600 font-semibold">
                          {Math.round((hw.totalSubmissions / hw.totalEnrolled) * 100)}% Turnout
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 px-2.5 flex items-center gap-1"
                        onClick={() => setSelectedReview(hw)}
                      >
                        <Eye className="h-3 w-3 text-slate-500" />
                        Review Submissions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submission Review Modal / Drawer */}
          {selectedReview && (
            <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs">
              <CardHeader className="p-4 border-b border-indigo-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    Reviewing Submissions: {selectedReview.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-indigo-700">
                    {selectedReview.subject} &bull; Due: {selectedReview.dueDate}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setSelectedReview(null)}>
                  Close
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-indigo-100/50 text-indigo-900 font-semibold border-b border-indigo-200">
                      <tr>
                        <th className="py-2 px-3">Student Name</th>
                        <th className="py-2 px-3">Submitted At</th>
                        <th className="py-2 px-3">File Scan</th>
                        <th className="py-2 px-3">Teacher Score</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-100/80 bg-white">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">Aarav Mehta (Roll 14)</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">24 Nov 06:45 PM</td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-indigo-600 text-[11px] flex items-center gap-1">
                            <Download className="h-3 w-3" /> aarav_exercise_4_2.pdf
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-600">5 / 5 (Full Credit)</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge variant="success" className="text-[10px]">Verified</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">Ananya Deshmukh (Roll 01)</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">24 Nov 07:12 PM</td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-indigo-600 text-[11px] flex items-center gap-1">
                            <Download className="h-3 w-3" /> ananya_solutions.pdf
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-600">5 / 5 (Full Credit)</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge variant="success" className="text-[10px]">Verified</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">Kabir Khan (Roll 04)</td>
                        <td className="py-2.5 px-3 font-mono text-amber-600">Pending Submission</td>
                        <td className="py-2.5 px-3 text-slate-400">—</td>
                        <td className="py-2.5 px-3 text-slate-400">—</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50">Pending</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Assign New Homework Form */}
        <div>
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                Assign New Homework
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pushes push notification and syncs to student homework dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateHomework} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Mathematics Standard (041)">Mathematics Standard (041)</option>
                    <option value="Science (086)">Science (086)</option>
                    <option value="English Lang & Lit (184)">English Lang & Lit (184)</option>
                    <option value="Social Science (087)">Social Science (087)</option>
                    <option value="Information Technology (402)">Information Technology (402)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Task Title *</label>
                  <Input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Circle Theorems Proofs Set"
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Due Date *</label>
                  <Input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Instructions & Guidelines</label>
                  <textarea
                    rows={3}
                    value={newInstructions}
                    onChange={(e) => setNewInstructions(e.target.value)}
                    placeholder="Provide details on questions, rubric, and submission requirements..."
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Publish to Student & Parent Portals
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
