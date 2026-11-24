'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Compass,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Send,
  Target,
  Trophy,
  HelpCircle,
  Briefcase,
} from 'lucide-react';
import {
  StreamDiscipline,
  INITIAL_STREAM_BASKETS,
  StudentAcademicScores,
  evaluateStreamEligibility,
  validateSubjectCombination,
} from '@/modules/academics/stream-selection';

const MOCK_SCORES: StudentAcademicScores = {
  math: 88,
  science: 84,
  english: 90,
  socialScience: 82,
  aggregatePercent: 86.0,
};

export function StudentStreamSelector() {
  const [selectedStream, setSelectedStream] = useState<StreamDiscipline>('SCIENCE_PCM');
  const [selectedElectives, setSelectedElectives] = useState<string[]>(['Computer Science (Python)']);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeBasket = INITIAL_STREAM_BASKETS.find((b) => b.stream === selectedStream)!;
  const eligibility = evaluateStreamEligibility(MOCK_SCORES, selectedStream);
  const electiveValidation = validateSubjectCombination(selectedStream, selectedElectives);

  const toggleElective = (elective: string) => {
    if (selectedElectives.includes(elective)) {
      setSelectedElectives(selectedElectives.filter((e) => e !== elective));
    } else {
      if (selectedElectives.length < activeBasket.maxElectivesAllowed) {
        setSelectedElectives([...selectedElectives, elective]);
      } else {
        // Replace single elective if max is 1
        if (activeBasket.maxElectivesAllowed === 1) {
          setSelectedElectives([elective]);
        }
      }
    }
  };

  const handleStreamChange = (stream: StreamDiscipline) => {
    setSelectedStream(stream);
    const basket = INITIAL_STREAM_BASKETS.find((b) => b.stream === stream)!;
    setSelectedElectives(basket.electiveOptions.slice(0, basket.maxElectivesAllowed));
  };

  const handleSubmitPreference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.eligible) {
      setFeedback('Cannot submit: Academic cutoff threshold not met for the selected stream.');
      return;
    }
    if (!electiveValidation.valid) {
      setFeedback(electiveValidation.error || 'Invalid elective combination.');
      return;
    }

    setFeedback(
      `Your Senior Secondary Course Basket (${activeBasket.title} + ${selectedElectives.join(', ')}) has been submitted to the Academic Counseling Cell for Class 11 allotment.`
    );
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-700 h-7"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Top Academic Baseline Bar */}
      <Card className="border-slate-200 shadow-xs bg-slate-900 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                NEP 2020 Holistic Senior Secondary Matrix
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Class 10 Board Assessment & Eligibility Benchmark
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                VidyaOS auto-evaluates your term marks against institutional CBSE cutoffs across STEM, Commerce, and Humanities subject baskets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Class 10 Aggregate</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {MOCK_SCORES.aggregatePercent}%
                </span>
              </div>
              <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono">
                <span className="text-[10px] text-slate-400 block font-sans">Math / Science</span>
                <span className="font-bold text-white">
                  {MOCK_SCORES.math}% / {MOCK_SCORES.science}%
                </span>
              </div>
              <div className="bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono">
                <span className="text-[10px] text-slate-400 block font-sans">Eng / SocSci</span>
                <span className="font-bold text-white">
                  {MOCK_SCORES.english}% / {MOCK_SCORES.socialScience}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stream Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stream Cards Selection (5 spans) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Compass className="h-4 w-4 text-blue-600" />
            Senior Secondary Stream Baskets
          </h3>

          <div className="space-y-3">
            {INITIAL_STREAM_BASKETS.map((basket) => {
              const check = evaluateStreamEligibility(MOCK_SCORES, basket.stream);
              const isSelected = basket.stream === selectedStream;

              return (
                <div
                  key={basket.stream}
                  onClick={() => handleStreamChange(basket.stream)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isSelected ? 'text-blue-950' : 'text-slate-900'
                        }`}
                      >
                        {basket.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{basket.streamBadge}</p>
                    </div>
                    {check.eligible ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] shrink-0">
                        Eligible ({basket.minimumAggregateCutoff}%+)
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] shrink-0">
                        Shortfall
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Compulsory:{' '}
                      <strong className="text-slate-700">{basket.compulsorySubjects.length}</strong>
                    </span>
                    <span>
                      Elective options:{' '}
                      <strong className="text-slate-700">{basket.electiveOptions.length}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Basket Details, Electives & Career Mapping (7 spans) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {activeBasket.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {activeBasket.streamBadge} &bull; Minimum Cutoff: {activeBasket.minimumAggregateCutoff}%
                  </CardDescription>
                </div>
                {eligibility.eligible ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Cutoff Cleared
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    Cutoff Not Met
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Shortfall Alert if ineligible */}
              {!eligibility.eligible && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-900">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Academic Requirement Shortfall
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    {eligibility.shortfallReasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                  {eligibility.recommendedAlternatives.length > 0 && (
                    <div className="pt-2 border-t border-rose-200 text-rose-800">
                      <strong>Recommended Eligible Streams:</strong>{' '}
                      {eligibility.recommendedAlternatives.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Compulsory Core Subjects */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  1. Mandated Core Subjects (CBSE Scheme)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeBasket.compulsorySubjects.map((sub) => (
                    <div
                      key={sub}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multidisciplinary Elective Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Select Multidisciplinary Elective ({selectedElectives.length} /{' '}
                    {activeBasket.maxElectivesAllowed})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Choose up to {activeBasket.maxElectivesAllowed} option(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeBasket.electiveOptions.map((opt) => {
                    const isSelected = selectedElectives.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleElective(opt)}
                        className={`p-2.5 rounded-lg border text-xs text-left font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Career Roadmap & Competitive Exams */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-indigo-600" />
                  Target Careers & Competitive Entrance Exams
                </span>

                <div className="space-y-1.5">
                  <p className="text-xs text-slate-600">
                    <strong>Career Directions:</strong>{' '}
                    {activeBasket.careerPathways.join(' • ')}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Entrance Tests:</strong>{' '}
                    {activeBasket.entranceExams.map((exam) => (
                      <Badge
                        key={exam}
                        variant="outline"
                        className="mr-1.5 text-[10px] text-indigo-700 bg-indigo-50/50"
                      >
                        {exam}
                      </Badge>
                    ))}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleSubmitPreference}
                disabled={!eligibility.eligible}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Stream Choice to Counseling Cell
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
