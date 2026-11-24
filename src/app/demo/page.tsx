'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GraduationCap, ArrowLeft, CheckCircle2, PhoneCall } from 'lucide-react';

export default function BookDemoPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <span>VidyaOS</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Button>
        </Link>
      </nav>

      <div className="py-16 px-6 max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Schedule a Personalized Walkthrough
          </h1>
          <p className="text-xs text-slate-500">
            Our educational SaaS specialists will demonstrate multi-campus administration, automated fee collection, and CBSE report card generation.
          </p>
        </div>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="pt-6">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Demo Scheduled!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Our team will reach out via WhatsApp and Email within 2 working hours with your calendar invite and sandbox access.
                </p>
                <div className="pt-2">
                  <Link href="/portal/admin">
                    <Button size="sm" className="text-xs bg-blue-600">
                      Explore Interactive Sandbox Now
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Your Full Name *</label>
                  <Input required placeholder="e.g. Principal Dr. A.K. Nair" className="text-xs" />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Institution / School Name *</label>
                  <Input required placeholder="e.g. Cambridge Court High School" className="text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Official Email *</label>
                    <Input type="email" required placeholder="principal@school.edu.in" className="text-xs" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mobile / WhatsApp *</label>
                    <Input required placeholder="+91 98765 43210" className="text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Affiliation</label>
                    <select className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white">
                      <option>CBSE</option>
                      <option>ICSE</option>
                      <option>State Board</option>
                      <option>IB / Cambridge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Student Strength</label>
                    <select className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white">
                      <option>Below 500 Students</option>
                      <option>500 - 1,500 Students</option>
                      <option>1,500 - 3,500 Students</option>
                      <option>3,500+ Students (Multi-Campus)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="w-full gap-2 bg-blue-600 hover:bg-blue-700 font-semibold py-2">
                    <PhoneCall className="h-4 w-4" /> Book 30-Minute Live Demo
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
