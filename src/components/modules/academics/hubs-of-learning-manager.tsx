'use client';

import React, { useState } from 'react';
import {
  Network,
  School,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Plus,
  BookOpen,
  MapPin,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  HubCluster,
  SharedResourceBooking,
  PreBoardModeration,
  TeacherPeerObservation,
  INITIAL_HUB_CLUSTER,
  INITIAL_RESOURCE_BOOKINGS,
  INITIAL_PREBOARD_MODERATIONS,
  INITIAL_PEER_OBSERVATIONS,
  calculateHubCollaborativeScore,
  validatePreBoardBlueprint,
} from '@/modules/academics/hubs-of-learning';

export function HubsOfLearningManager() {
  const [cluster, setCluster] = useState<HubCluster>(INITIAL_HUB_CLUSTER);
  const [bookings, setBookings] = useState<SharedResourceBooking[]>(INITIAL_RESOURCE_BOOKINGS);
  const [moderations, setModerations] = useState<PreBoardModeration[]>(INITIAL_PREBOARD_MODERATIONS);
  const [observations, setObservations] = useState<TeacherPeerObservation[]>(INITIAL_PEER_OBSERVATIONS);
  const [activeTab, setActiveTab] = useState<'network' | 'resources' | 'moderation' | 'observations'>('network');

  // New Resource Booking Form State
  const [reqFacility, setReqFacility] = useState('Advanced ATL Robotics & AI Lab');
  const [reqSchool, setReqSchool] = useState('St. Xavier Public School');
  const [reqDate, setReqDate] = useState('2026-12-10');
  const [reqTimeSlot, setReqTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [reqDelegation, setReqDelegation] = useState(30);
  const [reqPurpose, setReqPurpose] = useState('Hands-on micro-controller sensor experiments.');

  // New Observation Form State
  const [newObsTeacher, setNewObsTeacher] = useState('Dr. Rajesh Sharma');
  const [newHostTeacher, setNewHostTeacher] = useState('Smt. Preeti Grover (DAV Public School)');
  const [newSubject, setNewSubject] = useState('Physics / Science');
  const [newGrade, setNewGrade] = useState('Class 10');
  const [newDomain, setNewDomain] = useState<'inquiry' | 'experiential' | 'art_integrated' | 'tech_blended'>('inquiry');
  const [newReflection, setNewReflection] = useState('Observed student inquiry during ray optics lab demonstrations.');
  const [newBestPractice, setNewBestPractice] = useState('Use of digital ray simulation on smart board before actual bench testing.');

  const vitality = calculateHubCollaborativeScore(cluster, bookings, observations, moderations);

  // Approve booking
  const handleApproveBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'approved' } : b))
    );
  };

  // Complete booking
  const handleCompleteBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'completed' } : b))
    );
  };

  // Create booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: SharedResourceBooking = {
      id: `res-${Date.now().toString().slice(-4)}`,
      facilityName: reqFacility,
      hostSchoolId: 'sch-01',
      hostSchoolName: 'Vidya Mandir Senior Secondary School',
      requestingSchoolId: 'sch-02',
      requestingSchoolName: reqSchool,
      bookingDate: reqDate,
      timeSlot: reqTimeSlot,
      delegationSize: reqDelegation,
      purpose: reqPurpose,
      safetyNOCConfirmed: true,
      status: 'approved',
    };
    setBookings((prev) => [newBooking, ...prev]);
    setActiveTab('resources');
  };

  // Approve Pre-Board moderation
  const handleApproveModeration = (modId: string) => {
    setModerations((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, status: 'approved_for_print' } : m))
    );
  };

  // Submit Observation
  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newObs: TeacherPeerObservation = {
      id: `obs-${Date.now().toString().slice(-4)}`,
      observerTeacherName: newObsTeacher,
      observerSchoolName: 'Vidya Mandir Senior Secondary School',
      hostTeacherName: newHostTeacher,
      hostSchoolName: 'Partner Cluster School',
      subject: newSubject,
      grade: newGrade,
      observationDate: new Date().toISOString().split('T')[0],
      pedagogyDomain: newDomain,
      reflectionNotes: newReflection,
      bestPracticeShared: newBestPractice,
    };
    setObservations((prev) => [newObs, ...prev]);
    setActiveTab('observations');
  };

  return (
    <div className="space-y-6">
      {/* Top Vitality Index Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                HoL Vitality Index
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">{vitality.score}%</h3>
              <p className="text-xs text-blue-700 mt-0.5">Rating: {vitality.rating} Cluster</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Network className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Member Schools
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">
                {cluster.memberSchools.length} Schools
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">Lead: Vidya Mandir (LCS)</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <School className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Shared Lab Bookings
              </p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{bookings.length}</h3>
              <p className="text-xs text-purple-700 mt-0.5">ATL, Biotech & Track</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Joint Pre-Board Papers
              </p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">
                {moderations.filter((m) => m.status === 'approved_for_print').length} Vetted
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">CBSE Standard 30:50:20</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('network')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'network'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Network className="h-4 w-4" />
          Cluster Network & Schools
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Shared Lab & Facility Pooling
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'moderation'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Joint Pre-Board Moderation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('observations')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'observations'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          Faculty Peer Observations
        </button>
      </div>

      {/* TAB 1: CLUSTER NETWORK & MEMBER SCHOOLS */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-1">
                    {cluster.clusterCode} • {cluster.cbseRegion}
                  </Badge>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {cluster.clusterName}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 mt-0.5">
                    Lead Collaborator School (LCS): {cluster.leadSchoolName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs py-1">
                    ✓ {cluster.quarterlyMeetingCount}/4 Quarterly Meetings Held
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cluster.memberSchools.map((sch) => (
                  <div
                    key={sch.id}
                    className={`p-4 rounded-xl border transition-all ${
                      sch.role === 'lead_collaborator'
                        ? 'border-blue-300 bg-blue-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <School className="h-4 w-4 text-slate-600 shrink-0" />
                          {sch.schoolName}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                          CBSE Affiliation No: {sch.cbseAffiliationNo}
                        </span>
                      </div>
                      <Badge
                        className={
                          sch.role === 'lead_collaborator'
                            ? 'bg-blue-600 text-white text-[10px]'
                            : 'bg-slate-100 text-slate-700 border-slate-200 text-[10px]'
                        }
                      >
                        {sch.role === 'lead_collaborator' ? 'Lead LCS' : 'Partner School'}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Principal:</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {sch.principalName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Distance from LCS:</span>
                        <span className="font-semibold text-slate-800">
                          {sch.distanceKm === 0 ? 'Campus Base' : `${sch.distanceKm} km`}
                        </span>
                      </div>
                      <div className="col-span-2 text-[11px] text-slate-500">
                        {sch.contactEmail} • {sch.contactPhone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: SHARED LABS & FACILITY POOLING */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Inter-School Infrastructure Sharing Requests
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-slate-200 shadow-xs">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-1">
                    <Badge
                      className={
                        booking.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                          : booking.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 border-blue-200 text-[10px]'
                          : 'bg-amber-100 text-amber-800 border-amber-200 text-[10px]'
                      }
                    >
                      {booking.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{booking.bookingDate}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 mt-1">
                    {booking.facilityName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-xs space-y-2">
                  <div className="p-2 bg-slate-50 rounded text-[11px] space-y-1">
                    <div>
                      <span className="text-slate-400">Host Campus:</span>{' '}
                      <strong>{booking.hostSchoolName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Visiting School:</span>{' '}
                      <strong>{booking.requestingSchoolName}</strong> ({booking.delegationSize} Students)
                    </div>
                    <div>
                      <span className="text-slate-400">Time:</span> {booking.timeSlot}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    "{booking.purpose}"
                  </p>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t">
                    {booking.status === 'requested' && (
                      <Button
                        size="sm"
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7"
                        onClick={() => handleApproveBooking(booking.id)}
                      >
                        Approve Booking
                      </Button>
                    )}
                    {booking.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 text-blue-700 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Request booking form */}
          <Card className="border-slate-200 shadow-xs max-w-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-blue-600" />
                Schedule Shared Facility Access
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Facility Name</label>
                  <select
                    value={reqFacility}
                    onChange={(e) => setReqFacility(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                  >
                    <option value="Advanced ATL Robotics & AI Lab">Advanced ATL Robotics & AI Lab (Vidya Mandir)</option>
                    <option value="Biotech Chromatography Lab">Biotech Chromatography Lab (Vidya Mandir)</option>
                    <option value="Olympic Synthetic 400m Track">Olympic Synthetic 400m Track (KV Cantt)</option>
                    <option value="All-Weather Acoustic Auditorium">Central 1200-Seat Auditorium (St. Xavier)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Visiting School</label>
                    <select
                      value={reqSchool}
                      onChange={(e) => setReqSchool(e.target.value)}
                      className="w-full text-xs rounded-md border border-slate-200 bg-white p-2"
                    >
                      <option value="St. Xavier Public School">St. Xavier Public School</option>
                      <option value="DAV Centenary Public School">DAV Centenary Public School</option>
                      <option value="Kendriya Vidyalaya No. 2, Cantt">Kendriya Vidyalaya No. 2, Cantt</option>
                      <option value="Tagore International Modern School">Tagore International Modern School</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Delegation Size</label>
                    <Input
                      type="number"
                      min={5}
                      max={60}
                      value={reqDelegation}
                      onChange={(e) => setReqDelegation(parseInt(e.target.value) || 20)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                    <Input
                      type="date"
                      value={reqDate}
                      onChange={(e) => setReqDate(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
                    <Input
                      value={reqTimeSlot}
                      onChange={(e) => setReqTimeSlot(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  Submit Facility Sharing Reservation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: JOINT PRE-BOARD MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-500" />
                Joint Pre-Board Question Paper Moderation & Blueprint Vetting
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Peer school question paper standardization enforcing CBSE 30% Easy, 50% Average, 20% HOTS difficulty balance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {moderations.map((mod) => {
                  const bp = validatePreBoardBlueprint(mod.difficultyDistribution);
                  return (
                    <div
                      key={mod.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <Badge variant="outline" className="bg-slate-50 text-[10px]">
                            {mod.boardClass}
                          </Badge>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{mod.subject}</h4>
                        </div>
                        <Badge
                          className={
                            mod.status === 'approved_for_print'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]'
                              : 'bg-amber-100 text-amber-800 border-amber-300 text-[10px]'
                          }
                        >
                          {mod.status === 'approved_for_print' ? '✓ Vetted & Approved' : 'In Moderation'}
                        </Badge>
                      </div>

                      {/* Difficulty distribution breakdown */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Difficulty Curve:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {mod.difficultyDistribution.easyPercentage}% Easy :{' '}
                            {mod.difficultyDistribution.averagePercentage}% Avg :{' '}
                            {mod.difficultyDistribution.hotsPercentage}% HOTS
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          <div
                            style={{ width: `${mod.difficultyDistribution.easyPercentage}%` }}
                            className="bg-emerald-500 h-2"
                            title="Easy (Knowledge/Recall)"
                          />
                          <div
                            style={{ width: `${mod.difficultyDistribution.averagePercentage}%` }}
                            className="bg-blue-500 h-2"
                            title="Average (Application/Analysis)"
                          />
                          <div
                            style={{ width: `${mod.difficultyDistribution.hotsPercentage}%` }}
                            className="bg-purple-500 h-2"
                            title="HOTS (Evaluation/Creation)"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 italic">"{mod.moderationRemarks}"</p>

                      <div className="pt-2 border-t flex items-center justify-between text-[10px] text-slate-500">
                        <span>{mod.moderatorSchools.length} Schools in Committee</span>
                        {mod.status !== 'approved_for_print' && (
                          <Button
                            size="sm"
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7"
                            onClick={() => handleApproveModeration(mod.id)}
                          >
                            Approve for Print
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: FACULTY PEER OBSERVATIONS */}
      {activeTab === 'observations' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Inter-School Teacher Peer Observations & Lesson Study Exchange
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Collaborative professional learning community observing classroom pedagogical practices across cluster schools
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-purple-700 uppercase">
                          {obs.pedagogyDomain.replace('_', ' ')} Pedagogy
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {obs.subject} ({obs.grade})
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400">{obs.observationDate}</span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded text-[11px] space-y-0.5">
                      <div>
                        <span className="text-slate-400">Observer:</span>{' '}
                        <strong>{obs.observerTeacherName}</strong> ({obs.observerSchoolName})
                      </div>
                      <div>
                        <span className="text-slate-400">Host Class:</span>{' '}
                        <strong>{obs.hostTeacherName}</strong> ({obs.hostSchoolName})
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      <strong>Observation Notes:</strong> {obs.reflectionNotes}
                    </p>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      💡 <strong>Best Practice Adopted:</strong> {obs.bestPracticeShared}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
