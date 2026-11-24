'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Users,
  Calendar,
  MapPin,
  Clock,
  Bus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Plus,
  ShieldCheck,
  Phone,
  Printer,
  ChevronRight,
  Sparkles,
  School,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  SahodayaEvent,
  DelegationMember,
  EscortTeacher,
  INITIAL_SAHODAYA_EVENTS,
  calculateDelegationReadiness,
  calculateClusterTrophySummary,
  formatAgeGroup,
  formatCategory,
  POSITION_POINTS,
  SahodayaCategory,
  AgeGroup,
  NOCStatus,
} from '@/modules/activities/sahodaya';

export function SahodayaManager() {
  const [events, setEvents] = useState<SahodayaEvent[]>(INITIAL_SAHODAYA_EVENTS);
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard' | 'register'>('events');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [showTravelOrder, setShowTravelOrder] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Result entry state
  const [resPosition, setResPosition] = useState<
    'first' | 'second' | 'third' | 'best_delegate' | 'special_mention' | 'participation'
  >('first');
  const [resTrophy, setResTrophy] = useState('Sahodaya Champions Cup');
  const [resRemarks, setResRemarks] = useState('Secured highest cumulative jury score.');

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCluster, setNewCluster] = useState('Delhi Central Sahodaya School Complex');
  const [newHostSchool, setNewHostSchool] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-12-10');
  const [newReportingTime, setNewReportingTime] = useState('08:00 AM');
  const [newCategory, setNewCategory] = useState<SahodayaCategory>('debate');
  const [newAgeGroup, setNewAgeGroup] = useState<AgeGroup>('under_17');
  const [newTransport, setNewTransport] = useState<'school_bus' | 'school_van' | 'direct_parent_drop'>('school_bus');
  const [newVehicle, setNewVehicle] = useState('DL-1P-CB-9082');

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const readiness = selectedEvent ? calculateDelegationReadiness(selectedEvent) : null;
  const trophySummary = calculateClusterTrophySummary(events);

  // Toggle delegate consent
  const handleToggleConsent = (eventId: string, delegateId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const updatedDelegates: DelegationMember[] = ev.delegates.map((del) => {
          if (del.id !== delegateId) return del;
          const nextStatus: NOCStatus = del.parentConsentNOC === 'verified' ? 'pending' : 'verified';
          return { ...del, parentConsentNOC: nextStatus };
        });
        return { ...ev, delegates: updatedDelegates };
      })
    );
  };

  // Toggle medical clearance
  const handleToggleMedical = (eventId: string, delegateId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const updatedDelegates = ev.delegates.map((del) => {
          if (del.id !== delegateId) return del;
          return { ...del, medicalClearance: !del.medicalClearance };
        });
        return { ...ev, delegates: updatedDelegates };
      })
    );
  };

  // Dispatch delegation (only when 100% compliant)
  const handleDispatchDelegation = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return { ...ev, status: 'dispatched' };
      })
    );
  };

  // Submit Result
  const handleSaveResult = () => {
    if (!selectedEvent) return;
    const pts = POSITION_POINTS[resPosition] || 1;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== selectedEvent.id) return ev;
        return {
          ...ev,
          status: 'completed',
          result: {
            position: resPosition,
            trophyWon: resTrophy,
            points: pts,
            certificateIssued: true,
            remarks: resRemarks,
          },
        };
      })
    );
    setShowResultModal(false);
  };

  // Create Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newHostSchool || !newVenue) return;

    const newEvent: SahodayaEvent = {
      id: `sah-${Date.now().toString().slice(-4)}`,
      code: `SAH-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      clusterName: newCluster,
      hostSchool: newHostSchool,
      venueAddress: newVenue,
      eventDate: newEventDate,
      reportingTime: newReportingTime,
      category: newCategory,
      ageGroup: newAgeGroup,
      status: 'registration',
      transportMode: newTransport,
      vehicleNumber: newVehicle,
      delegates: [
        {
          id: `del-${Date.now()}-1`,
          studentId: 'STU-1088',
          studentName: 'Anvit Sharma',
          grade: 'Class 10',
          section: 'A',
          role: 'Lead Representative',
          parentConsentNOC: 'pending',
          medicalClearance: true,
          emergencyPhone: '+91 98111 00223',
          bloodGroup: 'B+',
        },
      ],
      escorts: [
        {
          id: `esc-${Date.now()}-1`,
          staffId: 'EMP-T14',
          name: 'Mr. Rajesh Khurana',
          designation: 'Activity In-Charge',
          phone: '+91 98102 33445',
          isLeadEscort: true,
        },
      ],
    };

    setEvents((prev) => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);
    setActiveTab('events');
    setNewTitle('');
    setNewHostSchool('');
    setNewVenue('');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Sahodaya Trophy Pts
              </p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">{trophySummary.totalPoints}</h3>
              <p className="text-xs text-amber-700 mt-0.5">Rank #3 in Cluster Zone</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <Trophy className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                First Place Podiums
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">{trophySummary.firstPlaces}</h3>
              <p className="text-xs text-blue-700 mt-0.5">Gold & Champion Cups</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Second / Silver Honors
              </p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{trophySummary.secondPlaces}</h3>
              <p className="text-xs text-purple-700 mt-0.5">Cluster Finalists</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Delegations Active
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">
                {events.filter((e) => e.status !== 'completed').length}
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">Upcoming Inter-School Meets</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'events'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          Delegations & Safety
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Trophy className="h-4 w-4" />
          Trophy Standings & Hall of Fame
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'register'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus className="h-4 w-4" />
          Register Event
        </button>
      </div>

      {/* TAB 1: EVENTS & DELEGATION SAFETY */}
      {activeTab === 'events' && (
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Event List (Left 5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-semibold text-slate-800">Sahodaya Competition Schedule</h3>
                <span className="text-xs text-slate-500">{events.length} Competitions</span>
              </div>

              {events.map((ev) => {
                const isSelected = ev.id === selectedEventId;
                const evReadiness = calculateDelegationReadiness(ev);

                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setSelectedEventId(ev.id);
                      setShowTravelOrder(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                          {ev.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                          {ev.title}
                        </h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          ev.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                            : ev.status === 'dispatched'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]'
                            : ev.status === 'delegation_ready'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]'
                            : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                        }
                      >
                        {ev.status === 'completed'
                          ? 'Completed'
                          : ev.status === 'dispatched'
                          ? 'En Route / At Venue'
                          : ev.status === 'delegation_ready'
                          ? 'Safety Cleared'
                          : 'Drafting Roster'}
                      </Badge>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <School className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.hostSchool}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {ev.eventDate} • {ev.reportingTime}
                        </span>
                      </div>
                    </div>

                    {/* Readiness bar */}
                    {ev.status !== 'completed' && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Parent NOC & Safety Compliance:</span>
                        <span
                          className={`font-semibold ${
                            evReadiness.isReady ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {evReadiness.readinessPercentage}%
                        </span>
                      </div>
                    )}

                    {ev.result && (
                      <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] bg-emerald-50/50 p-1.5 rounded-sm">
                        <span className="text-emerald-800 font-medium flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-amber-600" />
                          {ev.result.trophyWon || 'Podium Finish'}
                        </span>
                        <span className="font-bold text-emerald-900">+{ev.result.points} pts</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Event Detail & Delegation Workspace (Right 7 Cols) */}
            <div className="lg:col-span-7">
              {selectedEvent && (
                <div className="space-y-5">
                  {/* Event Header Banner */}
                  <Card className="border-slate-200 shadow-xs">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <Badge className="bg-slate-100 text-slate-800 border-slate-200 mb-1">
                            {formatCategory(selectedEvent.category)}
                          </Badge>
                          <CardTitle className="text-base font-bold text-slate-900">
                            {selectedEvent.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-600 mt-1">
                            {selectedEvent.clusterName} • {formatAgeGroup(selectedEvent.ageGroup)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setShowTravelOrder(!showTravelOrder)}
                          >
                            <Printer className="h-3.5 w-3.5 mr-1" />
                            {showTravelOrder ? 'Hide Travel Order' : 'Official Travel Order'}
                          </Button>
                          {selectedEvent.status !== 'completed' && (
                            <Button
                              size="sm"
                              className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
                              onClick={() => setShowResultModal(true)}
                            >
                              <Trophy className="h-3.5 w-3.5 mr-1" />
                              Record Podium Result
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {/* Venue, Schedule & Transit Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                        <div>
                          <span className="text-slate-400 font-medium block">Host School & Venue:</span>
                          <span className="font-semibold text-slate-800">{selectedEvent.hostSchool}</span>
                          <span className="text-slate-500 block truncate">{selectedEvent.venueAddress}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Date & Reporting Time:</span>
                          <span className="font-semibold text-slate-800">
                            {selectedEvent.eventDate} at {selectedEvent.reportingTime}
                          </span>
                          <span className="text-slate-500 block">
                            Transport: {selectedEvent.transportMode.replace('_', ' ').toUpperCase()} (
                            {selectedEvent.vehicleNumber || 'Unassigned'})
                          </span>
                        </div>
                      </div>

                      {/* Printable Travel Order Preview */}
                      {showTravelOrder && (
                        <div className="p-4 border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-xl space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                            <div>
                              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                CBSE Sahodaya Delegation Official Travel Authorization & Gate Pass
                              </h4>
                              <p className="text-[10px] text-blue-700">
                                Document ID: VOS-AUTH-{selectedEvent.code} • Signed by Principal
                              </p>
                            </div>
                            <Badge className="bg-blue-600 text-white text-[10px]">Statutory Pass</Badge>
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed">
                            This certifies that the under-signed students and escort teachers are authorized
                            to represent Vidya Mandir Senior Secondary School at the Sahodaya Inter-School Meet
                            hosted by <strong>{selectedEvent.hostSchool}</strong> on{' '}
                            <strong>{selectedEvent.eventDate}</strong>. All parental NOCs and infirmary
                            medical clearances have been verified in accordance with CBSE student safety norms.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-blue-200">
                            <div>
                              <span className="text-slate-500">Lead Teacher Escort:</span>{' '}
                              <span className="font-semibold text-slate-800">
                                {selectedEvent.escorts[0]?.name} ({selectedEvent.escorts[0]?.phone})
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Transport:</span>{' '}
                              <span className="font-semibold text-slate-800">
                                {selectedEvent.vehicleNumber} (Authorized School Transit)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Safety & Compliance Meter */}
                      {readiness && selectedEvent.status !== 'completed' && (
                        <div className="p-3.5 border rounded-lg bg-white space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 text-blue-600" />
                              CBSE Student Off-Campus Safety & Parent Consent Compliance
                            </span>
                            <span
                              className={`font-bold ${
                                readiness.isReady ? 'text-emerald-700' : 'text-amber-600'
                              }`}
                            >
                              {readiness.readinessPercentage}% Compliant
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                readiness.isReady ? 'bg-emerald-600' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, readiness.readinessPercentage))}%` }}
                            />
                          </div>

                          {readiness.isReady ? (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                100% Verified. All NOCs, Medical Clearances & Escort Teachers Assigned.
                              </span>
                              {selectedEvent.status !== 'dispatched' && (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => handleDispatchDelegation(selectedEvent.id)}
                                >
                                  <Bus className="h-3.5 w-3.5 mr-1" />
                                  Dispatch Delegation
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1 pt-1">
                              {readiness.blockingReasons.map((reason, idx) => (
                                <p
                                  key={idx}
                                  className="text-[11px] text-amber-700 flex items-center gap-1"
                                >
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                  {reason}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Delegation Members Roster */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-600" />
                            Student Delegation Roster ({selectedEvent.delegates.length} Students)
                          </h4>
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                              <tr>
                                <th className="p-2.5">Student / Class</th>
                                <th className="p-2.5">Assigned Role</th>
                                <th className="p-2.5">Parent NOC</th>
                                <th className="p-2.5">Infirmary</th>
                                <th className="p-2.5 text-right">Emergency Contact</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedEvent.delegates.map((del) => (
                                <tr key={del.id} className="hover:bg-slate-50/50">
                                  <td className="p-2.5">
                                    <div className="font-semibold text-slate-900">{del.studentName}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      {del.studentId} • {del.grade}-{del.section} ({del.bloodGroup})
                                    </div>
                                  </td>
                                  <td className="p-2.5 text-slate-700 font-medium">{del.role}</td>
                                  <td className="p-2.5">
                                    <button
                                      onClick={() => handleToggleConsent(selectedEvent.id, del.id)}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${
                                        del.parentConsentNOC === 'verified'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : 'bg-amber-50 text-amber-700 border-amber-200'
                                      }`}
                                    >
                                      {del.parentConsentNOC === 'verified' ? (
                                        <>
                                          <CheckCircle2 className="h-3 w-3" /> Verified
                                        </>
                                      ) : (
                                        <>
                                          <AlertTriangle className="h-3 w-3" /> Click to Verify
                                        </>
                                      )}
                                    </button>
                                  </td>
                                  <td className="p-2.5">
                                    <button
                                      onClick={() => handleToggleMedical(selectedEvent.id, del.id)}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${
                                        del.medicalClearance
                                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                                          : 'bg-rose-50 text-rose-700 border-rose-200'
                                      }`}
                                    >
                                      {del.medicalClearance ? 'Fit to Travel' : 'Checkup Pending'}
                                    </button>
                                  </td>
                                  <td className="p-2.5 text-right font-mono text-slate-600 text-[11px]">
                                    {del.emergencyPhone}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Escort Teachers Roster */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
                          Faculty Escorts & Teacher In-Charge
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedEvent.escorts.map((esc) => (
                            <div
                              key={esc.id}
                              className="p-3 border border-slate-200 rounded-lg bg-slate-50/60 flex items-center justify-between"
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                  {esc.name}
                                  {esc.isLeadEscort && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[9px] py-0">
                                      Lead Escort
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  {esc.designation} • {esc.staffId}
                                </div>
                              </div>
                              <div className="text-right">
                                <a
                                  href={`tel:${esc.phone}`}
                                  className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <Phone className="h-3 w-3" />
                                  {esc.phone}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TROPHY STANDINGS & LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Breakdown (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-slate-200 shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Sahodaya Cluster Trophy Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Points contribution by competition vertical
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {Object.entries(trophySummary.categoryBreakdown).map(([cat, pts]) => {
                    const maxPts = 20;
                    const pct = Math.min(100, Math.round((pts / maxPts) * 100));
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 capitalize">
                            {formatCategory(cat as SahodayaCategory)}
                          </span>
                          <span className="font-bold text-slate-900">{pts} pts</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-xs bg-slate-50">
                <CardContent className="p-4 space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-blue-600" />
                    CBSE Sahodaya Point Scoring Matrix
                  </h4>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                    <li>1st Place / Championship Gold Cup: <strong>10 Points</strong></li>
                    <li>2nd Place / Runners-Up Silver Trophy: <strong>7 Points</strong></li>
                    <li>3rd Place / Bronze Trophy: <strong>5 Points</strong></li>
                    <li>Best Delegate / Speaker Commendation: <strong>8 Points</strong></li>
                    <li>Official Delegation Participation: <strong>1 Point</strong></li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Honor Roll of Completed Events (7 Cols) */}
            <div className="lg:col-span-7">
              <Card className="border-slate-200 shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Podium Honors & Trophy Hall of Fame (2026-27)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Officially recorded inter-school medals, citations and laurels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {events
                    .filter((e) => e.result)
                    .map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                ev.result?.position === 'first'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }
                            >
                              {ev.result?.position === 'first'
                                ? '🥇 Champions'
                                : ev.result?.position === 'second'
                                ? '🥈 Runners Up'
                                : '🥉 3rd Position'}
                            </Badge>
                            <span className="text-xs text-slate-500 font-medium">
                              {ev.eventDate}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{ev.title}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Host: {ev.hostSchool} • {ev.result?.trophyWon}
                          </p>
                          <p className="text-[11px] text-slate-500 italic mt-1">"{ev.result?.remarks}"</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xl font-bold text-emerald-600">
                            +{ev.result?.points} Pts
                          </span>
                          <span className="block text-[10px] text-slate-400">Cluster Standing</span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTER NEW EVENT */}
      {activeTab === 'register' && (
        <div className="mt-4">
          <Card className="border-slate-200 shadow-xs max-w-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                Register New Inter-School / Sahodaya Event
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Create event record, initialize delegation roster, and schedule student escort details.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Event Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sahodaya Annual Sanskrit Shloka Chanting Competition"
                    required
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Sahodaya Cluster</label>
                    <Input
                      value={newCluster}
                      onChange={(e) => setNewCluster(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Host School Name</label>
                    <Input
                      value={newHostSchool}
                      onChange={(e) => setNewHostSchool(e.target.value)}
                      placeholder="e.g. Springdales School, Dhaula Kuan"
                      required
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Venue Address</label>
                  <Input
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Benito Juarez Marg, Dhaula Kuan, New Delhi - 110021"
                    required
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Event Date</label>
                    <Input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Reporting Time</label>
                    <Input
                      value={newReportingTime}
                      onChange={(e) => setNewReportingTime(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as SahodayaCategory)}
                      className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                    >
                      <option value="debate">Debate & Oratory</option>
                      <option value="mun">Model United Nations (MUN)</option>
                      <option value="science_robotics">Science & Robotics</option>
                      <option value="sports_cluster">Sports Cluster</option>
                      <option value="cultural_arts">Performing Arts</option>
                      <option value="quiz">Heritage Quiz</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Age Division</label>
                    <select
                      value={newAgeGroup}
                      onChange={(e) => setNewAgeGroup(e.target.value as AgeGroup)}
                      className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                    >
                      <option value="under_12">Sub-Junior (Under 12)</option>
                      <option value="under_14">Junior (Under 14)</option>
                      <option value="under_17">Cadet (Under 17)</option>
                      <option value="under_19">Senior (Under 19)</option>
                      <option value="open">All Grades (Open)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Transit Mode</label>
                    <select
                      value={newTransport}
                      onChange={(e) => setNewTransport(e.target.value as any)}
                      className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                    >
                      <option value="school_bus">School Bus</option>
                      <option value="school_van">Official School Van</option>
                      <option value="direct_parent_drop">Direct Parent Drop-off</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Vehicle No.</label>
                    <Input
                      value={newVehicle}
                      onChange={(e) => setNewVehicle(e.target.value)}
                      placeholder="DL-1P-CB-9082"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Register Event & Open Delegation Roster
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* RECORD RESULT MODAL */}
      {showResultModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Record Podium Finish: {selectedEvent.code}
              </h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Podium Position</label>
                <select
                  value={resPosition}
                  onChange={(e) => setResPosition(e.target.value as any)}
                  className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                >
                  <option value="first">🥇 1st Place / Champions (10 pts)</option>
                  <option value="second">🥈 2nd Place / Runners-up (7 pts)</option>
                  <option value="third">🥉 3rd Place / Bronze (5 pts)</option>
                  <option value="best_delegate">🎖️ Best Delegate / Best Speaker (8 pts)</option>
                  <option value="special_mention">⭐ Special Jury Commendation (3 pts)</option>
                  <option value="participation">📜 Official Participation (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Trophy / Plaque Name</label>
                <Input
                  value={resTrophy}
                  onChange={(e) => setResTrophy(e.target.value)}
                  placeholder="e.g. Sahodaya Parliamentary Champions Trophy"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Jury Remarks & Citation</label>
                <Input
                  value={resRemarks}
                  onChange={(e) => setResRemarks(e.target.value)}
                  placeholder="e.g. Commended by judges for impeccable cross-examination."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowResultModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleSaveResult}
              >
                Save & Update Trophy Tally
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
