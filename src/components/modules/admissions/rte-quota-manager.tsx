'use client';

import React, { useState } from 'react';
import {
  RteApplicant,
  RteCategory,
  calculateRteQuota,
  verifyRteApplicant,
  calculateStateReimbursementClaim,
  runRteDrawOfLots,
  INITIAL_RTE_APPLICANTS,
} from '@/modules/admissions/rte-quota';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  FileText,
  UserCheck,
  DollarSign,
  Shuffle,
  Users,
  Search,
  Check,
  X,
  Scale,
  Sparkles,
} from 'lucide-react';

const CATEGORY_LABELS: Record<RteCategory, { label: string; badge: string }> = {
  EWS: { label: 'EWS (Economically Weaker Section)', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' },
  DISADVANTAGED_GROUP_SC: { label: 'DG - Scheduled Caste (SC)', badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20' },
  DISADVANTAGED_GROUP_ST: { label: 'DG - Scheduled Tribe (ST)', badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20' },
  DISADVANTAGED_GROUP_OBC_NCL: { label: 'DG - OBC (Non-Creamy Layer)', badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' },
  CWSN: { label: 'Child with Special Needs (CWSN)', badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' },
  ORPHAN: { label: 'Orphan / Vulnerable Child', badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' },
};

export function RteQuotaManager() {
  const [totalIntake, setTotalIntake] = useState(120);
  const [applicants, setApplicants] = useState<RteApplicant[]>(INITIAL_RTE_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'applicants' | 'draw' | 'reimbursement'>('applicants');
  const [stateCapPerChild, setStateCapPerChild] = useState(26000);
  const [schoolTuitionPerChild, setSchoolTuitionPerChild] = useState(55000);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quota calculation
  const quota = calculateRteQuota(totalIntake);
  const confirmedAdmissions = applicants.filter((a) => a.allocationStatus === 'ADMISSION_CONFIRMED').length;
  const remainingRteSeats = Math.max(0, quota.mandatoryRteSeats - confirmedAdmissions);

  // Reimbursement calculation
  const claimStats = calculateStateReimbursementClaim({
    confirmedStudentsCount: Math.max(1, confirmedAdmissions),
    schoolAnnualTuitionPerChild: schoolTuitionPerChild,
    stateNotifiedPerChildCap: stateCapPerChild,
  });

  // Filter applicants
  const filteredApplicants = applicants.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesQuery =
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Verification action
  const handleVerify = (id: string) => {
    setApplicants((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const res = verifyRteApplicant(a);
        return {
          ...a,
          verificationStatus: res.status,
        };
      })
    );
    setFeedback('Applicant statutory eligibility re-verified against income & neighbourhood criteria.');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Confirm admission action
  const handleConfirmAdmission = (id: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, allocationStatus: 'ADMISSION_CONFIRMED' } : a))
    );
    setFeedback('Admission confirmed under 25% RTE Free Education Quota. Zero fee ledger assigned.');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Run Draw of Lots
  const handleExecuteDrawOfLots = () => {
    const { allotted, waitlisted } = runRteDrawOfLots(applicants, quota.mandatoryRteSeats);
    const combined = [...allotted, ...waitlisted];
    // Keep applicants not eligible unchanged
    const map = new Map(combined.map((c) => [c.id, c]));
    setApplicants((prev) => prev.map((a) => map.get(a.id) || a));
    setFeedback(`Computerized Draw of Lots completed. ${allotted.length} applicants allotted seats based on neighbourhood distance.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-teal-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Right of Children to Free and Compulsory Education Act 2009</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">RTE Section 12(1)(c) 25% Quota Desk</h1>
            <p className="text-sm text-teal-200/80 max-w-2xl mt-1">
              Statutory 25% admission reservation for Economically Weaker Sections (EWS) and Disadvantaged Groups (DG) with state government fee reimbursement tracking.
            </p>
          </div>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-teal-600/30 text-xs">
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'applicants' ? 'bg-teal-600 text-white shadow-xs' : 'text-teal-300 hover:text-white'
              }`}
            >
              Applicants & Verification
            </button>
            <button
              onClick={() => setActiveTab('draw')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'draw' ? 'bg-teal-600 text-white shadow-xs' : 'text-teal-300 hover:text-white'
              }`}
            >
              Draw of Lots (Lottery)
            </button>
            <button
              onClick={() => setActiveTab('reimbursement')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'reimbursement' ? 'bg-teal-600 text-white shadow-xs' : 'text-teal-300 hover:text-white'
              }`}
            >
              Section 12(2) Fee Claim
            </button>
          </div>
        </div>
      </div>

      {/* Quota Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Entry Intake Capacity</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{totalIntake} Seats</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Pre-School / Class 1</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Mandatory 25% RTE Quota</span>
            <Scale className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">
            {quota.mandatoryRteSeats} Seats
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Statutory zero-fee seats</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Confirmed RTE Admissions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {confirmedAdmissions} Enrolled
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{remainingRteSeats} seats open</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>State Reimbursement Est.</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            ₹{claimStats.totalClaimAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            @ ₹{claimStats.perChildReimbursed.toLocaleString('en-IN')}/child
          </div>
        </div>
      </div>

      {/* TAB 1: Applicants & Verification Console */}
      {activeTab === 'applicants' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search applicant, application no, parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'EWS', 'DISADVANTAGED_GROUP_SC', 'DISADVANTAGED_GROUP_ST', 'DISADVANTAGED_GROUP_OBC_NCL', 'CWSN'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white font-medium'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat === 'ALL'
                      ? 'All Categories'
                      : cat === 'DISADVANTAGED_GROUP_SC'
                      ? 'SC'
                      : cat === 'DISADVANTAGED_GROUP_ST'
                      ? 'ST'
                      : cat === 'DISADVANTAGED_GROUP_OBC_NCL'
                      ? 'OBC (NCL)'
                      : cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Applicant & Parent</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Income & Distance</th>
                  <th className="p-3">Document Checklist</th>
                  <th className="p-3">Verification Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplicants.map((a) => {
                  const catStyle = CATEGORY_LABELS[a.category];
                  const isEligible = a.verificationStatus === 'VERIFIED_ELIGIBLE';
                  const isConfirmed = a.allocationStatus === 'ADMISSION_CONFIRMED';
                  const isOverIncome = a.verificationStatus === 'REJECTED_OVER_INCOME';

                  return (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono font-medium text-foreground">
                        {a.applicationNumber}
                        <span className="block text-[10px] text-muted-foreground">Class 1</span>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-foreground">{a.studentName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {a.gender} &bull; {a.parentName}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${catStyle.badge}`}
                        >
                          {a.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-3">
                        <div
                          className={`font-semibold ${
                            isOverIncome ? 'text-destructive font-bold' : 'text-foreground'
                          }`}
                        >
                          ₹{a.annualFamilyIncome.toLocaleString('en-IN')}/yr
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <span>{a.neighbourhoodDistanceKm} km from school</span>
                          <span
                            className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                              a.neighbourhoodDistanceKm <= 1.0
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-blue-500/10 text-blue-600'
                            }`}
                          >
                            {a.neighbourhoodDistanceKm <= 1.0 ? 'Tier 1' : 'Tier 2'}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1 text-[10px]">
                          <span
                            title="Birth Certificate"
                            className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                              a.documentsSubmitted.birthCertificate
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            DOB: {a.documentsSubmitted.birthCertificate ? '✓' : '✗'}
                          </span>
                          <span
                            title="Income / Tehsildar Certificate"
                            className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                              a.documentsSubmitted.incomeCertificate
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            INC: {a.documentsSubmitted.incomeCertificate ? '✓' : '-'}
                          </span>
                          <span
                            title="Residence Proof"
                            className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                              a.documentsSubmitted.residenceProof
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            RES: {a.documentsSubmitted.residenceProof ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isEligible
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-destructive/10 text-destructive border border-destructive/20'
                          }`}
                        >
                          {isEligible ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {a.verificationStatus.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Status: {a.allocationStatus.replace(/_/g, ' ')}
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleVerify(a.id)}
                            className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs font-semibold"
                          >
                            Verify
                          </button>

                          {isEligible && !isConfirmed && (
                            <button
                              onClick={() => handleConfirmAdmission(a.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                            >
                              Enroll RTE
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Draw of Lots (Computerized Lottery) */}
      {activeTab === 'draw' && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-teal-600" />
                Computerized RTE Draw of Lots (Lottery Allocation)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory computerized lottery conducted in presence of District Education Officer (DEO) observer.
              </p>
            </div>

            <button
              onClick={handleExecuteDrawOfLots}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Run Automated Draw of Lots</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allotted Seats */}
            <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Allotted Quota Seats (Top Distance Ranks)</span>
                </h4>
                <span className="text-xs font-semibold text-emerald-600">
                  {applicants.filter((a) => a.allocationStatus !== 'WAITLISTED' && a.verificationStatus === 'VERIFIED_ELIGIBLE').length} Seats
                </span>
              </div>

              <div className="space-y-2">
                {applicants
                  .filter((a) => a.allocationStatus !== 'WAITLISTED' && a.verificationStatus === 'VERIFIED_ELIGIBLE')
                  .map((a, idx) => (
                    <div
                      key={a.id}
                      className="p-3 bg-card border border-border rounded-lg text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-foreground">
                          Rank #{a.drawOfLotsSerial || idx + 1}: {a.studentName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {a.applicationNumber} &bull; {a.neighbourhoodDistanceKm} km ({CATEGORY_LABELS[a.category].label})
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                        {a.allocationStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Waitlisted */}
            <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Waitlisted Applicants</span>
                </h4>
                <span className="text-xs font-semibold text-amber-600">
                  {applicants.filter((a) => a.allocationStatus === 'WAITLISTED').length} Waitlisted
                </span>
              </div>

              <div className="space-y-2">
                {applicants
                  .filter((a) => a.allocationStatus === 'WAITLISTED')
                  .map((a, idx) => (
                    <div
                      key={a.id}
                      className="p-3 bg-card border border-border rounded-lg text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-foreground">
                          Waitlist #{idx + 1}: {a.studentName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {a.applicationNumber} &bull; {a.neighbourhoodDistanceKm} km &bull; ₹{a.annualFamilyIncome.toLocaleString('en-IN')}/yr
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                        {a.verificationStatus === 'REJECTED_OVER_INCOME' ? 'INCOME EXCEEDED' : 'WAITLISTED'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Section 12(2) State Reimbursement Claim Desk */}
      {activeTab === 'reimbursement' && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Section 12(2) State Government Fee Reimbursement Form
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Official statutory claim invoice submitted to the Directorate of Education / Zilla Parishad.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Claim Form</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3 text-xs">
              <span className="font-bold text-foreground block">Statutory Parameters:</span>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">State Notified Per-Child Ceiling:</span>
                <input
                  type="number"
                  value={stateCapPerChild}
                  onChange={(e) => setStateCapPerChild(Number(e.target.value))}
                  className="w-28 bg-card border border-input rounded px-2 py-1 text-xs font-mono font-bold text-foreground text-right"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">School Standard Annual Tuition:</span>
                <input
                  type="number"
                  value={schoolTuitionPerChild}
                  onChange={(e) => setSchoolTuitionPerChild(Number(e.target.value))}
                  className="w-28 bg-card border border-input rounded px-2 py-1 text-xs font-mono font-bold text-foreground text-right"
                />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">Applicable Rate (Lower of Two):</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ₹{claimStats.perChildReimbursed.toLocaleString('en-IN')}/child
                </span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-950 dark:text-emerald-300 block mb-1">
                  Total Statutory Reimbursement Claim
                </span>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-2">
                  ₹{claimStats.totalClaimAmount.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  {claimStats.stateAuditSummary}
                </p>
              </div>

              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold pt-2 border-t border-emerald-500/20">
                Statutory Bank Account: PFMS Registered School Single Nodal Account (SNA)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
