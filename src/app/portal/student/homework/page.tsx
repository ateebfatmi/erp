import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, FileText, CheckCircle2, Clock } from 'lucide-react';
import { CbtExamRunner } from '@/components/modules/assessment/cbt-exam-runner';

const ASSIGNMENTS = [
  {
    id: 'asg-1',
    subject: 'Mathematics Standard',
    title: 'Quadratic Equations Exercise 4.3 & Word Problems',
    dueDate: '2026-11-26',
    status: 'pending',
    points: 25,
  },
  {
    id: 'asg-2',
    subject: 'English Communicative',
    title: 'Formal Letter to the Editor — Water Logging Advisory',
    dueDate: '2026-11-28',
    status: 'submitted',
    points: 20,
  },
];

export default function StudentHomeworkPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Online CBT Tests & Homework Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Attempt timed computer-based practice assessments with instant auto-grading, and track homework submissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Auto-Grading Live</Badge>
          <Badge variant="outline">CBSE Class 10</Badge>
        </div>
      </div>

      {/* Online CBT Test Section */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Scheduled Computer-Based Practice Exam (CBT)
        </h2>
        <CbtExamRunner />
      </div>

      {/* Written Homework Assignments */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">
            Teacher Homework Assignments & Lab Files
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Assignment Title</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Max Marks</th>
                  <th className="py-2.5 px-3">Submission Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ASSIGNMENTS.map((asg) => (
                  <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{asg.subject}</td>
                    <td className="py-3 px-3 font-medium text-blue-600">{asg.title}</td>
                    <td className="py-3 px-3 text-slate-600">{asg.dueDate}</td>
                    <td className="py-3 px-3 font-mono">{asg.points} pts</td>
                    <td className="py-3 px-3">
                      {asg.status === 'submitted' ? (
                        <Badge variant="success">Submitted</Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-700 bg-amber-50">Pending</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
