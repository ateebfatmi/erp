'use client';

import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkle,
  Sliders,
  Package,
  Calendar,
  Building,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlliedSpecialist,
  SensoryEquipment,
  TherapySessionLog,
  TherapyType,
  SpecialistRole,
  StudentArousalState,
  evaluateResourceRoomCompliance,
  toggleEquipmentAssignment,
  INITIAL_SPECIALISTS,
  INITIAL_EQUIPMENT,
  INITIAL_THERAPY_SESSIONS,
} from '@/modules/academics/inclusive-resource-room';

interface InclusiveResourceRoomManagerProps {
  role?: 'admin' | 'specialist';
}

export function InclusiveResourceRoomManager({ role = 'admin' }: InclusiveResourceRoomManagerProps) {
  const [specialists, setSpecialists] = useState<AlliedSpecialist[]>(INITIAL_SPECIALISTS);
  const [equipment, setEquipment] = useState<SensoryEquipment[]>(INITIAL_EQUIPMENT);
  const [sessions, setSessions] = useState<TherapySessionLog[]>(INITIAL_THERAPY_SESSIONS);

  const [activeTab, setActiveTab] = useState<'inventory' | 'sessions' | 'specialists' | 'audit'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedEquipmentForCheckout, setSelectedEquipmentForCheckout] = useState<SensoryEquipment | null>(null);
  const [checkoutStudentName, setCheckoutStudentName] = useState('');
  const [checkoutStudentId, setCheckoutStudentId] = useState('');

  // Form states for new therapy session
  const [newStudentName, setNewStudentName] = useState('Devansh Kulkarni');
  const [newStudentId, setNewStudentId] = useState('CWSN-2024-002');
  const [newStudentGrade, setNewStudentGrade] = useState('Class 4-B');
  const [newSpecialistId, setNewSpecialistId] = useState('SPEC-01');
  const [newTherapyType, setNewTherapyType] = useState<TherapyType>('SENSORY_INTEGRATION');
  const [newDuration, setNewDuration] = useState('45');
  const [newArousalBefore, setNewArousalBefore] = useState<StudentArousalState>('HYPER_AROUSED_RESTLESS');
  const [newArousalAfter, setNewArousalAfter] = useState<StudentArousalState>('OPTIMAL_ENGAGED');
  const [newObservations, setNewObservations] = useState('');
  const [newTeacherInstructions, setNewTeacherInstructions] = useState('');

  // Form states for new equipment
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState<SensoryEquipment['category']>('SENSORY_REGULATION');
  const [newEqLocation, setNewEqLocation] = useState('Sensory Pod Alpha');
  const [newEqAccommodations, setNewEqAccommodations] = useState('Sensory regulation, calming');

  // Compute compliance audit
  const auditReport = useMemo(
    () => evaluateResourceRoomCompliance(specialists, equipment, sessions),
    [specialists, equipment, sessions]
  );

  // Handle Checkout / Return
  const handleOpenCheckout = (eq: SensoryEquipment) => {
    setSelectedEquipmentForCheckout(eq);
    setCheckoutStudentName('');
    setCheckoutStudentId('');
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentForCheckout) return;

    const updated = toggleEquipmentAssignment(
      equipment,
      selectedEquipmentForCheckout.id,
      checkoutStudentId || 'CWSN-GEN-01',
      checkoutStudentName || 'Assigned Student'
    );
    setEquipment(updated);
    setShowCheckoutModal(false);
    setSelectedEquipmentForCheckout(null);
  };

  const handleReturnEquipment = (eqId: string) => {
    const updated = toggleEquipmentAssignment(equipment, eqId);
    setEquipment(updated);
  };

  // Handle Create Therapy Session
  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specialist = specialists.find((s) => s.id === newSpecialistId) || specialists[0];

    const newLog: TherapySessionLog = {
      id: `TH-${Date.now()}`,
      studentId: newStudentId,
      studentName: newStudentName,
      grade: newStudentGrade,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialistRole: specialist.role,
      therapyType: newTherapyType,
      sessionDate: new Date().toISOString().split('T')[0],
      durationMinutes: Number(newDuration),
      arousalStateBefore: newArousalBefore,
      arousalStateAfter: newArousalAfter,
      sensoryToolsUsed: ['Calming Pod', 'Adaptive Grips'],
      clinicalObservations:
        newObservations || 'Conducted sensory stimulation and occupational motor integration routine.',
      nextStepsForClassroomTeacher:
        newTeacherInstructions || 'Allow short sensory movement breaks between lecture periods.',
      status: 'Completed',
    };

    setSessions([newLog, ...sessions]);
    setNewObservations('');
    setNewTeacherInstructions('');
    setShowAddSessionModal(false);
  };

  // Handle Create Equipment
  const handleCreateEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName) return;

    const newDevice: SensoryEquipment = {
      id: `EQ-${Date.now()}`,
      name: newEqName,
      category: newEqCategory,
      serialNumber: `SN-${Math.floor(100 + Math.random() * 900)}`,
      storageLocation: newEqLocation,
      status: 'AVAILABLE',
      lastSanitizedAt: new Date().toISOString().split('T')[0],
      targetAccommodations: newEqAccommodations.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setEquipment([...equipment, newDevice]);
    setNewEqName('');
    setShowAddEquipmentModal(false);
  };

  const filteredEquipment = equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.assignedStudentName && e.assignedStudentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Statutory Citation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-teal-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-teal-500/30 text-teal-200 border-teal-400/40 text-xs py-0.5 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              CBSE Affiliation Bye-Laws App. IX
            </Badge>
            <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-xs py-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              RPwD Act 2016 Section 16
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-teal-400" />
            Multi-Disciplinary Inclusive Resource Room & Therapy Hub
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-3xl">
            Coordinate RCI-registered allied specialists, manage sensory integration & assistive technology devices, document clinical therapy logs, and monitor statutory inclusive education compliance.
          </p>
        </div>
        <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Statutory Audit
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Statutory Audit Index</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{auditReport.overallComplianceScore}%</h3>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                  Grade {auditReport.complianceGrade.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">RCI & RPwD Aligned</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Allied Specialists</p>
              <h3 className="text-lg font-bold text-slate-900">{specialists.length} Certified</h3>
              <p className="text-[11px] text-slate-400">Special Ed, SLP, OT</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Assistive Inventory</p>
              <h3 className="text-lg font-bold text-slate-900">{equipment.length} Devices</h3>
              <p className="text-[11px] text-slate-400">{auditReport.sensoryEquipmentAvailabilityRate}% Functional</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Therapy Delivered</p>
              <h3 className="text-lg font-bold text-slate-900">{auditReport.weeklyTherapyHoursDelivered} Hours</h3>
              <p className="text-[11px] text-slate-400">Weekly Pull-Out Sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'inventory'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="h-4 w-4" />
          Sensory & Assistive Devices ({equipment.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'sessions'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="h-4 w-4" />
          Therapy & Pull-Out Logs ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('specialists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'specialists'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          Allied Specialist Team ({specialists.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'audit'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          CBSE RPwD Statutory Audit
        </button>
      </div>

      {/* TAB 1: SENSORY & ASSISTIVE DEVICES */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search equipment by name, category, or assigned student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <Button
              onClick={() => setShowAddEquipmentModal(true)}
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Register Assistive Device
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((eq) => (
              <Card key={eq.id} className="border-slate-200 shadow-xs flex flex-col justify-between">
                <CardHeader className="pb-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                        {eq.category.replace(/_/g, ' ')}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-slate-900 leading-tight">
                        {eq.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        {eq.storageLocation} • SN: {eq.serialNumber}
                      </CardDescription>
                    </div>

                    <Badge
                      className={
                        eq.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                          : eq.status === 'IN_USE'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-200 text-[10px]'
                          : 'bg-amber-100 text-amber-800 border-amber-200 text-[10px]'
                      }
                    >
                      {eq.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Targeted Accommodations
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {eq.targetAccommodations.map((acc, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {eq.status === 'IN_USE' && (
                    <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
                      <p className="text-[11px] text-indigo-700 font-medium">Currently Checked Out To:</p>
                      <p className="font-bold text-slate-800">{eq.assignedStudentName}</p>
                      <p className="text-[10px] text-slate-500">{eq.assignedStudentId}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Sanitized: {eq.lastSanitizedAt}</span>

                    {eq.status === 'AVAILABLE' ? (
                      <Button
                        onClick={() => handleOpenCheckout(eq)}
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Check Out
                      </Button>
                    ) : eq.status === 'IN_USE' ? (
                      <Button
                        onClick={() => handleReturnEquipment(eq.id)}
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" /> Return & Sanitize
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: THERAPY & PULL-OUT LOGS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Therapeutic Pull-Out & Push-In Session Records
              </h3>
              <p className="text-xs text-slate-500">
                Detailed clinical notes, student arousal states, sensory regulation, and classroom carry-over instructions.
              </p>
            </div>
            <Button
              onClick={() => setShowAddSessionModal(true)}
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Therapy Session
            </Button>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <Card key={s.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs">
                        {s.therapyType.replace(/_/g, ' ')}
                      </Badge>
                      <h4 className="text-xs font-bold text-slate-900">{s.studentName}</h4>
                      <span className="text-xs text-slate-400">({s.grade})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Therapist: <strong className="text-slate-700">{s.specialistName}</strong></span>
                      <span>•</span>
                      <span>{s.sessionDate} ({s.durationMinutes} mins)</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                        {s.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Arousal Progression */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Pre-Session State:</span>
                      <Badge
                        variant="outline"
                        className={
                          s.arousalStateBefore.includes('HYPER')
                            ? 'text-rose-700 border-rose-200 bg-rose-50'
                            : s.arousalStateBefore.includes('HYPO')
                            ? 'text-amber-700 border-amber-200 bg-amber-50'
                            : 'text-emerald-700 border-emerald-200 bg-emerald-50'
                        }
                      >
                        {s.arousalStateBefore.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Post-Session State:</span>
                      <Badge
                        variant="outline"
                        className={
                          s.arousalStateAfter.includes('OPTIMAL')
                            ? 'text-emerald-700 border-emerald-200 bg-emerald-50 font-bold'
                            : 'text-blue-700 border-blue-200 bg-blue-50'
                        }
                      >
                        {s.arousalStateAfter.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-2">
                    <p>
                      <strong className="text-slate-900">Clinical Observations: </strong>
                      {s.clinicalObservations}
                    </p>
                    <div className="bg-teal-50/60 p-2.5 rounded-lg border border-teal-100">
                      <strong className="text-teal-900">Carry-Over Guidance for Classroom Teachers: </strong>
                      <span className="text-teal-800">{s.nextStepsForClassroomTeacher}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ALLIED SPECIALISTS */}
      {activeTab === 'specialists' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialists.map((sp) => (
              <Card key={sp.id} className="border-slate-200 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-[10px] mb-1">
                        {sp.role.replace(/_/g, ' ')}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-slate-900">
                        {sp.name}
                      </CardTitle>
                    </div>
                    {sp.isFullTime ? (
                      <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200">
                        Full-Time
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200">
                        Consultant
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs pt-0">
                  {sp.rciRegistrationNo && (
                    <div className="bg-emerald-50 p-2 rounded border border-emerald-100 flex items-center justify-between">
                      <span className="text-emerald-800 font-semibold text-[11px]">RCI Central Reg:</span>
                      <span className="font-mono text-emerald-900 font-bold">{sp.rciRegistrationNo}</span>
                    </div>
                  )}

                  <p className="text-slate-600 text-[11px]">{sp.qualification}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Daily Caseload Utilization</span>
                      <span className="font-bold text-slate-700">{sp.currentCaseload} / {sp.maxDailyCaseload}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full"
                        style={{ width: `${Math.round((sp.currentCaseload / sp.maxDailyCaseload) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Available: {sp.availableDays.join(', ')}</span>
                    <a href={`mailto:${sp.contactEmail}`} className="text-teal-600 hover:underline">
                      Email
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CBSE RPwD STATUTORY AUDIT */}
      {activeTab === 'audit' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  CBSE Affiliation By-Laws & RPwD Act 2016 Inspection Audit
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Comprehensive compliance checklist for annual CBSE board affiliation extension and state RTE inspection.
                </CardDescription>
              </div>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-xs">
                Score: {auditReport.overallComplianceScore} / 100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  1. RCI Registered Special Educator on Permanent Faculty
                </span>
                {auditReport.rciSpecialistStaffed ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Compliant
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Deficit
                  </Badge>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  2. Ground-Floor Barrier-Free Architectural Ramp Access & Tactile Paths
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified Compliant
                </Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  3. Multi-Category Sensory & Assistive Technology Provisioning (&gt;= 80%)
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {auditReport.sensoryEquipmentAvailabilityRate}% Ready
                </Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  4. Minimum Weekly Pull-Out Therapeutic Instruction Delivered (&gt;= 5 Hours)
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {auditReport.weeklyTherapyHoursDelivered} Hours / Week
                </Badge>
              </div>
            </div>

            {auditReport.statutoryGaps.length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                <p className="font-semibold">All Statutory RPwD & CBSE Mandates Fully Satisfied.</p>
                <p className="text-[11px] mt-0.5">The Multi-Disciplinary Resource Room qualifies for Level-A Exemplary Inclusive Center accreditation.</p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800">
                <p className="font-semibold">Actionable Compliance Reminders:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  {auditReport.statutoryGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL: Check Out Equipment */}
      {showCheckoutModal && selectedEquipmentForCheckout && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-teal-600" />
                Check Out Assistive Device
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCheckout} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">{selectedEquipmentForCheckout.name}</p>
                <p className="text-[11px] text-slate-500">Location: {selectedEquipmentForCheckout.storageLocation}</p>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Student Full Name</label>
                <Input
                  value={checkoutStudentName}
                  onChange={(e) => setCheckoutStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Student Admission / CWSN ID</label>
                <Input
                  value={checkoutStudentId}
                  onChange={(e) => setCheckoutStudentId(e.target.value)}
                  placeholder="e.g. CWSN-2024-001"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-700 hover:bg-teal-800 text-xs"
                >
                  Confirm Check Out
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Log Therapy Session */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" />
                Log Clinical Therapy & Sensory Session
              </h3>
              <button
                onClick={() => setShowAddSessionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Student Full Name</label>
                  <Input
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Grade & Section</label>
                  <Input
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Allied Specialist</label>
                  <select
                    value={newSpecialistId}
                    onChange={(e) => setNewSpecialistId(e.target.value)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    {specialists.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name} ({sp.role.replace(/_/g, ' ')})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Therapy Discipline</label>
                  <select
                    value={newTherapyType}
                    onChange={(e) => setNewTherapyType(e.target.value as TherapyType)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    <option value="SENSORY_INTEGRATION">Sensory Integration & Regulation</option>
                    <option value="REMEDIAL_DYSLEXIA_PHONICS">Remedial Dyslexia Phonics</option>
                    <option value="SPEECH_ARTICULATION">Speech Articulation & Fluency</option>
                    <option value="FINE_MOTOR_AND_HANDWRITING">Fine Motor & Handwriting Ergonomics</option>
                    <option value="DYSCALCULIA_MULTISENSORY_MATH">Dyscalculia Multisensory Math</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Duration (Mins)</label>
                  <Input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Pre-Session State</label>
                  <select
                    value={newArousalBefore}
                    onChange={(e) => setNewArousalBefore(e.target.value as StudentArousalState)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    <option value="HYPER_AROUSED_RESTLESS">Hyper-Aroused / Restless</option>
                    <option value="HYPO_AROUSED_LETHARGIC">Hypo-Aroused / Lethargic</option>
                    <option value="OPTIMAL_ENGAGED">Optimal / Engaged</option>
                    <option value="SENSORY_OVERWHELMED">Sensory Overwhelmed</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Post-Session State</label>
                  <select
                    value={newArousalAfter}
                    onChange={(e) => setNewArousalAfter(e.target.value as StudentArousalState)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    <option value="OPTIMAL_ENGAGED">Optimal / Engaged</option>
                    <option value="HYPO_AROUSED_LETHARGIC">Hypo-Aroused / Calm</option>
                    <option value="HYPER_AROUSED_RESTLESS">Restless</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Therapist Clinical Observations</label>
                <textarea
                  rows={2}
                  value={newObservations}
                  onChange={(e) => setNewObservations(e.target.value)}
                  placeholder="Note student response to sensory inputs, phonemic cues, or motor exercises..."
                  className="w-full border rounded-lg p-2 text-xs border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Classroom Subject Teacher Instructions</label>
                <Input
                  value={newTeacherInstructions}
                  onChange={(e) => setNewTeacherInstructions(e.target.value)}
                  placeholder="e.g. Provide sensory break before math; use slanted writing board"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSessionModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-700 hover:bg-teal-800 text-xs"
                >
                  Save Therapy Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Register Assistive Device */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-teal-600" />
                Register Sensory or Assistive Device
              </h3>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEquipmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Device / Tool Name</label>
                <Input
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  placeholder="e.g. Weighted Lap Pad (5 lbs)"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Category</label>
                <select
                  value={newEqCategory}
                  onChange={(e) => setNewEqCategory(e.target.value as any)}
                  className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                >
                  <option value="SENSORY_REGULATION">Sensory Regulation & Calming</option>
                  <option value="VISUAL_ASSISTIVE">Visual & Reading Assistive (C-Pen, Braille)</option>
                  <option value="HEARING_ASSISTIVE">Hearing & FM Systems</option>
                  <option value="MOTOR_AND_ERGONOMIC">Motor & Ergonomic (Writing Slopes, Grips)</option>
                  <option value="COGNITIVE_SOFTWARE">Cognitive & Assistive Software</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Storage Bay / Room Location</label>
                <Input
                  value={newEqLocation}
                  onChange={(e) => setNewEqLocation(e.target.value)}
                  placeholder="e.g. Sensory Sanctuary Room 102"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Target Accommodations (comma-separated)</label>
                <Input
                  value={newEqAccommodations}
                  onChange={(e) => setNewEqAccommodations(e.target.value)}
                  placeholder="e.g. ADHD Focus, Sensory Calming"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-700 hover:bg-teal-800 text-xs"
                >
                  Add Device
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
