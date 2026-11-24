'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Medal,
  Timer,
  Flag,
  Calendar,
  Clock,
  Printer,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  AthleticEvent,
  RaceHeat,
  HeatResult,
  HouseName,
  INITIAL_ATHLETIC_EVENTS,
  INITIAL_RACE_HEATS,
  INITIAL_SPORTS_TALLIES,
  calculateLiveSportsShield,
  recordHeatResults,
  validateScheduleCollisions,
} from '@/modules/activities/sports-meet';

interface SportsMeetManagerProps {
  role?: 'admin' | 'student';
}

const HOUSE_THEMES: Record<HouseName, { bg: string; text: string; border: string; badge: string; accent: string }> = {
  ASHOKA: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accent: 'bg-emerald-600',
  },
  TAGORE: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    accent: 'bg-rose-600',
  },
  SHIVAJI: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    accent: 'bg-amber-600',
  },
  RAMAN: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    accent: 'bg-blue-600',
  },
};

export function SportsMeetManager({ role = 'admin' }: SportsMeetManagerProps) {
  const [events] = useState<AthleticEvent[]>(INITIAL_ATHLETIC_EVENTS);
  const [heats, setHeats] = useState<RaceHeat[]>(INITIAL_RACE_HEATS);
  const [tallies, setTallies] = useState<Record<HouseName, { gold: number; silver: number; bronze: number; points: number }>>(INITIAL_SPORTS_TALLIES);
  const [selectedHeatId, setSelectedHeatId] = useState<string>(INITIAL_RACE_HEATS[0].id);

  // Result entry modal state
  const [recordingHeat, setRecordingHeat] = useState<RaceHeat | null>(null);
  const [finishInputs, setFinishInputs] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const activeHeat = heats.find((h) => h.id === selectedHeatId) || heats[0];
  const standings = calculateLiveSportsShield(tallies);

  const handleOpenRecordModal = (heat: RaceHeat) => {
    setRecordingHeat(heat);
    const initialInputs: Record<string, string> = {};
    heat.athletes.forEach((a, idx) => {
      // Default placeholder realistic times if blank
      initialInputs[a.athleteId] = a.seedTime ? a.seedTime : `11.${50 + idx * 12}s`;
    });
    setFinishInputs(initialInputs);
  };

  const handleSubmitResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingHeat) return;

    // Sort finish order by entered times
    const finishOrder = recordingHeat.athletes.map((a) => ({
      athleteId: a.athleteId,
      finishTimeOrDistance: finishInputs[a.athleteId] || '12.00s',
    }));

    // Sort by ascending time (e.g. 11.38s < 11.45s)
    finishOrder.sort((a, b) => {
      const valA = parseFloat(a.finishTimeOrDistance.replace(/[^0-9.]/g, '')) || 99;
      const valB = parseFloat(b.finishTimeOrDistance.replace(/[^0-9.]/g, '')) || 99;
      return valA - valB;
    });

    const isRelay = recordingHeat.id.includes('relay');
    const { updatedHeat, housePoints } = recordHeatResults(recordingHeat, finishOrder, isRelay);

    // Update heats state
    setHeats((prev) => prev.map((h) => (h.id === updatedHeat.id ? updatedHeat : h)));

    // Update tallies
    setTallies((prev) => {
      const next = { ...prev };
      (Object.keys(housePoints) as HouseName[]).forEach((h) => {
        next[h] = {
          ...next[h],
          points: next[h].points + housePoints[h],
          gold: housePoints[h] >= (isRelay ? 10 : 5) ? next[h].gold + 1 : next[h].gold,
          silver: housePoints[h] === (isRelay ? 6 : 3) ? next[h].silver + 1 : next[h].silver,
          bronze: housePoints[h] === (isRelay ? 2 : 1) ? next[h].bronze + 1 : next[h].bronze,
        };
      });
      return next;
    });

    setRecordingHeat(null);
    setNotification(
      `Official results certified for ${recordingHeat.heatLabel}! Points credited to House tallies.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Live Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Cock House Athletic Shield Standings */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <Trophy className="h-4 w-4 text-amber-500" />
              Annual Cock House Athletic Shield &ndash; Live Standings
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Gold (5 pts) &bull; Silver (3 pts) &bull; Bronze (1 pt) &bull; Double Points for Relay Finals
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Heat Sheets</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {standings.map((s) => {
              const theme = HOUSE_THEMES[s.house];
              return (
                <div
                  key={s.house}
                  className={`p-4 rounded-xl border ${theme.border} ${theme.bg} relative overflow-hidden transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-wider uppercase text-slate-700">
                      Rank #{s.rank}
                    </span>
                    <Badge className={theme.badge}>{s.house} HOUSE</Badge>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">{s.points}</span>
                    <span className="text-xs font-semibold text-slate-500">Total Points</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-semibold text-amber-700" title="Gold">
                      <Medal className="h-3.5 w-3.5 text-amber-500 fill-amber-400" /> {s.gold}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600" title="Silver">
                      <Medal className="h-3.5 w-3.5 text-slate-400 fill-slate-300" /> {s.silver}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-900" title="Bronze">
                      <Medal className="h-3.5 w-3.5 text-amber-700 fill-amber-600" /> {s.bronze}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {s.totalMedals} Medals
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Heat Sheet & Track Arena View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Heats List */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Athletic Track Heats</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {heats.length} Scheduled
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {heats.map((heat) => {
                const event = events.find((e) => e.id === heat.eventId);
                const isSelected = heat.id === activeHeat.id;
                return (
                  <div
                    key={heat.id}
                    onClick={() => setSelectedHeatId(heat.id)}
                    className={`p-4 transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{heat.heatLabel}</span>
                      <Badge
                        variant={heat.status === 'COMPLETED' ? 'success' : 'outline'}
                        className="text-[10px]"
                      >
                        {heat.status}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 mt-1">{event?.title}</p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {heat.scheduledTime}
                      </span>
                      <span>{heat.athletes.length} Athletes</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right 2 Columns: 8-Lane Synthetic Track Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-600" />
                  {activeHeat.heatLabel} &ndash; 8-Lane Synthetic Track
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {events.find((e) => e.id === activeHeat.eventId)?.venue} &bull; Scheduled at{' '}
                  {activeHeat.scheduledTime}
                </CardDescription>
              </div>

              {role === 'admin' && activeHeat.status !== 'COMPLETED' && (
                <Button
                  size="sm"
                  onClick={() => handleOpenRecordModal(activeHeat)}
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs text-xs"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Enter Heat Finish Timings</span>
                </Button>
              )}

              {activeHeat.status === 'COMPLETED' && (
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" /> Results Certified & Recorded
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-4">
              {/* Synthetic Track Lanes Visual */}
              <div className="space-y-2.5">
                {activeHeat.athletes.map((athlete) => {
                  const theme = HOUSE_THEMES[athlete.house];
                  const result = activeHeat.results?.find((r) => r.athleteId === athlete.athleteId);

                  return (
                    <div
                      key={athlete.athleteId}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border ${
                        result?.medal ? theme.border : 'border-slate-200'
                      } ${result?.medal ? theme.bg : 'bg-white hover:bg-slate-50'} transition-all`}
                    >
                      {/* Lane Number & Bib */}
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          L{athlete.laneNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {athlete.athleteName}
                            </span>
                            <Badge className={`text-[10px] py-0 ${theme.badge}`}>
                              {athlete.house}
                            </Badge>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            Bib #{athlete.bibNumber} &bull; {athlete.admissionNo}
                          </span>
                        </div>
                      </div>

                      {/* Seed Time & Final Finish Result */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">
                            Seed Time
                          </span>
                          <span className="font-mono text-slate-600">
                            {athlete.seedTime || 'None'}
                          </span>
                        </div>

                        {result ? (
                          <div className="text-right pl-3 border-l border-slate-200">
                            <span className="text-[10px] text-slate-400 block uppercase">
                              Official Finish
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900">
                                {result.finishTimeOrDistance}
                              </span>
                              {result.medal === 'GOLD' && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-bold">
                                  1st (Gold &bull; +{result.pointsAwarded} pts)
                                </Badge>
                              )}
                              {result.medal === 'SILVER' && (
                                <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-bold">
                                  2nd (Silver &bull; +{result.pointsAwarded} pts)
                                </Badge>
                              )}
                              {result.medal === 'BRONZE' && (
                                <Badge className="bg-amber-50 text-amber-900 border-amber-200 text-[10px] font-bold">
                                  3rd (Bronze &bull; +{result.pointsAwarded} pts)
                                </Badge>
                              )}
                              {!result.medal && (
                                <span className="text-slate-400 text-[11px]">
                                  #{result.position}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-right pl-3 border-l border-slate-200">
                            <span className="text-[10px] text-amber-600 font-medium block">
                              Pending Race Call
                            </span>
                            <span className="text-[11px] text-slate-400">Awaiting Track Gun</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Finish Timings Modal */}
      {recordingHeat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-600" />
                  Record Official Finish Times &ndash; {recordingHeat.heatLabel}
                </h3>
                <p className="text-xs text-slate-500">
                  Enter electronic timer stamps (e.g. 11.38s). Rankings and House points will be computed automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRecordingHeat(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitResults} className="space-y-3">
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {recordingHeat.athletes.map((athlete) => (
                  <div
                    key={athlete.athleteId}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">
                        L{athlete.laneNumber}: {athlete.athleteName}
                      </span>
                      <span className="text-slate-400 text-[11px] block">
                        Bib #{athlete.bibNumber} &bull; {athlete.house}
                      </span>
                    </div>
                    <div className="w-28">
                      <Input
                        type="text"
                        value={finishInputs[athlete.athleteId] || ''}
                        onChange={(e) =>
                          setFinishInputs((prev) => ({
                            ...prev,
                            [athlete.athleteId]: e.target.value,
                          }))
                        }
                        placeholder="e.g. 11.45s"
                        required
                        className="text-xs font-mono h-8 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRecordingHeat(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Certify & Publish Results</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
