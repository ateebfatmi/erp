'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  QrCode,
  User,
  CheckCircle2,
  School,
  Lock,
} from 'lucide-react';
import {
  CbseAdmitCard,
  INITIAL_ADMIT_CARD,
  verifyAdmitCardRelease,
} from '@/modules/assessment/admit-card';

interface AdmitCardManagerProps {
  role?: 'student' | 'admin' | 'parent';
  cardData?: CbseAdmitCard;
}

export function AdmitCardManager({
  role = 'student',
  cardData = INITIAL_ADMIT_CARD,
}: AdmitCardManagerProps) {
  const [card, setCard] = useState<CbseAdmitCard>(cardData);
  const releaseStatus = verifyAdmitCardRelease(card);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <Card className="border-slate-200 shadow-xs print:hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                CBSE Board Examination Hall Ticket & Admit Card
              </h2>
              <p className="text-xs text-slate-500">
                Official Hall Ticket for Secondary / Senior Secondary Examination 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={!releaseStatus.canDownload}
              onClick={handlePrint}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blocking Notice if Shortage or Fee Dues */}
      {!releaseStatus.canDownload && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm block">Hall Ticket Withheld</span>
            <p>{releaseStatus.blockingReason}</p>
          </div>
        </div>
      )}

      {/* Official CBSE Printable Admit Card Letterhead */}
      <Card className="bg-white border-2 border-slate-900 shadow-lg rounded-xl print:shadow-none print:border-none">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1 relative">
            <div className="flex items-center justify-center gap-2">
              <School className="h-6 w-6 text-slate-900" />
              <h1 className="text-base font-black tracking-wider uppercase text-slate-900">
                CENTRAL BOARD OF SECONDARY EDUCATION, DELHI
              </h1>
            </div>
            <p className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              ADMIT CARD &bull; {card.gradeClass.toUpperCase()} EXAMINATION 2025
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Academic Session {card.academicSession} &bull; School: {card.schoolName} (Code: {card.schoolCode})
            </p>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-slate-300 mt-2">
              <span><strong>Serial:</strong> {card.admitCardSerial}</span>
              <span><strong>LOC Reg:</strong> {card.locRegistrationNumber}</span>
            </div>
          </div>

          {/* Candidate & Center Details Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50/80 p-4 rounded-lg border border-slate-300">
            {/* Candidate Identity */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[11px] block">Candidate Board Roll No:</span>
                  <span className="text-lg font-black font-mono text-blue-900 tracking-wider">
                    {card.rollNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Candidate Full Name:</span>
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    {card.candidateName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 text-[11px] block">Mother&apos;s Name:</span>
                  <span className="font-bold text-slate-800">{card.motherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Father&apos;s / Guardian&apos;s Name:</span>
                  <span className="font-bold text-slate-800">{card.fatherName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-500">Gender:</span> <strong>{card.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Attendance:</span>{' '}
                  <strong className="text-emerald-700">{card.attendancePercentage}% (Qualified &ge; 75%)</strong>
                </div>
              </div>
            </div>

            {/* Exam Center Card */}
            <div className="border-t md:border-t-0 md:border-l border-slate-300 pt-3 md:pt-0 md:pl-4 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Allotted Examination Center
              </span>
              <div className="font-mono font-bold text-slate-900 text-xs">
                Center No: {card.centerCode}
              </div>
              <p className="font-bold text-slate-800 text-xs leading-snug">
                {card.centerName}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {card.centerAddress}
              </p>
            </div>
          </div>

          {/* CWSN Concessions Banner if Applicable */}
          {card.cwsnConcessions && (
            <div className="bg-teal-50 border border-teal-300 rounded-lg p-2.5 text-xs text-teal-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0" />
              <span>
                <strong>Statutory Examination Accommodations Approved:</strong> {card.cwsnConcessions}
              </span>
            </div>
          )}

          {/* Subject Schedule Timetable */}
          <div className="border border-slate-300 rounded-md overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Sub Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Date & Day</th>
                  <th className="py-2.5 px-3">Reporting Time</th>
                  <th className="py-2.5 px-3">Reading Time</th>
                  <th className="py-2.5 px-3 text-right">Exam Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {card.subjects.map((sub) => (
                  <tr key={sub.subjectCode} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                      {sub.subjectCode}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {sub.subjectName}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {sub.examDate} <span className="text-slate-500 text-[11px]">({sub.dayOfWeek})</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {sub.reportingTime}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-amber-700 font-medium">
                      {sub.readingTime}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {sub.examTiming}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important Instructions for Candidates */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Important Mandatory Examination Instructions
            </span>
            <ul className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
              {card.importantInstructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </div>

          {/* Official Signatures & Verification Stamp */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 items-end text-center">
            {/* Candidate Signature */}
            <div className="space-y-1">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-xs text-slate-700">Aarav Mehta</span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 uppercase block">
                Signature of Candidate
              </span>
            </div>

            {/* Parent Signature */}
            <div className="space-y-1">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-xs text-slate-700">Rajesh Mehta</span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 uppercase block">
                Signature of Parent / Guardian
              </span>
            </div>

            {/* Principal Signature & QR */}
            <div className="space-y-1">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-xs text-slate-900 font-bold">
                  Rameshwar Sharma
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 uppercase block">
                Principal Counter-Signature & Seal
              </span>
              <span className="font-mono text-[9px] text-slate-400 block">
                Verification Hash: {card.verificationQrHash.substring(0, 16)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
