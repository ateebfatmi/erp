'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  Bus,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  Printer,
  PlusCircle,
  FileText,
  AlertTriangle,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';
import {
  ConsentCampaign,
  StudentConsentRecord,
  INITIAL_CONSENT_CAMPAIGNS,
  INITIAL_STUDENT_CONSENTS,
  recordParentalConsent,
  calculateConsentManifestSummary,
  getAuthorizedPassengerManifest,
} from '@/modules/communication/consent';

interface Props {
  role?: 'parent' | 'admin';
  studentId?: string;
}

export function ParentConsentManager({ role = 'parent', studentId = 'stu-01' }: Props) {
  const [campaigns] = useState<ConsentCampaign[]>(INITIAL_CONSENT_CAMPAIGNS);
  const [records, setRecords] = useState<StudentConsentRecord[]>(INITIAL_STUDENT_CONSENTS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0].id);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'manifest'>('campaigns');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Parent Consent Modal/Drawer State
  const [actingCampaign, setActingCampaign] = useState<ConsentCampaign | null>(null);
  const [decisionType, setDecisionType] = useState<'GRANTED' | 'DECLINED'>('GRANTED');
  const [parentName, setParentName] = useState<string>('Mr. Rajesh Mehta');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+91 98101 23456');
  const [medicalNotes, setMedicalNotes] = useState<string>('Carry personal asthma inhaler in bag');

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const manifestSummary = calculateConsentManifestSummary(records, selectedCampaign.id);
  const authorizedManifest = getAuthorizedPassengerManifest(records, selectedCampaign.id);

  const handleOpenDecision = (campaign: ConsentCampaign, decision: 'GRANTED' | 'DECLINED') => {
    setActingCampaign(campaign);
    setDecisionType(decision);
  };

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actingCampaign) return;

    const updated = recordParentalConsent(
      records,
      actingCampaign.id,
      studentId,
      decisionType,
      parentName,
      emergencyPhone,
      medicalNotes
    );

    setRecords(updated);
    setFeedback(
      decisionType === 'GRANTED'
        ? `Digital consent granted for "${actingCampaign.title}"! Student seat reserved on excursion bus.`
        : `Decline recorded for "${actingCampaign.title}". Child will remain on campus in supervised study hall.`
    );
    setActingCampaign(null);
    setTimeout(() => setFeedback(null), 5000);
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

      {/* Admin Mode Controls & Manifest Tab Switcher */}
      {role === 'admin' && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="h-4 w-4" />
            Excursion Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'manifest'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="h-4 w-4" />
            Authorized Passenger Manifest ({authorizedManifest.length})
          </button>
        </div>
      )}

      {/* VIEW 1: CAMPAIGNS LIST (FOR PARENTS & ADMINS) */}
      {(role === 'parent' || activeTab === 'campaigns') && (
        <div className="space-y-6">
          {/* Campaign Selector / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((camp) => {
              const myRecord = records.find(
                (r) => r.campaignId === camp.id && r.studentId === studentId
              );
              const isSelected = camp.id === selectedCampaignId;

              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {camp.category}
                    </Badge>
                    {myRecord?.status === 'GRANTED' ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                        Consent Granted
                      </Badge>
                    ) : myRecord?.status === 'DECLINED' ? (
                      <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px]">
                        Declined
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                        Action Required
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2 line-clamp-2">
                    {camp.title}
                  </h4>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {camp.eventDate}
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {camp.costInr > 0 ? `₹${camp.costInr}` : 'Free'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Campaign View */}
          <Card className="border-slate-300 shadow-md bg-white overflow-hidden">
            <div className="bg-slate-900 text-white p-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white border-0 text-[10px]">
                  {selectedCampaign.category}
                </Badge>
                <span className="text-xs text-slate-300">
                  Target Classes: {selectedCampaign.targetClasses.join(', ')}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">{selectedCampaign.title}</h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {selectedCampaign.description}
              </p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Event Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[11px] font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    Excursion Date & Time
                  </span>
                  <div className="font-bold text-slate-900">{selectedCampaign.eventDate}</div>
                  <div className="text-slate-600 text-[11px] font-mono">
                    Departure: {selectedCampaign.reportingTime}
                  </div>
                  <div className="text-slate-600 text-[11px] font-mono">
                    Return: {selectedCampaign.returnTime}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[11px] font-medium flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-600" />
                    Excursion Destination
                  </span>
                  <div className="font-bold text-slate-900">{selectedCampaign.destination}</div>
                  <div className="text-slate-600 text-[11px]">
                    Deluxe AC Coach Transport (AIS-140 GPS Monitored)
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[11px] font-medium flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    Faculty In-Charge
                  </span>
                  <div className="font-bold text-slate-900">
                    {selectedCampaign.facultyInCharge}
                  </div>
                  <a
                    href={`tel:${selectedCampaign.facultyPhone}`}
                    className="font-mono text-blue-600 font-bold block hover:underline"
                  >
                    {selectedCampaign.facultyPhone}
                  </a>
                </div>
              </div>

              {/* Inclusions & Safety Protocols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Tour Inclusions & Refreshments
                  </h4>
                  <ul className="space-y-1 text-slate-700">
                    {selectedCampaign.inclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                    Safety, POCSO & First Aid Protocol
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedCampaign.safetyProtocol}
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium pt-1 border-t border-amber-200">
                    Consent Deadline: {selectedCampaign.deadlineDate}
                  </p>
                </div>
              </div>

              {/* Parent Action Panel */}
              {role === 'parent' && (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Parent Authorization & Digital Consent Status
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Student: <strong className="text-slate-800">Aarav Mehta</strong> (DPGA/2021/1042 &bull; Class 10-A)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleOpenDecision(selectedCampaign, 'GRANTED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Grant Digital Consent
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDecision(selectedCampaign, 'DECLINED')}
                      className="border-slate-300 text-rose-700 hover:bg-rose-50 text-xs flex items-center gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Decline Participation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* VIEW 2: AUTHORIZED PASSENGER MANIFEST (FOR ADMINS & TEACHERS) */}
      {role === 'admin' && activeTab === 'manifest' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bus className="h-4 w-4 text-blue-600" />
                  Official Excursion Passenger Manifest & Boarding Roster
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {selectedCampaign.title} &bull; Only students with verified digital parental consent.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="border-slate-300 text-xs flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-600" />
                  Print Bus Passenger Manifest
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Manifest Stat Counter Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Total Eligible Cohort</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {manifestSummary.totalStudents} Students
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 block text-[10px]">Consent Granted (Seated)</span>
                <span className="text-lg font-bold font-mono text-emerald-950">
                  {manifestSummary.grantedCount}
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-rose-800 block text-[10px]">Declined (Study Hall)</span>
                <span className="text-lg font-bold font-mono text-rose-950">
                  {manifestSummary.declinedCount}
                </span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-amber-800 block text-[10px]">Consent Pending</span>
                <span className="text-lg font-bold font-mono text-amber-950">
                  {manifestSummary.pendingCount}
                </span>
              </div>
            </div>

            {/* Passenger Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Seat #</th>
                    <th className="py-3 px-4">Student Name & Adm No</th>
                    <th className="py-3 px-4">Class & Roll</th>
                    <th className="py-3 px-4">Consenting Guardian</th>
                    <th className="py-3 px-4">Emergency Contact</th>
                    <th className="py-3 px-4">Special Medical Notes</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {authorizedManifest.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No students have granted digital consent yet for this excursion.
                      </td>
                    </tr>
                  ) : (
                    authorizedManifest.map((pass, idx) => (
                      <tr key={pass.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          Seat {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{pass.studentName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {pass.admissionNo}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {pass.classSection} (Roll: {pass.rollNo})
                        </td>
                        <td className="py-3 px-4 text-slate-800">{pass.parentName || '—'}</td>
                        <td className="py-3 px-4 font-mono text-blue-600 font-semibold">
                          {pass.emergencyPhone || '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 italic">
                          {pass.specialMedicalNotes || 'None reported'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                            Boarding Approved
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PARENT CONSENT SIGN-OFF MODAL / DRAWER */}
      {actingCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg border-slate-200 shadow-xl bg-white animate-in fade-in-50 zoom-in-95">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                {decisionType === 'GRANTED'
                  ? 'Digital Parental Consent Declaration'
                  : 'Decline Excursion Participation'}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {actingCampaign.title} &bull; {actingCampaign.eventDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveDecision} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Parent / Legal Guardian Full Name
                  </label>
                  <Input
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Emergency Contact Number (During Excursion Hours)
                  </label>
                  <Input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {decisionType === 'GRANTED'
                      ? 'Special Medical Declarations or Food Allergies'
                      : 'Reason for Declining Participation'}
                  </label>
                  <Input
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    placeholder={
                      decisionType === 'GRANTED'
                        ? 'e.g. Needs motion sickness pill, lactose intolerant...'
                        : 'e.g. Prior family commitment...'
                    }
                    className="text-xs"
                  />
                </div>

                {decisionType === 'GRANTED' && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
                    <p className="leading-relaxed">
                      I hereby authorize my ward to participate in this official school excursion. I confirm that all medical and emergency details provided are authentic.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs border-slate-300"
                    onClick={() => setActingCampaign(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={`text-xs font-medium text-white ${
                      decisionType === 'GRANTED'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {decisionType === 'GRANTED'
                      ? 'Sign & Grant Digital Consent'
                      : 'Confirm Decline'}
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
