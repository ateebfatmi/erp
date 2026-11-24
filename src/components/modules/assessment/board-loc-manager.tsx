'use client';

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Search,
  Filter,
  Users,
  CreditCard,
  Camera,
  PenTool,
  Sparkles,
  School,
  X,
  IndianRupee,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  LOCCandidate,
  BoardClass,
  INITIAL_LOC_CANDIDATES,
  validateCandidateLOC,
  calculateLOCSummary,
  formatCWSNConcession,
  formatParikshaSangamRow,
} from '@/modules/assessment/board-loc';

export function BoardLOCManager() {
  const [candidates, setCandidates] = useState<LOCCandidate[]>(INITIAL_LOC_CANDIDATES);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingCandidateId, setInspectingCandidateId] = useState<string | null>(null);
  const [showPrintRoll, setShowPrintRoll] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Edit fields for candidate being inspected
  const [editPEN, setEditPEN] = useState<string>('');
  const [editAadhar, setEditAadhar] = useState<string>('');

  const summary = calculateLOCSummary(candidates);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    if (selectedClass !== 'all' && c.boardClass !== selectedClass) return false;
    if (selectedStatus !== 'all' && c.validationStatus !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.candidateName.toLowerCase().includes(q) ||
        c.cbseRegNo.toLowerCase().includes(q) ||
        (c.rollNo && c.rollNo.includes(q)) ||
        c.admissionNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const inspectedCandidate = candidates.find((c) => c.id === inspectingCandidateId);
  const inspectedValidation = inspectedCandidate ? validateCandidateLOC(inspectedCandidate) : null;

  const handleOpenInspect = (cand: LOCCandidate) => {
    setInspectingCandidateId(cand.id);
    setEditPEN(cand.udisePEN);
    setEditAadhar(cand.aadharNumber);
  };

  // Toggle Photo verification
  const handleTogglePhoto = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const updated = { ...c, photoWithDateVerified: !c.photoWithDateVerified };
        const val = validateCandidateLOC(updated);
        return {
          ...updated,
          validationStatus: val.isValid ? 'verified' : 'data_error',
          validationErrors: val.errors,
          feeAmount: val.calculatedFee,
        };
      })
    );
  };

  // Toggle Signature verification
  const handleToggleSignature = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const updated = { ...c, signatureVerified: !c.signatureVerified };
        const val = validateCandidateLOC(updated);
        return {
          ...updated,
          validationStatus: val.isValid ? 'verified' : 'data_error',
          validationErrors: val.errors,
          feeAmount: val.calculatedFee,
        };
      })
    );
  };

  // Quick fix for Mathematics Conflict (e.g. remove Math Basic if both present)
  const handleFixMathConflict = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        // Keep Math Standard 041, drop Math Basic 241
        const cleanedSubjects = c.subjects.filter((s) => s.code !== '241');
        // Add Social Science if missing to make 5 subjects
        if (!cleanedSubjects.some((s) => s.code === '087')) {
          cleanedSubjects.push({
            code: '087',
            name: 'SOCIAL SCIENCE',
            type: 'compulsory',
            hasPractical: false,
          });
        }
        const updated = {
          ...c,
          subjects: cleanedSubjects,
          udisePEN: '21300450013',
          aadharNumber: '998877665544',
          photoWithDateVerified: true,
          signatureVerified: true,
        };
        const val = validateCandidateLOC(updated);
        return {
          ...updated,
          validationStatus: val.isValid ? 'verified' : 'data_error',
          validationErrors: val.errors,
          feeAmount: val.calculatedFee,
        };
      })
    );
  };

  // Approve & Seal candidate
  const handleApproveByPrincipal = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        return { ...c, validationStatus: 'approved_by_principal' };
      })
    );
    setInspectingCandidateId(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = 'CBSE_REG_NO,CANDIDATE_NAME,MOTHER_NAME,FATHER_NAME,DOB,GENDER,UDISE_PEN,AADHAR,SUBJECT_CODES,FEE,CWSN';
    const rows = candidates.map(formatParikshaSangamRow);
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CBSE_LOC_2026_PARIKSHA_SANGAM_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CBSE Pariksha Sangam formatted CSV exported successfully!');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Statutory Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Total Board Candidates
              </p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">{summary.totalCandidates}</h3>
              <p className="text-xs text-blue-700 mt-0.5">
                Class 10: {summary.class10Count} • Class 12: {summary.class12Count}
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Verified & Ready
              </p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">{summary.verifiedCount}</h3>
              <p className="text-xs text-emerald-700 mt-0.5">Pariksha Sangam Compliant</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                Critical Data Errors
              </p>
              <h3 className="text-2xl font-bold text-rose-950 mt-1">{summary.dataErrorCount}</h3>
              <p className="text-xs text-rose-700 mt-0.5">Will be rejected by CBSE portal</p>
            </div>
            <div className="h-10 w-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                CBSE Fee Liability
              </p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">
                ₹{summary.totalCBSEFeeLiability.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">Exam, Practicals & Migration</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <Input
            placeholder="Search candidate name, reg no, roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs max-w-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="all">All Classes (10 & 12)</option>
            <option value="class_10">Class 10 (Secondary)</option>
            <option value="class_12">Class 12 (Sr Secondary)</option>
          </select>

          <span className="text-slate-500 ml-2">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="all">All Records</option>
            <option value="verified">Verified (Error-Free)</option>
            <option value="data_error">Data Errors</option>
            <option value="approved_by_principal">Approved by Principal</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-8 text-xs flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export Pariksha CSV
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPrintRoll(!showPrintRoll)}
            className="h-8 text-xs flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            {showPrintRoll ? 'Hide Master Roll' : 'CBSE Master Roll'}
          </Button>
        </div>
      </div>

      {/* Printable Master Roll Preview */}
      {showPrintRoll && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/20 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-blue-950 uppercase">
                  Central Board of Secondary Education — Final List of Candidates (LOC 2026-27)
                </CardTitle>
                <CardDescription className="text-xs text-blue-700">
                  Vidya Mandir Sr. Sec. School (School Code: 2130045 • Affiliation: 2130045)
                </CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white text-[10px]">Statutory Document</Badge>
            </div>
          </CardHeader>
          <CardContent className="text-[11px] text-slate-700 space-y-2">
            <p>
              Certified that the candidates listed hereunder are bonafide students of this institution
              having fulfilled attendance requirements under CBSE Examination By-Laws Rule 13. Subject
              combinations, names of parents, and date of birth have been cross-verified with the Admission
              and Withdrawal Register.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200 font-semibold text-slate-900">
              <div>Class 10 Roll: {summary.class10Count} Candidates</div>
              <div>Class 12 Roll: {summary.class12Count} Candidates</div>
              <div>Total Exam Fee: ₹{summary.totalCBSEFeeLiability.toLocaleString('en-IN')}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Candidates Roster Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Candidate / Roll</th>
                  <th className="p-3">CBSE Reg No & PEN</th>
                  <th className="p-3">Class & Stream</th>
                  <th className="p-3">Subject Codes</th>
                  <th className="p-3">CBSE Fee</th>
                  <th className="p-3">Validation Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{cand.candidateName}</div>
                      <div className="text-[10px] text-slate-500">
                        {cand.gender === 'M' ? 'Son of' : 'Daughter of'} {cand.motherName} & {cand.fatherName}
                      </div>
                      {cand.rollNo && (
                        <span className="font-mono text-[10px] text-blue-600 block">Roll: {cand.rollNo}</span>
                      )}
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <div className="font-semibold text-slate-800">{cand.cbseRegNo}</div>
                      <div className="text-[10px] text-slate-500">
                        PEN: {cand.udisePEN} • Aadhar: {cand.aadharNumber.slice(-4).padStart(12, '•')}
                      </div>
                    </td>

                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-semibold bg-slate-50">
                        {cand.boardClass === 'class_10' ? 'Class 10' : 'Class 12'}-{cand.section}
                      </Badge>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{cand.stream || 'General'}</span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.subjects
                          .filter((s) => s.type !== 'internal_assessment')
                          .map((s) => (
                            <span
                              key={s.code}
                              title={s.name}
                              className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] rounded border border-slate-200"
                            >
                              {s.code}
                            </span>
                          ))}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {cand.subjects.length} subjects enrolled
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-slate-900">
                      ₹{cand.feeAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3">
                      {cand.validationStatus === 'approved_by_principal' ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                          ✓ Principal Sealed
                        </Badge>
                      ) : cand.validationStatus === 'verified' ? (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[10px]">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          {cand.validationErrors.length} Errors
                        </Badge>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenInspect(cand)}
                        className={`text-xs ${
                          cand.validationStatus === 'data_error'
                            ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Inspect & Verify
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* INSPECTION & VERIFICATION MODAL */}
      {inspectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  CBSE Pariksha Sangam LOC Record: {inspectedCandidate.candidateName}
                </h3>
                <p className="text-[10px] font-mono text-slate-500">
                  CBSE Reg: {inspectedCandidate.cbseRegNo} • Admission: {inspectedCandidate.admissionNumber}
                </p>
              </div>
              <button
                onClick={() => setInspectingCandidateId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Error alerts if present */}
            {inspectedCandidate.validationErrors.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1.5 text-xs text-rose-800">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  CBSE Portal Validation Violations:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {inspectedCandidate.validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
                {inspectedCandidate.validationErrors.some((e) => e.includes('Conflicting Mathematics')) && (
                  <Button
                    size="sm"
                    className="mt-2 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                    onClick={() => handleFixMathConflict(inspectedCandidate.id)}
                  >
                    Auto-Resolve Subject Conflict & Complete Data
                  </Button>
                )}
              </div>
            )}

            {/* Bio Data Fields */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Date of Birth (DOB):</span>
                <span className="font-bold text-slate-900">{inspectedCandidate.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Gender / CWSN Category:</span>
                <span className="font-bold text-slate-900">
                  {inspectedCandidate.gender === 'M' ? 'Male' : 'Female'} •{' '}
                  {formatCWSNConcession(inspectedCandidate.cwsnCategory)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">UDISE+ PEN:</span>
                <span className="font-mono font-bold text-slate-900">{inspectedCandidate.udisePEN}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Aadhar UID:</span>
                <span className="font-mono font-bold text-slate-900">{inspectedCandidate.aadharNumber}</span>
              </div>
            </div>

            {/* Enrolled Subjects List */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-800 block">Enrolled Examination Subjects:</span>
              <div className="space-y-1">
                {inspectedCandidate.subjects.map((sub) => (
                  <div
                    key={sub.code}
                    className="p-2 border border-slate-200 rounded-md bg-white flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {sub.code}
                      </span>
                      <span className="font-semibold text-slate-900">{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      {sub.hasPractical && (
                        <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[9px] py-0">
                          Practical (+₹150)
                        </Badge>
                      )}
                      <span className="capitalize">{sub.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo & Signature Verification Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 border rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Photo with Date Stamp</span>
                  <span className="text-[10px] text-slate-500">35mm x 45mm, Name & Date</span>
                </div>
                <button
                  onClick={() => handleTogglePhoto(inspectedCandidate.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border cursor-pointer ${
                    inspectedCandidate.photoWithDateVerified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  {inspectedCandidate.photoWithDateVerified ? '✓ Verified' : 'Mark Verified'}
                </button>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Digital Signature</span>
                  <span className="text-[10px] text-slate-500">Black ink signature</span>
                </div>
                <button
                  onClick={() => handleToggleSignature(inspectedCandidate.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border cursor-pointer ${
                    inspectedCandidate.signatureVerified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  {inspectedCandidate.signatureVerified ? '✓ Verified' : 'Mark Verified'}
                </button>
              </div>
            </div>

            {/* Fee summary & Principal Seal action */}
            <div className="flex items-center justify-between pt-3 border-t text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Calculated CBSE Examination Fee:</span>
                <span className="text-base font-bold text-slate-900">
                  ₹{inspectedCandidate.feeAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInspectingCandidateId(null)}
                >
                  Close
                </Button>
                {inspectedCandidate.validationErrors.length === 0 && (
                  <Button
                    size="sm"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleApproveByPrincipal(inspectedCandidate.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Approve & Seal for Pariksha Sangam
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
