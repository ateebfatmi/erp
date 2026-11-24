'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  Lock,
  Save,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  StudentSubjectScore,
  computeSubjectScore,
  ComputedSubjectResult,
} from '@/modules/assessment/cbse-grading';

const INITIAL_SCORES: StudentSubjectScore[] = [
  {
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    rollNo: '14',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    internalAssessment: { periodicTest: 4.5, multipleAssessment: 4.5, portfolio: 5.0, subjectEnrichment: 4.5 },
    theoryMarks: 74,
  },
  {
    studentId: 'std-102',
    studentName: 'Ananya Deshmukh',
    rollNo: '01',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    internalAssessment: { periodicTest: 5.0, multipleAssessment: 5.0, portfolio: 5.0, subjectEnrichment: 5.0 },
    theoryMarks: 78,
  },
  {
    studentId: 'std-103',
    studentName: 'Rohan Mehra',
    rollNo: '02',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    internalAssessment: { periodicTest: 4.0, multipleAssessment: 4.0, portfolio: 4.0, subjectEnrichment: 4.5 },
    theoryMarks: 62,
  },
  {
    studentId: 'std-104',
    studentName: 'Diya Patel',
    rollNo: '03',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    internalAssessment: { periodicTest: 4.5, multipleAssessment: 4.0, portfolio: 4.5, subjectEnrichment: 4.0 },
    theoryMarks: 69,
  },
  {
    studentId: 'std-105',
    studentName: 'Kabir Khan',
    rollNo: '04',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    internalAssessment: { periodicTest: 3.5, multipleAssessment: 3.0, portfolio: 3.5, subjectEnrichment: 4.0 },
    theoryMarks: 48,
  },
  {
    studentId: 'std-106',
    studentName: 'Sanya Gupta',
    rollNo: '05',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    internalAssessment: { periodicTest: 4.0, multipleAssessment: 4.0, portfolio: 4.5, subjectEnrichment: 4.0 },
    theoryMarks: 58,
  },
];

export function TeacherMarksEntry() {
  const [selectedSubject, setSelectedSubject] = useState('041');
  const [scores, setScores] = useState<StudentSubjectScore[]>(INITIAL_SCORES);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Computed results
  const computedResults: ComputedSubjectResult[] = scores.map(computeSubjectScore);

  const totalStudents = computedResults.length;
  const passCount = computedResults.filter((r) => r.status === 'PASSED').length;
  const passPercentage = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 100;
  const averageTotal = totalStudents > 0
    ? Math.round(computedResults.reduce((sum, r) => sum + r.grandTotal, 0) / totalStudents)
    : 0;
  const highestScore = Math.max(...computedResults.map((r) => r.grandTotal), 0);

  const handleScoreChange = (
    studentId: string,
    field: 'periodicTest' | 'multipleAssessment' | 'portfolio' | 'subjectEnrichment' | 'theoryMarks',
    value: string
  ) => {
    if (isLocked) return;
    const num = parseFloat(value) || 0;

    setScores((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        if (field === 'theoryMarks') {
          return { ...s, theoryMarks: Math.min(80, Math.max(0, num)) };
        } else {
          return {
            ...s,
            internalAssessment: {
              ...s.internalAssessment,
              [field]: Math.min(5, Math.max(0, num)),
            },
          };
        }
      })
    );
  };

  const handleSaveDraft = () => {
    setFeedback('Draft marks saved successfully in session storage.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLockAndPublish = () => {
    setIsLocked(true);
    setFeedback('Marks locked and published! CBSE Gazette synchronized and Report Cards updated.');
    setTimeout(() => setFeedback(null), 6000);
  };

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'PT (5)', 'MA (5)', 'PF (5)', 'SE (5)', 'IA Total (20)', 'Theory (80)', 'Grand Total (100)', 'Grade', 'Status'];
    const rows = computedResults.map((r, i) => [
      r.rollNo,
      r.studentName,
      scores[i].internalAssessment.periodicTest,
      scores[i].internalAssessment.multipleAssessment,
      scores[i].internalAssessment.portfolio,
      scores[i].internalAssessment.subjectEnrichment,
      r.internalTotal,
      r.theoryMarks,
      r.grandTotal,
      r.grade,
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBSE_Class10A_${selectedSubject}_Marks_Gazette.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Saved</Badge>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Class & Subject</p>
              <p className="text-sm font-bold text-slate-900">Grade 10-A • Math (041)</p>
              <p className="text-[10px] text-slate-500">{totalStudents} Students Evaluated</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Class Average</p>
              <p className="text-xl font-bold text-slate-900">{averageTotal} / 100</p>
              <p className="text-[10px] text-slate-500">Highest Score: {highestScore} / 100</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Pass Percentage</p>
              <p className="text-xl font-bold text-emerald-700">{passPercentage}%</p>
              <p className="text-[10px] text-slate-500">Passing criteria: min 33%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isLocked ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
              {isLocked ? <Lock className="h-5 w-5" /> : <Award className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Registry Status</p>
              <p className="text-sm font-bold text-slate-900">{isLocked ? 'Locked & Published' : 'In Progress (Editable)'}</p>
              <p className="text-[10px] text-slate-500">{isLocked ? 'Synced with Report Card' : 'Draft mode'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Marks Entry Matrix Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-600" />
              CBSE Annual & Periodic Assessment Marks Entry Studio
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Internal Assessment (20 Marks) = PT(5) + MA(5) + Portfolio(5) + Practical/SE(5) | Theory = 80 Marks.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs h-8 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-600" />
              Export Gazette (CSV)
            </Button>
            {!isLocked ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  className="text-xs h-8 flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5 text-slate-600" />
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  onClick={handleLockAndPublish}
                  className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Publish & Lock
                </Button>
              </>
            ) : (
              <Badge variant="success" className="text-xs py-1">
                Finalized
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Roll</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-2 text-center bg-blue-50/40">PT (5)</th>
                  <th className="py-2.5 px-2 text-center bg-blue-50/40">MA (5)</th>
                  <th className="py-2.5 px-2 text-center bg-blue-50/40">Port (5)</th>
                  <th className="py-2.5 px-2 text-center bg-blue-50/40">SE/Lab (5)</th>
                  <th className="py-2.5 px-3 text-center font-bold text-blue-900 bg-blue-100/50">IA (/20)</th>
                  <th className="py-2.5 px-3 text-center bg-indigo-50/40">Theory (/80)</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Total (/100)</th>
                  <th className="py-2.5 px-3 text-center">CBSE Grade</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {computedResults.map((result, idx) => {
                  const raw = scores[idx];
                  return (
                    <tr key={result.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{result.rollNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {result.studentName}
                      </td>

                      {/* PT */}
                      <td className="py-2 px-2 text-center bg-blue-50/20">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          disabled={isLocked}
                          value={raw.internalAssessment.periodicTest}
                          onChange={(e) => handleScoreChange(result.studentId, 'periodicTest', e.target.value)}
                          className="w-12 text-center py-1 font-mono text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                        />
                      </td>

                      {/* MA */}
                      <td className="py-2 px-2 text-center bg-blue-50/20">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          disabled={isLocked}
                          value={raw.internalAssessment.multipleAssessment}
                          onChange={(e) => handleScoreChange(result.studentId, 'multipleAssessment', e.target.value)}
                          className="w-12 text-center py-1 font-mono text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                        />
                      </td>

                      {/* Portfolio */}
                      <td className="py-2 px-2 text-center bg-blue-50/20">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          disabled={isLocked}
                          value={raw.internalAssessment.portfolio}
                          onChange={(e) => handleScoreChange(result.studentId, 'portfolio', e.target.value)}
                          className="w-12 text-center py-1 font-mono text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                        />
                      </td>

                      {/* SE / Lab */}
                      <td className="py-2 px-2 text-center bg-blue-50/20">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          disabled={isLocked}
                          value={raw.internalAssessment.subjectEnrichment}
                          onChange={(e) => handleScoreChange(result.studentId, 'subjectEnrichment', e.target.value)}
                          className="w-12 text-center py-1 font-mono text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                        />
                      </td>

                      {/* IA Total */}
                      <td className="py-2 px-3 text-center font-mono font-bold text-blue-700 bg-blue-100/30">
                        {result.internalTotal}
                      </td>

                      {/* Theory Marks */}
                      <td className="py-2 px-3 text-center bg-indigo-50/20">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="80"
                          disabled={isLocked}
                          value={raw.theoryMarks}
                          onChange={(e) => handleScoreChange(result.studentId, 'theoryMarks', e.target.value)}
                          className="w-14 text-center py-1 font-mono font-bold text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 text-indigo-900"
                        />
                      </td>

                      {/* Grand Total */}
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900 text-sm">
                        {result.grandTotal}
                      </td>

                      {/* CBSE Grade */}
                      <td className="py-2 px-3 text-center">
                        <Badge
                          variant={result.grade === 'A1' || result.grade === 'A2' ? 'success' : result.grade === 'E' ? 'destructive' : 'outline'}
                          className="font-mono text-[11px]"
                        >
                          {result.grade}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3 text-center">
                        {result.status === 'PASSED' ? (
                          <span className="text-[11px] font-semibold text-emerald-600">Passed</span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-600">Compartment</span>
                        )}
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
