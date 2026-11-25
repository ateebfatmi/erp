'use client';

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sparkles,
  Award,
  Layers,
  Wrench,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Users,
  Compass,
  Zap,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
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
  AtlEquipmentItem,
  AtlProject,
  MentorOfChangeSession,
  PrototypeStage,
  InnovationTheme,
  evaluateAtlLabHealth,
  updateProjectStage,
  INITIAL_ATL_INVENTORY,
  INITIAL_ATL_PROJECTS,
  INITIAL_MOC_SESSIONS,
} from '@/modules/academics/atal-tinkering-lab';

interface AtalTinkeringLabManagerProps {
  role?: 'admin' | 'student';
}

export function AtalTinkeringLabManager({ role = 'admin' }: AtalTinkeringLabManagerProps) {
  const [inventory, setInventory] = useState<AtlEquipmentItem[]>(INITIAL_ATL_INVENTORY);
  const [projects, setProjects] = useState<AtlProject[]>(INITIAL_ATL_PROJECTS);
  const [mocSessions, setMocSessions] = useState<MentorOfChangeSession[]>(INITIAL_MOC_SESSIONS);

  const [activeTab, setActiveTab] = useState<'projects' | 'packages' | 'mentors' | 'pfr'>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showAddMocModal, setShowAddMocModal] = useState(false);

  // Form states for new project
  const [projTitle, setProjTitle] = useState('');
  const [projTheme, setProjTheme] = useState<InnovationTheme>('AGRITECH_AND_FARMING');
  const [projLeadName, setProjLeadName] = useState('Ananya Verma');
  const [projLeadId, setProjLeadId] = useState('STU-12B-019');
  const [projGrade, setProjGrade] = useState('Class 12-B');
  const [projMembers, setProjMembers] = useState('Ananya Verma, Aarav Sharma');
  const [projSynopsis, setProjSynopsis] = useState('');
  const [projComponents, setProjComponents] = useState('ESP32, Ultrasonic Sensor, OLED');
  const [projMarathon, setProjMarathon] = useState(true);

  // Form states for new equipment
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState<AtlEquipmentItem['packageCategory']>('P1_ELECTRONICS_DEVELOPMENT');
  const [eqQuantity, setEqQuantity] = useState('10');
  const [eqSpecs, setEqSpecs] = useState('');
  const [eqSafety, setEqSafety] = useState('Operate under faculty supervision');

  // Form states for new MoC session
  const [mocName, setMocName] = useState('Dr. Amitava Roy');
  const [mocOrg, setMocOrg] = useState('Senior Scientist, ISRO');
  const [mocTopic, setMocTopic] = useState('Satellite Telemetry & Micro-Sensors');
  const [mocStudents, setMocStudents] = useState('45');
  const [mocDuration, setMocDuration] = useState('90');
  const [mocInsights, setMocInsights] = useState('Conducted live demo of telemetry signal packets.');

  // Lab health evaluation
  const healthReport = useMemo(
    () => evaluateAtlLabHealth(inventory, projects, mocSessions, 280, 72),
    [inventory, projects, mocSessions]
  );

  // Handle advance stage
  const handleAdvanceStage = (projectId: string, currentStage: PrototypeStage) => {
    const stageFlow: PrototypeStage[] = [
      'IDEATION_AND_DESIGN',
      'BREADBOARD_PROOF_OF_CONCEPT',
      'FUNCTIONAL_PROTOTYPE',
      'FIELD_TESTED',
      'EXHIBITION_READY',
    ];
    const currentIndex = stageFlow.indexOf(currentStage);
    if (currentIndex < stageFlow.length - 1) {
      const nextStage = stageFlow[currentIndex + 1];
      const updated = updateProjectStage(
        projects,
        projectId,
        nextStage,
        `Advanced to ${nextStage.replace(/_/g, ' ')} following faculty review.`
      );
      setProjects(updated);
    }
  };

  // Submit project
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;

    const newProject: AtlProject = {
      id: `PROJ-ATL-${Date.now()}`,
      title: projTitle,
      theme: projTheme,
      leadStudentId: projLeadId,
      leadStudentName: projLeadName,
      grade: projGrade,
      teamMembers: projMembers.split(',').map((m) => m.trim()).filter(Boolean),
      facultyMentorName: 'Mr. Arvind Saxena (ATL In-Charge)',
      synopsis: projSynopsis || 'Innovative student prototype under development.',
      componentsUsed: projComponents.split(',').map((c) => c.trim()).filter(Boolean),
      stage: 'IDEATION_AND_DESIGN',
      submittedForAtlMarathon: projMarathon,
      patentOrIpPotential: false,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      mentorFeedback: 'Project initiated and registered in ATL Innovation Register.',
    };

    setProjects([newProject, ...projects]);
    setProjTitle('');
    setProjSynopsis('');
    setShowAddProjectModal(false);
  };

  // Submit equipment
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName) return;

    const qty = Number(eqQuantity) || 5;
    const newItem: AtlEquipmentItem = {
      id: `ATL-EQ-${Date.now()}`,
      name: eqName,
      packageCategory: eqCategory,
      quantityTotal: qty,
      quantityFunctional: qty,
      specifications: eqSpecs || 'Standard educational grade component',
      safetyInstruction: eqSafety,
      status: 'IN_STOCK',
    };

    setInventory([...inventory, newItem]);
    setEqName('');
    setEqSpecs('');
    setShowAddEquipmentModal(false);
  };

  // Submit MoC session
  const handleAddMocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: MentorOfChangeSession = {
      id: `MOC-${Date.now()}`,
      sessionDate: new Date().toISOString().split('T')[0],
      mentorName: mocName,
      mentorOrganization: mocOrg,
      topicCovered: mocTopic,
      participatingStudentCount: Number(mocStudents) || 35,
      durationMinutes: Number(mocDuration) || 60,
      keyInsights: mocInsights,
      studentProjectsReviewed: ['PROJ-ATL-01'],
    };

    setMocSessions([newSession, ...mocSessions]);
    setShowAddMocModal(false);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.leadStudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & NITI Aayog AIM Citation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-teal-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-cyan-500/30 text-cyan-200 border-cyan-400/40 text-xs py-0.5 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              NITI Aayog Atal Innovation Mission (AIM)
            </Badge>
            <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-xs py-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              CBSE STEM & Tinkering Hub
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            Atal Tinkering Lab (ATL) & Innovation Project Desk
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200 mt-1 max-w-3xl">
            Oversee student IoT, robotics, and 3D printing prototypes, manage 4 statutory AIM equipment packages, log Mentor of Change sessions, and generate monthly NITI Aayog PFR returns.
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
            Export Monthly PFR
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">AIM Health Tier</p>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {healthReport.healthTier.replace(/_/g, ' ')}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold">{healthReport.overallLabHealthScore}% Score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Monthly Lab Hours</p>
              <h3 className="text-lg font-bold text-slate-900">{healthReport.monthlyTinkeringHoursDelivered} Hours</h3>
              <p className="text-[11px] text-slate-400">AIM Target: &ge; 60 Hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Student Engagement</p>
              <h3 className="text-lg font-bold text-slate-900">{healthReport.monthlyStudentEngagementCount} Students</h3>
              <p className="text-[11px] text-slate-400">AIM Target: &ge; 250 Reach</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">ATL Marathon Entries</p>
              <h3 className="text-lg font-bold text-slate-900">{healthReport.marathonSubmissionsCount} Submitted</h3>
              <p className="text-[11px] text-slate-400">{healthReport.totalActiveProjects} Active Prototypes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'projects'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu className="h-4 w-4" />
          Innovation Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'packages'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="h-4 w-4" />
          4 AIM Equipment Packages ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('mentors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'mentors'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          Mentor of Change (MoC) Logs ({mocSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('pfr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'pfr'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          NITI Aayog Monthly PFR Audit
        </button>
      </div>

      {/* TAB 1: INNOVATION PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search projects by title, theme, or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <Button
              onClick={() => setShowAddProjectModal(true)}
              size="sm"
              className="bg-cyan-700 hover:bg-cyan-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Submit Innovation Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((p) => (
              <Card key={p.id} className="border-slate-200 shadow-xs flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono text-cyan-800 bg-cyan-50 border-cyan-200">
                          {p.theme.replace(/_/g, ' ')}
                        </Badge>
                        {p.submittedForAtlMarathon && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                            ATL Marathon Nominated
                          </Badge>
                        )}
                        {p.patentOrIpPotential && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]">
                            Patent Potential
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
                        {p.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Lead: <strong className="text-slate-700">{p.leadStudentName}</strong> ({p.grade}) • Team: {p.teamMembers.join(', ')}
                      </CardDescription>
                    </div>

                    <Badge
                      className={
                        p.stage === 'EXHIBITION_READY' || p.stage === 'FIELD_TESTED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                          : p.stage === 'FUNCTIONAL_PROTOTYPE'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-200 text-[10px]'
                          : 'bg-slate-100 text-slate-800 border-slate-200 text-[10px]'
                      }
                    >
                      {p.stage.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {p.synopsis}
                  </p>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Components & Sensors Deployed
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {p.componentsUsed.map((comp, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {p.mentorFeedback && (
                    <div className="bg-cyan-50/70 p-2.5 rounded-lg border border-cyan-100 text-[11px] text-cyan-900">
                      <strong>Mentor Insight: </strong>
                      {p.mentorFeedback}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Updated: {p.lastUpdatedDate}</span>

                    {p.stage !== 'EXHIBITION_READY' && (
                      <Button
                        onClick={() => handleAdvanceStage(p.id, p.stage)}
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 border-cyan-200 text-cyan-700 hover:bg-cyan-50 flex items-center gap-1"
                      >
                        Advance Stage <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 4 AIM EQUIPMENT PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                NITI Aayog 4-Package Standard Equipment Register
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory STEM packages: P1 (Electronics), P2 (3D Printing), P3 (Mechanical Tools), P4 (Sensors & IoT).
              </p>
            </div>
            <Button
              onClick={() => setShowAddEquipmentModal(true)}
              size="sm"
              className="bg-cyan-700 hover:bg-cyan-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Equipment / Consumable
            </Button>
          </div>

          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Package Category</TableHead>
                    <TableHead className="text-xs">Device / Tool Name</TableHead>
                    <TableHead className="text-xs">Specifications</TableHead>
                    <TableHead className="text-xs">Inventory (Func / Total)</TableHead>
                    <TableHead className="text-xs">Safety Instruction</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-xs text-cyan-800">
                        {item.packageCategory.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-slate-900">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                        {item.specifications}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-slate-800">
                        {item.quantityFunctional} / {item.quantityTotal}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 text-[11px]">
                        {item.safetyInstruction}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          className={
                            item.status === 'IN_STOCK'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]'
                              : 'bg-rose-100 text-rose-800 border-rose-200 text-[10px]'
                          }
                        >
                          {item.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: MENTOR OF CHANGE (MoC) SESSIONS */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Atal Innovation Mission Mentor of Change (MoC) Volunteer Records
              </h3>
              <p className="text-xs text-slate-500">
                Industry and research mentors guiding students in advanced electronics, embedded systems, and design thinking.
              </p>
            </div>
            <Button
              onClick={() => setShowAddMocModal(true)}
              size="sm"
              className="bg-cyan-700 hover:bg-cyan-800 text-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Log MoC Session
            </Button>
          </div>

          <div className="space-y-3">
            {mocSessions.map((session) => (
              <Card key={session.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{session.mentorName}</span>
                      <span className="text-xs text-cyan-800 font-medium ml-2">({session.mentorOrganization})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{session.sessionDate}</span>
                      <span>•</span>
                      <span>{session.durationMinutes} Minutes</span>
                      <span>•</span>
                      <Badge className="bg-cyan-50 text-cyan-800 border-cyan-200 text-[10px]">
                        {session.participatingStudentCount} Students Attended
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5">
                    <p>
                      <strong className="text-slate-900">Masterclass Topic: </strong>
                      {session.topicCovered}
                    </p>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong className="text-slate-800">Key Takeaways & Mentorship Guidance: </strong>
                      {session.keyInsights}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NITI AAYOG MONTHLY PFR AUDIT */}
      {activeTab === 'pfr' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-600" />
                  NITI Aayog Monthly Periodic Feedback Report (PFR) Audit
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Monthly statutory compliance metrics mandated by Atal Innovation Mission (AIM).
                </CardDescription>
              </div>
              <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 text-xs font-mono">
                Score: {healthReport.overallLabHealthScore} / 100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    1. Minimum Monthly Tinkering Hours (&ge; 60 Hours Benchmark)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Current Logged: {healthReport.monthlyTinkeringHoursDelivered} Hours / Month
                  </span>
                </div>
                {healthReport.aimBenchmarkMonthlyHoursMet ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Benchmark Satisfied
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Deficit
                  </Badge>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    2. Minimum Monthly Student Engagement Reach (&ge; 250 Students)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Current Reach: {healthReport.monthlyStudentEngagementCount} Students
                  </span>
                </div>
                {healthReport.aimBenchmarkStudentReachMet ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Benchmark Satisfied
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Deficit
                  </Badge>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    3. 4-Package AIM Functional Equipment Availability (&ge; 85%)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Current Readiness: {healthReport.equipmentFunctionalRatio}%
                  </span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> All 4 Packages Operational
                </Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    4. Active ATL Marathon & National Science Exhibition Nominated Projects
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {healthReport.marathonSubmissionsCount} Projects Submitted
                  </span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Nominated
                </Badge>
              </div>
            </div>

            {healthReport.complianceAlerts.length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                <p className="font-semibold">NITI Aayog AIM Monthly PFR Compliant.</p>
                <p className="text-[11px] mt-0.5">Lab qualifies for Platinum Innovation Hub national recognition.</p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800">
                <p className="font-semibold">PFR Compliance Action Items:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  {healthReport.complianceAlerts.map((alert, i) => (
                    <li key={i}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL: Submit Innovation Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-600" />
                Submit Student Innovation Project
              </h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Project Title</label>
                <Input
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. IoT Smart Flood Warning System"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Thematic Domain</label>
                  <select
                    value={projTheme}
                    onChange={(e) => setProjTheme(e.target.value as InnovationTheme)}
                    className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                  >
                    <option value="AGRITECH_AND_FARMING">AgriTech & Smart Farming</option>
                    <option value="CLEAN_ENERGY_AND_ENVIRONMENT">Clean Energy & Environment</option>
                    <option value="ASSISTIVE_TECH_HEALTHCARE">Assistive Tech & Healthcare</option>
                    <option value="SMART_MOBILITY_AND_SAFETY">Smart Mobility & Safety</option>
                    <option value="EDTECH_AND_ROBOTICS">EdTech & Robotics</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Lead Student Full Name</label>
                  <Input
                    value={projLeadName}
                    onChange={(e) => setProjLeadName(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Lead Student ID</label>
                  <Input
                    value={projLeadId}
                    onChange={(e) => setProjLeadId(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Grade / Class</label>
                  <Input
                    value={projGrade}
                    onChange={(e) => setProjGrade(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Team Members (comma-separated)</label>
                <Input
                  value={projMembers}
                  onChange={(e) => setProjMembers(e.target.value)}
                  placeholder="e.g. Aarav Sharma, Diya Sen"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Project Synopsis / Innovation Problem</label>
                <textarea
                  rows={2}
                  value={projSynopsis}
                  onChange={(e) => setProjSynopsis(e.target.value)}
                  placeholder="Explain problem solved and working mechanism..."
                  className="w-full border rounded-lg p-2 text-xs border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Components & Sensors Used (comma-separated)</label>
                <Input
                  value={projComponents}
                  onChange={(e) => setProjComponents(e.target.value)}
                  placeholder="e.g. Arduino UNO, Ultrasonic Sensor, 3D Printed Chassis"
                  className="text-xs h-8"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projMarathon}
                    onChange={(e) => setProjMarathon(e.target.checked)}
                    className="rounded text-cyan-600 h-3.5 w-3.5"
                  />
                  <span className="font-medium text-slate-700">Nominate for NITI Aayog ATL Marathon 2026</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddProjectModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-cyan-700 hover:bg-cyan-800 text-xs"
                >
                  Register Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Equipment */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-600" />
                Add Equipment to AIM Package
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
                <label className="font-medium text-slate-700 block mb-1">AIM Package Classification</label>
                <select
                  value={eqCategory}
                  onChange={(e) => setEqCategory(e.target.value as any)}
                  className="w-full border rounded-lg p-2 text-xs bg-white border-slate-300"
                >
                  <option value="P1_ELECTRONICS_DEVELOPMENT">Package 1: Electronics & Development Boards</option>
                  <option value="P2_RAPID_PROTOTYPING_3D_PRINTING">Package 2: Rapid Prototyping & 3D Printing</option>
                  <option value="P3_MECHANICAL_POWER_TOOLS">Package 3: Mechanical & Power Tools</option>
                  <option value="P4_SENSORS_IOT_ACTUATORS">Package 4: Sensors, Actuators & IoT Modules</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Component / Tool Name</label>
                <Input
                  value={eqName}
                  onChange={(e) => setEqName(e.target.value)}
                  placeholder="e.g. Raspberry Pi 4 Model B (4GB)"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Quantity</label>
                <Input
                  type="number"
                  value={eqQuantity}
                  onChange={(e) => setEqQuantity(e.target.value)}
                  placeholder="10"
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Technical Specifications</label>
                <Input
                  value={eqSpecs}
                  onChange={(e) => setEqSpecs(e.target.value)}
                  placeholder="e.g. Quad core Cortex-A72, 4GB RAM"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Safety Instruction</label>
                <Input
                  value={eqSafety}
                  onChange={(e) => setEqSafety(e.target.value)}
                  placeholder="e.g. Use 5V 3A Type-C power adapter only"
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
                  className="bg-cyan-700 hover:bg-cyan-800 text-xs"
                >
                  Add to Lab Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Log MoC Session */}
      {showAddMocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-600" />
                Log Mentor of Change Masterclass
              </h3>
              <button
                onClick={() => setShowAddMocModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMocSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Mentor Full Name</label>
                <Input
                  value={mocName}
                  onChange={(e) => setMocName(e.target.value)}
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Industry / Research Organization</label>
                <Input
                  value={mocOrg}
                  onChange={(e) => setMocOrg(e.target.value)}
                  className="text-xs h-8"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Topic Covered</label>
                <Input
                  value={mocTopic}
                  onChange={(e) => setMocTopic(e.target.value)}
                  className="text-xs h-8"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Students Attending</label>
                  <Input
                    type="number"
                    value={mocStudents}
                    onChange={(e) => setMocStudents(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Duration (Minutes)</label>
                  <Input
                    type="number"
                    value={mocDuration}
                    onChange={(e) => setMocDuration(e.target.value)}
                    className="text-xs h-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Mentorship Insights & Feedback</label>
                <textarea
                  rows={2}
                  value={mocInsights}
                  onChange={(e) => setMocInsights(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs border-slate-300"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMocModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-cyan-700 hover:bg-cyan-800 text-xs"
                >
                  Save MoC Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
