'use client';

import React, { useState, useMemo } from 'react';
import {
  Flame,
  ShieldAlert,
  ShieldCheck,
  Award,
  AlertTriangle,
  Clock,
  Printer,
  Plus,
  Users,
  CheckCircle2,
  FileText,
  Search,
  Building,
  Bell,
  Activity,
  Calendar,
  Layers,
  Wrench,
  Sparkles,
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
  StatutorySafetyCertificate,
  FireSafetyEquipment,
  EvacuationMockDrill,
  SDMCMember,
  DrillType,
  FireEquipmentType,
  EquipmentCondition,
  evaluateCertificateStatus,
  evaluateDisasterSafetyAudit,
  INITIAL_CERTIFICATES,
  INITIAL_FIRE_EQUIPMENT,
  INITIAL_MOCK_DRILLS,
  INITIAL_SDMC_MEMBERS,
} from '@/modules/security/disaster-management';

export function DisasterManagementManager() {
  const [certificates, setCertificates] = useState<StatutorySafetyCertificate[]>(INITIAL_CERTIFICATES);
  const [equipment, setEquipment] = useState<FireSafetyEquipment[]>(INITIAL_FIRE_EQUIPMENT);
  const [drills, setDrills] = useState<EvacuationMockDrill[]>(INITIAL_MOCK_DRILLS);
  const [sdmcMembers] = useState<SDMCMember[]>(INITIAL_SDMC_MEMBERS);

  const [activeTab, setActiveTab] = useState<'drills' | 'certificates' | 'equipment' | 'sdmc'>('drills');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddDrillModal, setShowAddDrillModal] = useState(false);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);

  // Form states for new drill
  const [drillType, setDrillType] = useState<DrillType>('FIRE_EVACUATION');
  const [drillDate, setDrillDate] = useState('2026-11-25');
  const [drillStartTime, setDrillStartTime] = useState('11:00 AM');
  const [drillEndTime, setDrillEndTime] = useState('11:03 AM');
  const [drillOccupants, setDrillOccupants] = useState('1450');
  const [drillDurationSeconds, setDrillDurationSeconds] = useState('160');
  const [drillRemarks, setDrillRemarks] = useState('Rapid orderly evacuation across 4 stairwells to Cricket Ground Zone A.');
  const [drillCorrectiveActions, setDrillCorrectiveActions] = useState('Service West Wing acoustic alarm sounder');

  // Form states for new certificate
  const [certType, setCertType] = useState<StatutorySafetyCertificate['certificateType']>('FIRE_SAFETY_NOC_FORM_5');
  const [certNumber, setCertNumber] = useState('');
  const [certAuthority, setCertAuthority] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('2026-01-01');
  const [certExpiryDate, setCertExpiryDate] = useState('2029-01-01');

  // Form states for new equipment
  const [eqType, setEqType] = useState<FireEquipmentType>('ABC_DRY_POWDER');
  const [eqLocation, setEqLocation] = useState('');
  const [eqCapacity, setEqCapacity] = useState('6 Kg MAP 50%');
  const [eqVendor, setEqVendor] = useState('Minimax Fire Protection');

  // Compute composite audit
  const audit = useMemo(
    () => evaluateDisasterSafetyAudit(certificates, equipment, drills),
    [certificates, equipment, drills]
  );

  // Handle Log Mock Drill
  const handleAddDrillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const occupants = Number(drillOccupants) || 1000;
    const duration = Number(drillDurationSeconds) || 150;

    const newDrill: EvacuationMockDrill = {
      id: `DRILL-${Date.now()}`,
      drillType,
      scheduledDate: drillDate,
      drillStartTime,
      drillEndTime,
      totalOccupantsPresent: occupants,
      totalEvacuatedSafely: occupants,
      evacuationDurationSeconds: duration,
      safeAssemblyArea: 'Main Athletics Ground - Safe Zone A',
      floorWardensReporting: 12,
      unaccountedSimulatedCount: 0,
      evaluatorRemarks: drillRemarks || 'Drill executed successfully under statutory time limit.',
      correctiveActionsRequired: drillCorrectiveActions.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'COMPLETED',
    };

    setDrills([newDrill, ...drills]);
    setShowAddDrillModal(false);
  };

  // Handle Add Certificate
  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber || !certAuthority) return;

    const newCert: StatutorySafetyCertificate = {
      id: `CERT-${Date.now()}`,
      certificateType: certType,
      certificateNumber: certNumber,
      issuingAuthority: certAuthority,
      issueDate: certIssueDate,
      expiryDate: certExpiryDate,
      status: evaluateCertificateStatus(certExpiryDate),
      pdfDocumentUrl: '/documents/statutory-safety-doc.pdf',
    };

    setCertificates([...certificates, newCert]);
    setCertNumber('');
    setCertAuthority('');
    setShowAddCertModal(false);
  };

  // Handle Add Equipment
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqLocation) return;

    const newEq: FireSafetyEquipment = {
      id: `EQ-FIRE-${Date.now()}`,
      type: eqType,
      serialNumber: `FE-${Math.floor(100 + Math.random() * 900)}`,
      capacityOrRating: eqCapacity,
      locationFloor: eqLocation,
      lastInspectedDate: new Date().toISOString().split('T')[0],
      nextHydroTestDueDate: '2027-11-30',
      condition: 'FUNCTIONAL',
      pressureGaugeNormal: true,
      serviceVendor: eqVendor,
    };

    setEquipment([...equipment, newEq]);
    setEqLocation('');
    setShowAddEquipmentModal(false);
  };

  // Toggle Equipment Condition
  const handleToggleEquipmentCondition = (eqId: string) => {
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id === eqId) {
          const nextCondition: EquipmentCondition =
            eq.condition === 'FUNCTIONAL' ? 'REFILL_REQUIRED' : 'FUNCTIONAL';
          return {
            ...eq,
            condition: nextCondition,
            pressureGaugeNormal: nextCondition === 'FUNCTIONAL',
          };
        }
        return eq;
      })
    );
  };

  const filteredEquipment = equipment.filter(
    (e) =>
      e.locationFloor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Statutory Citations */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-rose-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-rose-500/30 text-rose-200 border-rose-400/40 text-xs py-0.5 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              CBSE Affiliation Bye-Laws Cl. 2.4.9
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/40 text-xs py-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              NDMA School Safety Policy
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Flame className="h-6 w-6 text-rose-400" />
            Disaster Management, Fire Safety NOC & Evacuation Drill Desk
          </h1>
          <p className="text-xs sm:text-sm text-rose-200 mt-1 max-w-3xl">
            Maintain statutory Form-5 Fire Safety NOCs, oversee bi-annual campus fire & earthquake evacuation mock drills, inspect fire extinguishers, and direct the School Disaster Management Committee (SDMC).
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
            Print Safety Dossier
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Overall Safety Index</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{audit.overallSafetyIndex}%</h3>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                  Grade {audit.complianceGrade.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">NBC 2016 Compliant</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Fire Safety NOC (Form-5)</p>
              <h3 className="text-lg font-bold text-emerald-700">
                {audit.fireNocValid ? 'Verified Valid' : 'Requires Renewal'}
              </h3>
              <p className="text-[11px] text-slate-400">Delhi Fire Services</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Last Mock Drill</p>
              <h3 className="text-lg font-bold text-slate-900">{audit.lastMockDrillDaysAgo} Days Ago</h3>
              <p className="text-[11px] text-slate-400">
                {audit.biAnnualMockDrillCompliant ? 'Bi-Annual Cycle Met' : 'Overdue (>180 Days)'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Fire Extinguishers</p>
              <h3 className="text-lg font-bold text-slate-900">{audit.equipmentFunctionalRate}% Ready</h3>
              <p className="text-[11px] text-slate-400">{equipment.length} Active Stations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('drills')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'drills'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="h-4 w-4" />
          Evacuation Mock Drills ({drills.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'certificates'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Statutory Safety NOCs ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'equipment'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Flame className="h-4 w-4" />
          Fire Equipment Register ({equipment.length})
        </button>
        <button
          onClick={() => setActiveTab('sdmc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'sdmc'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          SDMC Emergency Committee ({sdmcMembers.length})
        </button>
      </div>

      {/* TAB 1: EVACUATION MOCK DRILLS */}
      {activeTab === 'drills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Bi-Annual Evacuation Mock Drill Register
              </h3>
              <p className="text-xs text-slate-500">
                CBSE Affiliation Bye-Laws mandate bi-annual drills. Evacuation benchmark target: $\le$ 3 minutes.
              </p>
            </div>
            <Button
              onClick={() => setShowAddDrillModal(true)}
              size="sm"
              className="bg-rose-700 hover:bg-rose-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Evacuation Mock Drill
            </Button>
          </div>

          <div className="space-y-4">
            {drills.map((d) => {
              const minutes = Math.floor(d.evacuationDurationSeconds / 60);
              const seconds = d.evacuationDurationSeconds % 60;
              const isUnderThreeMinutes = d.evacuationDurationSeconds <= 180;

              return (
                <Card key={d.id} className="border-slate-200 shadow-xs">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-xs">
                          {d.drillType.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-xs font-bold text-slate-800">{d.scheduledDate}</span>
                        <span className="text-xs text-slate-500">
                          ({d.drillStartTime} - {d.drillEndTime})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono font-bold ${
                            isUnderThreeMinutes
                              ? 'text-emerald-700 border-emerald-300 bg-emerald-50'
                              : 'text-rose-700 border-rose-300 bg-rose-50'
                          }`}
                        >
                          Clearance Time: {minutes}m {seconds}s ({isUnderThreeMinutes ? 'Target Met' : 'Exceeded'})
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                          {d.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 text-xs text-slate-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Total Occupants</span>
                        <span className="font-bold text-slate-800">{d.totalOccupantsPresent} Persons</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Evacuated Safely</span>
                        <span className="font-bold text-emerald-700">{d.totalEvacuatedSafely} (100%)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Safe Assembly Zone</span>
                        <span className="font-bold text-slate-800">{d.safeAssemblyArea}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Floor Wardens</span>
                        <span className="font-bold text-slate-800">{d.floorWardensReporting} Stations</span>
                      </div>
                    </div>

                    <p>
                      <strong className="text-slate-900">Evaluator Assessment: </strong>
                      {d.evaluatorRemarks}
                    </p>

                    <div>
                      <strong className="text-slate-900">Mandatory Corrective Action Checklist:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                        {d.correctiveActionsRequired.map((ca, idx) => (
                          <li key={idx}>{ca}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STATUTORY SAFETY NOCS & CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Government Authority Safety NOC & Building Inspection Dossiers
              </h3>
              <p className="text-xs text-slate-500">
                Essential documents for CBSE Affiliation extension and state education department safety audits.
              </p>
            </div>
            <Button
              onClick={() => setShowAddCertModal(true)}
              size="sm"
              className="bg-rose-700 hover:bg-rose-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Register Safety Certificate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certificates.map((cert) => {
              const status = evaluateCertificateStatus(cert.expiryDate);

              return (
                <Card key={cert.id} className="border-slate-200 shadow-xs flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="outline" className="text-[10px] font-mono text-slate-500 mb-1">
                          {cert.certificateType.replace(/_/g, ' ')}
                        </Badge>
                        <CardTitle className="text-sm font-bold text-slate-900">
                          {cert.certificateNumber}
                        </CardTitle>
                      </div>
                      <Badge
                        className={
                          status === 'VALID'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                            : status === 'EXPIRING_SOON'
                            ? 'bg-amber-100 text-amber-800 border-amber-200 text-[10px]'
                            : 'bg-rose-100 text-rose-800 border-rose-200 text-[10px]'
                        }
                      >
                        {status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Issuing Authority</span>
                      <span className="font-semibold text-slate-800">{cert.issuingAuthority}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Issued:</span>
                        <span className="font-medium text-slate-700">{cert.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Expires:</span>
                        <span className="font-bold text-slate-800">{cert.expiryDate}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Certified Authentic
                      </span>
                      <span className="text-slate-400 font-mono">PDF Verified</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FIRE EQUIPMENT REGISTER */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search equipment by location, type, or serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <Button
              onClick={() => setShowAddEquipmentModal(true)}
              size="sm"
              className="bg-rose-700 hover:bg-rose-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Register Fire Equipment
            </Button>
          </div>

          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Equipment Type</TableHead>
                    <TableHead className="text-xs">Location & Serial</TableHead>
                    <TableHead className="text-xs">Capacity / Rating</TableHead>
                    <TableHead className="text-xs">Pressure & Gauge</TableHead>
                    <TableHead className="text-xs">Next Hydro-Test</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-semibold text-xs text-slate-800">
                        {eq.type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <div>{eq.locationFloor}</div>
                        <div className="text-[10px] font-mono text-slate-400">{eq.serialNumber}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">{eq.capacityOrRating}</TableCell>
                      <TableCell className="text-xs">
                        {eq.pressureGaugeNormal ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> In Green Zone
                          </span>
                        ) : (
                          <span className="text-rose-700 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="h-3 w-3" /> Low / Depleted
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-600">
                        {eq.nextHydroTestDueDate}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          className={
                            eq.condition === 'FUNCTIONAL'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                              : 'bg-rose-100 text-rose-800 border-rose-200 text-[10px]'
                          }
                        >
                          {eq.condition.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        <Button
                          onClick={() => handleToggleEquipmentCondition(eq.id)}
                          variant="outline"
                          size="sm"
                          className="text-[11px] h-7 border-slate-200 hover:bg-slate-100"
                        >
                          {eq.condition === 'FUNCTIONAL' ? 'Mark Refill' : 'Mark Functional'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: SDMC & EMERGENCY RESPONSE ROSTER */}
      {activeTab === 'sdmc' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sdmcMembers.map((m) => (
              <Card key={m.id} className="border-slate-200 shadow-xs">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] mb-1">
                        {m.role.replace(/_/g, ' ')}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-slate-900">{m.name}</CardTitle>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                      {m.contactPhone}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 pt-0">
                  <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                    Assigned Incident Command Responsibility:
                  </strong>
                  <p className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {m.dutyAssignment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Log Evacuation Mock Drill */}
      {showAddDrillModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-600" />
                Log Bi-Annual Evacuation Mock Drill
              </h3>
              <button
                onClick={() => setShowAddDrillModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDrillSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Drill Simulation Type</label>
                  <select
                    value={drillType}
                    onChange={(e) => setDrillType(e.target.value as DrillType)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    <option value="FIRE_EVACUATION">Fire Evacuation Drill</option>
                    <option value="EARTHQUAKE_DROP_COVER_HOLD">Earthquake Drop-Cover-Hold</option>
                    <option value="CHEMISTRY_LAB_HAZMAT">Chemistry Lab Hazmat Spill</option>
                    <option value="FLOOD_OR_CYCLONE_SHELTER">Severe Weather / Cyclone Shelter</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Drill Execution Date</label>
                  <Input
                    type="date"
                    value={drillDate}
                    onChange={(e) => setDrillDate(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Start Time</label>
                  <Input
                    value={drillStartTime}
                    onChange={(e) => setDrillStartTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">End Time</label>
                  <Input
                    value={drillEndTime}
                    onChange={(e) => setDrillEndTime(e.target.value)}
                    placeholder="11:03 AM"
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Duration (Seconds)</label>
                  <Input
                    type="number"
                    value={drillDurationSeconds}
                    onChange={(e) => setDrillDurationSeconds(e.target.value)}
                    placeholder="160"
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Total Occupants Present (Students & Faculty)</label>
                <Input
                  type="number"
                  value={drillOccupants}
                  onChange={(e) => setDrillOccupants(e.target.value)}
                  placeholder="1450"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Evaluator Observations</label>
                <textarea
                  rows={2}
                  value={drillRemarks}
                  onChange={(e) => setDrillRemarks(e.target.value)}
                  placeholder="Record stairwell flow, siren audibility, gas isolation..."
                  className="w-full border rounded-lg p-2 text-xs border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Corrective Action Items (comma-separated)</label>
                <Input
                  value={drillCorrectiveActions}
                  onChange={(e) => setDrillCorrectiveActions(e.target.value)}
                  placeholder="e.g. Service West Wing alarm, Re-align stairwell markers"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDrillModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-rose-700 hover:bg-rose-800 text-xs"
                >
                  Save Mock Drill Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Register Certificate */}
      {showAddCertModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-rose-600" />
                Register Statutory Safety Certificate
              </h3>
              <button
                onClick={() => setShowAddCertModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCertSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Certificate Classification</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                >
                  <option value="FIRE_SAFETY_NOC_FORM_5">Form-5 Fire Safety NOC</option>
                  <option value="STRUCTURAL_STABILITY_PWD">PWD Structural Stability Certificate</option>
                  <option value="SAFE_DRINKING_WATER_SANITARY">Safe Drinking Water & Sanitary Certificate</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Official Certificate Number</label>
                <Input
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  placeholder="e.g. DFS/HQ/School/2026/NOC-9921"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Issuing Government Authority</label>
                <Input
                  value={certAuthority}
                  onChange={(e) => setCertAuthority(e.target.value)}
                  placeholder="e.g. Delhi Fire Services / Executive Engineer PWD"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Issue Date</label>
                  <Input
                    type="date"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Expiry Date</label>
                  <Input
                    type="date"
                    value={certExpiryDate}
                    onChange={(e) => setCertExpiryDate(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCertModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-rose-700 hover:bg-rose-800 text-xs"
                >
                  Save Certificate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Register Equipment */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-600" />
                Register Fire Protection Equipment
              </h3>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Equipment Category</label>
                <select
                  value={eqType}
                  onChange={(e) => setEqType(e.target.value as FireEquipmentType)}
                  className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                >
                  <option value="ABC_DRY_POWDER">ABC Dry Powder Extinguisher</option>
                  <option value="CO2_EXTINGUISHER">CO2 Gas Extinguisher</option>
                  <option value="MECHANICAL_FOAM">Mechanical Foam (AFFF)</option>
                  <option value="FIRE_HOSE_REEL">Fire Hose Reel (30m)</option>
                  <option value="YARD_HYDRANT">Yard Hydrant Post</option>
                  <option value="EMERGENCY_ALARM_PANEL">Emergency Alarm Panel / Hooter</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Installation Location & Floor</label>
                <Input
                  value={eqLocation}
                  onChange={(e) => setEqLocation(e.target.value)}
                  placeholder="e.g. 2nd Floor Library Corridor"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Capacity or Rating</label>
                <Input
                  value={eqCapacity}
                  onChange={(e) => setEqCapacity(e.target.value)}
                  placeholder="e.g. 6 Kg MAP 50%"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Annual Maintenance Contractor</label>
                <Input
                  value={eqVendor}
                  onChange={(e) => setEqVendor(e.target.value)}
                  placeholder="e.g. Minimax Fire Protection Pvt Ltd"
                  className="text-xs h-8"
                  required
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
                  className="bg-rose-700 hover:bg-rose-800 text-xs"
                >
                  Save Equipment Station
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
