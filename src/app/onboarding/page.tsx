'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, Building2, Calendar, Users, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolName: '',
    subdomain: '',
    affiliation: 'CBSE',
    campusName: 'Main Campus',
    campusCode: 'MAIN-01',
    sessionName: '2026-2027',
    plan: 'growth',
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-xs">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Provision Your School on VidyaOS
          </h1>
          <p className="text-sm text-slate-500">
            Set up your multi-tenant environment, campus hierarchy, and academic session in 4 simple steps.
          </p>
        </div>

        {/* Progress Step Indicators */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          <div className={`p-2 rounded-lg border ${step >= 1 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-400'}`}>
            1. Institution
          </div>
          <div className={`p-2 rounded-lg border ${step >= 2 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-400'}`}>
            2. Campus
          </div>
          <div className={`p-2 rounded-lg border ${step >= 3 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-400'}`}>
            3. Session
          </div>
          <div className={`p-2 rounded-lg border ${step >= 4 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-400'}`}>
            4. Ready
          </div>
        </div>

        {/* Form Container */}
        <Card className="shadow-xs border-slate-200 bg-white">
          <CardContent className="pt-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900">Step 1: School Identity & Subdomain</h2>
                  <p className="text-xs text-slate-500">Provide legal school credentials and chosen tenant URL.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Official School Name *</label>
                  <Input
                    placeholder="e.g. Modern Public Academy"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dedicated Tenant Subdomain *</label>
                  <div className="flex items-center">
                    <Input
                      placeholder="modernacademy"
                      className="rounded-r-none font-mono text-xs"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    />
                    <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-xs text-slate-500 font-mono">
                      .platformdomain.com
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Curriculum / Board Affiliation</label>
                  <select
                    className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  >
                    <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                    <option value="ICSE">ICSE / CISCE</option>
                    <option value="State Board">State Secondary Education Board</option>
                    <option value="IB">International Baccalaureate (IB)</option>
                    <option value="Cambridge">Cambridge Assessment International (CAIE)</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900">Step 2: Primary Physical Campus</h2>
                  <p className="text-xs text-slate-500">Configure your flagship campus location.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Campus Name *</label>
                  <Input
                    value={formData.campusName}
                    onChange={(e) => setFormData({ ...formData, campusName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Campus Code *</label>
                  <Input
                    value={formData.campusCode}
                    onChange={(e) => setFormData({ ...formData, campusCode: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900">Step 3: Initial Academic Session</h2>
                  <p className="text-xs text-slate-500">Define academic cycle for timetables and fee schedules.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Session Year</label>
                  <Input
                    value={formData.sessionName}
                    onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
                  />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                  Default classes (Nursery to Class 12) with standard CBSE subjects and fee categories will be automatically provisioned.
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-6 space-y-4">
                <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Tenant Successfully Provisioned!
                </h2>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {formData.schoolName || 'Your School'} is now live on <span className="font-mono font-bold text-blue-600">{formData.subdomain || 'school'}.platformdomain.com</span> with Row Level Security enabled.
                </p>
                <div className="pt-4">
                  <Link href="/portal/admin">
                    <Button size="lg" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      <span>Enter School Administrator Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {step < 4 && (
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <Button variant="outline" size="sm" onClick={prevStep} className="gap-1 text-xs">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Button>
                ) : <div />}
                <Button size="sm" onClick={nextStep} className="gap-1 text-xs bg-blue-600">
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-400">
        VidyaOS Enterprise Multi-Tenant School ERP &bull; Protected by Clerk Auth & Supabase RLS
      </div>
    </div>
  );
}
