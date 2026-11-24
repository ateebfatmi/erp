'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TransferCertificateRecord,
  INITIAL_TC_REGISTRY,
  verifyTransferCertificate,
} from '@/modules/students/transfer-certificate';
import {
  Award,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  School,
  Stamp,
  Printer,
  Download,
  ArrowLeft,
  QrCode,
  FileText,
} from 'lucide-react';

export default function PublicTcVerificationPage() {
  const [registry] = useState<TransferCertificateRecord[]>(INITIAL_TC_REGISTRY);
  const [tcQuery, setTcQuery] = useState('TC/2026/1042');
  const [result, setResult] = useState<{
    searched: boolean;
    isValid: boolean;
    certificate?: TransferCertificateRecord;
    reason?: string;
  }>({
    searched: true,
    isValid: true,
    certificate: INITIAL_TC_REGISTRY[0],
  });

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tcQuery.trim()) return;

    const res = verifyTransferCertificate(registry, {
      tcNumber: tcQuery.trim(),
      admissionNumber: tcQuery.trim(),
    });

    setResult({
      searched: true,
      isValid: res.isValid,
      certificate: res.certificate,
      reason: res.reason,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation link back to portal */}
        <div>
          <Link
            href="/portal/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to VidyaOS Portal</span>
          </Link>
        </div>

        {/* Institution Verification Header */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center space-y-2">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
            <School className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Official Transfer Certificate (TC) Verification Portal
          </h1>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Public verification registry compliant with CBSE Affiliation By-Laws (Rule 14 & 15). Verify the authenticity of school leaving documents issued by Delhi Public Global Academy.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter TC Number (e.g. TC/2026/1042) or Admission No (DPGA/2021/1042)..."
                value={tcQuery}
                onChange={(e) => setTcQuery(e.target.value)}
                className="w-full bg-muted/50 border border-input rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Authenticity</span>
            </button>
          </form>

          <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span>Try sample TC:</span>
            <button
              type="button"
              onClick={() => setTcQuery('TC/2026/1042')}
              className="text-blue-600 font-mono underline font-medium"
            >
              TC/2026/1042
            </button>
            <span>or</span>
            <button
              type="button"
              onClick={() => setTcQuery('DPGA/2021/1089')}
              className="text-blue-600 font-mono underline font-medium"
            >
              DPGA/2021/1089
            </button>
          </div>
        </div>

        {/* Result Card */}
        {result.searched && (
          <div>
            {result.isValid && result.certificate ? (
              <div className="bg-card border-2 border-emerald-500/40 rounded-2xl p-6 shadow-lg space-y-4 animate-in fade-in duration-200">
                {/* Verified Badge Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                        OFFICIALLY VERIFIED & GENUINE
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Certified Transfer Certificate found in the statutory school register.
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-muted border border-border">
                    {result.certificate.tcNumber}
                  </span>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">PUPIL FULL NAME</span>
                    <span className="font-bold text-foreground text-sm">{result.certificate.studentName}</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">UDISE+ PEN NUMBER</span>
                    <span className="font-mono font-bold text-foreground text-sm">
                      {result.certificate.penNumber}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">ADMISSION NUMBER</span>
                    <span className="font-mono font-bold text-foreground">
                      {result.certificate.admissionNumber}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">DATE OF BIRTH</span>
                    <span className="font-semibold text-foreground">
                      {result.certificate.dateOfBirth} ({result.certificate.dateOfBirthWords})
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">PARENTS</span>
                    <span className="text-foreground">
                      Mother: {result.certificate.motherName} &bull; Father: {result.certificate.fatherName}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">CLASS LAST STUDIED</span>
                    <span className="font-bold text-foreground">{result.certificate.lastClassStudied}</span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">PROMOTION STATUS</span>
                    <span className="font-semibold text-emerald-600">
                      {result.certificate.qualifiedForPromotion
                        ? `Promoted to ${result.certificate.promotionClass}`
                        : 'Not Promoted'}
                    </span>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[10px]">DATE OF ISSUE</span>
                    <span className="font-mono text-foreground">{result.certificate.issueDate}</span>
                  </div>
                </div>

                {/* Digital Verification Seal */}
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                      <Stamp className="w-4 h-4 text-emerald-600" />
                      <span>Tamper-Evident Verification Seal</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      Hash: {result.certificate.verificationHash} &bull; Signatory: {result.certificate.principalSignatory}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1.5 bg-card hover:bg-muted text-foreground border border-border rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    <a
                      href={`/api/documents/transfer-certificate/${result.certificate.admissionNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Invalid or Not Found Card */
              <div className="bg-card border-2 border-destructive/40 rounded-2xl p-6 shadow-sm text-center space-y-2 animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-2 border border-destructive/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-destructive">
                  TRANSFER CERTIFICATE NOT VERIFIED
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {result.reason ||
                    'The queried record was not found in the official institutional register or has been revoked.'}
                </p>
                <div className="pt-2 text-[11px] text-muted-foreground">
                  Please verify that the TC number or Admission Number is correctly formatted without typos.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
