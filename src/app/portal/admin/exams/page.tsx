import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, Download, Award, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ExamsPage() {
  const auth = await getVerifiedAuthContext();
  const examTerms = await repository.getExamTerms(auth.tenantId);
  const enrollments = await repository.getEnrollments(auth.tenantId);

  // Sample student: Aarav Mehta
  const sampleStudent = enrollments[0];
  const marks = sampleStudent
    ? await repository.getExamMarksByEnrollment(auth.tenantId, sampleStudent.id)
    : [];

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Examinations & CBSE Report Card Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configurable 9-point grading scale, periodic assessments, and automated term report cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/portal/admin/exams/loc">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer text-blue-700 bg-blue-50 border-blue-200">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Board LOC Pariksha Desk</span>
            </Button>
          </a>
          <a href="/api/documents/report-card/aarav" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer text-indigo-700 bg-indigo-50 border-indigo-200">
              <Download className="h-3.5 w-3.5" />
              <span>Print CBSE Report Card (PDF)</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Terms Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {examTerms.map((term) => (
          <Card key={term.id}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-900">
                {term.name}
              </CardTitle>
              <Badge variant={term.is_published ? 'success' : 'secondary'}>
                {term.is_published ? 'Published' : 'Draft'}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">
                Weightage: <span className="font-bold text-slate-800">{term.weightage_percent}%</span> towards Final Cumulative Grade
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gradebook Sample Sheet for Class 10 Mid-Term */}
      <Card>
        <CardHeader className="border-b border-slate-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Mid-Term Marks Sheet — {sampleStudent?.student?.full_name} ({sampleStudent?.student?.admission_number})
            </CardTitle>
            <p className="text-xs text-slate-500">
              Class 10 - Section A &bull; CBSE Standard Evaluation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Overall Score</span>
              <span className="text-sm font-bold text-slate-900">
                {totalObtained} / {totalMax} ({percentage}%)
              </span>
            </div>
            <Badge variant="success" className="text-xs px-2.5 py-1">
              Grade: {getGrade(Number(percentage))}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Max Theory Marks</th>
                  <th className="py-2.5 px-3">Passing Marks</th>
                  <th className="py-2.5 px-3">Marks Obtained</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marks.map((m) => {
                  const max = m.max_marks || 80;
                  const pct = Math.round((m.marks_obtained / max) * 100);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {m.subject_name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {max}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">
                        27
                      </td>
                      <td className="py-3 px-3 font-bold text-blue-600 font-mono">
                        {m.marks_obtained}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {pct}%
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="font-semibold">
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
  );
}
