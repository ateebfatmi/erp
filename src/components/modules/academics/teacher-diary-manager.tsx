'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  FileText,
  UserCheck,
  Send,
} from 'lucide-react';
import {
  TeacherDiaryEntry,
  INITIAL_DIARY_ENTRIES,
  verifyWeeklyDiaryBatch,
} from '@/modules/academics/teacher-diary';

interface Props {
  role?: 'teacher' | 'admin';
}

export function TeacherDiaryManager({ role = 'teacher' }: Props) {
  const [entries, setEntries] = useState<TeacherDiaryEntry[]>(INITIAL_DIARY_ENTRIES);
  const [selectedWeek, setSelectedWeek] = useState<number>(32);
  const [activeTab, setActiveTab] = useState<'logbook' | 'newEntry' | 'review'>('logbook');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Diary Entry State
  const [newDate, setNewDate] = useState('2024-11-27');
  const [newPeriod, setNewPeriod] = useState(2);
  const [newClass, setNewClass] = useState(10);
  const [newSection, setNewSection] = useState('A');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newTopic, setNewTopic] = useState('');
  const [newPedagogy, setNewPedagogy] = useState('');
  const [newHomework, setNewHomework] = useState('');
  const [newRemedial, setNewRemedial] = useState('');

  // Supervisor Sign-off State
  const [supervisorRemark, setSupervisorRemark] = useState(
    'Thorough conceptual coverage and excellent remediation for slower learners. Verified.'
  );

  const weekEntries = entries.filter((e) => e.weekNumber === selectedWeek);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic) return;

    const newEntry: TeacherDiaryEntry = {
      id: `dry-${Date.now()}`,
      teacherId: 'tch-01',
      teacherName: 'Smt. Ananya Sen',
      weekNumber: selectedWeek,
      date: newDate,
      periodNo: newPeriod,
      classGrade: newClass,
      section: newSection,
      subject: newSubject,
      topicTaught: newTopic,
      pedagogicalAid: newPedagogy || 'Textbook, blackboard diagrams & smart classroom display',
      homeworkAssigned: newHomework || 'Complete exercise practice questions',
      remedialNotes: newRemedial || 'Addressed individual student doubts post-lecture',
      supervisorStatus: 'SUBMITTED',
    };

    setEntries([...entries, newEntry]);
    setNewTopic('');
    setNewPedagogy('');
    setNewHomework('');
    setNewRemedial('');
    setActiveTab('logbook');
    setFeedback(`Period ${newPeriod} lecture log added to Weekly Diary for Class ${newClass}-${newSection}.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleSignOff = () => {
    const verified = verifyWeeklyDiaryBatch(weekEntries, supervisorRemark);
    setEntries((prev) =>
      prev.map((e) => {
        const found = verified.find((v) => v.id === e.id);
        return found || e;
      })
    );
    setFeedback(`Academic Week ${selectedWeek} Teaching Diary digitally signed and approved by Principal.`);
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'logbook' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('logbook')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Weekly Logbook ({weekEntries.length} Periods)
          </Button>

          <Button
            variant={activeTab === 'newEntry' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('newEntry')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Log Class Lecture
          </Button>

          {role === 'admin' && (
            <Button
              variant={activeTab === 'review' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('review')}
              className="text-xs h-8 flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Principal Verification Desk
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Academic Week:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
          >
            <option value={32}>Week 32 (Nov 25 - Nov 30)</option>
            <option value={31}>Week 31 (Nov 18 - Nov 23)</option>
            <option value={30}>Week 30 (Nov 11 - Nov 16)</option>
          </select>
        </div>
      </div>

      {/* TAB 1: WEEKLY LOGBOOK CARDS */}
      {activeTab === 'logbook' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weekEntries.map((e) => (
              <Card key={e.id} className="border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge className="bg-blue-600 text-white font-mono text-[10px]">
                            Period {e.periodNo}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-mono text-slate-700 bg-slate-50">
                            Class {e.classGrade}-{e.section}
                          </Badge>
                          <Badge
                            className={`text-[10px] ${
                              e.supervisorStatus === 'PRINCIPAL_VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {e.supervisorStatus.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
                          {e.topicTaught}
                        </CardTitle>
                      </div>
                      <span className="text-xs font-mono text-slate-500 shrink-0">
                        {e.date}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2.5 pt-0 text-xs text-slate-700">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold block text-slate-900 mb-0.5">
                        Teaching Aids & Pedagogy:
                      </span>
                      <p className="text-slate-600">{e.pedagogicalAid}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Homework Assigned: </span>
                      <span className="text-slate-700">{e.homeworkAssigned}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900">Remedial Action: </span>
                      <span className="text-slate-600 italic">{e.remedialNotes}</span>
                    </div>

                    {e.supervisorRemarks && (
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 text-[11px]">
                        <strong>Principal / Supervisor Remark:</strong> {e.supervisorRemarks}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LOG CLASS LECTURE */}
      {activeTab === 'newEntry' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Log Period Lecture Entry into Teaching Diary
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              CBSE statutory logbook: Record period topic, teaching aids, assigned tasks, and student remediation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                  <Input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period No *</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class & Section *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(Number(e.target.value))}
                      className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    >
                      <option value={9}>Class 9</option>
                      <option value={10}>Class 10</option>
                      <option value={11}>Class 11</option>
                      <option value={12}>Class 12</option>
                    </select>
                    <select
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                      <option value="C">Sec C</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <Input
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic & Key Concepts Covered *
                </label>
                <Input
                  required
                  placeholder="e.g. Chapter 6: Applications of Integrals — Parabola and line bounded area"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teaching Aids & Pedagogy Method
                  </label>
                  <Input
                    placeholder="e.g. 3D graphing software, interactive smartboard, physical models"
                    value={newPedagogy}
                    onChange={(e) => setNewPedagogy(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Homework / Practice Assigned
                  </label>
                  <Input
                    placeholder="e.g. NCERT Exercise 6.2 Questions 1 to 5"
                    value={newHomework}
                    onChange={(e) => setNewHomework(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remedial Support & Doubt Clearance Notes
                </label>
                <Input
                  placeholder="e.g. Addressed confusion regarding limit evaluation for 3 slower learners"
                  value={newRemedial}
                  onChange={(e) => setNewRemedial(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('logbook')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Save Entry to Teaching Diary
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: PRINCIPAL VERIFICATION DESK */}
      {activeTab === 'review' && role === 'admin' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-600" />
              Academic Coordinator / Principal Digital Sign-Off
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Review Week {selectedWeek} entries for Smt. Ananya Sen (PGT Math) and append official supervisor remarks.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Supervisory Remarks & Pedagogical Feedback *
              </label>
              <textarea
                rows={3}
                value={supervisorRemark}
                onChange={(e) => setSupervisorRemark(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                size="sm"
                onClick={handleSignOff}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Sign Off & Verify Week {selectedWeek} Diary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
