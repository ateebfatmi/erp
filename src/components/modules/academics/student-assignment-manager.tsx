'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  BookOpen,
  Calendar,
  Send,
  Sparkles,
} from 'lucide-react';

export interface StudentAssignment {
  id: string;
  subject: string;
  code: string;
  title: string;
  teacherName: string;
  dueDate: string;
  maxMarks: number;
  instructions: string;
  status: 'PENDING' | 'SUBMITTED' | 'EVALUATED';
  submissionDate?: string;
  marksAwarded?: number;
  teacherFeedback?: string;
  submissionNotes?: string;
}

const INITIAL_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: 'asg-01',
    subject: 'Mathematics Standard',
    code: '041',
    title: 'Chapter 4: Quadratic Equations — Exercise 4.3 Word Problems',
    teacherName: 'Smt. Ananya Sen (PGT Math)',
    dueDate: '2024-11-28',
    maxMarks: 25,
    instructions: 'Solve questions 1 through 8 from NCERT Textbook. Show complete algebraic steps for discriminant calculation (b² - 4ac).',
    status: 'PENDING',
  },
  {
    id: 'asg-02',
    subject: 'Physics',
    code: '042',
    title: 'Ray Optics — Convex & Concave Mirror Image Formation Diagrams',
    teacherName: 'Dr. R. Ramanujan (PGT Physics)',
    dueDate: '2024-11-26',
    maxMarks: 20,
    instructions: 'Draw neat ray diagrams for 6 focal positions of concave mirror. Label principal axis, pole, focus, and center of curvature.',
    status: 'SUBMITTED',
    submissionDate: '2024-11-24 16:30',
    submissionNotes: 'Uploaded 4-page scanned PDF with compass-drawn diagrams.',
  },
  {
    id: 'asg-03',
    subject: 'English Core',
    code: '301',
    title: 'Formal Letter to Municipal Commissioner: Urban Drainage Congestion',
    teacherName: 'Ms. Clara D’Souza (PGT English)',
    dueDate: '2024-11-22',
    maxMarks: 15,
    instructions: 'Format per CBSE 2024-25 writing section rules. Word count strictly between 120 and 150 words.',
    status: 'EVALUATED',
    submissionDate: '2024-11-21 19:15',
    marksAwarded: 14,
    teacherFeedback: 'Excellent vocabulary, precise salutation, and persuasive arguments. Keep it up!',
    submissionNotes: 'Submitted handwritten draft scanned via mobile app.',
  },
  {
    id: 'asg-04',
    subject: 'Chemistry',
    code: '043',
    title: 'Electrochemical Cells & Nernst Equation Numerical Calculations',
    teacherName: 'Dr. V. K. Saxena (PGT Chemistry)',
    dueDate: '2024-12-02',
    maxMarks: 30,
    instructions: 'Calculate EMF and equilibrium constants for standard Daniell cell setups per NCERT Exemplar problems.',
    status: 'PENDING',
  },
];

export function StudentAssignmentManager() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>(INITIAL_ASSIGNMENTS);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'EVALUATED'>('ALL');
  const [selectedAsg, setSelectedAsg] = useState<StudentAssignment | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = assignments.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  const handleOpenSubmit = (asg: StudentAssignment) => {
    setSelectedAsg(asg);
    setSubmissionNotes(asg.submissionNotes || '');
    setSimulatedFileName('');
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsg) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAsg.id
          ? {
              ...a,
              status: 'SUBMITTED',
              submissionDate: formattedDate,
              submissionNotes: submissionNotes || `Attached: ${simulatedFileName || 'work_solution.pdf'}`,
            }
          : a
      )
    );

    setFeedback(`Assignment "${selectedAsg.title}" submitted successfully on ${formattedDate}. Subject teacher notified.`);
    setSelectedAsg(null);
    setSubmissionNotes('');
    setSimulatedFileName('');
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

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('ALL')}
            className="text-xs h-8"
          >
            All Tasks ({assignments.length})
          </Button>
          <Button
            variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('PENDING')}
            className="text-xs h-8 text-amber-700 hover:text-amber-800"
          >
            Pending ({assignments.filter((a) => a.status === 'PENDING').length})
          </Button>
          <Button
            variant={statusFilter === 'SUBMITTED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('SUBMITTED')}
            className="text-xs h-8 text-blue-700 hover:text-blue-800"
          >
            Submitted ({assignments.filter((a) => a.status === 'SUBMITTED').length})
          </Button>
          <Button
            variant={statusFilter === 'EVALUATED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('EVALUATED')}
            className="text-xs h-8 text-emerald-700 hover:text-emerald-800"
          >
            Graded ({assignments.filter((a) => a.status === 'EVALUATED').length})
          </Button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          <span>Class 12-A Academic Batch 2024-25</span>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((asg) => {
          return (
            <Card key={asg.id} className="border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px] font-mono text-slate-700 bg-slate-50">
                          {asg.subject} ({asg.code})
                        </Badge>
                        <Badge
                          className={`text-[10px] font-semibold ${
                            asg.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : asg.status === 'SUBMITTED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {asg.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-semibold text-slate-900 leading-snug">
                        {asg.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Assigned by {asg.teacherName}
                      </CardDescription>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-800 block">
                        {asg.maxMarks} Marks
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 justify-end">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        Due {asg.dueDate}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                    <span className="font-semibold block text-slate-900 mb-0.5">Instructions:</span>
                    {asg.instructions}
                  </div>

                  {asg.status === 'SUBMITTED' && (
                    <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-blue-900">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                          Submitted on {asg.submissionDate}
                        </span>
                        <span className="text-[11px] font-normal text-blue-700">Awaiting Teacher Grading</span>
                      </div>
                      {asg.submissionNotes && (
                        <p className="mt-1 text-[11px] text-blue-800 italic">“{asg.submissionNotes}”</p>
                      )}
                    </div>
                  )}

                  {asg.status === 'EVALUATED' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                          Evaluated Score: {asg.marksAwarded} / {asg.maxMarks}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-700">
                          {Math.round(((asg.marksAwarded || 0) / asg.maxMarks) * 100)}%
                        </span>
                      </div>
                      {asg.teacherFeedback && (
                        <p className="text-[11px] text-emerald-800">
                          <span className="font-semibold">Teacher Remark:</span> {asg.teacherFeedback}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    alert(`Downloading worksheet reference PDF for ${asg.title}`);
                  }}
                  className="text-xs h-8 flex items-center gap-1 text-slate-700"
                >
                  <Download className="h-3 w-3" />
                  Worksheet
                </Button>

                {asg.status === 'PENDING' ? (
                  <Button
                    size="sm"
                    onClick={() => handleOpenSubmit(asg)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 flex items-center gap-1.5"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    Submit Solution
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenSubmit(asg)}
                    className="text-xs h-8 text-slate-600"
                  >
                    View Submission
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedAsg && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg bg-white border-slate-200 shadow-xl animate-in zoom-in-95 duration-150">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-blue-600" />
                Submit Homework Solution
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {selectedAsg.subject} • {selectedAsg.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Scanned Assignment (PDF / JPG / PNG)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <UploadCloud className="h-8 w-8 mx-auto text-slate-400 mb-1" />
                  <p className="text-xs font-medium text-slate-700">
                    Click to select file or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 15 MB</p>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSimulatedFileName(e.target.files[0].name);
                      }
                    }}
                    className="mt-2 text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 cursor-pointer"
                  />
                  {simulatedFileName && (
                    <Badge variant="outline" className="mt-2 text-blue-600 bg-blue-50">
                      Selected: {simulatedFileName}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Remarks / Queries for Subject Teacher
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Completed questions 1 through 8. Had a minor doubt in question 6 part (b)..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAsg(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSubmit}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Confirm & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
