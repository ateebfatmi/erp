'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TransferCertificateRecord,
  TcReasonForLeaving,
  INITIAL_TC_REGISTRY,
  issueTransferCertificate,
  convertDateToWords,
} from '@/modules/students/transfer-certificate';
import {
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Search,
  Plus,
  ShieldCheck,
  ExternalLink,
  Ban,
  School,
  Stamp,
  QrCode,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface TcRegistryManagerProps {
  viewMode?: 'admin' | 'parent';
}

const REASON_LABELS: Record<TcReasonForLeaving, string> = {
  PARENT_JOB_TRANSFER: 'Parent Employment Transfer',
  HIGHER_STUDIES: 'Progression to Higher Studies',
  RELOCATION_ABROAD: 'Family Emigration / Relocation Abroad',
  FAMILY_RELOCATION: 'Domestic Residence Relocation',
  PERSONAL_REASON: 'Personal / Domestic Grounds',
};

export function TcRegistryManager({ viewMode = 'admin' }: TcRegistryManagerProps) {
  const [registry, setRegistry] = useState<TransferCertificateRecord[]>(INITIAL_TC_REGISTRY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTcForView, setSelectedTcForView] = useState<TransferCertificateRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New TC Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [admNo, setAdmNo] = useState('DPGA/2021/1150');
  const [studentName, setStudentName] = useState('Kabir Sengupta');
  const [motherName, setMotherName] = useState('Mrs. Ananya Sengupta');
  const [fatherName, setFatherName] = useState('Mr. Deep Sengupta');
  const [dob, setDob] = useState('2011-06-18');
  const [dateOfFirstAdm, setDateOfFirstAdm] = useState('06-Apr-2022 in Class 5');
  const [lastClass, setLastClass] = useState('Class 8 (Eighth)');
  const [examResult, setExamResult] = useState('Annual Examination Passed');
  const [subjects, setSubjects] = useState('English, Hindi, Mathematics, Science, Social Science, French');
  const [promotionClass, setPromotionClass] = useState('Class 9 (Ninth)');
  const [workingDays, setWorkingDays] = useState(218);
  const [presentDays, setPresentDays] = useState(204);
  const [duesCleared, setDuesCleared] = useState(true);
  const [monthDues, setMonthDues] = useState('March 2026');
  const [reason, setReason] = useState<TcReasonForLeaving>('PARENT_JOB_TRANSFER');

  // Filtered records
  const filteredRecords = registry.filter((tc) => {
    const q = searchQuery.toLowerCase();
    return (
      tc.studentName.toLowerCase().includes(q) ||
      tc.tcNumber.toLowerCase().includes(q) ||
      tc.admissionNumber.toLowerCase().includes(q) ||
      tc.penNumber.includes(q)
    );
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subjectArray = subjects.split(',').map((s) => s.trim()).filter(Boolean);
      const newTc = issueTransferCertificate({
        admissionNumber: admNo,
        studentName,
        motherName,
        fatherName,
        dateOfBirth: dob,
        dateOfFirstAdmission: dateOfFirstAdm,
        lastClassStudied: lastClass,
        schoolBoardExamResult: examResult,
        subjectsStudied: subjectArray,
        qualifiedForPromotion: true,
        promotionClass,
        totalWorkingDays: Number(workingDays),
        daysPresent: Number(presentDays),
        duesCleared,
        monthUpToWhichDuesPaid: monthDues,
        reasonForLeaving: reason,
      });

      setRegistry([newTc, ...registry]);
      setIsIssueModalOpen(false);
      setSelectedTcForView(newTc);
      setFeedback(`Official Transfer Certificate ${newTc.tcNumber} issued successfully with digital seal.`);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Error issuing Transfer Certificate');
    }
  };

  const handleRevokeTc = (id: string) => {
    if (!confirm('Are you sure you want to officially REVOKE this Transfer Certificate?')) return;
    setRegistry((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, status: 'REVOKED' } : tc))
    );
    if (selectedTcForView?.id === id) {
      setSelectedTcForView((prev) => prev ? { ...prev, status: 'REVOKED' } : null);
    }
    setFeedback('Transfer Certificate revoked and marked invalid on public registry.');
    setTimeout(() => setFeedback(null), 4000);
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
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-blue-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>CBSE Examination & Affiliation By-Laws (Rule 14 & 15)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Statutory Transfer Certificate (TC) Desk</h1>
            <p className="text-sm text-blue-200/80 max-w-2xl mt-1">
              Official school leaving certificates with 20-point statutory questionnaire, UDISE+ PEN tagging, and public verification registry.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/verify/tc"
              target="_blank"
              className="px-3.5 py-2 bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Verification Portal</span>
            </Link>

            {viewMode === 'admin' && (
              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New TC</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Total TCs Issued</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{registry.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Session 2025-26</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>No-Dues Reconciled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">100%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Accounts, Library, Lab clear</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>UDISE+ PEN Tagged</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">100%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Permanent Education No.</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Revoked Certificates</span>
            <Ban className="w-4 h-4 text-destructive" />
          </div>
          <div className="text-2xl font-bold text-destructive mt-1">
            {registry.filter((tc) => tc.status === 'REVOKED').length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Tamper invalidations</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student, TC no, admission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Displaying {filteredRecords.length} Transfer Certificates
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="p-3">TC & Book No</th>
                <th className="p-3">Student & Parents</th>
                <th className="p-3">Admission & PEN</th>
                <th className="p-3">Last Class & Result</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.map((tc) => {
                const isValid = tc.status === 'ISSUED_VALID';

                return (
                  <tr key={tc.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-blue-600">{tc.tcNumber}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{tc.bookNumber}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-foreground">{tc.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        F: {tc.fatherName} &bull; M: {tc.motherName}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-foreground">{tc.admissionNumber}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        PEN: {tc.penNumber}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-foreground">{tc.lastClassStudied}</div>
                      <div className="text-[11px] text-muted-foreground">{tc.schoolBoardExamResult}</div>
                    </td>

                    <td className="p-3 font-mono text-muted-foreground">{tc.issueDate}</td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isValid
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                      >
                        {isValid ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {isValid ? 'VERIFIED VALID' : 'REVOKED'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTcForView(tc)}
                          className="px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View TC</span>
                        </button>

                        <a
                          href={`/api/documents/transfer-certificate/${tc.admissionNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>

                        {viewMode === 'admin' && isValid && (
                          <button
                            onClick={() => handleRevokeTc(tc.id)}
                            className="px-2 py-1 text-destructive hover:bg-destructive/10 rounded text-xs font-semibold"
                            title="Revoke Certificate"
                          >
                            <Ban className="w-3.5 h-3.5" />
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

      {/* Official TC Letterhead Modal Preview */}
      {selectedTcForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-foreground max-h-[90vh] overflow-y-auto">
            {/* Certificate Header */}
            <div className="text-center pb-4 border-b border-border space-y-1">
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-lg">
                <School className="w-6 h-6 text-blue-600" />
                <span>DELHI PUBLIC GLOBAL ACADEMY</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Affiliated to Central Board of Secondary Education (CBSE), New Delhi &bull; Affiliation No: 2130894 &bull; School Code: 20194
              </p>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground pt-2">
                TRANSFER / SCHOOL LEAVING CERTIFICATE
              </h3>
            </div>

            {/* TC Details Grid */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-lg font-mono text-[11px] border border-border">
                <span>TC NO: <strong>{selectedTcForView.tcNumber}</strong></span>
                <span>BOOK NO: <strong>{selectedTcForView.bookNumber}</strong></span>
                <span>ADMISSION NO: <strong>{selectedTcForView.admissionNumber}</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                <div>
                  <span className="text-muted-foreground block text-[10px]">1. NAME OF PUPIL:</span>
                  <span className="font-bold text-foreground">{selectedTcForView.studentName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">2. UDISE+ PEN NUMBER:</span>
                  <span className="font-mono font-bold text-foreground">{selectedTcForView.penNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">3. MOTHER&apos;S NAME:</span>
                  <span className="font-semibold text-foreground">{selectedTcForView.motherName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">4. FATHER&apos;S / GUARDIAN&apos;S NAME:</span>
                  <span className="font-semibold text-foreground">{selectedTcForView.fatherName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">5. NATIONALITY:</span>
                  <span className="text-foreground">{selectedTcForView.nationality}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">6. DATE OF FIRST ADMISSION IN SCHOOL:</span>
                  <span className="text-foreground">{selectedTcForView.dateOfFirstAdmission}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px]">7. DATE OF BIRTH (IN FIGURES & WORDS):</span>
                  <span className="font-semibold text-foreground">
                    {selectedTcForView.dateOfBirth} ({selectedTcForView.dateOfBirthWords})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">8. CLASS IN WHICH PUPIL LAST STUDIED:</span>
                  <span className="font-bold text-foreground">{selectedTcForView.lastClassStudied}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">9. SCHOOL / BOARD ANNUAL EXAMINATION:</span>
                  <span className="text-foreground">{selectedTcForView.schoolBoardExamResult}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px]">10. SUBJECTS STUDIED:</span>
                  <span className="text-foreground">{selectedTcForView.subjectsStudied.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">11. QUALIFIED FOR PROMOTION:</span>
                  <span className="font-semibold text-emerald-600">
                    {selectedTcForView.qualifiedForPromotion ? `Yes, to ${selectedTcForView.promotionClass}` : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">12. MONTH UP TO WHICH DUES PAID:</span>
                  <span className="font-semibold text-foreground">{selectedTcForView.monthUpToWhichDuesPaid}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">13. TOTAL WORKING DAYS:</span>
                  <span className="text-foreground">{selectedTcForView.totalWorkingDays} Days</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">14. TOTAL DAYS PRESENT:</span>
                  <span className="font-semibold text-foreground">{selectedTcForView.daysPresent} Days</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">15. GENERAL CONDUCT:</span>
                  <span className="font-bold text-emerald-600">{selectedTcForView.generalConduct}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">16. REASON FOR LEAVING SCHOOL:</span>
                  <span className="text-foreground">{REASON_LABELS[selectedTcForView.reasonForLeaving]}</span>
                </div>
              </div>

              {/* Digital Hash Checksum & Signature */}
              <div className="mt-4 pt-4 border-t border-dashed border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Stamp className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-foreground text-xs">OFFICIAL DIGITAL SIGNATURE</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Hash: {selectedTcForView.verificationHash}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                    Signatory: {selectedTcForView.principalSignatory}
                  </div>
                </div>

                <div className="text-right">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shadow-inner ml-auto">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <span className="text-[9px] text-muted-foreground block mt-0.5">Scan to Verify</span>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex gap-2 justify-end pt-3 border-t border-border">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>

              <a
                href={`/api/documents/transfer-certificate/${selectedTcForView.admissionNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={() => setSelectedTcForView(null)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue TC Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-foreground max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-foreground mb-1">
              Issue Official CBSE Transfer Certificate
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Requires 100% No-Dues clearance across Accounts, Library, and Laboratory departments.
            </p>

            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
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
                  <label className="font-semibold text-foreground block mb-1">Mother&apos;s Name *</label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Father&apos;s / Guardian&apos;s Name *</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Date of Birth (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Reason for Leaving *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as TcReasonForLeaving)}
                    className="w-full bg-muted/50 border border-input rounded-lg p-1.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="PARENT_JOB_TRANSFER">Parent Job Transfer</option>
                    <option value="HIGHER_STUDIES">Progression to Higher Studies</option>
                    <option value="RELOCATION_ABROAD">Family Relocation Abroad</option>
                    <option value="FAMILY_RELOCATION">Domestic Relocation</option>
                    <option value="PERSONAL_REASON">Personal / Domestic Grounds</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Total School Working Days *</label>
                  <input
                    type="number"
                    required
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value))}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Days Pupil Present *</label>
                  <input
                    type="number"
                    required
                    value={presentDays}
                    onChange={(e) => setPresentDays(Number(e.target.value))}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Subjects Studied (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              {/* No Dues Interlock */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800 dark:text-emerald-300">
                  <input
                    type="checkbox"
                    checked={duesCleared}
                    onChange={(e) => setDuesCleared(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>No-Dues Clearance Verified (Accounts, Library, Laboratories)</span>
                </label>
                <p className="text-[11px] text-muted-foreground pl-5">
                  Fee paid up to: {monthDues}. TC issuance blocked if dues pending per CBSE Rule 14.2.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Issue Transfer Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
