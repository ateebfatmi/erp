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
  CheckCircle2,
  Phone,
  Eye,
  Smile,
  Thermometer,
  ShieldAlert,
  Calendar,
  FileText,
  User,
  PlusCircle,
  Clock,
} from 'lucide-react';
import {
  StudentHealthCard,
  InfirmaryVisitRecord,
  calculateBmiAndCategory,
} from '@/modules/health/infirmary';

const INITIAL_HEALTH_CARD: StudentHealthCard = {
  studentId: 'stu-01',
  studentName: 'Aarav Mehta',
  admissionNo: 'DPGA/2021/1042',
  gradeSection: 'Class 10-A',
  gender: 'MALE',
  dob: '2010-04-14',
  bloodGroup: 'B+',
  heightCm: 168,
  weightKg: 58,
  bmi: 20.5,
  bmiCategory: 'HEALTHY_WEIGHT',
  visionLeft: '6/6',
  visionRight: '6/6',
  wearsGlasses: false,
  dentalHygiene: 'NORMAL',
  chronicConditions: ['Mild Seasonal Allergic Rhinitis'],
  regularMedications: 'None during school hours',
  emergencyContact: {
    name: 'Mr. Rajesh Mehta (Father)',
    relationship: 'Father',
    phone: '+91 98101 23456',
  },
  lastCheckedDate: '2024-10-15',
};

const INITIAL_VISITS: InfirmaryVisitRecord[] = [
  {
    visitId: 'vis-101',
    studentId: 'stu-01',
    studentName: 'Aarav Mehta',
    gradeSection: 'Class 10-A',
    timestamp: '2024-11-12T11:30:00Z',
    chiefComplaint: 'Mild headache and eye strain after computer science lab',
    temperatureF: 98.6,
    pulseRateBpm: 76,
    triageLevel: 'ROUTINE',
    firstAidGiven: 'Hydration administered (500ml oral rehydration), 25 min quiet rest in Infirmary Bay 2',
    attendingNurse: 'Sister Rekha (RN)',
    bedAssigned: 'Bed 2',
    parentNotified: false,
    status: 'DISCHARGED_TO_CLASS',
    dischargeNotes: 'Student felt completely relieved after rest and hydration; resumed regular classes for Period 6.',
  },
  {
    visitId: 'vis-102',
    studentId: 'stu-01',
    studentName: 'Aarav Mehta',
    gradeSection: 'Class 10-A',
    timestamp: '2024-09-24T14:15:00Z',
    chiefComplaint: 'Blunt left knee scrape during Inter-House Football practice',
    temperatureF: 98.4,
    pulseRateBpm: 84,
    triageLevel: 'ROUTINE',
    firstAidGiven: 'Antiseptic wash (Betadine 5%), Neosporin ointment, sterile waterproof dressing applied',
    attendingNurse: 'Sister Rekha (RN)',
    parentNotified: true,
    status: 'DISCHARGED_TO_CLASS',
    dischargeNotes: 'Advised not to wet dressing till evening. Dressing change scheduled for next day.',
  },
];

interface Props {
  role?: 'parent' | 'student';
}

export function StudentHealthManager({ role = 'parent' }: Props) {
  const [healthCard] = useState<StudentHealthCard>(INITIAL_HEALTH_CARD);
  const [visits] = useState<InfirmaryVisitRecord[]>(INITIAL_VISITS);
  const [activeTab, setActiveTab] = useState<'card' | 'visits' | 'exemption'>('card');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Exemption request form state
  const [exemptionReason, setExemptionReason] = useState<string>('');
  const [exemptionDuration, setExemptionDuration] = useState<string>('3 days');
  const [exemptionType, setExemptionType] = useState<string>('PE_SPORTS');

  const handleSubmitExemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exemptionReason.trim()) return;

    setFeedback(
      `Medical Exemption Notice submitted to Physical Education Department and School Infirmary for ${healthCard.studentName}.`
    );
    setExemptionReason('');
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'card'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartPulse className="h-4 w-4" />
          CBSE Health & Physical Card
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'visits'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="h-4 w-4" />
          Infirmary OPD Visits ({visits.length})
        </button>
        <button
          onClick={() => setActiveTab('exemption')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'exemption'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          Medical & P.E. Exemption Request
        </button>
      </div>

      {/* TAB 1: HEALTH CARD */}
      {activeTab === 'card' && (
        <div className="space-y-6">
          {/* Top Vital Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Blood Group</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-rose-600 font-mono">
                    {healthCard.bloodGroup}
                  </span>
                  <span className="text-[11px] text-slate-400">Rh Positive</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Height & Weight</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-900">
                    {healthCard.heightCm} cm
                  </span>
                  <span className="text-slate-400 font-mono">/</span>
                  <span className="text-xl font-bold text-slate-900">
                    {healthCard.weightKg} kg
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Calculated BMI</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {healthCard.bmi}
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                    Normal / Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Annual Checkup</p>
                <div className="mt-1">
                  <span className="text-sm font-bold text-slate-900">
                    {healthCard.lastCheckedDate}
                  </span>
                  <p className="text-[11px] text-emerald-600 font-medium">Valid for 2025-26</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Clinical Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision & Dental Hygiene */}
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  Sensory & Dental Examination
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Conducted by School Medical Officer per CBSE Annual Health Guidelines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Visual Acuity (Snellen Chart)</p>
                    <p className="text-[11px] text-slate-500">Left Eye: 6/6 | Right Eye: 6/6</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    Normal Vision
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Dental & Oral Health</p>
                    <p className="text-[11px] text-slate-500">No active caries or periodontal symptoms</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    Caries Free
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Correction Spectacles</p>
                    <p className="text-[11px] text-slate-500">Does not require vision glasses</p>
                  </div>
                  <Badge variant="outline" className="text-slate-600">
                    Not Prescribed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Allergies & Emergency Contact */}
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  Medical Alerts & Emergency Protocol
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Critical information displayed on school nurse's emergency dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Known Chronic Conditions / Allergies
                  </div>
                  <p className="text-xs text-amber-800 font-medium">
                    {healthCard.chronicConditions.join(', ') || 'None reported'}
                  </p>
                  <p className="text-[10px] text-amber-700">
                    Canteen and physical education faculty alerted regarding seasonal pollen triggers.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    Emergency Contact on File
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>{healthCard.emergencyContact.name}</span>
                    <a
                      href={`tel:${healthCard.emergencyContact.phone}`}
                      className="font-mono font-bold text-blue-600 hover:underline"
                    >
                      {healthCard.emergencyContact.phone}
                    </a>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 italic">
                  To update blood group, allergy records, or physician contacts, please contact the School Infirmary desk.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: INFIRMARY VISITS */}
      {activeTab === 'visits' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              School Infirmary Clinic OPD History
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Complete digital log of triage evaluations, vitals, and medications administered during school hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visits.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                No infirmary visits recorded for this academic year.
              </p>
            ) : (
              <div className="space-y-3">
                {visits.map((vis) => (
                  <div
                    key={vis.visitId}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{vis.chiefComplaint}</span>
                        <Badge
                          className={
                            vis.triageLevel === 'ROUTINE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }
                        >
                          {vis.triageLevel}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {new Date(vis.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Body Temperature</span>
                        <span className="font-bold text-slate-900 font-mono">{vis.temperatureF}°F</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Pulse Rate</span>
                        <span className="font-bold text-slate-900 font-mono">{vis.pulseRateBpm} bpm</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Attending Clinician</span>
                        <span className="font-medium text-slate-800">{vis.attendingNurse}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Discharge Status</span>
                        <span className="font-semibold text-emerald-700">Discharged to Class</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p>
                        <strong className="text-slate-700">Treatment & First Aid:</strong>{' '}
                        <span className="text-slate-600">{vis.firstAidGiven}</span>
                      </p>
                      {vis.dischargeNotes && (
                        <p>
                          <strong className="text-slate-700">Clinical Notes:</strong>{' '}
                          <span className="text-slate-600">{vis.dischargeNotes}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: EXEMPTION REQUEST */}
      {activeTab === 'exemption' && (
        <Card className="border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Submit Medical or Physical Education Exemption
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Notify the school infirmary, sports coach, and class teacher regarding temporary medical restrictions or post-recovery care.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitExemption} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Exemption Category
                </label>
                <select
                  value={exemptionType}
                  onChange={(e) => setExemptionType(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PE_SPORTS">Physical Education (P.E.) & Outdoor Sports Exemption</option>
                  <option value="YOGA">Morning Assembly / Yoga Drill Exemption</option>
                  <option value="DIET">Special Dietary Canteen Exemption</option>
                  <option value="STAIRS">Ground Floor Classroom / Lift Access Pass</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Requested Duration
                </label>
                <select
                  value={exemptionDuration}
                  onChange={(e) => setExemptionDuration(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1 day">1 Day (Today only)</option>
                  <option value="3 days">3 Days</option>
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="Medical Certificate Attached">Full Term (Doctor's Note Attached)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Medical Reason & Doctor's Advice
                </label>
                <textarea
                  value={exemptionReason}
                  onChange={(e) => setExemptionReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Recovering from ankle ligament sprain. Orthopedic doctor has advised rest from contact sports for 1 week."
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Submit Exemption Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
