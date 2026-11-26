'use client';

import React, { useState } from 'react';
import {
  Award,
  FileText,
  Printer,
  Plus,
  Sliders,
  CheckCircle2,
  Sparkles,
  Download,
  Eye,
  FileCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';

export type CertificateTabId = 'issued' | 'designer';

export interface IssuedCertificate {
  id: string;
  certNumber: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  certificateType: 'Bonafide' | 'Character & Conduct' | 'Sports Achievement' | 'Fee Paid Certificate' | 'Merit Certificate';
  issueDate: string;
  issuedBy: string;
  status: 'valid' | 'revoked';
}

interface UnifiedCertificatesHubProps {
  initialTab?: CertificateTabId;
}

export function UnifiedCertificatesHub({ initialTab = 'issued' }: UnifiedCertificatesHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Issued certificates list
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificate[]>([
    {
      id: 'cert-1',
      certNumber: 'CERT-2026-081',
      studentName: 'Aarav Mehta',
      admissionNumber: 'ADM-2024-001',
      className: 'Class 10 - Section A',
      certificateType: 'Bonafide',
      issueDate: '2026-11-26',
      issuedBy: 'Dr. Anand Swaroop (Principal)',
      status: 'valid',
    },
    {
      id: 'cert-2',
      certNumber: 'CERT-2026-080',
      studentName: 'Diya Sharma',
      admissionNumber: 'ADM-2024-002',
      className: 'Class 10 - Section B',
      certificateType: 'Character & Conduct',
      issueDate: '2026-11-25',
      issuedBy: 'Dr. Anand Swaroop (Principal)',
      status: 'valid',
    },
    {
      id: 'cert-3',
      certNumber: 'CERT-2026-079',
      studentName: 'Rohan Verma',
      admissionNumber: 'ADM-2024-003',
      className: 'Class 9 - Section A',
      certificateType: 'Sports Achievement',
      issueDate: '2026-11-20',
      issuedBy: 'Coach Balwant Singh (Sports Director)',
      status: 'valid',
    },
    {
      id: 'cert-4',
      certNumber: 'CERT-2026-078',
      studentName: 'Ananya Iyer',
      admissionNumber: 'ADM-2024-004',
      className: 'Class 12 - Science',
      certificateType: 'Fee Paid Certificate',
      issueDate: '2026-11-18',
      issuedBy: 'Accounts Bursar Office',
      status: 'valid',
    },
  ]);

  // Certificate Print / Preview State
  const [previewCert, setPreviewCert] = useState<IssuedCertificate | null>(null);

  // New Certificate Issue Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    studentName: '',
    admissionNumber: '',
    className: 'Class 10 - Section A',
    certificateType: 'Bonafide' as IssuedCertificate['certificateType'],
  });

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.studentName || !newCert.admissionNumber) return;

    const record: IssuedCertificate = {
      id: `cert-${Date.now()}`,
      certNumber: `CERT-2026-0${issuedCerts.length + 82}`,
      studentName: newCert.studentName,
      admissionNumber: newCert.admissionNumber,
      className: newCert.className,
      certificateType: newCert.certificateType,
      issueDate: new Date().toISOString().slice(0, 10),
      issuedBy: 'Principal Office',
      status: 'valid',
    };

    setIssuedCerts([record, ...issuedCerts]);
    setIsIssueModalOpen(false);
    setNewCert({
      studentName: '',
      admissionNumber: '',
      className: 'Class 10 - Section A',
      certificateType: 'Bonafide',
    });
  };

  // --- Template Designer State ---
  const [templateConfig, setTemplateConfig] = useState({
    certType: 'Bonafide Certificate',
    headerTitle: 'DELHI PUBLIC GLOBAL ACADEMY',
    affiliationText: 'Affiliated to Central Board of Secondary Education (CBSE), New Delhi',
    includeLetterhead: true,
    includeWatermark: true,
    includeSignature: true,
    bodyTemplate:
      'This is to certify that {{student_name}}, bearing Admission No. {{admission_number}}, is a bonafide student of this institution studying in {{class}} during the academic session {{academic_year}}. To the best of our knowledge, they bear good moral character and conduct.',
  });

  const tabs: SubTabItem[] = [
    {
      id: 'issued',
      label: 'Certificate Registry & Issuance',
      icon: Award,
      badge: `${issuedCerts.length} Issued`,
    },
    {
      id: 'designer',
      label: 'Certificate Studio & Template Designer',
      icon: Sliders,
      badge: 'Dynamic Tags',
    },
  ];

  const columns: DataTableColumn<IssuedCertificate>[] = [
    {
      key: 'certNumber',
      header: 'Cert Number',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-indigo-600 text-xs">{row.certNumber}</span>,
    },
    {
      key: 'studentName',
      header: 'Student & Admission',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{row.studentName}</span>
          <span className="text-[10px] text-slate-500 font-mono">{row.admissionNumber} • {row.className}</span>
        </div>
      ),
    },
    {
      key: 'certificateType',
      header: 'Certificate Type',
      sortable: true,
      render: (row) => <Badge variant="indigo" className="text-[10px] font-semibold">{row.certificateType}</Badge>,
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      sortable: true,
      render: (row) => <span className="font-mono text-xs text-slate-600">{formatDate(row.issueDate)}</span>,
    },
    {
      key: 'issuedBy',
      header: 'Authorized Signatory',
      render: (row) => <span className="text-xs text-slate-700">{row.issuedBy}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewCert(row)}
            className="h-7 px-2.5 text-xs gap-1 text-slate-700 hover:text-indigo-600 hover:border-indigo-300"
          >
            <Eye className="h-3 w-3 text-indigo-600" /> Preview
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setPreviewCert(row);
              setTimeout(() => window.print(), 200);
            }}
            className="h-7 px-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1"
          >
            <Printer className="h-3 w-3" /> Print
          </Button>
        </div>
      ),
    },
  ];

  // Render template sample
  const renderedSampleBody = templateConfig.bodyTemplate
    .replace('{{student_name}}', 'Aarav Mehta')
    .replace('{{admission_number}}', 'DPGA/2024/001')
    .replace('{{class}}', 'Class 10-A')
    .replace('{{academic_year}}', '2025-2026');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-indigo-600" />
              Institutional Certificate Studio &amp; Template Designer
            </h1>
            <Badge variant="indigo" className="text-[11px] font-semibold py-0.5">
              Verified Public Sign-Off
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Issue cryptographically verifiable Bonafide, Character, Merit, and Sports certificates. Customize institutional
            templates with dynamic tags, authorized digital stamps, and automated verification QR codes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'issued' && (
            <Button
              size="sm"
              onClick={() => setIsIssueModalOpen(true)}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Issue New Certificate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Issued Certificates Table */}
      {activeTab === 'issued' && (
        <div className="space-y-4">
          <DataTable
            data={issuedCerts}
            columns={columns}
            rowKey="id"
            searchPlaceholder="Search certificates by student name, cert number, or type..."
            exportCsvFilename="issued_certificates_register"
          />
        </div>
      )}

      {/* Tab 2: Certificate Template Designer */}
      {activeTab === 'designer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-200">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-indigo-600" />
                  Template Configuration &amp; Variables
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Certificate Type</label>
                  <select
                    value={templateConfig.certType}
                    onChange={(e) => setTemplateConfig({ ...templateConfig, certType: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900"
                  >
                    <option value="Bonafide Certificate">Bonafide Certificate</option>
                    <option value="Character & Conduct Certificate">Character &amp; Conduct Certificate</option>
                    <option value="Sports Achievement Certificate">Sports Achievement Certificate</option>
                    <option value="Fee Paid Certificate">Fee Paid Certificate</option>
                    <option value="Academic Merit Certificate">Academic Merit Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institution Heading</label>
                  <Input
                    value={templateConfig.headerTitle}
                    onChange={(e) => setTemplateConfig({ ...templateConfig, headerTitle: e.target.value })}
                    className="text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Affiliation By-Line</label>
                  <Input
                    value={templateConfig.affiliationText}
                    onChange={(e) => setTemplateConfig({ ...templateConfig, affiliationText: e.target.value })}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Body Text Template (Use Placeholders)
                  </label>
                  <textarea
                    rows={5}
                    value={templateConfig.bodyTemplate}
                    onChange={(e) => setTemplateConfig({ ...templateConfig, bodyTemplate: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-mono bg-slate-50 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-indigo-600 font-mono">
                    <span className="bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer">{'{{student_name}}'}</span>
                    <span className="bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer">{'{{admission_number}}'}</span>
                    <span className="bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer">{'{{class}}'}</span>
                    <span className="bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer">{'{{academic_year}}'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.includeLetterhead}
                      onChange={(e) => setTemplateConfig({ ...templateConfig, includeLetterhead: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Display Institutional Emblem &amp; Letterhead</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.includeWatermark}
                      onChange={(e) => setTemplateConfig({ ...templateConfig, includeWatermark: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Background Security Watermark</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.includeSignature}
                      onChange={(e) => setTemplateConfig({ ...templateConfig, includeSignature: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Principal Signature &amp; Seal Box</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border-slate-300 shadow-md bg-white p-6 relative overflow-hidden">
              {templateConfig.includeWatermark && (
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                  <Building className="h-96 w-96 text-slate-900" />
                </div>
              )}

              {/* Certificate Border Frame */}
              <div className="border-4 border-double border-indigo-950 p-6 rounded-lg text-center space-y-5 relative">
                {/* Header */}
                {templateConfig.includeLetterhead && (
                  <div className="space-y-1">
                    <div className="h-10 w-10 mx-auto rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">
                      <Award className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-extrabold tracking-wider text-slate-950 font-serif uppercase">
                      {templateConfig.headerTitle}
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans">
                      {templateConfig.affiliationText}
                    </p>
                    <div className="w-24 h-0.5 bg-indigo-900 mx-auto mt-2" />
                  </div>
                )}

                {/* Title */}
                <div className="py-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b-2 border-indigo-900 pb-0.5 font-serif">
                    {templateConfig.certType}
                  </span>
                </div>

                {/* Body Text */}
                <div className="text-xs text-slate-800 leading-relaxed font-serif px-6 py-2 text-justify">
                  {renderedSampleBody}
                </div>

                {/* Footer Signatures */}
                {templateConfig.includeSignature && (
                  <div className="pt-8 flex items-end justify-between px-6 text-xs text-slate-700 font-sans">
                    <div className="text-left space-y-1">
                      <div className="h-8 border-b border-slate-300 w-28" />
                      <span className="text-[10px] text-slate-500 block font-semibold">Dated: 26-11-2026</span>
                      <span className="text-[10px] text-slate-500 block font-mono">Ref: CERT-2026-DEMO</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-10 w-10 mx-auto rounded-full border border-dashed border-slate-400 flex items-center justify-center text-[8px] text-slate-400">
                        SEAL
                      </div>
                      <span className="text-[10px] text-slate-500 block">School Stamp</span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-8 border-b border-slate-400 w-32" />
                      <span className="text-[10px] font-bold text-slate-900 block">Principal</span>
                      <span className="text-[9px] text-slate-500 block">Delhi Public Global Academy</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal: Issue Certificate */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl border-slate-200 animate-in fade-in zoom-in-95">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" />
                Issue Official Certificate
              </CardTitle>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleIssueCertificate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Diya Sharma"
                    value={newCert.studentName}
                    onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admission Number *
                    </label>
                    <Input
                      required
                      placeholder="DPGA/2024/002"
                      value={newCert.admissionNumber}
                      onChange={(e) => setNewCert({ ...newCert, admissionNumber: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class &amp; Section
                    </label>
                    <Input
                      required
                      value={newCert.className}
                      onChange={(e) => setNewCert({ ...newCert, className: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Certificate Type
                  </label>
                  <select
                    value={newCert.certificateType}
                    onChange={(e) => setNewCert({ ...newCert, certificateType: e.target.value as any })}
                    className="w-full text-xs h-9 px-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Bonafide">Bonafide Certificate</option>
                    <option value="Character & Conduct">Character &amp; Conduct Certificate</option>
                    <option value="Sports Achievement">Sports Achievement Certificate</option>
                    <option value="Fee Paid Certificate">Fee Paid Certificate</option>
                    <option value="Merit Certificate">Academic Merit Certificate</option>
                  </select>
                </div>
                <div className="pt-3 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsIssueModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-indigo-600 text-white text-xs font-semibold">
                    Generate &amp; Issue
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Print / Preview Certificate */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl border-slate-300">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Printer className="h-4 w-4 text-indigo-600" />
                Certificate Preview — {previewCert.certNumber}
              </CardTitle>
              <button onClick={() => setPreviewCert(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕
              </button>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-4">
              <div className="border-4 border-double border-indigo-950 p-6 rounded-lg text-center space-y-4 bg-amber-50/20 font-serif">
                <div className="text-xs font-bold tracking-widest text-indigo-900 uppercase">
                  DELHI PUBLIC GLOBAL ACADEMY
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-sans">
                  CBSE Affiliated Institution &bull; Senior Secondary
                </div>
                <div className="text-xs font-bold uppercase underline text-indigo-950 pt-2">
                  {previewCert.certificateType}
                </div>
                <div className="text-xs text-slate-800 leading-relaxed text-justify px-2">
                  This is to certify that <strong>{previewCert.studentName}</strong> (Admission No.{' '}
                  <strong>{previewCert.admissionNumber}</strong>) is a student of this school in{' '}
                  <strong>{previewCert.className}</strong>. They bear good moral character and conduct.
                </div>
                <div className="pt-6 flex justify-between text-[10px] font-sans text-slate-600">
                  <div>Date: {formatDate(previewCert.issueDate)}</div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">Dr. Anand Swaroop</div>
                    <div>Principal / Authorized Signatory</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewCert(null)} className="flex-1 text-xs">
                  Close
                </Button>
                <Button size="sm" onClick={() => window.print()} className="flex-1 bg-indigo-600 text-white text-xs gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Print Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
