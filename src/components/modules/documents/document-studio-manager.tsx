'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Award,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  ShieldCheck,
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  Ban,
  School,
  Stamp,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  DocumentCategory,
  IssuedCertificateRecord,
  INITIAL_DISPATCH_RECORDS,
  issueCertificate,
  revokeCertificate,
  verifyCertificate,
  filterCertificates,
} from '@/modules/documents/dispatch';

interface StudentPreset {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  dob: string;
  fatherName: string;
}

const MOCK_STUDENTS: StudentPreset[] = [
  {
    id: 'stu-01',
    name: 'Aarav Mehta',
    admissionNo: 'DPGA/2021/1042',
    className: 'Class 10-A',
    dob: '14-Apr-2010',
    fatherName: 'Mr. Rajesh Mehta',
  },
  {
    id: 'stu-02',
    name: 'Diya Sharma',
    admissionNo: 'DPGA/2021/1089',
    className: 'Class 10-B',
    dob: '22-Aug-2010',
    fatherName: 'Mr. Vikram Sharma',
  },
  {
    id: 'stu-03',
    name: 'Kabir Verma',
    admissionNo: 'DPGA/2020/0912',
    className: 'Class 9-C',
    dob: '05-Dec-2011',
    fatherName: 'Mr. Anand Verma',
  },
  {
    id: 'stu-04',
    name: 'Ananya Iyer',
    admissionNo: 'DPGA/2022/1201',
    className: 'Class 11-A',
    dob: '11-Jan-2009',
    fatherName: 'Mr. S. Iyer',
  },
];

export function DocumentStudioManager() {
  const [activeTab, setActiveTab] = useState<'studio' | 'register' | 'verify'>('studio');
  const [records, setRecords] = useState<IssuedCertificateRecord[]>(INITIAL_DISPATCH_RECORDS);

  // Studio form state
  const [selectedDocType, setSelectedDocType] = useState<DocumentCategory>('BONAFIDE');
  const [selectedStudent, setSelectedStudent] = useState<StudentPreset>(MOCK_STUDENTS[0]);
  const [customReason, setCustomReason] = useState<string>('For Passport Application Verification');
  const [signatory, setSignatory] = useState<string>('Dr. S. Mukherjee (Principal)');
  const [academicSession, setAcademicSession] = useState<string>('2025-26');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Register filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'REVOKED' | 'ALL'>('ALL');

  // Verification portal state
  const [verificationInput, setVerificationInput] = useState<string>('VOS-BON-101-7X9K');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    record?: IssuedCertificateRecord;
    message: string;
  } | null>(null);

  // Revocation modal state
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revocationReasonInput, setRevocationReasonInput] = useState<string>('');

  const handleIssueCertificate = () => {
    const newRecord = issueCertificate({
      documentType: selectedDocType,
      studentOrStaffId: selectedStudent.id,
      recipientName: selectedStudent.name,
      admissionOrEmployeeNo: selectedStudent.admissionNo,
      className: selectedStudent.className,
      academicSession,
      issuedBy: signatory,
      reasonOrRemarks: customReason,
    });

    setRecords([newRecord, ...records]);
    setFeedback(`Successfully issued ${newRecord.dispatchNumber} for ${newRecord.recipientName}`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleConfirmRevocation = () => {
    if (!revokingId || !revocationReasonInput.trim()) return;

    const { updatedRecords, revokedRecord } = revokeCertificate(
      records,
      revokingId,
      revocationReasonInput.trim()
    );

    setRecords(updatedRecords);
    setRevokingId(null);
    setRevocationReasonInput('');
    if (revokedRecord) {
      setFeedback(`Certificate ${revokedRecord.dispatchNumber} has been REVOKED.`);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleVerify = () => {
    const result = verifyCertificate(records, verificationInput);
    setVerificationResult(result);
  };

  const filteredRecords = filterCertificates(records, searchQuery, categoryFilter, statusFilter);

  // PDF endpoint mapping
  const getPdfRoute = (docType: DocumentCategory, studentId: string) => {
    switch (docType) {
      case 'MERIT':
        return `/api/documents/certificate/${studentId}`;
      case 'ID_CARD':
        return `/api/documents/id-card/${studentId}`;
      case 'TRANSFER_CERTIFICATE':
        return `/api/documents/transfer-certificate/${studentId}`;
      case 'FEE_RECEIPT':
        return `/api/documents/fee-receipt/${studentId}`;
      case 'REPORT_CARD':
        return `/api/documents/report-card/${studentId}`;
      case 'OFFER_LETTER':
        return `/api/documents/admission-letter/${studentId}`;
      case 'SALARY_SLIP':
        return `/api/documents/salary-slip/${studentId}`;
      default:
        return `/api/documents/certificate/${studentId}`;
    }
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'studio'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="h-4 w-4" />
          Document Studio & Preview
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'register'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          Statutory Dispatch Register ({records.length})
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'verify'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          QR Verification Terminal
        </button>
      </div>

      {/* TAB 1: STUDIO & LIVE PREVIEW */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Certificate Configuration
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Select the statutory document type and recipient student.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Document Template
                  </label>
                  <select
                    value={selectedDocType}
                    onChange={(e) => {
                      const type = e.target.value as DocumentCategory;
                      setSelectedDocType(type);
                      if (type === 'BONAFIDE') {
                        setCustomReason('For Passport Application Verification');
                      } else if (type === 'MERIT') {
                        setCustomReason('Secured 1st Rank with 98.4% Aggregate in Term Exams');
                      } else if (type === 'TRANSFER_CERTIFICATE') {
                        setCustomReason('Parent Relocation to Bangalore (Transfer of Service)');
                      } else if (type === 'ID_CARD') {
                        setCustomReason('Annual RFID Student Identity Card Issue');
                      }
                    }}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BONAFIDE">Student Bonafide Certificate</option>
                    <option value="MERIT">Certificate of Academic Merit & Distinction</option>
                    <option value="TRANSFER_CERTIFICATE">Official Transfer Certificate (TC)</option>
                    <option value="ID_CARD">Smart RFID Student Identity Card</option>
                    <option value="CHARACTER">Conduct & Character Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Select Student Recipient
                  </label>
                  <select
                    value={selectedStudent.id}
                    onChange={(e) => {
                      const found = MOCK_STUDENTS.find((s) => s.id === e.target.value);
                      if (found) setSelectedStudent(found);
                    }}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {MOCK_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.admissionNo}) - {s.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Purpose / Award Citation / Grounds
                  </label>
                  <Input
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="e.g. Higher Education Passport Clearance"
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Academic Session
                    </label>
                    <Input
                      value={academicSession}
                      onChange={(e) => setAcademicSession(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Authorized Signatory
                    </label>
                    <Input
                      value={signatory}
                      onChange={(e) => setSignatory(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Button
                    onClick={handleIssueCertificate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Issue & Enter in Dispatch Register
                  </Button>
                  <a
                    href={getPdfRoute(selectedDocType, selectedStudent.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4 text-slate-500" />
                      Generate & Open Official PDF
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Document Preview */}
          <div className="lg:col-span-7">
            <Card className="border-slate-300 shadow-md bg-amber-50/20 overflow-hidden">
              <div className="bg-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-blue-400" />
                  Live Authentic Certificate Stamping Preview
                </span>
                <span className="text-slate-400">CBSE Affiliation No: 2130894</span>
              </div>

              <div className="p-8 sm:p-12 bg-white m-4 border-8 border-double border-amber-900/30 rounded-sm relative shadow-inner">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <School className="w-96 h-96 text-slate-900" />
                </div>

                {/* Header */}
                <div className="text-center pb-6 border-b border-amber-900/20">
                  <div className="flex justify-center mb-2">
                    <div className="h-12 w-12 rounded-full bg-amber-100 border-2 border-amber-800 flex items-center justify-center text-amber-900 font-bold">
                      <School className="h-7 w-7" />
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                    Delhi Public Global Academy
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Affiliated to CBSE, New Delhi (Affiliation No: 2130894 | School Code: 71204)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Sector 12, Institutional Area, New Delhi - 110075 | Email: contact@dpga.edu.in
                  </p>
                </div>

                {/* Title Banner */}
                <div className="text-center my-6">
                  <span className="inline-block px-6 py-1.5 bg-amber-100 border border-amber-800 text-amber-950 font-serif font-bold text-sm tracking-wider uppercase rounded-xs">
                    {selectedDocType === 'BONAFIDE' && 'Bonafide Student Certificate'}
                    {selectedDocType === 'MERIT' && 'Certificate of Merit & Distinction'}
                    {selectedDocType === 'TRANSFER_CERTIFICATE' && 'School Transfer Certificate'}
                    {selectedDocType === 'ID_CARD' && 'Student Smart Identity Card'}
                    {selectedDocType === 'CHARACTER' && 'Character & Conduct Certificate'}
                  </span>
                </div>

                {/* Serial & Session Meta */}
                <div className="flex items-center justify-between text-xs text-slate-600 mb-6 font-mono">
                  <span>
                    Dispatch No:{' '}
                    <strong className="text-slate-900">
                      DPGA/{selectedDocType.substring(0, 3)}/{academicSession}/PREVIEW
                    </strong>
                  </span>
                  <span>
                    Issue Date:{' '}
                    <strong className="text-slate-900">
                      {new Date().toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </strong>
                  </span>
                </div>

                {/* Certificate Prose */}
                <div className="space-y-4 text-sm text-slate-800 leading-relaxed font-serif text-justify">
                  <p>
                    This is to formally certify that{' '}
                    <strong className="font-bold underline text-slate-950">
                      {selectedStudent.name}
                    </strong>
                    , Son/Daughter of{' '}
                    <strong className="font-bold text-slate-950">{selectedStudent.fatherName}</strong>,
                    bearing Admission Number{' '}
                    <strong className="font-bold font-mono text-slate-950">
                      {selectedStudent.admissionNo}
                    </strong>
                    , is a bonafide student of this institution studying in{' '}
                    <strong className="font-bold text-slate-950">{selectedStudent.className}</strong>{' '}
                    during the academic session{' '}
                    <strong className="font-bold text-slate-950">{academicSession}</strong>.
                  </p>

                  <p>
                    As per school records, the student's date of birth is recorded as{' '}
                    <strong className="font-bold text-slate-950">{selectedStudent.dob}</strong>.
                    During their academic tenure at Delhi Public Global Academy, their conduct and
                    character have been observed to be{' '}
                    <strong className="font-bold text-emerald-800">Exemplary</strong>.
                  </p>

                  <p>
                    This certificate is issued upon formal institutional request for the specific purpose of:{' '}
                    <span className="italic font-semibold text-slate-900 bg-amber-50 px-2 py-0.5 border-b border-amber-300">
                      "{customReason}"
                    </span>
                    .
                  </p>
                </div>

                {/* Signatures & Seal Section */}
                <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-3 items-end">
                  <div className="text-center space-y-1">
                    <div className="h-12 flex items-center justify-center">
                      <div className="border border-slate-300 p-1 rounded-sm bg-slate-50 flex items-center gap-1 text-[10px] font-mono text-slate-600">
                        <QrCode className="h-6 w-6 text-slate-800" />
                        <span>VERIFIED</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">Digital QR Seal</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex flex-col items-center justify-center p-2 rounded-full border-2 border-dashed border-red-700/60 text-red-800 text-[10px] font-bold uppercase rotate-[-6deg]">
                      <Stamp className="h-5 w-5 mb-0.5" />
                      <span>INSTITUTIONAL SEAL</span>
                      <span className="text-[8px]">DPGA NEW DELHI</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="h-8 border-b border-slate-900 border-dashed mx-4"></div>
                    <p className="text-xs font-bold text-slate-900">{signatory}</p>
                    <p className="text-[10px] text-slate-500">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH REGISTER */}
      {activeTab === 'register' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Institutional Certificate Dispatch Book
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Every issued document is permanently recorded with a serial dispatch number and cryptographic QR code.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => window.print()}
                  variant="outline"
                  className="text-xs border-slate-300"
                >
                  <Printer className="h-3.5 w-3.5 mr-1 text-slate-600" />
                  Print Register
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="sm:col-span-6 relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, admission no, or dispatch code..."
                  className="pl-9 text-xs bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as DocumentCategory | 'ALL')}
                  className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
                >
                  <option value="ALL">All Document Categories</option>
                  <option value="BONAFIDE">Bonafide Certificate</option>
                  <option value="MERIT">Merit Certificate</option>
                  <option value="TRANSFER_CERTIFICATE">Transfer Certificate</option>
                  <option value="ID_CARD">RFID ID Card</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'ACTIVE' | 'REVOKED' | 'ALL')}
                  className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active (Valid)</option>
                  <option value="REVOKED">Revoked</option>
                </select>
              </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Dispatch Serial No</th>
                    <th className="py-3 px-4">Recipient Student</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Verification Code</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No dispatch records found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          {r.dispatchNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{r.recipientName}</div>
                          <div className="text-[11px] text-slate-500">
                            {r.admissionOrEmployeeNo} | {r.className}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="secondary"
                            className={
                              r.documentType === 'BONAFIDE'
                                ? 'bg-blue-100 text-blue-800'
                                : r.documentType === 'MERIT'
                                ? 'bg-amber-100 text-amber-800'
                                : r.documentType === 'TRANSFER_CERTIFICATE'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-800'
                            }
                          >
                            {r.documentType}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{r.issuedAt}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-indigo-700 bg-indigo-50/50 px-2 rounded">
                          {r.verificationCode}
                        </td>
                        <td className="py-3 px-4">
                          {r.status === 'ACTIVE' ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                              Active / Valid
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                              Revoked
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setVerificationInput(r.verificationCode);
                              setActiveTab('verify');
                              handleVerify();
                            }}
                          >
                            Verify
                          </Button>
                          {r.status === 'ACTIVE' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-rose-600 hover:text-rose-700"
                              onClick={() => setRevokingId(r.id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Revocation Modal/Banner */}
            {revokingId && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <Ban className="h-4 w-4" />
                  Revoke Certificate Confirmation
                </div>
                <p className="text-xs text-rose-700">
                  Revoking this document will immediately flag its verification code as invalid across public verification portals.
                </p>
                <div className="flex items-center gap-3">
                  <Input
                    value={revocationReasonInput}
                    onChange={(e) => setRevocationReasonInput(e.target.value)}
                    placeholder="Enter mandatory reason for revocation (e.g. Erroneous issuance, Duplicate)..."
                    className="text-xs bg-white flex-1"
                  />
                  <Button
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
                    onClick={handleConfirmRevocation}
                  >
                    Confirm Revoke
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      setRevokingId(null);
                      setRevocationReasonInput('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: VERIFICATION TERMINAL */}
      {activeTab === 'verify' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Institutional Public Verification Terminal
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Enter the certificate verification code printed on the official document or scan the document QR code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  placeholder="e.g. VOS-BON-101-7X9K"
                  className="font-mono text-sm tracking-wide uppercase"
                />
                <Button
                  onClick={handleVerify}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                >
                  Verify Now
                </Button>
              </div>

              {verificationResult && (
                <div
                  className={`p-5 rounded-xl border mt-4 ${
                    verificationResult.valid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {verificationResult.valid ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-2 flex-1">
                      <h4 className="font-bold text-sm">
                        {verificationResult.valid
                          ? 'Valid Institutional Document Verified'
                          : 'Document Verification Failed'}
                      </h4>
                      <p className="text-xs leading-relaxed">{verificationResult.message}</p>

                      {verificationResult.record && (
                        <div className="bg-white/80 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 mt-2 font-sans">
                          <div>
                            <span className="text-slate-500">Dispatch Serial:</span>{' '}
                            <strong className="text-slate-900 font-mono">
                              {verificationResult.record.dispatchNumber}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Student Name:</span>{' '}
                            <strong className="text-slate-900">
                              {verificationResult.record.recipientName}
                            </strong>{' '}
                            ({verificationResult.record.admissionOrEmployeeNo})
                          </div>
                          <div>
                            <span className="text-slate-500">Class & Session:</span>{' '}
                            <strong className="text-slate-900">
                              {verificationResult.record.className} |{' '}
                              {verificationResult.record.academicSession}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Issued On:</span>{' '}
                            <span className="text-slate-900">
                              {verificationResult.record.issuedAt}
                            </span>{' '}
                            by {verificationResult.record.issuedBy}
                          </div>
                          {verificationResult.record.status === 'REVOKED' && (
                            <div className="text-rose-700 font-semibold pt-1 border-t border-rose-200">
                              Grounds for Revocation:{' '}
                              {verificationResult.record.revocationReason || 'Administrative decision'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
