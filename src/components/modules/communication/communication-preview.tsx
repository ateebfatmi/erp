'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Mail, Smartphone, Send, CheckCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'fee_due',
    title: 'Quarterly Fee Due Notice & Razorpay Link',
    channel: 'whatsapp',
    subject: 'Fee Due Reminder — Quarter 4',
    content: 'Dear Parent, fee dues of ₹19,500 for your ward Aarav Mehta (Class 10A) are payable by 15 Jan 2027. Avoid late penalty by paying online instantly: https://pay.dpga.edu.in/rcpt/9812 - Delhi Public Global Academy',
    cta: 'Pay ₹19,500 Online',
  },
  {
    id: 'attendance_absence',
    title: 'Daily Student Absence Notification',
    channel: 'whatsapp',
    subject: 'Absence Alert — 24 Nov 2026',
    content: 'Dear Guardian, this is to inform you that your child Aarav Mehta was marked ABSENT today (24 Nov 2026) during morning roll call. If this absence is unscheduled, please contact the class teacher immediately.',
    cta: 'Submit Leave Application',
  },
  {
    id: 'closure_circular',
    title: 'Emergency Weather Advisory & School Closure',
    channel: 'sms',
    subject: 'URGENT: School Holiday Notice',
    content: 'DPGA Advisory: Due to heavy fog & government directive, all school campuses will remain closed tomorrow 25 Nov 2026. Online study materials uploaded to student portal. Stay safe.',
    cta: null,
  },
  {
    id: 'report_card',
    title: 'CBSE Mid-Term Report Card Published',
    channel: 'email',
    subject: 'Academic Progress Report Card Published — Mid Term',
    content: 'Dear Mr. and Mrs. Mehta, the Mid-Term CBSE Progress Report Card for Aarav Mehta (Class 10A) has been published. Aarav secured Grade A1 (92.5%) with exemplary remarks. Download the official signed report card from the parent portal.',
    cta: 'Download Report Card PDF',
  },
];

export function CommunicationPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [targetAudience, setTargetAudience] = useState('Class 10 Parents (80 Recipients)');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Template Selector & Dispatch Form */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Send className="h-4 w-4 text-blue-600" />
            Select Broadcast Template & Recipients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Select Official Template</label>
            <div className="space-y-1.5">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedTemplate.id === tmpl.id
                      ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{tmpl.title}</span>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {tmpl.channel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Recipient Group</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
            >
              <option>Class 10 Parents (80 Recipients)</option>
              <option>All School Parents (850 Recipients)</option>
              <option>Fee Defaulters Quarter 4 (32 Recipients)</option>
              <option>All Certified Teaching Faculty (45 Staff)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Broadcast Subject</label>
            <Input value={selectedTemplate.subject} readOnly className="text-xs bg-slate-50" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Personalized Message Body</label>
            <textarea
              rows={4}
              value={selectedTemplate.content}
              readOnly
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 leading-relaxed font-sans"
            />
          </div>

          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Broadcast successfully dispatched to {targetAudience}!
            </div>
          )}

          <div className="pt-2">
            <Button
              size="sm"
              onClick={handleDispatch}
              disabled={isSending}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold"
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Dispatching Gateways...' : `Send Broadcast via ${selectedTemplate.channel.toUpperCase()}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right: Realistic Device Preview */}
      <div className="space-y-4">
        {selectedTemplate.channel === 'whatsapp' ? (
          /* WhatsApp Chat Bubble Preview */
          <div className="bg-[#e5ddd5] rounded-2xl p-4 border border-slate-300 shadow-sm min-h-[380px] flex flex-col justify-between font-sans">
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white p-3 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  DP
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    Delhi Public Global Academy
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300 inline" />
                  </div>
                  <span className="text-[10px] text-emerald-100">Official Verified Business Account</span>
                </div>
              </div>
            </div>

            {/* Bubble */}
            <div className="my-auto max-w-[85%] self-start bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs text-xs text-slate-800 space-y-2">
              <p className="leading-relaxed">{selectedTemplate.content}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                <span>08:15 AM</span>
                <CheckCheck className="h-3 w-3 text-blue-500" />
              </div>

              {selectedTemplate.cta && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="p-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    {selectedTemplate.cta}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-500">
              WhatsApp Business Cloud API &bull; End-to-End Encrypted
            </div>
          </div>
        ) : selectedTemplate.channel === 'email' ? (
          /* Email Layout Preview */
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">From: VidyaOS Notifications &lt;circulars@dpga.edu.in&gt;</span>
                <span className="text-[11px] text-slate-500">Subject: {selectedTemplate.subject}</span>
              </div>
              <Badge variant="outline">Resend Transactional</Badge>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2 text-xs">
              <div className="font-bold text-sm text-blue-900">Delhi Public Global Academy</div>
              <p className="text-slate-700 leading-relaxed">{selectedTemplate.content}</p>
              {selectedTemplate.cta && (
                <div className="pt-2">
                  <Button size="sm" className="bg-blue-600 text-xs">
                    {selectedTemplate.cta}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SMS Preview */
          <div className="bg-slate-100 rounded-2xl p-6 border border-slate-300 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4" /> DLT Transactional SMS (Header: VM-DPGA)</span>
              <span className="font-mono text-[10px] text-slate-400">142 / 160 Chars</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed shadow-2xs">
              {selectedTemplate.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
