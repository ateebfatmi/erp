'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Shield,
  Award,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  PlusCircle,
  Bell,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  HouseName,
  IncidentType,
  DemeritSeverity,
  BehaviorRecord,
  INITIAL_BEHAVIOR_RECORDS,
  calculateHouseStandings,
  filterBehaviorRecords,
} from '@/modules/students/discipline';

export function DisciplineManager() {
  const [records, setRecords] = useState<BehaviorRecord[]>(INITIAL_BEHAVIOR_RECORDS);
  const [activeTab, setActiveTab] = useState<'standings' | 'newIncident'>('standings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHouse, setSelectedHouse] = useState<HouseName | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<IncidentType | 'ALL'>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Record Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newRollNo, setNewRollNo] = useState('');
  const [newClass, setNewClass] = useState('12-A');
  const [newHouse, setNewHouse] = useState<HouseName>('ASHOKA');
  const [newType, setNewType] = useState<IncidentType>('MERIT');
  const [newCategory, setNewCategory] = useState('ACADEMIC_EXCELLENCE');
  const [newPoints, setNewPoints] = useState(20);
  const [newDescription, setNewDescription] = useState('');
  const [newRestorative, setNewRestorative] = useState('');
  const [newNotifyParent, setNewNotifyParent] = useState(true);

  const standings = calculateHouseStandings(records);
  const filteredRecords = filterBehaviorRecords(records, selectedHouse, selectedType, searchQuery);

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newDescription) return;

    const pointsValue = newType === 'MERIT' ? Math.abs(newPoints) : -Math.abs(newPoints);

    const newRecord: BehaviorRecord = {
      id: `beh-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      studentName: newStudentName,
      rollNo: newRollNo || '01',
      classSection: newClass,
      house: newHouse,
      incidentType: newType,
      category: newCategory,
      points: pointsValue,
      severity: newType === 'DEMERIT' ? 'LEVEL_1_VERBAL_WARNING' : undefined,
      date: new Date().toISOString().split('T')[0],
      reportedBy: 'Faculty Discipline Committee',
      description: newDescription,
      restorativeAction: newRestorative || (newType === 'MERIT' ? 'House recognition awarded' : 'Verbal guidance session logged'),
      parentNotified: newNotifyParent,
    };

    setRecords([newRecord, ...records]);
    setNewStudentName('');
    setNewRollNo('');
    setNewDescription('');
    setNewRestorative('');
    setActiveTab('standings');
    setFeedback(`Recorded ${newType.toLowerCase()} for ${newRecord.studentName}. ${Math.abs(pointsValue)} points ${pointsValue > 0 ? 'awarded to' : 'deducted from'} ${newHouse} House!`);
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

      {/* House Cup Championship Standings Leaderboard */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          Annual Cock House Championship Leaderboard 2024-25
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {standings.map((s) => (
            <Card
              key={s.house}
              className={`border-slate-200 shadow-xs relative overflow-hidden ${
                s.rank === 1 ? 'ring-2 ring-amber-400 bg-amber-50/20' : ''
              }`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: s.colorHex }}
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{s.house} HOUSE</span>
                  <Badge
                    className={`font-mono text-[10px] ${
                      s.rank === 1
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Rank #{s.rank}
                  </Badge>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold font-mono text-slate-900">
                    {s.totalPoints} <span className="text-xs font-normal text-slate-500">pts</span>
                  </h3>
                  {s.rank === 1 && (
                    <Trophy className="h-5 w-5 text-amber-500 shrink-0 animate-bounce" />
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-emerald-600 font-semibold">+{s.meritsCount} Merits</span>
                  <span className="text-rose-600 font-semibold">-{s.demeritsCount} Demerits</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'standings' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('standings')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5" />
            Behavior Register ({filteredRecords.length})
          </Button>

          <Button
            variant={activeTab === 'newIncident' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('newIncident')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Award Merit / Log Incident
          </Button>
        </div>

        {activeTab === 'standings' && (
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="ALL">All Houses</option>
              <option value="ASHOKA">Ashoka House</option>
              <option value="TAGORE">Tagore House</option>
              <option value="SHIVAJI">Shivaji House</option>
              <option value="RAMAN">Raman House</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="MERIT">Positive Merits Only</option>
              <option value="DEMERIT">Disciplinary Demerits Only</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: BEHAVIOR REGISTER */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search records by student name, roll number, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <Card className="border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">House</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Points</th>
                      <th className="py-2.5 px-3">Description & Restorative Action</th>
                      <th className="py-2.5 px-3 text-right">Parent Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono text-slate-500">{r.date}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{r.studentName}</td>
                        <td className="py-3 px-3 text-slate-600 font-mono">Class {r.classSection}</td>
                        <td className="py-3 px-3">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: `${r.house === 'ASHOKA' ? '#DBEAFE' : r.house === 'TAGORE' ? '#DCFCE7' : r.house === 'SHIVAJI' ? '#FEE2E2' : '#FEF3C7'}`,
                              color: `${r.house === 'ASHOKA' ? '#1E40AF' : r.house === 'TAGORE' ? '#166534' : r.house === 'SHIVAJI' ? '#991B1B' : '#92400E'}`,
                            }}
                          >
                            {r.house}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            className={`text-[10px] ${
                              r.incidentType === 'MERIT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.incidentType}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          <span className={r.points > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {r.points > 0 ? `+${r.points}` : r.points} pts
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 max-w-[280px]">
                          <p className="font-medium text-slate-900 truncate">{r.description}</p>
                          <p className="text-[11px] text-slate-500 italic mt-0.5">{r.restorativeAction}</p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {r.parentNotified ? (
                            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 text-[10px]">
                              SMS Sent
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
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

      {/* TAB 2: AWARD MERIT / LOG INCIDENT */}
      {activeTab === 'newIncident' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Award Positive Merit / Record Pastoral Incident
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Reinforces positive student achievements or logs restorative disciplinary actions with immediate House Point computation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIncident} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Aarav Mehta"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class & Section *
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="12-A">Class 12-A</option>
                    <option value="12-B">Class 12-B</option>
                    <option value="11-A">Class 11-A</option>
                    <option value="11-B">Class 11-B</option>
                    <option value="10-A">Class 10-A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned House *
                  </label>
                  <select
                    value={newHouse}
                    onChange={(e) => setNewHouse(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="ASHOKA">Ashoka House</option>
                    <option value="TAGORE">Tagore House</option>
                    <option value="SHIVAJI">Shivaji House</option>
                    <option value="RAMAN">Raman House</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Incident Type *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const t = e.target.value as IncidentType;
                      setNewType(t);
                      setNewPoints(t === 'MERIT' ? 20 : 10);
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="MERIT">Positive Merit (+ Points)</option>
                    <option value="DEMERIT">Disciplinary Demerit (- Points)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    {newType === 'MERIT' ? (
                      <>
                        <option value="ACADEMIC_EXCELLENCE">Academic Excellence</option>
                        <option value="COMMUNITY_SERVICE">Community Service</option>
                        <option value="SPORTSMANSHIP">Sportsmanship & Fair Play</option>
                        <option value="CREATIVE_ARTS">Creative Arts & Drama</option>
                        <option value="CIVIC_LEADERSHIP">Civic Leadership & Mentorship</option>
                      </>
                    ) : (
                      <>
                        <option value="UNIFORM_NON_COMPLIANCE">Uniform Non-Compliance</option>
                        <option value="HOMEWORK_DEFAULT">Chronic Homework Default</option>
                        <option value="CLASSROOM_DISRUPTION">Classroom Disruption</option>
                        <option value="UNAUTHORIZED_EXIT">Unauthorized Campus Exit</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    House Points Magnitude *
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Description / Justification *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detail the positive achievement or specific infraction..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Restorative Action / Recognition Citation
                </label>
                <Input
                  placeholder="e.g. House certificate presented at assembly / Verbal counseling recorded"
                  value={newRestorative}
                  onChange={(e) => setNewRestorative(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={newNotifyParent}
                    onChange={(e) => setNewNotifyParent(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Send instant notification SMS & portal alert to Parent / Guardian
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('standings')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Record Behavior Incident
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
