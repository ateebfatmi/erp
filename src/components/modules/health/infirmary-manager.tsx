'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Stethoscope,
  Eye,
  Thermometer,
  ShieldAlert,
  Send,
  UserCheck,
  FileText,
} from 'lucide-react';
import {
  StudentHealthCard,
  InfirmaryVisitRecord,
  TriageLevel,
  calculateBmiAndCategory,
  evaluateInfirmaryTriage,
  aggregateSchoolHealthIndicators,
} from '@/modules/health/infirmary';

const INITIAL_HEALTH_CARDS: StudentHealthCard[] = [
  {
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    admissionNo: 'DPS-2024-0412',
    gradeSection: 'Grade 10-A',
    gender: 'MALE',
    dob: '2009-04-12',
    bloodGroup: 'O+',
    heightCm: 165,
    weightKg: 55,
    bmi: 20.2,
    bmiCategory: 'HEALTHY_WEIGHT',
    visionLeft: '6/6',
    visionRight: '6/6',
    wearsGlasses: false,
    dentalHygiene: 'NORMAL',
    chronicConditions: [],
    emergencyContact: { name: 'Sanjay Mehta (Father)', relationship: 'Father', phone: '+91 98110 12345' },
    lastCheckedDate: '2024-10-15',
  },
  {
    studentId: 'std-102',
    studentName: 'Ananya Deshmukh',
    admissionNo: 'DPS-2024-0413',
    gradeSection: 'Grade 10-A',
    gender: 'FEMALE',
    dob: '2009-08-20',
    bloodGroup: 'B+',
    heightCm: 158,
    weightKg: 48,
    bmi: 19.2,
    bmiCategory: 'HEALTHY_WEIGHT',
    visionLeft: '6/9',
    visionRight: '6/9',
    wearsGlasses: true,
    dentalHygiene: 'NORMAL',
    chronicConditions: ['Dust Allergy'],
    emergencyContact: { name: 'Dr. Sunita Deshmukh', relationship: 'Mother', phone: '+91 98220 54321' },
    lastCheckedDate: '2024-10-15',
  },
  {
    studentId: 'std-105',
    studentName: 'Kabir Khan',
    admissionNo: 'DPS-2024-0416',
    gradeSection: 'Grade 10-A',
    gender: 'MALE',
    dob: '2009-02-14',
    bloodGroup: 'AB+',
    heightCm: 170,
    weightKg: 52,
    bmi: 18.0,
    bmiCategory: 'UNDERWEIGHT',
    visionLeft: '6/6',
    visionRight: '6/6',
    wearsGlasses: false,
    dentalHygiene: 'NORMAL',
    chronicConditions: ['Asthma (Mild Exercise-Induced)'],
    emergencyContact: { name: 'Tariq Khan (Father)', relationship: 'Father', phone: '+91 98223 45678' },
    lastCheckedDate: '2024-10-15',
  },
];

const INITIAL_VISITS: InfirmaryVisitRecord[] = [
  {
    visitId: 'OPD-2024-089',
    studentId: 'std-105',
    studentName: 'Kabir Khan',
    gradeSection: 'Grade 10-A',
    timestamp: '2024-11-25T10:15:00+05:30',
    chiefComplaint: 'Mild wheezing after 800m sprint in PE period',
    temperatureF: 98.6,
    pulseRateBpm: 88,
    triageLevel: 'MODERATE_OBSERVATION',
    firstAidGiven: 'Salbutamol inhaler 2 puffs administered, 30 mins rest in Bed #2',
    attendingNurse: 'Nurse Sarojini Devi (RN)',
    bedAssigned: 'Infirmary Bed #2',
    parentNotified: true,
    status: 'UNDER_OBSERVATION',
    dischargeNotes: 'Resting comfortably; vital signs stable.',
  },
  {
    visitId: 'OPD-2024-088',
    studentId: 'std-102',
    studentName: 'Ananya Deshmukh',
    gradeSection: 'Grade 10-A',
    timestamp: '2024-11-25T09:05:00+05:30',
    chiefComplaint: 'Throbbing frontal headache during math class',
    temperatureF: 98.4,
    pulseRateBpm: 76,
    triageLevel: 'ROUTINE',
    firstAidGiven: 'Paracetamol 250mg oral, glass of electrolyte water, 20 min rest',
    attendingNurse: 'Nurse Sarojini Devi (RN)',
    parentNotified: false,
    status: 'DISCHARGED_TO_CLASS',
    dischargeNotes: 'Headache subsided; resumed classroom lectures.',
  },
];

export function InfirmaryManager() {
  const [activeTab, setActiveTab] = useState<'OPD' | 'HEALTH_CARDS'>('OPD');
  const [visits, setVisits] = useState<InfirmaryVisitRecord[]>(INITIAL_VISITS);
  const [healthCards, setHealthCards] = useState<StudentHealthCard[]>(INITIAL_HEALTH_CARDS);
  const [showLogModal, setShowLogModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('std-101');
  const [complaint, setComplaint] = useState('');
  const [temperature, setTemperature] = useState('98.6');
  const [pulse, setPulse] = useState('78');
  const [firstAid, setFirstAid] = useState('');

  const stats = aggregateSchoolHealthIndicators(healthCards);
  const underObservationCount = visits.filter((v) => v.status === 'UNDER_OBSERVATION').length;

  const handleLogVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = healthCards.find((h) => h.studentId === selectedStudentId);
    if (!student) return;

    const tempNum = parseFloat(temperature) || 98.6;
    const triageEval = evaluateInfirmaryTriage(complaint, tempNum, student.chronicConditions);

    const newVisit: InfirmaryVisitRecord = {
      visitId: `OPD-2024-${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.studentId,
      studentName: student.studentName,
      gradeSection: student.gradeSection,
      timestamp: new Date().toISOString(),
      chiefComplaint: complaint,
      temperatureF: tempNum,
      pulseRateBpm: parseInt(pulse) || 75,
      triageLevel: triageEval.triage,
      firstAidGiven: firstAid || 'Rest provided under observation',
      attendingNurse: 'Nurse Sarojini Devi (RN)',
      parentNotified: triageEval.requiresImmediateParentCall,
      status: triageEval.triage === 'ROUTINE' ? 'DISCHARGED_TO_CLASS' : 'UNDER_OBSERVATION',
    };

    setVisits([newVisit, ...visits]);
    setFeedback(`Infirmary record logged for ${student.studentName}. ${triageEval.requiresImmediateParentCall ? 'Urgent parent intimation SMS dispatched.' : 'Discharged to class.'}`);
    setShowLogModal(false);
    setComplaint('');
    setFirstAid('');

    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Logged</Badge>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-600" />
            School Infirmary & Student Health Clinic
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory CBSE Health &amp; Physical Activity Cards (Circular Acad-10/2019), live OPD emergency triage, and prescription records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowLogModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Clinic Visit
          </Button>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Visits Today</p>
              <p className="text-xl font-bold text-slate-900">{visits.length} Students</p>
              <p className="text-[10px] text-slate-500">OPD Day Register</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${underObservationCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Under Observation</p>
              <p className="text-xl font-bold text-slate-900">{underObservationCount} In Rest Bay</p>
              <p className="text-[10px] text-slate-500">4 Infirmary Beds Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Thermometer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Healthy Weight Index</p>
              <p className="text-xl font-bold text-slate-900">{stats.healthyWeightPercent}%</p>
              <p className="text-[10px] text-slate-500">WHO / IAP Pediatric Norms</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Vision Screened</p>
              <p className="text-xl font-bold text-slate-900">{stats.spectaclesPercent}% Specs</p>
              <p className="text-[10px] text-slate-500">Snellen 6/6 Chart Audited</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('OPD')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'OPD'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="h-4 w-4" />
          Live Clinic OPD Day Register ({visits.length})
        </button>

        <button
          onClick={() => setActiveTab('HEALTH_CARDS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'HEALTH_CARDS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4" />
          CBSE Health Cards Directory ({healthCards.length})
        </button>
      </div>

      {/* TAB 1: OPD LOG */}
      {activeTab === 'OPD' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Daily Clinic Register &amp; Triage Stream
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                School day outpatient visits, medical complaints, and nurse treatments.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              AY 2024-25
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Student Name &amp; Section</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Chief Symptoms</th>
                    <th className="py-2.5 px-3 text-center">Temp (°F)</th>
                    <th className="py-2.5 px-3">Triage</th>
                    <th className="py-2.5 px-3">Treatment / Care</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.map((v) => (
                    <tr key={v.visitId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{v.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{v.gradeSection} &bull; {v.visitId}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium max-w-xs truncate">
                        {v.chiefComplaint}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {v.temperatureF}°F
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={v.triageLevel === 'EMERGENCY_TRANSFER' ? 'destructive' : v.triageLevel === 'MODERATE_OBSERVATION' ? 'warning' : 'outline'}
                          className="text-[10px]"
                        >
                          {v.triageLevel.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {v.firstAidGiven}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={v.status === 'UNDER_OBSERVATION' ? 'warning' : 'success'}
                          className="text-[10px]"
                        >
                          {v.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: CBSE HEALTH CARDS */}
      {activeTab === 'HEALTH_CARDS' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                CBSE Mandatory Health &amp; Physical Activity Cards
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official biometric parameters, blood group registry, and chronic condition markers.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Student &amp; Adm No</th>
                    <th className="py-2.5 px-3">Blood Group</th>
                    <th className="py-2.5 px-3">Height / Weight</th>
                    <th className="py-2.5 px-3">BMI Index</th>
                    <th className="py-2.5 px-3">Vision (L/R)</th>
                    <th className="py-2.5 px-3">Chronic Markers</th>
                    <th className="py-2.5 px-3">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {healthCards.map((c) => (
                    <tr key={c.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{c.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.admissionNo} &bull; {c.gradeSection}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="font-mono font-bold text-rose-700 bg-rose-50 border-rose-200">
                          {c.bloodGroup}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {c.heightCm} cm &bull; {c.weightKg} kg
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{c.bmi}</span>
                        <Badge variant={c.bmiCategory === 'HEALTHY_WEIGHT' ? 'success' : 'warning'} className="text-[9px] py-0">
                          {c.bmiCategory.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {c.visionLeft} / {c.visionRight}
                        {c.wearsGlasses && <span className="text-[10px] text-indigo-600 block">(Glasses)</span>}
                      </td>
                      <td className="py-3 px-3">
                        {c.chronicConditions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.chronicConditions.map((cond, i) => (
                              <Badge key={i} variant="destructive" className="text-[9px] py-0">
                                {cond}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None reported</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium block">{c.emergencyContact.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{c.emergencyContact.phone}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal / Form */}
      {showLogModal && (
        <Card className="border-rose-200 bg-rose-50/20 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <CardHeader className="p-4 border-b border-rose-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-rose-950 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-rose-600" />
                Log Infirmary OPD Consultation &amp; Triage
              </CardTitle>
              <CardDescription className="text-xs text-rose-700">
                Automatic triage rating triggers emergency parent notifications for acute conditions.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowLogModal(false)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleLogVisit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {healthCards.map((h) => (
                      <option key={h.studentId} value={h.studentId}>
                        {h.studentName} ({h.gradeSection} - {h.admissionNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Body Temperature (°F)</label>
                  <Input
                    required
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="98.6"
                    className="text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pulse Rate (BPM)</label>
                  <Input
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="78"
                    className="text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Chief Medical Complaint / Symptoms *</label>
                <Input
                  required
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="e.g. Sudden severe headache and 101F fever / Ankle sprain on football turf"
                  className="text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Treatment / First-Aid Administered</label>
                <textarea
                  rows={2}
                  value={firstAid}
                  onChange={(e) => setFirstAid(e.target.value)}
                  placeholder="e.g. Paracetamol 250mg oral, ice pack applied, 30 min observation in Bed #1"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="text-xs h-8" onClick={() => setShowLogModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Save OPD Record &amp; Process Triage
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
