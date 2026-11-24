'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Info,
  Calendar,
  Building2,
  ExternalLink,
} from 'lucide-react';
import {
  generateSection80CCertificate,
  SAMPLE_80C_PAYMENTS,
  Section80CCertificate,
} from '@/modules/fees/tax-certificate';

interface ParentTaxCertificateProps {
  studentName?: string;
  admissionNumber?: string;
  gradeClass?: string;
}

export function ParentTaxCertificateManager({
  studentName = 'Aarav Mehta',
  admissionNumber = 'ADM-2024-001',
  gradeClass = 'Class 10A',
}: ParentTaxCertificateProps) {
  const [financialYear, setFinancialYear] = useState<string>('2024-25');
  const [copied, setCopied] = useState(false);

  const cert: Section80CCertificate = generateSection80CCertificate({
    financialYear,
    student: {
      fullName: studentName,
      admissionNumber,
      gradeClass: gradeClass,
      section: 'A',
      rollNumber: '1014',
    },
    parent: {
      fatherOrGuardianName: 'Rajesh Mehta',
      motherName: 'Sunita Mehta',
      parentPan: 'ABCDE1234F',
    },
    feePayments: SAMPLE_80C_PAYMENTS,
  });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cert.verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Statutory Section 80C Tuition Fee Certificate
              </h2>
              <p className="text-xs text-slate-500">
                Income Tax Act, 1961 deduction for children&apos;s full-time education
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-4 w-4 text-slate-400" />
              <label htmlFor="fy-select" className="font-medium text-slate-700">Financial Year:</label>
              <select
                id="fy-select"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="rounded-md border border-slate-300 text-xs py-1.5 px-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
                <option value="2023-24">FY 2023-24 (AY 2024-25)</option>
              </select>
            </div>

            <Button
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statutory Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Statutory Exemption Guideline: </span>
          Under Section 80C(2)(xvii) of the Income Tax Act, 1961, tax deduction up to ₹1,50,000 per financial year is admissible{' '}
          <strong>strictly for pure Tuition Fees</strong> paid to an Indian university, college, school or other educational institution for full-time education. Transport charges, development charges, admission charges, and hostel fees have been excluded from the eligible amount.
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 block font-medium">Total Fees Remitted (FY {financialYear})</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              ₹{(cert.totalEligibleAmount + cert.totalIneligibleAmount).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Sum of all 4 quarterly fee receipts</span>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/40 border-emerald-200">
          <CardContent className="p-4">
            <span className="text-xs text-emerald-800 block font-medium flex items-center justify-between">
              <span>Section 80C Eligible Tuition Fee</span>
              <Badge variant="success" className="text-[10px]">100% Deductible</Badge>
            </span>
            <span className="text-xl font-bold text-emerald-700 mt-1 block">
              ₹{cert.totalEligibleAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600/80 mt-0.5 block font-medium">
              {cert.totalEligibleAmountInWords}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 block font-medium flex items-center justify-between">
              <span>Non-Eligible Charges Excluded</span>
              <Badge variant="outline" className="text-[10px] text-slate-500">Excluded</Badge>
            </span>
            <span className="text-xl font-bold text-slate-700 mt-1 block">
              ₹{cert.totalIneligibleAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Transport, STEM Lab maintenance & activity</span>
          </CardContent>
        </Card>
      </div>

      {/* Printable Certificate Canvas */}
      <Card className="bg-white border-slate-300 shadow-md print:shadow-none print:border-none">
        <CardContent className="p-8 space-y-6">
          {/* Institution Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="inline-flex items-center gap-2 mb-1">
              <Building2 className="h-6 w-6 text-slate-800" />
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                {cert.institution.name}
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto">
              Affiliated to Central Board of Secondary Education (CBSE), New Delhi &bull; Affiliation No: {cert.institution.affiliationNumber} &bull; School Code: {cert.institution.schoolCode}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {cert.institution.address}
            </p>
            <div className="mt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-700">
              <span><strong>PAN:</strong> {cert.institution.pan}</span>
              <span><strong>TAN:</strong> {cert.institution.tan}</span>
            </div>

            <div className="mt-3">
              <span className="inline-block bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Tuition Fee Certificate for Income Tax Deduction
              </span>
              <p className="text-[11px] text-slate-500 mt-1 italic font-medium">
                (Issued in compliance with Section 80C(2)(xvii) of the Income Tax Act, 1961)
              </p>
            </div>
          </div>

          {/* Certificate Metadata & Student Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-lg border border-slate-200">
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500">Certificate Dispatch No:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{cert.certificateNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Financial Year (FY):</span>{' '}
                <span className="font-bold text-slate-900">{cert.financialYear}</span>
              </div>
              <div>
                <span className="text-slate-500">Assessment Year (AY):</span>{' '}
                <span className="font-bold text-slate-900">{cert.assessmentYear}</span>
              </div>
              <div>
                <span className="text-slate-500">Date of Issuance:</span>{' '}
                <span className="font-medium text-slate-800">{cert.issueDate}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500">Student Name:</span>{' '}
                <span className="font-bold text-slate-900">{cert.student.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500">Admission No:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{cert.student.admissionNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Class & Section:</span>{' '}
                <span className="font-bold text-slate-900">{cert.student.gradeClass} (Section {cert.student.section})</span>
              </div>
              <div>
                <span className="text-slate-500">Parent / Assessee:</span>{' '}
                <span className="font-bold text-slate-900">
                  {cert.parent.fatherOrGuardianName} / {cert.parent.motherName}
                </span>
              </div>
            </div>
          </div>

          {/* Certification Text */}
          <div className="text-xs text-slate-700 leading-relaxed text-justify">
            This is to officially certify that <strong>{cert.student.fullName}</strong>, child/ward of{' '}
            <strong>{cert.parent.fatherOrGuardianName}</strong>, is a bona fide full-time enrolled student of this institution in{' '}
            <strong>{cert.student.gradeClass}</strong>. During the Financial Year{' '}
            <strong>{cert.financialYear}</strong> (relevant to Assessment Year <strong>{cert.assessmentYear}</strong>), the pure tuition fee amount paid towards full-time education is detailed hereunder:
          </div>

          {/* Quarterly Breakup Table */}
          <div className="border border-slate-300 rounded-md overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Period / Quarter</th>
                  <th className="py-2.5 px-3">Receipt No & Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Tuition Fee (Eligible 80C)</th>
                  <th className="py-2.5 px-3 text-right">Other Fees (Ineligible)</th>
                  <th className="py-2.5 px-3 text-right">Total Remitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cert.quarterlyBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{item.quarter}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {item.receiptNumber} <span className="text-slate-400">({item.paymentDate})</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">{item.paymentMode}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      ₹{item.eligibleTuitionFee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      ₹{item.ineligibleOtherCharges.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                      ₹{item.totalAmountPaid.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={3} className="py-3 px-3 text-slate-900 uppercase">
                    Total Amount for Section 80C Claim
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-800 text-sm">
                    ₹{cert.totalEligibleAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    ₹{cert.totalIneligibleAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-900 text-sm">
                    ₹{(cert.totalEligibleAmount + cert.totalIneligibleAmount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount In Words Declaration */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-xs">
            <span className="font-semibold text-emerald-950">Total Eligible Tuition Fee in Words: </span>
            <span className="font-bold text-emerald-800 uppercase tracking-wide">
              {cert.totalEligibleAmountInWords}
            </span>
          </div>

          {/* Signatures & Verification Stamp */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-700">Digital Seal & Verification Hash:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-300 select-all">
                  {cert.verificationHash}
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title="Copy verification hash"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Verifiable via VidyaOS Cryptographic Verification Portal
              </span>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block border-b border-slate-400 pb-1 mb-1 w-48 text-center">
                <span className="font-serif italic text-sm text-slate-700">Rameshwar Sharma</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{cert.institution.signatoryName}</div>
              <div className="text-[11px] text-slate-500">{cert.institution.signatoryDesignation}</div>
              <div className="text-[10px] text-slate-400">{cert.institution.name}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
