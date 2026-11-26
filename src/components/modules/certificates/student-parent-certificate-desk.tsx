'use client';

import React, { useState } from 'react';
import {
  Award,
  Download,
  Printer,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Send,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';

export interface IssuedCertificate {
  id: string;
  certificateNo: string;
  type: string;
  title: string;
  studentName: string;
  admissionNo: string;
  className: string;
  issueDate: string;
  issuedBy: string;
  verificationCode: string;
  purpose: string;
  content: string;
}

export interface CertificateRequest {
  id: string;
  requestRef: string;
  type: string;
  purpose: string;
  urgency: 'Normal (3-5 Days)' | 'Urgent (24 Hours)';
  requestedDate: string;
  status: 'Pending Admin Review' | 'Processing & Signing' | 'Ready for Collection';
  remarks?: string;
}

const INITIAL_CERTIFICATES: IssuedCertificate[] = [
  {
    id: 'cert-01',
    certificateNo: 'DPGA/2026/BON-089',
    type: 'Bonafide Student Certificate',
    title: 'Bonafide Certificate for Passport & Travel',
    studentName: 'Aarav Mehta',
    admissionNo: 'ADM-2022-0492',
    className: 'Class 10 - Section A',
    issueDate: '2026-10-15',
    issuedBy: 'Dr. S. K. Roy (Principal)',
    verificationCode: 'AUTH-DPGA-BON-88392',
    purpose: 'Passport Application & Visa Documentation',
    content:
      'This is to certify that Aarav Mehta, Son of Shri Rajesh Mehta, bearing Admission No. ADM-2022-0492, is a bonafide student of Class 10 (Section A) of Delhi Public Global Academy during the Academic Year 2026-27. His conduct and character have been exemplary.',
  },
  {
    id: 'cert-02',
    certificateNo: 'DPGA/2026/MRT-142',
    type: 'Academic Merit Certificate',
    title: 'First Rank in Term-1 Science & Mathematics',
    studentName: 'Aarav Mehta',
    admissionNo: 'ADM-2022-0492',
    className: 'Class 10 - Section A',
    issueDate: '2026-09-30',
    issuedBy: 'Dr. Debashis Mukherjee (Academic Director)',
    verificationCode: 'AUTH-DPGA-MRT-11928',
    purpose: 'Academic Excellence Award',
    content:
      'This certificate of Academic Merit is awarded to Aarav Mehta in recognition of securing First Position with 96.8% aggregate in the Class 10 Mid-Term CBSE Comprehensive Assessments.',
  },
  {
    id: 'cert-03',
    certificateNo: 'DPGA/2026/ACT-033',
    type: 'Co-Curricular & House Achievement',
    title: 'Inter-House Debate Championship (Gold Medalist)',
    studentName: 'Aarav Mehta',
    admissionNo: 'ADM-2022-0492',
    className: 'Class 10 - Section A',
    issueDate: '2026-08-15',
    issuedBy: 'Cultural Committee Head',
    verificationCode: 'AUTH-DPGA-ACT-99021',
    purpose: 'Sahodaya Inter-School Extempore',
    content:
      'Awarded for outstanding oratory skills and logical argumentation representing Tagore House in the Annual Inter-House Independence Day Debate.',
  },
];

const INITIAL_REQUESTS: CertificateRequest[] = [
  {
    id: 'req-01',
    requestRef: 'REQ-CERT-2026-0041',
    type: 'Character & Conduct Certificate',
    purpose: 'NTSE Stage-2 National Talent Scholarship Registration',
    urgency: 'Normal (3-5 Days)',
    requestedDate: '2026-11-20',
    status: 'Processing & Signing',
    remarks: 'Signed by Class Teacher. Pending Vice Principal seal.',
  },
];

interface StudentParentCertificateDeskProps {
  userRole: 'student' | 'parent';
  studentName?: string;
}

export function StudentParentCertificateDesk({
  userRole,
  studentName = 'Aarav Mehta',
}: StudentParentCertificateDeskProps) {
  const [activeTab, setActiveTab] = useState<string>('issued');
  const [certificates] = useState<IssuedCertificate[]>(INITIAL_CERTIFICATES);
  const [requests, setRequests] = useState<CertificateRequest[]>(INITIAL_REQUESTS);
  const [selectedCert, setSelectedCert] = useState<IssuedCertificate | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Request Form State
  const [reqType, setReqType] = useState('Bonafide Student Certificate');
  const [reqPurpose, setReqPurpose] = useState('');
  const [reqUrgency, setReqUrgency] = useState<'Normal (3-5 Days)' | 'Urgent (24 Hours)'>('Normal (3-5 Days)');

  const tabs: SubTabItem[] = [
    { id: 'issued', label: 'Issued Certificates', badge: certificates.length, icon: Award },
    { id: 'requests', label: 'Track Applications', badge: requests.length, icon: Clock },
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPurpose.trim()) {
      alert('Please specify the purpose for the certificate.');
      return;
    }

    const newRef = `REQ-CERT-2026-${String(requests.length + 42).padStart(4, '0')}`;
    const newReq: CertificateRequest = {
      id: `req-${Date.now()}`,
      requestRef: newRef,
      type: reqType,
      purpose: reqPurpose.trim(),
      urgency: reqUrgency,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Admin Review',
      remarks: 'Forwarded to School Administration Office for verification.',
    };

    setRequests([newReq, ...requests]);
    setShowRequestModal(false);
    setReqPurpose('');
    setSuccessToast(`Certificate request "${newRef}" submitted successfully. School office will process it.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Digital Certificate & Bonafide Issuance Hub
            </h1>
            <Badge variant="indigo" className="text-xs">CBSE Verified</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access verified institutional credentials, download authentic signed certificates with QR seals, or apply for new official documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowRequestModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 flex items-center gap-1.5 shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            Request Certificate
          </Button>
        </div>
      </div>

      {/* Navigation SubTabs */}
      <SubTabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: Issued Certificates */}
      {activeTab === 'issued' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="border-slate-200 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] font-mono text-slate-600 bg-slate-50">
                        {cert.certificateNo}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        Digitally Signed
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-900 leading-snug">
                      {cert.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      {cert.type}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Student:</span>
                        <span className="font-semibold text-slate-800">{cert.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Class & Roll:</span>
                        <span className="text-slate-700">{cert.className}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Issue Date:</span>
                        <span className="font-medium text-slate-800">{cert.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Purpose:</span>
                        <span className="text-slate-700 truncate max-w-[160px]">{cert.purpose}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                      <span>{cert.verificationCode}</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCert(cert)}
                    className="text-xs h-8 flex-1 flex items-center justify-center gap-1.5 text-slate-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview & Print
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Application Track Record */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Submitted Certificate Applications
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Track status of formal documentation requests processed by the academic registrar office.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-900">{req.requestRef}</span>
                        <Badge
                          className={`text-[10px] ${
                            req.status === 'Ready for Collection'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Processing & Signing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] text-slate-600">
                          {req.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-slate-800">{req.type}</p>
                      <p className="text-[11px] text-slate-500">
                        Purpose: <span className="text-slate-700">{req.purpose}</span> • Applied on {req.requestedDate}
                      </p>
                      {req.remarks && (
                        <p className="text-[11px] text-blue-700 italic">
                          Update: {req.remarks}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Tracking update: Application ${req.requestRef} is currently with Administrative Registrar Office.`)}
                        className="text-xs h-8 text-slate-700"
                      >
                        Check Status
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* REQUEST CERTIFICATE MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg bg-white border-slate-200 shadow-xl animate-in zoom-in-95 duration-150">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  Apply for Institutional Certificate
                </CardTitle>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Official documents issued with digital verification credentials.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateRequest}>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Information
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{studentName}</p>
                      <p className="text-[11px] text-slate-500">Class 10 - Section A • ADM-2022-0492</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Active Student</Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Certificate Type *
                  </label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value)}
                    className="w-full text-xs h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bonafide Student Certificate">Bonafide Student Certificate</option>
                    <option value="Character & Conduct Certificate">Character & Conduct Certificate</option>
                    <option value="Fee Paid & No Dues Certificate">Fee Paid & No Dues Certificate</option>
                    <option value="Medium of Instruction Certificate (English)">Medium of Instruction Certificate (English)</option>
                    <option value="Transfer Clearance & Migration NOC">Transfer Clearance & Migration NOC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purpose / Reason for Request *
                  </label>
                  <textarea
                    rows={2}
                    value={reqPurpose}
                    onChange={(e) => setReqPurpose(e.target.value)}
                    placeholder="e.g. Required for Passport application / Visa verification / Scholarship grant"
                    className="w-full text-xs rounded-md border border-slate-300 bg-white p-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Processing Speed
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer ${
                      reqUrgency === 'Normal (3-5 Days)' ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold' : 'border-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="urgency"
                        checked={reqUrgency === 'Normal (3-5 Days)'}
                        onChange={() => setReqUrgency('Normal (3-5 Days)')}
                        className="text-blue-600"
                      />
                      <span>Normal (3-5 Days)</span>
                    </label>

                    <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer ${
                      reqUrgency === 'Urgent (24 Hours)' ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold' : 'border-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="urgency"
                        checked={reqUrgency === 'Urgent (24 Hours)'}
                        onChange={() => setReqUrgency('Urgent (24 Hours)')}
                        className="text-blue-600"
                      />
                      <span>Urgent (24 Hours)</span>
                    </label>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 rounded-b-xl">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRequestModal(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 flex items-center gap-1.5"
                >
                  <Send className="h-3 w-3" />
                  Submit Application
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* FULL-PAGE AUTHENTIC CERTIFICATE PRINT PREVIEW MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-300 p-6 my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Control Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {selectedCert.certificateNo}
                </Badge>
                <span className="text-xs text-slate-500">Official Document Canvas</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print / Save PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCert(null)}
                  className="text-xs h-8 text-slate-600"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* PRINTABLE CANVAS */}
            <div className="border-8 border-double border-slate-800 p-8 rounded-lg bg-amber-50/20 text-center relative print:border-8 print:p-8">
              {/* Decorative Corners */}
              <div className="absolute top-2 left-2 text-slate-400 font-serif text-lg">❖</div>
              <div className="absolute top-2 right-2 text-slate-400 font-serif text-lg">❖</div>
              <div className="absolute bottom-2 left-2 text-slate-400 font-serif text-lg">❖</div>
              <div className="absolute bottom-2 right-2 text-slate-400 font-serif text-lg">❖</div>

              {/* Institutional Header */}
              <div className="space-y-1 mb-6">
                <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                  CBSE Affiliation No: 2130048 • School Code: 70142
                </p>
                <h2 className="text-2xl font-serif font-black tracking-tight text-slate-900 uppercase">
                  Delhi Public Global Academy
                </h2>
                <p className="text-xs text-slate-600 font-serif">
                  Main Institutional Campus, Sector 14, Vasant Kunj, New Delhi - 110070
                </p>
                <div className="w-32 h-0.5 bg-slate-800 mx-auto my-2" />
              </div>

              {/* Certificate Heading */}
              <div className="my-6">
                <span className="inline-block px-4 py-1 border border-slate-800 font-serif font-bold text-base uppercase tracking-wider text-slate-900 bg-white">
                  {selectedCert.type}
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-2">
                  Certificate Ref: {selectedCert.certificateNo}
                </p>
              </div>

              {/* Certificate Body Content */}
              <p className="text-sm font-serif leading-relaxed text-slate-800 px-6 my-6 text-justify">
                {selectedCert.content}
              </p>

              <div className="grid grid-cols-2 text-left text-xs font-serif px-6 my-4 border-t border-b border-slate-200 py-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Academic Session:</span>
                  <span className="font-semibold text-slate-800">2026-2027</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Issued For:</span>
                  <span className="font-semibold text-slate-800">{selectedCert.purpose}</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="grid grid-cols-3 items-end pt-8 mt-6">
                <div className="text-center">
                  <p className="text-xs font-mono text-slate-700">{selectedCert.issueDate}</p>
                  <p className="text-[11px] font-semibold text-slate-600 border-t border-slate-400 pt-1 mt-1">
                    Date of Issue
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 mx-auto flex items-center justify-center text-[10px] text-slate-400 font-serif uppercase">
                    Institutional<br />Seal
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs font-serif italic font-bold text-slate-900">{selectedCert.issuedBy}</p>
                  <p className="text-[11px] font-semibold text-slate-600 border-t border-slate-400 pt-1 mt-1">
                    Authorized Signatory
                  </p>
                </div>
              </div>

              {/* Digital Verification Bar */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-slate-700" />
                  Scan QR / Verify Online: vidyaos.edu/verify/{selectedCert.verificationCode}
                </span>
                <span>Security Stamp: CBSE-DIGI-SEC-PASS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
