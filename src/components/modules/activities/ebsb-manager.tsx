'use client';

import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Award,
  Languages,
  UtensilsCrossed,
  Music,
  Trophy,
  Video,
  Landmark,
  CheckCircle2,
  Calendar,
  Users,
  Plus,
  Printer,
  ChevronRight,
  ShieldCheck,
  Search,
  BookOpen,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  EBSBPillar,
  StatePairingInfo,
  BhashaSentence,
  EBSBActivity,
  StudentLanguageProgress,
  INITIAL_STATE_PAIRING,
  INITIAL_BHASHA_SENTENCES,
  INITIAL_EBSB_ACTIVITIES,
  INITIAL_STUDENT_BHASHA_LOGS,
  calculateEBSBCompliance,
  calculateBhashaBadge,
  formatPillarTitle,
} from '@/modules/activities/ebsb';

interface Props {
  role?: 'admin' | 'teacher' | 'student';
}

export function EBSBManager({ role = 'admin' }: Props) {
  const [pairing] = useState<StatePairingInfo>(INITIAL_STATE_PAIRING);
  const [activities, setActivities] = useState<EBSBActivity[]>(INITIAL_EBSB_ACTIVITIES);
  const [sentences, setSentences] = useState<BhashaSentence[]>(INITIAL_BHASHA_SENTENCES);
  const [studentLogs, setStudentLogs] = useState<StudentLanguageProgress[]>(INITIAL_STUDENT_BHASHA_LOGS);
  const [activeTab, setActiveTab] = useState<'immersion' | 'bhasha' | 'portfolio' | 'dossier'>('immersion');
  const [selectedBhashaCategory, setSelectedBhashaCategory] = useState<string>('all');
  const [showCertificateFor, setShowCertificateFor] = useState<StudentLanguageProgress | null>(null);

  // New Activity form
  const [newTitle, setNewTitle] = useState('');
  const [newPillar, setNewPillar] = useState<EBSBPillar>('virtual_exchange');
  const [newDate, setNewDate] = useState('2026-12-18');
  const [newParticipants, setNewParticipants] = useState(80);
  const [newDescription, setNewDescription] = useState('Interactive cultural dialogue with partner school students.');

  const compliance = calculateEBSBCompliance(activities, studentLogs);

  // Mark activity completed
  const handleMarkActivityCompleted = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, status: 'completed', evidencePhotoCount: 15, reportFiledToCBSE: true }
          : a
      )
    );
  };

  // Add new activity
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: EBSBActivity = {
      id: `ebsb-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      pillar: newPillar,
      scheduledDate: newDate,
      targetGrades: ['Class 9', 'Class 10'],
      participantCount: newParticipants,
      pairedStateFocus: pairing.pairedState,
      description: newDescription,
      status: 'planned',
      evidencePhotoCount: 0,
      reportFiledToCBSE: false,
    };

    setActivities((prev) => [created, ...prev]);
    setNewTitle('');
    setActiveTab('immersion');
  };

  // Filtered sentences
  const filteredSentences = sentences.filter((s) => {
    if (selectedBhashaCategory !== 'all' && s.category !== selectedBhashaCategory) return false;
    return true;
  });

  const getPillarIcon = (pillar: EBSBPillar) => {
    switch (pillar) {
      case 'bhasha_sangam':
        return <Languages className="h-4 w-4 text-blue-600" />;
      case 'cuisine_food':
        return <UtensilsCrossed className="h-4 w-4 text-orange-600" />;
      case 'folk_dance_music':
        return <Music className="h-4 w-4 text-pink-600" />;
      case 'indigenous_sports':
        return <Trophy className="h-4 w-4 text-emerald-600" />;
      case 'virtual_exchange':
        return <Video className="h-4 w-4 text-purple-600" />;
      case 'heritage_monument':
        return <Landmark className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                EBSB Partner State
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">{pairing.pairedState}</h3>
              <p className="text-xs text-emerald-700 mt-0.5">Capital: {pairing.pairedCapital}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Pillars Implemented
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">
                {compliance.pillarsCoveredCount} / {compliance.totalPillars} Pillars
              </h3>
              <p className="text-xs text-blue-700 mt-0.5">{compliance.pillarCoveragePercentage}% Statutory Coverage</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Student Reach
              </p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{compliance.totalStudentReach}</h3>
              <p className="text-xs text-purple-700 mt-0.5">Cultural Participations</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                CBSE EBSB Portal
              </p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">{compliance.cbsePortalStatus}</h3>
              <p className="text-xs text-amber-700 mt-0.5">Compliant with MoE Norms</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('immersion')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'immersion'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Globe className="h-4 w-4" />
          Partner State Pairing & 6 Pillars
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bhasha')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'bhasha'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Languages className="h-4 w-4" />
          Bhasha Sangam (100 Sentences)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'portfolio'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Award className="h-4 w-4" />
          Student Linguistic Badges
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dossier')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'dossier'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          CBSE Annual EBSB Dossier
        </button>
      </div>

      {/* TAB 1: IMMERSION & 6 PILLARS */}
      {activeTab === 'immersion' && (
        <div className="space-y-4">
          {/* Pairing Showcase Banner */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-xl border border-emerald-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200/60">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Statutory State Pairing Agreement
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {pairing.hostState} ⇄ {pairing.pairedState}
                </h3>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                Partner School: {pairing.partnerSchoolName} ({pairing.partnerSchoolCity})
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Official Languages:</span>
                <strong className="text-slate-900">{pairing.officialLanguages.join(', ')}</strong>
              </div>
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Traditional Foods:</span>
                <strong className="text-slate-900">{pairing.traditionalCuisine.slice(0, 3).join(', ')}</strong>
              </div>
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Folk Dance & Arts:</span>
                <strong className="text-slate-900">{pairing.folkArtForms.slice(0, 2).join(', ')}</strong>
              </div>
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Indigenous Games:</span>
                <strong className="text-slate-900">{pairing.indigenousGames.slice(0, 2).join(', ')}</strong>
              </div>
            </div>
          </div>

          {/* Activities Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                EBSB Cultural Calendar ({activities.length} Activities Planned & Executed)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-1">
                    <Badge variant="outline" className="flex items-center gap-1 text-[10px] bg-slate-50">
                      {getPillarIcon(act.pillar)}
                      {formatPillarTitle(act.pillar)}
                    </Badge>
                    <Badge
                      className={
                        act.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]'
                          : 'bg-amber-100 text-amber-800 border-amber-300 text-[10px]'
                      }
                    >
                      {act.status === 'completed' ? '✓ Completed' : 'Planned'}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{act.description}</p>

                  <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-600 flex items-center justify-between">
                    <span>
                      <Calendar className="h-3 w-3 inline mr-1 text-slate-400" />
                      {act.scheduledDate}
                    </span>
                    <span>
                      <Users className="h-3 w-3 inline mr-1 text-slate-400" />
                      {act.participantCount} Students
                    </span>
                    <span>📷 {act.evidencePhotoCount} Photos</span>
                  </div>

                  {act.status !== 'completed' && (role === 'admin' || role === 'teacher') && (
                    <div className="pt-2 border-t flex justify-end">
                      <Button
                        size="sm"
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7"
                        onClick={() => handleMarkActivityCompleted(act.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Mark Activity Completed & Record Photos
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plan Activity Form */}
          {(role === 'admin' || role === 'teacher') && (
            <Card className="border-slate-200 shadow-xs max-w-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-emerald-600" />
                  Schedule New Ek Bharat Shreshtha Bharat Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Activity Title</label>
                    <Input
                      placeholder="e.g. Traditional Himalayan Weaving & Choktse Woodcarving Exhibition"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">EBSB Pillar</label>
                      <select
                        value={newPillar}
                        onChange={(e) => setNewPillar(e.target.value as any)}
                        className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                      >
                        <option value="bhasha_sangam">Bhasha Sangam</option>
                        <option value="cuisine_food">Traditional Cuisine</option>
                        <option value="folk_dance_music">Folk Dance & Music</option>
                        <option value="indigenous_sports">Indigenous Sports</option>
                        <option value="virtual_exchange">Virtual Exchange</option>
                        <option value="heritage_monument">Heritage Quiz & Monument</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Scheduled Date</label>
                      <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Expected Participation</label>
                    <Input
                      type="number"
                      value={newParticipants}
                      onChange={(e) => setNewParticipants(parseInt(e.target.value) || 50)}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Activity Description</label>
                    <Input
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    Schedule EBSB Activity & Add to CBSE Calendar
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: BHASHA SANGAM */}
      {activeTab === 'bhasha' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-blue-600" />
                Bhasha Sangam: 100 Sentences Practice Audio Desk
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily conversational sentences in Nepali (Paired State: Sikkim) with native script and phonetics
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Category:</span>
              <select
                value={selectedBhashaCategory}
                onChange={(e) => setSelectedBhashaCategory(e.target.value)}
                className="text-xs rounded border border-slate-200 bg-white p-1"
              >
                <option value="all">All Categories</option>
                <option value="greeting">Greetings</option>
                <option value="daily_conversation">Daily Conversation</option>
                <option value="school_life">School Life</option>
                <option value="culture_festivals">Culture & Festivals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSentences.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Sentence #{s.sentenceNo}
                  </span>
                  <span className="capitalize">{s.category.replace('_', ' ')}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-bold text-emerald-950 font-serif">
                    {s.pairedLanguageText}
                  </div>
                  <div className="text-xs font-mono text-purple-700">
                    Phonetic: <em>{s.transliteration}</em>
                  </div>
                  <div className="text-xs text-slate-800 font-medium">
                    Hindi: {s.hindiText}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    English: {s.englishText}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT LINGUISTIC BADGES */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" />
                Student Bhasha Sangam Badges & Language Mastery Roster
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Recognizing students who have mastered conversational sentences in Sikkim's official languages
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student & Class</th>
                      <th className="p-3">Paired Language</th>
                      <th className="p-3">Sentences Mastered</th>
                      <th className="p-3">Linguistic Badge</th>
                      <th className="p-3 text-right">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{log.studentName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {log.studentId} • {log.grade}-{log.section}
                          </div>
                        </td>

                        <td className="p-3 font-medium text-slate-700">{log.pairedLanguage}</td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{log.sentencesMastered} / 100</span>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${log.sentencesMastered}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <Badge
                            className={
                              log.badgeEarned === 'Bhasha Champion'
                                ? 'bg-purple-100 text-purple-800 border-purple-300 text-[10px]'
                                : log.badgeEarned === 'Bhasha Mitra'
                                ? 'bg-blue-100 text-blue-800 border-blue-300 text-[10px]'
                                : 'bg-slate-100 text-slate-700 border-slate-300 text-[10px]'
                            }
                          >
                            🏅 {log.badgeEarned}
                          </Badge>
                        </td>

                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => setShowCertificateFor(log)}
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            View Badge
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
      )}

      {/* TAB 4: CBSE ANNUAL EBSB DOSSIER */}
      {activeTab === 'dossier' && (
        <Card className="border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  CBSE Annual EBSB Statutory Compliance Dossier (2026-27)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Official report ready for CBSE Regional Office and Ministry of Education EBSB Portal
                </CardDescription>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                {compliance.cbsePortalStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border rounded-lg space-y-2 leading-relaxed text-slate-700">
              <p>
                This certifies that <strong>Vidya Mandir Senior Secondary School (CBSE Affiliation: 2130045)</strong>{' '}
                has actively implemented the statutory <strong>Ek Bharat Shreshtha Bharat (EBSB)</strong> cultural
                exchange mandate paired with the State of <strong>Sikkim</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px]">
                <div>
                  <span className="text-slate-400">Pillars Implemented:</span>{' '}
                  <strong>{compliance.pillarsCoveredCount} of 6 Mandated Pillars</strong>
                </div>
                <div>
                  <span className="text-slate-400">Student Reach:</span>{' '}
                  <strong>{compliance.totalStudentReach} Cumulative Participations</strong>
                </div>
                <div>
                  <span className="text-slate-400">Partner School:</span>{' '}
                  <strong>GSSS Tadong, Gangtok</strong>
                </div>
                <div>
                  <span className="text-slate-400">Bhasha Sangam:</span>{' '}
                  <strong>Nepali / Bhutia 100 Sentences Integrated</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print Verified CBSE EBSB Compliance Dossier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BHASHA SANGAM CERTIFICATE MODAL */}
      {showCertificateFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border-4 border-double border-purple-300">
            <div className="flex items-center justify-between pb-2 border-b border-purple-200">
              <h3 className="text-sm font-bold text-purple-950 uppercase">
                Ek Bharat Shreshtha Bharat — Bhasha Sangam Badge
              </h3>
              <button
                onClick={() => setShowCertificateFor(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2 py-3 bg-purple-50/40 rounded-lg p-4">
              <p className="text-[10px] text-purple-700 uppercase tracking-widest font-bold">
                Ministry of Education • Government of India
              </p>
              <h2 className="text-base font-bold text-slate-900">
                Vidya Mandir Senior Secondary School
              </h2>
              <div className="my-2">
                <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                  🏅 {showCertificateFor.badgeEarned}
                </span>
              </div>
              <p className="text-xs text-slate-800 pt-1 leading-relaxed">
                Awarded to <strong className="text-purple-950 underline">{showCertificateFor.studentName}</strong> (
                {showCertificateFor.studentId}), Class{' '}
                <strong>{showCertificateFor.grade}-{showCertificateFor.section}</strong> for mastering{' '}
                <strong>{showCertificateFor.sentencesMastered} conversational sentences</strong> in{' '}
                <strong>{showCertificateFor.pairedLanguage}</strong> under the EBSB initiative.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <span className="text-[10px] text-slate-400">CBSE Affiliation: 2130045</span>
              <Button
                size="sm"
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowCertificateFor(null)}
              >
                Close Badge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
