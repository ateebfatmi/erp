'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  Printer,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Download,
} from 'lucide-react';
import {
  BankQuestion,
  QuestionType,
  CognitiveLevel,
  GeneratedExamPaper,
  INITIAL_QUESTION_BANK,
  calculateCognitiveDistribution,
  generateExamPaperFromBlueprint,
} from '@/modules/assessment/question-bank';

export function QuestionBankManager() {
  const [bank, setBank] = useState<BankQuestion[]>(INITIAL_QUESTION_BANK);
  const [activeTab, setActiveTab] = useState<'bank' | 'generate' | 'newQuestion'>('bank');
  const [selectedType, setSelectedType] = useState<QuestionType | 'ALL'>('ALL');
  const [selectedCognitive, setSelectedCognitive] = useState<CognitiveLevel | 'ALL'>('ALL');
  const [showAnswerFor, setShowAnswerFor] = useState<Record<string, boolean>>({});
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedExamPaper | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Question Form State
  const [newChapter, setNewChapter] = useState('Differential Equations');
  const [newType, setNewType] = useState<QuestionType>('SA');
  const [newCognitive, setNewCognitive] = useState<CognitiveLevel>('APPLYING');
  const [newMarks, setNewMarks] = useState<number>(3);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerScheme, setNewAnswerScheme] = useState('');

  const distribution = calculateCognitiveDistribution(bank);

  const filteredQuestions = bank.filter((q) => {
    const matchesType = selectedType === 'ALL' || q.questionType === selectedType;
    const matchesCognitive = selectedCognitive === 'ALL' || q.cognitiveLevel === selectedCognitive;
    return matchesType && matchesCognitive;
  });

  const handleToggleAnswer = (id: string) => {
    setShowAnswerFor((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGeneratePaper = () => {
    const paper = generateExamPaperFromBlueprint(
      bank,
      '041',
      12,
      'CBSE All India Senior School Certificate Pre-Board Exam 2024-25'
    );
    setGeneratedPaper(paper);
    setActiveTab('generate');
    setFeedback(`Generated complete examination paper: "${paper.title}" with 5 sections.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newAnswerScheme) return;

    const newQ: BankQuestion = {
      id: `q-${Date.now()}`,
      subjectCode: '041',
      subjectName: 'Mathematics Standard',
      grade: 12,
      chapter: newChapter,
      questionType: newType,
      cognitiveLevel: newCognitive,
      questionText: newQuestionText,
      answerScheme: newAnswerScheme,
      marks: newMarks,
    };

    setBank([...bank, newQ]);
    setNewQuestionText('');
    setNewAnswerScheme('');
    setActiveTab('bank');
    setFeedback(`Added ${newType} (${newMarks} marks) from chapter "${newChapter}" to CBSE Question Bank.`);
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

      {/* Cognitive Distribution Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Bloom's Taxonomy Cognitive Distribution (CBSE Acad-05/2017)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: Remembering (15-20%), Understanding (25-30%), Applying (25-30%), Analyzing/Evaluating (20-25%)
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Total {bank.length} Questions in Repository
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Remembering</span>
              <span className="text-lg font-bold font-mono text-blue-900">{distribution.REMEMBERING.percentage}%</span>
              <span className="text-[10px] text-blue-600 block">{distribution.REMEMBERING.marks} marks</span>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Understanding</span>
              <span className="text-lg font-bold font-mono text-emerald-900">{distribution.UNDERSTANDING.percentage}%</span>
              <span className="text-[10px] text-emerald-600 block">{distribution.UNDERSTANDING.marks} marks</span>
            </div>

            <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Applying</span>
              <span className="text-lg font-bold font-mono text-purple-900">{distribution.APPLYING.percentage}%</span>
              <span className="text-[10px] text-purple-600 block">{distribution.APPLYING.marks} marks</span>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Analyzing / Evaluating</span>
              <span className="text-lg font-bold font-mono text-amber-900">{distribution.ANALYZING_EVALUATING.percentage}%</span>
              <span className="text-[10px] text-amber-600 block">{distribution.ANALYZING_EVALUATING.marks} marks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'bank' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('bank')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Question Repository ({filteredQuestions.length})
          </Button>

          <Button
            variant={activeTab === 'generate' ? 'default' : 'outline'}
            size="sm"
            onClick={handleGeneratePaper}
            className="text-xs h-8 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Generate CBSE Exam Paper
          </Button>

          <Button
            variant={activeTab === 'newQuestion' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('newQuestion')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Question
          </Button>
        </div>

        {activeTab === 'bank' && (
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="ALL">All Question Types</option>
              <option value="MCQ">MCQ (1 Mark)</option>
              <option value="ASSERTION_REASON">Assertion-Reason (1 Mark)</option>
              <option value="VSA">Very Short Answer (2 Marks)</option>
              <option value="SA">Short Answer (3 Marks)</option>
              <option value="LA">Long Answer (5 Marks)</option>
              <option value="CASE_BASED">Case-Based (4 Marks)</option>
            </select>

            <select
              value={selectedCognitive}
              onChange={(e) => setSelectedCognitive(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="ALL">All Cognitive Levels</option>
              <option value="REMEMBERING">Remembering</option>
              <option value="UNDERSTANDING">Understanding</option>
              <option value="APPLYING">Applying</option>
              <option value="ANALYZING_EVALUATING">Analyzing / Evaluating</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: QUESTION REPOSITORY */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isOpen = showAnswerFor[q.id];

              return (
                <Card key={q.id} className="border-slate-200 hover:border-slate-300 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-slate-900 text-white font-mono text-[10px]">
                          {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono text-slate-700 bg-slate-50">
                          {q.questionType.replace('_', ' ')}
                        </Badge>
                        <Badge
                          className={`text-[10px] ${
                            q.cognitiveLevel === 'REMEMBERING'
                              ? 'bg-blue-100 text-blue-800'
                              : q.cognitiveLevel === 'UNDERSTANDING'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.cognitiveLevel === 'APPLYING'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.cognitiveLevel.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-slate-500 font-medium">Chapter: {q.chapter}</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAnswer(q.id)}
                        className="text-xs h-7 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        {isOpen ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {isOpen ? 'Hide Marking Scheme' : 'View Marking Scheme'}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <p className="font-semibold text-slate-900 text-sm whitespace-pre-line leading-relaxed">
                      {q.questionText}
                    </p>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-slate-50 rounded-md border border-slate-100 text-slate-700 font-sans"
                          >
                            <span className="font-bold mr-1">({String.fromCharCode(65 + idx)})</span> {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {isOpen && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-900 space-y-1 text-xs animate-in fade-in duration-150">
                        <strong className="block text-emerald-800">Official CBSE Marking Scheme & Proof:</strong>
                        <p className="whitespace-pre-line leading-relaxed">{q.answerScheme}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AUTO-GENERATED CBSE EXAM PAPER */}
      {activeTab === 'generate' && generatedPaper && (
        <Card className="border-slate-300 shadow-md bg-white">
          <CardHeader className="text-center pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                CENTRAL BOARD OF SECONDARY EDUCATION
              </Badge>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {generatedPaper.title}
              </h2>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                <span>Subject: {generatedPaper.subjectName} ({generatedPaper.subjectCode})</span>
                <span>•</span>
                <span>Class: {generatedPaper.grade}</span>
                <span>•</span>
                <span>Maximum Marks: {generatedPaper.maxMarks}</span>
                <span>•</span>
                <span>Time Allowed: {generatedPaper.durationMinutes / 60} Hours</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6 text-xs">
            {/* General Instructions */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-1">
              <strong className="block text-slate-900 uppercase tracking-wide text-[11px]">
                General Instructions:
              </strong>
              <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                {generatedPaper.generalInstructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ol>
            </div>

            {/* Sections */}
            {generatedPaper.sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{sec.sectionName}</h3>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    Subtotal: {sec.subtotalMarks} Marks
                  </Badge>
                </div>
                <p className="text-slate-500 text-[11px] italic">{sec.description}</p>

                <div className="space-y-3 pl-2">
                  {sec.questions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-1.5 border-b border-slate-100 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Q{qIdx + 1}. {q.questionText}
                        </span>
                        <span className="font-mono font-bold text-slate-700 shrink-0">
                          [{q.marks}]
                        </span>
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-2 gap-2 pt-1 pl-4">
                          {q.options.map((opt, optIdx) => (
                            <span key={optIdx} className="text-slate-600">
                              ({String.fromCharCode(65 + optIdx)}) {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Exporting question paper to print-ready PDF layout with school watermark.')}
                className="text-xs h-8 flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / Export Paper PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: ADD NEW QUESTION */}
      {activeTab === 'newQuestion' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Contribute Question to Institutional CBSE Bank
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Categorize questions by cognitive capability, chapter, and CBSE mark scheme rubrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter Name *</label>
                  <Input
                    required
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Question Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const t = e.target.value as QuestionType;
                      setNewType(t);
                      if (t === 'MCQ' || t === 'ASSERTION_REASON') setNewMarks(1);
                      if (t === 'VSA') setNewMarks(2);
                      if (t === 'SA') setNewMarks(3);
                      if (t === 'LA') setNewMarks(5);
                      if (t === 'CASE_BASED') setNewMarks(4);
                    }}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="MCQ">MCQ (1 Mark)</option>
                    <option value="ASSERTION_REASON">Assertion-Reason (1 Mark)</option>
                    <option value="VSA">Very Short Answer (2 Marks)</option>
                    <option value="SA">Short Answer (3 Marks)</option>
                    <option value="LA">Long Answer (5 Marks)</option>
                    <option value="CASE_BASED">Case-Based (4 Marks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cognitive Level *</label>
                  <select
                    value={newCognitive}
                    onChange={(e) => setNewCognitive(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="REMEMBERING">Remembering (Recall)</option>
                    <option value="UNDERSTANDING">Understanding (Concepts)</option>
                    <option value="APPLYING">Applying (Problem-solving)</option>
                    <option value="ANALYZING_EVALUATING">Analyzing / Evaluating (Higher Order)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marks *</label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value))}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Text & Mathematical Formulations *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter full question formulation..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Answer Scheme & Step-by-Step Marking Breakdown *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Step 1: Formula [1 mark] • Step 2: Substitution [1 mark] • Step 3: Final Answer [1 mark]"
                  value={newAnswerScheme}
                  onChange={(e) => setNewAnswerScheme(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('bank')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Save Question to Repository
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
