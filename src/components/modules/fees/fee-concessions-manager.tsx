'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FeeConcessionApplication,
  ConcessionType,
  INITIAL_CONCESSION_APPLICATIONS,
  calculateFeeConcession,
  createConcessionApplication,
  sanctionConcessionApplication,
  rejectConcessionApplication,
} from '@/modules/fees/concessions';
import {
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Users,
  Search,
  Plus,
  Printer,
  ShieldCheck,
  FileText,
  DollarSign,
  Scale,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  X,
} from 'lucide-react';

interface FeeConcessionsManagerProps {
  viewMode?: 'admin' | 'parent';
}

const TYPE_CONFIG: Record<
  ConcessionType,
  { label: string; badge: string; description: string }
> = {
  SIBLING_DISCOUNT: {
    label: 'Sibling Concession',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    description: '20% tuition waiver for 2nd enrolled sibling, 30% for 3rd sibling',
  },
  SINGLE_GIRL_CHILD: {
    label: 'Single Girl Child (CBSE Udaan)',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    description: '50% tuition waiver to foster girl child secondary education',
  },
  STAFF_WARD: {
    label: 'Faculty & Staff Ward',
    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    description: '50% tuition concession for wards of confirmed faculty members',
  },
  MERIT_SCHOLARSHIP: {
    label: 'Academic Merit Scholarship',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    description: '50% to 100% waiver for annual examination or Olympiad rankers',
  },
  DEFENSE_MARTYR_WARD: {
    label: 'Armed Forces Martyr Ward',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    description: '100% complete institutional fee waiver for defense martyrs',
  },
  FINANCIAL_HARDSHIP: {
    label: 'Need-Based Bursary',
    badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
    description: 'Special relief sanctioned by the School Management Committee',
  },
};

export function FeeConcessionsManager({ viewMode = 'admin' }: FeeConcessionsManagerProps) {
  const [applications, setApplications] = useState<FeeConcessionApplication[]>(
    INITIAL_CONCESSION_APPLICATIONS
  );
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'policy'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<FeeConcessionApplication | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Concession Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [admNo, setAdmNo] = useState('DPGA/2023/1350');
  const [studentName, setStudentName] = useState('Meera Deshmukh');
  const [gradeClass, setGradeClass] = useState('Class 8B');
  const [concessionType, setConcessionType] = useState<ConcessionType>('SINGLE_GIRL_CHILD');
  const [originalTuition, setOriginalTuition] = useState(20000);
  const [customDiscount, setCustomDiscount] = useState<number | ''>('');
  const [docDescription, setDocDescription] = useState('Notarized single girl child affidavit submitted');

  // Metrics
  const activeApps = applications.filter((a) => a.status === 'APPROVED_ACTIVE');
  const pendingApps = applications.filter((a) => a.status === 'PENDING_SANCTION');
  const totalAnnualSubsidy = activeApps.reduce((acc, a) => acc + a.annualSavings, 0);
  const avgDiscount =
    activeApps.length > 0
      ? Math.round(activeApps.reduce((acc, a) => acc + a.discountPercentage, 0) / activeApps.length)
      : 0;

  // Filtered records
  const currentList = activeTab === 'pending' ? pendingApps : activeApps;
  const filteredList = currentList.filter((app) => {
    const matchesType = selectedTypeFilter === 'ALL' || app.concessionType === selectedTypeFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.studentName.toLowerCase().includes(q) ||
      app.admissionNumber.toLowerCase().includes(q) ||
      app.gradeClass.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  // Action: Sanction
  const handleSanction = (id: string) => {
    const updated = sanctionConcessionApplication(applications, id, 'Dr. Anita Roy (Principal)');
    setApplications(updated);
    setFeedback('Fee concession sanctioned successfully and reconciled in Bursar ledger.');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Action: Reject
  const handleReject = (id: string) => {
    const reason = prompt('Please enter the official rejection reason for the audit log:');
    if (!reason) return;
    const updated = rejectConcessionApplication(applications, id, reason);
    setApplications(updated);
    setFeedback('Concession application rejected with auditor remarks.');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Action: New application submit
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newApp = createConcessionApplication({
        admissionNumber: admNo,
        studentName,
        gradeClass,
        concessionType,
        originalQuarterlyTuition: Number(originalTuition),
        customPercent: customDiscount !== '' ? Number(customDiscount) : undefined,
        supportingDocDescription: docDescription,
        autoApprove: viewMode === 'admin',
        sanctionedBy: viewMode === 'admin' ? 'Dr. Anita Roy (Principal)' : undefined,
      });

      setApplications([newApp, ...applications]);
      setIsApplyModalOpen(false);
      setSelectedAppForSlip(newApp);
      setFeedback(`Concession application submitted for ${newApp.studentName} (${newApp.discountPercentage}% discount).`);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Error processing concession');
    }
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
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Percent className="w-3.5 h-3.5" />
              <span>CBSE & State Fee Regulatory Act Compliant</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Institutional Fee Concessions & Scholarships Desk</h1>
            <p className="text-sm text-emerald-200/80 max-w-2xl mt-1">
              Manage statutory single girl child waivers (CBSE Udaan), sibling discounts, staff ward concessions, and merit scholarships with automated quarterly ledger adjustments.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-emerald-600/30 text-xs">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Active Concessions ({activeApps.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'pending' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Pending Sanctions ({pendingApps.length})
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'policy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Policy Norms
              </button>
            </div>

            {viewMode === 'admin' && (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Grant Concession</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Active Beneficiaries</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{activeApps.length} Students</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Session 2026-27</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Total Annual Fee Subsidy</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalAnnualSubsidy.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Direct institutional relief</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Average Concession</span>
            <Percent className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{avgDiscount}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across all categories</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Awaiting Approval</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {pendingApps.length} Requests
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Principal verification queue</div>
        </div>
      </div>

      {/* Main Table for Active and Pending */}
      {(activeTab === 'active' || activeTab === 'pending') && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, admission no, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'SIBLING_DISCOUNT', 'SINGLE_GIRL_CHILD', 'STAFF_WARD', 'MERIT_SCHOLARSHIP', 'DEFENSE_MARTYR_WARD'].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTypeFilter(type)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                      selectedTypeFilter === type
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {type === 'ALL'
                      ? 'All Concessions'
                      : type === 'SIBLING_DISCOUNT'
                      ? 'Sibling'
                      : type === 'SINGLE_GIRL_CHILD'
                      ? 'Girl Child'
                      : type === 'STAFF_WARD'
                      ? 'Staff Ward'
                      : type === 'MERIT_SCHOLARSHIP'
                      ? 'Merit'
                      : 'Defense'}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Student & Class</th>
                  <th className="p-3">Concession Category</th>
                  <th className="p-3">Discount %</th>
                  <th className="p-3">Quarterly Payable</th>
                  <th className="p-3">Annual Relief</th>
                  <th className="p-3">Sanctioned By</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredList.map((app) => {
                  const cfg = TYPE_CONFIG[app.concessionType];
                  const isApproved = app.status === 'APPROVED_ACTIVE';

                  return (
                    <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono font-bold text-foreground">{app.id}</td>

                      <td className="p-3">
                        <div className="font-semibold text-foreground">{app.studentName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {app.admissionNumber} &bull; {app.gradeClass}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${cfg.badge}`}
                        >
                          {cfg.label}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">
                          {app.supportingDocDescription}
                        </div>
                      </td>

                      <td className="p-3 font-bold text-emerald-600 text-sm">
                        {app.discountPercentage}%
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-foreground">
                          ₹{app.discountedQuarterlyTuition.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-muted-foreground line-through">
                          ₹{app.originalQuarterlyTuition.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{app.annualSavings.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3">
                        {isApproved ? (
                          <div>
                            <span className="font-semibold text-foreground">{app.sanctionedBy}</span>
                            <span className="text-[10px] text-muted-foreground block font-mono">
                              {app.sanctionDate}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold">
                            PENDING APPROVAL
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAppForSlip(app)}
                            className="px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>

                          {viewMode === 'admin' && !isApproved && (
                            <>
                              <button
                                onClick={() => handleSanction(app.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Sanction</span>
                              </button>
                              <button
                                onClick={() => handleReject(app.id)}
                                className="px-2 py-1 text-destructive hover:bg-destructive/10 rounded text-xs font-semibold"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
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

      {/* Tab 3: Policy Norms */}
      {activeTab === 'policy' && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 text-xs">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>Institutional Fee Concession & Scholarship Regulations</span>
            </h3>
            <p className="text-muted-foreground mt-0.5">
              Governed by CBSE Circulars, State Fee Regulatory Acts, and School Management Committee By-Laws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TYPE_CONFIG).map(([key, item]) => (
              <div key={key} className="p-4 bg-muted/30 border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badge}`}>
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {key === 'DEFENSE_MARTYR_WARD' ? '100% Waiver' : '20% to 50% Relief'}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{item.description}</p>
                <div className="text-[10px] text-muted-foreground font-semibold pt-1 border-t border-border/50">
                  Documentation: Notarized affidavit / marksheet / service verification required annually.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sanction Slip Modal */}
      {selectedAppForSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-foreground">
            <div className="text-center pb-4 border-b border-border space-y-1">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Official Tuition Fee Concession Sanction Order
              </h3>
              <p className="text-xs text-muted-foreground">
                Bursar Reconciliation Code: {selectedAppForSlip.id} &bull; Academic Year {selectedAppForSlip.validAcademicYear}
              </p>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px]">STUDENT NAME</span>
                  <span className="font-bold text-foreground">{selectedAppForSlip.studentName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">ADMISSION / CLASS</span>
                  <span className="font-mono text-foreground">
                    {selectedAppForSlip.admissionNumber} ({selectedAppForSlip.gradeClass})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">CONCESSION TYPE</span>
                  <span className="font-semibold text-foreground">
                    {TYPE_CONFIG[selectedAppForSlip.concessionType].label}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">SANCTIONED RATE</span>
                  <span className="font-extrabold text-emerald-600">
                    {selectedAppForSlip.discountPercentage}% Waiver
                  </span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3 bg-card border border-border rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Quarterly Tuition:</span>
                  <span className="font-mono text-foreground line-through">
                    ₹{selectedAppForSlip.originalQuarterlyTuition.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Quarterly Fee Relief:</span>
                  <span>-₹{selectedAppForSlip.quarterlySavings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border font-bold text-sm">
                  <span>Net Quarterly Payable:</span>
                  <span className="text-foreground">
                    ₹{selectedAppForSlip.discountedQuarterlyTuition.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-dashed border-border text-[11px] text-muted-foreground">
                  <span>Total Annual Institutional Subsidy:</span>
                  <span className="font-bold text-emerald-600">
                    ₹{selectedAppForSlip.annualSavings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border text-[11px] space-y-1">
                <span className="font-bold text-foreground block">Verification & Audit Remarks:</span>
                <p className="text-muted-foreground">{selectedAppForSlip.supportingDocDescription}</p>
                <div className="text-[10px] text-emerald-600 font-semibold pt-1">
                  Sanctioned By: {selectedAppForSlip.sanctionedBy || 'Principal'} on {selectedAppForSlip.sanctionDate || 'Pending'}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 justify-end pt-3 border-t border-border">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sanction Slip</span>
              </button>
              <button
                onClick={() => setSelectedAppForSlip(null)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Concession Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-foreground">
            <h3 className="font-bold text-base text-foreground mb-1">
              Grant Institutional Fee Concession / Scholarship
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Directly adjusts quarterly tuition invoices and reconciles in Bursar general ledger.
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Admission Number *</label>
                  <input
                    type="text"
                    required
                    value={admNo}
                    onChange={(e) => setAdmNo(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Class & Section *</label>
                  <input
                    type="text"
                    required
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Concession Category *</label>
                  <select
                    value={concessionType}
                    onChange={(e) => setConcessionType(e.target.value as ConcessionType)}
                    className="w-full bg-muted/50 border border-input rounded-lg p-1.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="SIBLING_DISCOUNT">Sibling Concession (20%)</option>
                    <option value="SINGLE_GIRL_CHILD">Single Girl Child (50%)</option>
                    <option value="STAFF_WARD">Staff Ward (50%)</option>
                    <option value="MERIT_SCHOLARSHIP">Academic Merit (50%)</option>
                    <option value="DEFENSE_MARTYR_WARD">Armed Forces Martyr (100%)</option>
                    <option value="FINANCIAL_HARDSHIP">Need-Based Bursary (30%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Quarterly Tuition (₹) *</label>
                  <input
                    type="number"
                    required
                    value={originalTuition}
                    onChange={(e) => setOriginalTuition(Number(e.target.value))}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Custom Discount % (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Default policy rate"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Documentation & Audit Verification *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Sibling admission number, Single Girl Child magistrate affidavit, or Board marksheet details..."
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded-lg p-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Grant & Settle Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
