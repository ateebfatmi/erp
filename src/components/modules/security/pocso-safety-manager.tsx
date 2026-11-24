'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  FileCheck,
  AlertTriangle,
  PhoneCall,
  Lock,
  PlusCircle,
  CheckCircle2,
  Printer,
  Clock,
  EyeOff,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  CpcMember,
  SafetyIncidentReport,
  SafetyAuditItem,
  SafetyIncidentType,
  IncidentSeverity,
  INITIAL_CPC_MEMBERS,
  INITIAL_SAFETY_INCIDENTS,
  INITIAL_SAFETY_CHECKLIST,
  fileSafetyIncident,
  updateIncidentStatus,
  evaluateCampusSafetyScore,
} from '@/modules/security/pocso-safety';

interface PocsoSafetyManagerProps {
  role?: 'admin' | 'parent';
}

const SEVERITY_BADGES: Record<IncidentSeverity, { label: string; badge: string }> = {
  LOW: { label: 'Low', badge: 'bg-slate-100 text-slate-800 border-slate-200' },
  MEDIUM: { label: 'Medium', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  HIGH: { label: 'High', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  CRITICAL_MANDATORY_REPORTING: { label: 'Critical (24h Mandatory)', badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
};

export function PocsoSafetyManager({ role = 'admin' }: PocsoSafetyManagerProps) {
  const [activeTab, setActiveTab] = useState<'committee' | 'incidents' | 'audit'>('committee');
  const [members] = useState<CpcMember[]>(INITIAL_CPC_MEMBERS);
  const [incidents, setIncidents] = useState<SafetyIncidentReport[]>(INITIAL_SAFETY_INCIDENTS);
  const [checklist, setChecklist] = useState<SafetyAuditItem[]>(INITIAL_SAFETY_CHECKLIST);

  // New Incident Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<SafetyIncidentType>('BULLYING_AND_HARASSMENT');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [complainantName, setComplainantName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Resolution Action Modal State
  const [resolvingIncident, setResolvingIncident] = useState<SafetyIncidentReport | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const auditScore = evaluateCampusSafetyScore(checklist);

  const handleFileReport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newReport = fileSafetyIncident({
        incidentType,
        severity,
        isAnonymous,
        complainantName: isAnonymous ? undefined : complainantName,
        complainantRole: role === 'parent' ? 'PARENT' : 'TEACHER',
        studentAffectedName: studentName || undefined,
        incidentDate: new Date().toISOString().split('T')[0],
        incidentLocation: location,
        narrativeDescription: description,
      });

      setIncidents((prev) => [newReport, ...prev]);
      setIsReportModalOpen(false);
      setDescription('');
      setLocation('');
      setNotification(`Confidential Safety Concern logged (Ref: ${newReport.id}). Handled under strict POCSO privacy protocols.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to file report');
    }
  };

  const handleResolveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIncident) return;

    setIncidents((prev) =>
      updateIncidentStatus(
        prev,
        resolvingIncident.id,
        'ACTION_TAKEN_RESOLVED',
        actionNotes
      )
    );
    setResolvingIncident(null);
    setActionNotes('');
    setNotification(`Incident ${resolvingIncident.id} resolved and archived.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500 text-white font-mono text-[10px] font-bold">
                POCSO Act 2012 &bull; CBSE Acad-05/2017
              </Badge>
              <Badge className="bg-emerald-500/80 text-white text-[10px] font-semibold">
                Supreme Court Safety Compliance
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              Child Protection Committee (CPC) & Campus Safety Desk
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Statutory institutional committee ensuring zero-tolerance towards child abuse, bullying, corporal punishment, and physical hazards. Mandates 24-hour statutory action.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
              className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs text-xs font-semibold"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Confidential Concern</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Safety Audit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statutory Emergency Helplines Bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <PhoneCall className="h-4 w-4 text-amber-700" />
          <span>Statutory National Emergency Helplines:</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] font-semibold">
          <span><strong>Childline:</strong> 1098</span>
          <span><strong>National Emergency:</strong> 112</span>
          <span><strong>Women Helpline:</strong> 1091</span>
          <span><strong>School Security SOS:</strong> +91 98110 01199</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('committee')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'committee'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          Child Protection Committee (CPC) Composition
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('incidents')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'incidents'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Confidential Grievance & Incident Ledger ({incidents.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          Supreme Court & CBSE Safety Audit Checklist
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {auditScore.scorePercentage}% Compliant
          </span>
        </button>
      </div>

      {/* TAB 1: COMMITTEE COMPOSITION */}
      {activeTab === 'committee' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                Statutory Child Protection Committee (CPC) Members &bull; Tenure 2024-26
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Formed per CBSE Circular Acad-05/2017 comprising School Leadership, Female Faculty, Psychologist, PTA, and Police CWPO.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{member.name}</span>
                      <Badge variant="outline" className="text-[10px] bg-slate-50">
                        {member.role.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-600 block mt-0.5">{member.designation}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>{member.contactEmail}</span>
                    <span className="font-semibold text-slate-800">{member.contactPhone}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: CONFIDENTIAL INCIDENT LEDGER */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Child Protection Incident & Whistleblower Ledger
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Encrypted grievance logs with 24-hour statutory response tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {incidents.map((inc) => {
                  const sev = SEVERITY_BADGES[inc.severity];
                  return (
                    <div key={inc.id} className="p-5 space-y-3 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {inc.id}
                          </span>
                          <Badge className={`text-[10px] ${sev.badge}`}>
                            {sev.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {inc.incidentType.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={inc.status === 'ACTION_TAKEN_RESOLVED' ? 'success' : 'destructive'}
                            className="text-[10px]"
                          >
                            {inc.status.replace(/_/g, ' ')}
                          </Badge>
                          {role === 'admin' && inc.status !== 'ACTION_TAKEN_RESOLVED' && (
                            <Button
                              size="sm"
                              onClick={() => setResolvingIncident(inc)}
                              className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            >
                              Action & Close
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span>
                            <strong>Complainant:</strong> {inc.complainantName} ({inc.complainantRole})
                          </span>
                          <span>
                            <strong>Location:</strong> {inc.incidentLocation} &bull; Date: {inc.incidentDate}
                          </span>
                        </div>
                        <p className="leading-relaxed">{inc.narrativeDescription}</p>
                      </div>

                      {inc.committeeActionNotes && (
                        <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                          <span className="font-bold block mb-0.5">Committee Action & Resolution:</span>
                          {inc.committeeActionNotes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: SAFETY AUDIT CHECKLIST */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  Quarterly Campus Safety & Security Audit Checklist
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Supreme Court Guidelines & CBSE Affiliation Security Protocol Verification
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs font-mono">
                {auditScore.compliantChecks} / {auditScore.totalChecks} Standards Met
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {checklist.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">{item.checkTitle}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{item.mandatoryStandard}</p>
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                        Auditor Note: {item.auditorNotes}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge variant={item.isCompliant ? 'success' : 'destructive'} className="text-[10px]">
                        {item.isCompliant ? 'COMPLIANT' : 'DEFICIENT'}
                      </Badge>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Audited: {item.lastAuditedDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confidential Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  File Confidential Child Safety Concern
                </h3>
                <p className="text-xs text-slate-500">
                  Handled strictly under Child Protection Committee (CPC) & POCSO confidentiality rules.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFileReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nature of Concern *:
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value as SafetyIncidentType)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="BULLYING_AND_HARASSMENT">Bullying & Peer Harassment</option>
                    <option value="POCSO_INAPPROPRIATE_TOUCH_OR_BEHAVIOR">POCSO / Inappropriate Behavior</option>
                    <option value="CORPORAL_PUNISHMENT">Corporal Punishment Concern</option>
                    <option value="CYBER_SAFETY_AND_DIGITAL_ABUSE">Cyber Safety & Online Abuse</option>
                    <option value="CAMPUS_INFRASTRUCTURE_HAZARD">Campus Infrastructure Hazard</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Severity Level *:
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="LOW">Low (Minor friction/hazard)</option>
                    <option value="MEDIUM">Medium (Repeated bullying)</option>
                    <option value="HIGH">High (Urgent intervention)</option>
                    <option value="CRITICAL_MANDATORY_REPORTING">Critical (Statutory 24h Escalation)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="anon-check"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="anon-check" className="text-xs font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                  Keep Report 100% Anonymous (Identity Withheld)
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Your Name *:
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="Complainant Name"
                      value={complainantName}
                      onChange={(e) => setComplainantName(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Student Affected (Optional):
                    </label>
                    <Input
                      type="text"
                      placeholder="Student Name / Grade"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Specific Location on Campus *:
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Bus No. 4, Middle Wing Corridor, Computer Lab 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Narrative Description of What Transpired *:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the sequence of events, individuals involved, approximate time, and immediate context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 bg-white"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Minimum 20 characters. This report will be encrypted and submitted directly to the Child Protection Committee.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 cursor-pointer text-xs font-semibold"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Submit to Committee</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Record Committee Action & Close Incident &ndash; {resolvingIncident.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Document the inquiry findings, counseling notes, and protective measures taken.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResolvingIncident(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleResolveIncident} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Committee Resolution & Action Taken Notes *:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Parental conference held with Dr. Radhika Sen. Zero-tolerance policy reiterated. Ongoing check-ins scheduled with class teacher."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResolvingIncident(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Archive as Resolved</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
