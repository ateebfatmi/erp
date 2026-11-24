'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Medal,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  PlusCircle,
  Flag,
} from 'lucide-react';
import {
  HouseName,
  HouseEvent,
  HouseMedalStanding,
  INITIAL_HOUSE_EVENTS,
  INITIAL_MEDAL_TALLIES,
  calculateMedalStandings,
  recordEventResult,
} from '@/modules/activities/house-system';

interface Props {
  role?: 'admin' | 'student';
}

export function HouseManager({ role = 'admin' }: Props) {
  const [events, setEvents] = useState<HouseEvent[]>(INITIAL_HOUSE_EVENTS);
  const [tallies, setTallies] = useState(INITIAL_MEDAL_TALLIES);
  const [selectedEventToConclude, setSelectedEventToConclude] = useState<HouseEvent | null>(null);
  const [firstHouse, setFirstHouse] = useState<HouseName>('ASHOKA');
  const [secondHouse, setSecondHouse] = useState<HouseName>('TAGORE');
  const [thirdHouse, setThirdHouse] = useState<HouseName>('SHIVAJI');
  const [honoreeText, setHonoreeText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const standings = calculateMedalStandings(tallies);

  const handleConcludeEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventToConclude) return;

    const honorees = honoreeText.split(',').map((s) => s.trim()).filter(Boolean);
    const { concludedEvent, pointsAwarded } = recordEventResult(
      selectedEventToConclude,
      firstHouse,
      secondHouse,
      thirdHouse,
      honorees
    );

    // Update events
    setEvents((prev) =>
      prev.map((evt) => (evt.id === concludedEvent.id ? concludedEvent : evt))
    );

    // Update tallies
    setTallies((prev) => ({
      ...prev,
      [firstHouse]: { ...prev[firstHouse], gold: prev[firstHouse].gold + 1 },
      [secondHouse]: { ...prev[secondHouse], silver: prev[secondHouse].silver + 1 },
      [thirdHouse]: { ...prev[thirdHouse], bronze: prev[thirdHouse].bronze + 1 },
    }));

    setFeedback(`Event "${concludedEvent.title}" concluded! Gold: ${firstHouse}, Silver: ${secondHouse}, Bronze: ${thirdHouse}.`);
    setSelectedEventToConclude(null);
    setHonoreeText('');
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

      {/* Student Personal House Banner */}
      {role === 'student' && (
        <Card className="border-blue-300 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge className="bg-blue-500 text-white font-mono text-[10px] font-bold">
                MY ALLOTTED HOUSE
              </Badge>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Flag className="h-5 w-5 text-blue-400" />
                Ashoka House (The Royal Blue Lions)
              </h2>
              <p className="text-xs text-blue-200">
                Motto: <em>Courage, Integrity, and Excellence in Action</em> • House Captain: Aarav Mehta
              </p>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-blue-200 uppercase tracking-wide block">Current Standing</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">Rank #1</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Olympic Medal Tally Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Medal className="h-4 w-4 text-amber-500" />
                Annual Inter-House Olympic Medal Tally & Standing Score
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Scoring Model: Gold = 10 pts, Silver = 7 pts, Bronze = 5 pts.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Academic Session 2024-25
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">House</th>
                  <th className="py-2.5 px-3 text-center">Gold 🥇</th>
                  <th className="py-2.5 px-3 text-center">Silver 🥈</th>
                  <th className="py-2.5 px-3 text-center">Bronze 🥉</th>
                  <th className="py-2.5 px-3 text-center">Total Medals</th>
                  <th className="py-2.5 px-3 text-right">Championship Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standings.map((s) => (
                  <tr key={s.house} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      #{s.rank}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full inline-block"
                        style={{
                          backgroundColor:
                            s.house === 'ASHOKA'
                              ? '#2563EB'
                              : s.house === 'TAGORE'
                              ? '#16A34A'
                              : s.house === 'SHIVAJI'
                              ? '#DC2626'
                              : '#D97706',
                        }}
                      />
                      {s.house} HOUSE
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-600">
                      {s.gold}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                      {s.silver}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-800">
                      {s.bronze}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                      {s.totalMedals}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 text-sm">
                      {s.aggregateScore} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Events Roster */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Inter-House Fixtures, Competitions & Championship Finals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <Card key={evt.id} className="border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge
                          className={`text-[10px] font-semibold ${
                            evt.category === 'SPORTS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : evt.category === 'LITERARY'
                              ? 'bg-blue-100 text-blue-800'
                              : evt.category === 'SCIENCE_TECH'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {evt.category.replace('_', ' ')}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            evt.status === 'CONCLUDED'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-blue-700 bg-blue-50 border-blue-200'
                          }`}
                        >
                          {evt.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
                        {evt.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs text-slate-700">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {evt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {evt.venue}
                    </span>
                  </div>

                  {evt.status === 'CONCLUDED' ? (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-amber-600">🥇 1st: {evt.firstPlaceHouse}</span>
                        <span className="text-slate-500">🥈 2nd: {evt.secondPlaceHouse}</span>
                        <span className="text-amber-800">🥉 3rd: {evt.thirdPlaceHouse}</span>
                      </div>
                      {evt.studentHonorees && evt.studentHonorees.length > 0 && (
                        <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                          <strong>Outstanding Performers:</strong> {evt.studentHonorees.join(', ')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-[11px] text-blue-900">
                      Points at stake: 1st (+{evt.pointsSchedule.first} pts) • 2nd (+{evt.pointsSchedule.second} pts) • 3rd (+{evt.pointsSchedule.third} pts)
                    </div>
                  )}
                </CardContent>
              </div>

              {role === 'admin' && evt.status === 'SCHEDULED' && (
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => setSelectedEventToConclude(evt)}
                    className="text-xs h-7 bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Declare Podium Results
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Conclude Event Modal (Admin) */}
      {selectedEventToConclude && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl animate-in zoom-in-95 duration-150">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Declare Event Results & Podium
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {selectedEventToConclude.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleConcludeEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🥇 1st Place (Gold Medal) *
                  </label>
                  <select
                    value={firstHouse}
                    onChange={(e) => setFirstHouse(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="ASHOKA">Ashoka House</option>
                    <option value="TAGORE">Tagore House</option>
                    <option value="SHIVAJI">Shivaji House</option>
                    <option value="RAMAN">Raman House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🥈 2nd Place (Silver Medal) *
                  </label>
                  <select
                    value={secondHouse}
                    onChange={(e) => setSecondHouse(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="ASHOKA">Ashoka House</option>
                    <option value="TAGORE">Tagore House</option>
                    <option value="SHIVAJI">Shivaji House</option>
                    <option value="RAMAN">Raman House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🥉 3rd Place (Bronze Medal) *
                  </label>
                  <select
                    value={thirdHouse}
                    onChange={(e) => setThirdHouse(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="ASHOKA">Ashoka House</option>
                    <option value="TAGORE">Tagore House</option>
                    <option value="SHIVAJI">Shivaji House</option>
                    <option value="RAMAN">Raman House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Individual Student Honorees (Comma separated)
                  </label>
                  <Input
                    placeholder="e.g. Kabir Khan (Record Sprint), Pooja Iyer"
                    value={honoreeText}
                    onChange={(e) => setHonoreeText(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEventToConclude(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                  >
                    Publish Results & Award Points
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
