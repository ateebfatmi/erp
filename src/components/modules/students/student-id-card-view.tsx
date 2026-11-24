'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Download,
  Printer,
  RotateCw,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Bus,
  Heart,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface StudentIdCardViewProps {
  studentName?: string;
  admissionNo?: string;
  gradeClass?: string;
  section?: string;
  rollNo?: string | number;
  dob?: string;
  bloodGroup?: string;
  house?: string;
  guardianName?: string;
  emergencyContact?: string;
  address?: string;
  busRoute?: string;
  schoolName?: string;
  affiliationNo?: string;
}

export function StudentIdCardView({
  studentName = 'Aarav Mehta',
  admissionNo = 'DPGA/2021/1042',
  gradeClass = 'Class 10',
  section = 'A',
  rollNo = '14',
  dob = '14-Apr-2010',
  bloodGroup = 'B+',
  house = 'ASHOKA',
  guardianName = 'Rajesh Mehta',
  emergencyContact = '+91 98101 23456',
  address = 'B-4/112 Vasant Kunj, New Delhi 110070',
  busRoute = 'Route 4 (Noida Sector 62)',
  schoolName = 'DELHI PUBLIC GLOBAL ACADEMY',
  affiliationNo = 'CBSE/AFF/2130894',
}: StudentIdCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Digital Student Identity & Campus RFID Badge Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official tamper-evident digital student card with QR gate clearance, bus pass coordinates, and emergency medical contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFlipped(!isFlipped)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Flip Card ({isFlipped ? 'Show Front' : 'Show Back'})</span>
          </Button>

          <a href={`/api/documents/id-card/${admissionNo}`} target="_blank" rel="noreferrer">
            <Button size="sm" className="text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Download className="h-3.5 w-3.5" />
              <span>Download Official PDF</span>
            </Button>
          </a>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print PVC</span>
          </Button>
        </div>
      </div>

      {/* PVC Card Canvas Presentation */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-100/80 rounded-2xl border border-slate-200">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl rounded-2xl w-full max-w-sm select-none"
        >
          {!isFlipped ? (
            /* FRONT OF PVC CARD */
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-blue-400/30">
              {/* Subtle Watermark Badge */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <Building2 className="w-56 h-56 text-white" />
              </div>

              {/* Institution Header */}
              <div className="border-b border-white/20 pb-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-white">
                    {schoolName}
                  </span>
                </div>
                <p className="text-[9px] text-blue-200 font-medium">
                  Affiliation No: {affiliationNo} &bull; Academic Session 2025-26
                </p>
              </div>

              {/* Student Photo & Identity Core */}
              <div className="mt-4 flex gap-4 items-center">
                <div className="w-20 h-24 rounded-xl bg-white/10 border-2 border-white/30 flex flex-col items-center justify-center shrink-0 relative overflow-hidden shadow-inner">
                  <span className="text-2xl font-black text-white/80">AM</span>
                  <span className="text-[8px] uppercase tracking-wider text-blue-200 mt-1">Photo</span>
                  <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 text-[7px] text-center text-white py-0.5">
                    VERIFIED
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-base font-black text-white tracking-wide uppercase">
                    {studentName}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-blue-200">
                    <span className="font-semibold text-white">{gradeClass} &bull; Sec {section}</span>
                    <span>(Roll #{rollNo})</span>
                  </div>
                  <div className="font-mono text-[10px] text-amber-300 font-bold">
                    Adm: {admissionNo}
                  </div>
                  <Badge className="bg-emerald-500/80 text-white text-[9px] py-0 font-bold mt-1">
                    {house} HOUSE
                  </Badge>
                </div>
              </div>

              {/* Bottom Quick Chips */}
              <div className="mt-5 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-blue-300 block">Date of Birth</span>
                  <span className="font-bold text-white">{dob}</span>
                </div>
                <div className="text-right">
                  <span className="text-blue-300 block">Blood Group</span>
                  <span className="font-bold text-rose-300 flex items-center justify-end gap-1">
                    <Heart className="h-3 w-3 fill-rose-400" /> {bloodGroup}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-center text-[8px] text-blue-300/80">
                Click anywhere on card to flip &bull; Front Face
              </div>
            </div>
          ) : (
            /* BACK OF PVC CARD */
            <div className="bg-white text-slate-800 rounded-2xl p-6 relative overflow-hidden border border-slate-300">
              {/* Back Header */}
              <div className="border-b border-slate-200 pb-2 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Campus Security & Emergency Contact Record
                </span>
              </div>

              {/* Details List */}
              <div className="mt-3 space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold">Father / Guardian</span>
                  <span className="font-bold text-slate-900">{guardianName}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Emergency SOS Contact</span>
                    <span className="font-bold text-slate-900 font-mono">{emergencyContact}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Residential Address</span>
                    <span className="text-slate-700 text-[11px] leading-tight block">{address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Bus className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Allotted Bus Route & Stop</span>
                    <span className="font-bold text-slate-900">{busRoute}</span>
                  </div>
                </div>
              </div>

              {/* Barcode / Signatures */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-8 w-28 bg-slate-900 flex items-center justify-center text-white font-mono text-[9px] tracking-widest rounded">
                    ||| || ||| || |||
                  </div>
                  <span className="font-mono text-[8px] text-slate-400 block text-center">
                    RFID: 88A9F01B2
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-xs text-slate-700 border-b border-slate-400 pb-0.5">
                    Rameshwar Sharma
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 block mt-0.5">Principal Seal</span>
                  <span className="text-[8px] text-slate-400 block">{schoolName.split(' ')[0]}</span>
                </div>
              </div>

              <div className="mt-2 text-center text-[8px] text-slate-400">
                Click anywhere on card to flip &bull; Reverse Face
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
