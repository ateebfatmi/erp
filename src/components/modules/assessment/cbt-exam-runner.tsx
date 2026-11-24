'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  SAMPLE_CBSE_EXAM,
  evaluateCbtSubmission,
  CbtEvaluationResult,
} from '@/modules/assessment/cbt-engine';

export function CbtExamRunner() {
  const [exam] = useState(SAMPLE_CBSE_EXAM);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<CbtEvaluationResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = exam.questions[currentQIndex];

  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleSubmit = () => {
    const res = evaluateCbtSubmission(exam, answers);
    setResult(res);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(15 * 60);
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Exam Header */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] text-blue-700 bg-blue-50">
                CBSE Class 10 Mock
              </Badge>
              <h2 className="text-sm font-bold text-slate-900">{exam.title}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              5 Questions &bull; +4 marks for correct &bull; -1 mark negative penalty &bull; 15 min limit
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-mono font-bold">
                <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                {formatTimer(timeLeft)}
              </div>
            )}
            {!isSubmitted ? (
              <Button size="sm" onClick={handleSubmit} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                Submit Test
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={handleRetake} className="text-xs gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Retake Test
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {!isSubmitted ? (
        /* Test Taking Interface */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Question Area (3 cols) */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-slate-200 min-h-[340px] flex flex-col justify-between">
              <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Question {currentQIndex + 1} of {exam.questions.length}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {currentQ.subject} &bull; {currentQ.topic}
                  </Badge>
                </div>
                <div className="text-[11px] font-mono font-semibold text-slate-600">
                  <span className="text-emerald-600">+{currentQ.marks}</span> / <span className="text-red-500">-{currentQ.negativeMarks}</span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4 my-auto">
                <h3 className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentQ.questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {currentQ.options?.map((opt, oIdx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(opt)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 font-semibold text-blue-950 shadow-2xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>

              {/* Navigation Controls */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((i) => i - 1)}
                  className="text-xs gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </Button>

                {currentQIndex < exam.questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQIndex((i) => i + 1)}
                    className="text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSubmit} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                    Submit Exam
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Question Palette Sidebar */}
          <div>
            <Card className="bg-white border-slate-200 p-4 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Question Palette
              </span>

              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentQIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 w-full rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'ring-2 ring-blue-600 ring-offset-1 bg-blue-600 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                  <span>Unanswered ({exam.questions.length - Object.keys(answers).length})</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Evaluation & Instant Results Screen */
        result && (
          <div className="space-y-4">
            {/* Scorecard Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-200 uppercase font-semibold">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Automated Assessment Report
                  </div>
                  <h3 className="text-2xl font-bold mt-1">
                    Score: {result.netScore} / {result.maxScore} Marks
                  </h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Aggregate Percentage: {result.percentage}% &bull; Status: {result.isPassed ? 'PASSED (Qualified)' : 'NEEDS REVISION'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-blue-200 block">CBSE Grade</span>
                    <span className="text-3xl font-extrabold text-amber-300">{result.cbseGrade}</span>
                  </div>
                </div>
              </div>

              {/* Accuracy Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-blue-200 block text-[10px]">Correct Answers</span>
                  <span className="font-bold text-emerald-300 text-sm">{result.correctCount} / {result.totalQuestions}</span>
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">Incorrect (Penalty)</span>
                  <span className="font-bold text-red-300 text-sm">{result.incorrectCount} (-{result.negativePenalty} pts)</span>
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">Unanswered</span>
                  <span className="font-bold text-slate-300 text-sm">{result.unansweredCount}</span>
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">Topic Accuracy</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {Math.round((result.correctCount / (result.totalQuestions || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Answer Explanations Review */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-sm font-semibold">
                  Detailed Solution Key & Rationales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {exam.questions.map((q, idx) => {
                  const studentAns = answers[q.id];
                  const isCorrect = studentAns?.toLowerCase() === q.correctAnswer.toLowerCase();
                  return (
                    <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Question {idx + 1}: {q.questionText}</span>
                        {isCorrect ? (
                          <Badge variant="success" className="text-[10px]">
                            +4 Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            {studentAns ? '-1 Incorrect' : '0 Unattempted'}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-slate-400 block">Your Answer:</span>
                          <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                            {studentAns || 'Not Answered'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Correct Answer:</span>
                          <span className="text-slate-900 font-bold">{q.correctAnswer}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
