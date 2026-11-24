'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  CheckCircle2,
  Globe,
  GraduationCap,
  Layers,
  Save,
  ShieldCheck,
  Sparkles,
  Users,
  Settings,
  BellRing,
  ArrowRight,
  School,
} from 'lucide-react';
import {
  PromotionCandidate,
  executeSessionRollover,
  SessionRolloverSummary,
} from '@/modules/academics/promotion';

const MOCK_PROMOTION_COHORT: PromotionCandidate[] = [
  { enrollmentId: 'e1', studentId: 's1', studentName: 'Aarav Mehta', currentClass: 'Class 10', currentSection: 'Section A', rollNo: '14', academicPercentage: 92.0, failedSubjectsCount: 0, attendancePercentage: 94.1, hasMedicalCondonation: false },
  { enrollmentId: 'e2', studentId: 's2', studentName: 'Ananya Deshmukh', currentClass: 'Class 10', currentSection: 'Section A', rollNo: '01', academicPercentage: 96.5, failedSubjectsCount: 0, attendancePercentage: 98.0, hasMedicalCondonation: false },
  { enrollmentId: 'e3', studentId: 's3', studentName: 'Rohan Mehra', currentClass: 'Class 10', currentSection: 'Section A', rollNo: '02', academicPercentage: 81.0, failedSubjectsCount: 0, attendancePercentage: 88.5, hasMedicalCondonation: false },
  { enrollmentId: 'e4', studentId: 's4', studentName: 'Diya Patel', currentClass: 'Class 10', currentSection: 'Section A', rollNo: '03', academicPercentage: 84.5, failedSubjectsCount: 0, attendancePercentage: 91.0, hasMedicalCondonation: false },
  { enrollmentId: 'e5', studentId: 's5', studentName: 'Kabir Khan', currentClass: 'Class 10', currentSection: 'Section A', rollNo: '04', academicPercentage: 62.0, failedSubjectsCount: 1, attendancePercentage: 78.0, hasMedicalCondonation: false },
  { enrollmentId: 'e6', studentId: 's6', studentName: 'Sanya Gupta', currentClass: 'Class 10', currentSection: 'Section A', rollNo: '05', academicPercentage: 73.0, failedSubjectsCount: 0, attendancePercentage: 85.0, hasMedicalCondonation: false },
];

export function SchoolSettingsManager() {
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'ROLLOVER' | 'CAMPUSES' | 'POLICIES'>('IDENTITY');

  // Form State
  const [schoolName, setSchoolName] = useState('Delhi Public Global Academy');
  const [affiliation, setAffiliation] = useState('CBSE (Central Board of Secondary Education)');
  const [affiliationNo, setAffiliationNo] = useState('2130842');
  const [schoolCode, setSchoolCode] = useState('08412');
  const [email, setEmail] = useState('contact@dpga.edu.in');
  const [phone, setPhone] = useState('+91 11 4982 0000');
  const [address, setAddress] = useState('Sector 4, Vasant Kunj, Institutional Area, New Delhi - 110070');
  const [principalName, setPrincipalName] = useState('Dr. Rajeshwar Sharma, Ph.D.');
  const [motto, setMotto] = useState('Service Before Self • तमसो मा ज्योतिर्गमय');

  // Rollover state
  const [rolloverSummary, setRolloverSummary] = useState<SessionRolloverSummary | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Institutional profile and affiliation parameters updated successfully.');
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleRunRollover = () => {
    const summary = executeSessionRollover(MOCK_PROMOTION_COHORT, '2024-2025', '2025-2026');
    setRolloverSummary(summary);
    setFeedback(`Annual Session Rollover simulated for ${summary.totalCandidates} candidates! ${summary.promotedCount} Promoted, ${summary.compartmentCount} Compartment.`);
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Notification */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Saved</Badge>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('IDENTITY')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'IDENTITY'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Institution Identity & Affiliation
        </button>

        <button
          onClick={() => setActiveTab('ROLLOVER')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'ROLLOVER'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Annual Promotion & Session Rollover
        </button>

        <button
          onClick={() => setActiveTab('CAMPUSES')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'CAMPUSES'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <School className="h-4 w-4" />
          Multi-Campus Infrastructure
        </button>

        <button
          onClick={() => setActiveTab('POLICIES')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'POLICIES'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BellRing className="h-4 w-4" />
          Automated ERP Policies
        </button>
      </div>

      {/* TAB 1: IDENTITY */}
      {activeTab === 'IDENTITY' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Institutional Profile & Statutory Affiliation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                These credentials appear on all official PDF Fee Receipts, Transfer Certificates, and CBSE Report Cards.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
              CBSE Affiliation Active
            </Badge>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Official School Name *</label>
                  <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required className="text-xs font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">School Motto / Tagline</label>
                  <Input value={motto} onChange={(e) => setMotto(e.target.value)} className="text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Education Board</label>
                  <Input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Affiliation Number</label>
                  <Input value={affiliationNo} onChange={(e) => setAffiliationNo(e.target.value)} className="text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CBSE School Code</label>
                  <Input value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} className="text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Official Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Toll-Free Helpline</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Principal Signatory</label>
                  <Input value={principalName} onChange={(e) => setPrincipalName(e.target.value)} className="text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Headquarters Campus Address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="text-xs" />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  Save Institutional Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: PROMOTION & ROLLOVER */}
      {activeTab === 'ROLLOVER' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  Annual Academic Session Rollover & Promotion Desk
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Transitions active student enrollments from Session 2024-2025 into 2025-2026 based on CBSE promotion criteria.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={handleRunRollover}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 gap-1.5 flex-shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Simulate Session Rollover
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {rolloverSummary ? (
                <div className="space-y-4">
                  {/* Summary Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-[10px] font-semibold text-emerald-800 uppercase">Promoted</p>
                      <p className="text-xl font-bold text-emerald-950">{rolloverSummary.promotedCount}</p>
                      <p className="text-[10px] text-emerald-700">Moving to Grade 11</p>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-[10px] font-semibold text-amber-800 uppercase">Compartment</p>
                      <p className="text-xl font-bold text-amber-950">{rolloverSummary.compartmentCount}</p>
                      <p className="text-[10px] text-amber-700">Eligible for July re-test</p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-[10px] font-semibold text-red-800 uppercase">Detained</p>
                      <p className="text-xl font-bold text-red-950">{rolloverSummary.detainedCount}</p>
                      <p className="text-[10px] text-red-700">Essential Repeat</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-[10px] font-semibold text-blue-800 uppercase">Total Evaluated</p>
                      <p className="text-xl font-bold text-blue-950">{rolloverSummary.totalCandidates}</p>
                      <p className="text-[10px] text-blue-700">Class 10-A Cohort</p>
                    </div>
                  </div>

                  {/* Decisions Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <tr>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Current Class</th>
                          <th className="py-2.5 px-3">Next Session Allocation</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Official Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {rolloverSummary.decisions.map((d) => (
                          <tr key={d.enrollmentId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{d.studentName}</td>
                            <td className="py-2.5 px-3 text-slate-600">{d.fromClass}</td>
                            <td className="py-2.5 px-3 font-bold text-indigo-700">
                              {d.toClass} ({d.targetSection})
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge
                                variant={d.status === 'PROMOTED' ? 'success' : d.status === 'COMPARTMENT' ? 'warning' : 'destructive'}
                                className="text-[10px]"
                              >
                                {d.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px]">{d.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 space-y-2">
                  <GraduationCap className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">Session Rollover Simulator Ready</p>
                  <p className="max-w-md mx-auto text-slate-500">
                    Click &ldquo;Simulate Session Rollover&rdquo; to evaluate the Class 10 cohort against attendance and academic passing criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: CAMPUSES */}
      {activeTab === 'CAMPUSES' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Registered Physical Campuses & Branches
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Multi-campus configuration unified under single tenant database tenancy.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              3 Registered Campuses
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Main Campus (Senior & Middle Wing)</span>
                  <Badge variant="success" className="text-[9px]">Headquarters</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Sector 4, Vasant Kunj, New Delhi &bull; Capacity: 2,500 Students</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Campus Code: CAMP-VK-01 &bull; CBSE Exam Center: 841201</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs w-fit">Active</Badge>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Junior & Primary Campus (Nursery to Grade 5)</span>
                  <Badge variant="outline" className="text-[9px]">Primary Wing</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Plot 12, Nelson Mandela Marg, New Delhi &bull; Capacity: 1,200 Students</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Campus Code: CAMP-VK-02</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs w-fit">Active</Badge>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Sports & Aquatic Academy Campus</span>
                  <Badge variant="outline" className="text-[9px]">Athletics Complex</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Sector 11, Dwarka Expressway Link &bull; Olympic Pool & Turf Fields</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Campus Code: CAMP-DW-03</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs w-fit">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: POLICIES */}
      {activeTab === 'POLICIES' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Automated Institutional Governance & ERP Policies
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Control automated triggers for attendance SMS, fee defaulter reminders, and RFID turnstile thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="font-bold text-slate-900 block">Morning Absence SMS Cutoff</span>
                <p className="text-slate-500 text-[11px]">
                  Time when the automated SMS gateway sends intimation to parents of absent students.
                </p>
                <Input defaultValue="08:30 AM" className="text-xs font-mono w-32" />
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="font-bold text-slate-900 block">Gate Turnstile Late Grace Period</span>
                <p className="text-slate-500 text-[11px]">
                  Minutes after official morning bell (08:00 AM) before student is marked LATE.
                </p>
                <Input defaultValue="15 Minutes (08:15 AM)" className="text-xs font-mono w-48" />
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="font-bold text-slate-900 block">CBSE Mandatory Attendance Gate</span>
                <p className="text-slate-500 text-[11px]">
                  Minimum attendance percentage required to generate Board Exam Roll Number.
                </p>
                <Input defaultValue="75% (Rule 13)" disabled className="text-xs font-mono w-32 bg-slate-100" />
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="font-bold text-slate-900 block">Quarterly Fee Due Grace Window</span>
                <p className="text-slate-500 text-[11px]">
                  Days after 10th of the quarter month before late fee fine is accrued.
                </p>
                <Input defaultValue="5 Calendar Days" className="text-xs font-mono w-36" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5"
                onClick={() => {
                  setFeedback('Automated ERP institutional policies saved.');
                  setTimeout(() => setFeedback(null), 4000);
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Update Governance Policies
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
