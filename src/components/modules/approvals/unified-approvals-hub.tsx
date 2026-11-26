'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  History,
  GitFork,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  Building,
  User,
  DollarSign,
  Briefcase,
  FileText,
  Boxes,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { formatCurrency, formatDate } from '@/lib/utils';

export type ApprovalsTabId = 'inbox' | 'history' | 'rules';

export interface ApprovalTask {
  id: string;
  module: 'leave' | 'fee_concession' | 'indent' | 'transfer_certificate';
  title: string;
  applicantName: string;
  applicantRole: string;
  department: string;
  requestDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  summary: string;
  amountOrDays?: string;
  currentStep: number;
  totalSteps: number;
  status: 'pending' | 'approved' | 'rejected';
  decisionRemarks?: string;
  decidedAt?: string;
}

export interface ApprovalRule {
  id: string;
  module: string;
  ruleName: string;
  condition: string;
  approverChain: string[];
  autoApproveBelow?: string;
  status: 'active' | 'paused';
}

interface UnifiedApprovalsHubProps {
  initialTab?: ApprovalsTabId;
}

export function UnifiedApprovalsHub({ initialTab = 'inbox' }: UnifiedApprovalsHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Active Pending Tasks
  const [tasks, setTasks] = useState<ApprovalTask[]>([
    {
      id: 'task-101',
      module: 'fee_concession',
      title: 'Merit-Cum-Means 50% Concession',
      applicantName: 'Devansh Verma (Class 10A)',
      applicantRole: 'Parent: Smt. Sunita Verma',
      department: 'Fee Accounts',
      requestDate: '2026-11-26',
      priority: 'high',
      summary: 'State-level Science Olympiad 1st Rank; single parent annual income < ₹2.5L certificate verified.',
      amountOrDays: '₹9,750 / Term',
      currentStep: 2,
      totalSteps: 2,
      status: 'pending',
    },
    {
      id: 'task-102',
      module: 'leave',
      title: 'Medical Leave Application (4 Days)',
      applicantName: 'Dr. Ramesh Sharma',
      applicantRole: 'PGT Physics / HOD',
      department: 'Academics',
      requestDate: '2026-11-26',
      priority: 'urgent',
      summary: 'Viral pneumonia recovery; arrangement periods already assigned to Mrs. Ananya Sen.',
      amountOrDays: '4 Days (Nov 27 - Nov 30)',
      currentStep: 1,
      totalSteps: 2,
      status: 'pending',
    },
    {
      id: 'task-103',
      module: 'indent',
      title: 'Robotics Lab Components Procurement',
      applicantName: 'Er. Sandeep Mittal',
      applicantRole: 'ATL In-Charge',
      department: 'Atal Tinkering Lab',
      requestDate: '2026-11-25',
      priority: 'normal',
      summary: 'Procurement of 10 Arduino Uno kits, sensors & servo motors for inter-school robotics fest.',
      amountOrDays: '₹14,500',
      currentStep: 1,
      totalSteps: 2,
      status: 'pending',
    },
    {
      id: 'task-104',
      module: 'transfer_certificate',
      title: 'Transfer Certificate Clearance & Sign-off',
      applicantName: 'Rohan Mehra (Adm #DPGA/2024/091)',
      applicantRole: 'Student (Class 9B)',
      department: 'Student Registry',
      requestDate: '2026-11-25',
      priority: 'normal',
      summary: 'Parent transfer to Bengaluru (Defence Officer); all 5 department no-dues clearances verified.',
      amountOrDays: 'UDISE+ PEN: 2049182',
      currentStep: 2,
      totalSteps: 2,
      status: 'pending',
    },
  ]);

  // Decision History
  const [history, setHistory] = useState<ApprovalTask[]>([
    {
      id: 'task-099',
      module: 'leave',
      title: 'Casual Leave (1 Day)',
      applicantName: 'Kavita Joshi',
      applicantRole: 'Primary Teacher (Grade 3)',
      department: 'Academics',
      requestDate: '2026-11-24',
      priority: 'normal',
      summary: 'Family emergency; substitute teacher assigned.',
      amountOrDays: '1 Day',
      currentStep: 1,
      totalSteps: 1,
      status: 'approved',
      decisionRemarks: 'Approved as per casual leave eligibility.',
      decidedAt: '2026-11-24 14:30',
    },
    {
      id: 'task-098',
      module: 'indent',
      title: 'Sports Day Trophies & Medals Batch',
      applicantName: 'Coach Balwant Singh',
      applicantRole: 'Physical Education Director',
      department: 'Sports & Athletics',
      requestDate: '2026-11-23',
      priority: 'high',
      summary: 'Custom engraved medals for Annual Sports Meet 2026.',
      amountOrDays: '₹32,000',
      currentStep: 2,
      totalSteps: 2,
      status: 'approved',
      decisionRemarks: 'Approved under Sports & Cultural Annual Cap.',
      decidedAt: '2026-11-23 16:15',
    },
  ]);

  // Multi-tier Workflow Rules
  const [rules] = useState<ApprovalRule[]>([
    {
      id: 'rule-1',
      module: 'Faculty Leave',
      ruleName: 'Extended Medical / Casual Leave (>3 Days)',
      condition: 'Leave Duration > 3 Calendar Days',
      approverChain: ['HOD / Coordinator', 'Principal'],
      autoApproveBelow: '1 Day (Auto-Logged)',
      status: 'active',
    },
    {
      id: 'rule-2',
      module: 'Fee Concessions',
      ruleName: 'Tuition Fee Waiver / Concession Request',
      condition: 'Concession Amount > ₹5,000 / Term',
      approverChain: ['Accounts Bursar', 'Principal / Secretary'],
      status: 'active',
    },
    {
      id: 'rule-3',
      module: 'Store Indents',
      ruleName: 'Capital Asset & Equipment Procurement',
      condition: 'Purchase Amount > ₹10,000',
      approverChain: ['Store Supervisor', 'Bursar', 'Principal'],
      status: 'active',
    },
    {
      id: 'rule-4',
      module: 'Transfer Certificates',
      ruleName: 'CBSE 20-Point TC Public Release',
      condition: 'No-Dues Satisfied from 5 Depts',
      approverChain: ['Registrar', 'Principal'],
      status: 'active',
    },
  ]);

  // Action State (Approve / Reject Dialogs)
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleConfirmDecision = () => {
    if (!selectedTask || !actionType) return;

    const updatedTask: ApprovalTask = {
      ...selectedTask,
      status: actionType === 'approve' ? 'approved' : 'rejected',
      decisionRemarks: remarks || (actionType === 'approve' ? 'Approved by Executive Desk' : 'Rejected by Executive Desk'),
      decidedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    // Remove from pending, add to history
    setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
    setHistory((prev) => [updatedTask, ...prev]);

    setSelectedTask(null);
    setActionType(null);
    setRemarks('');
  };

  const tabs: SubTabItem[] = [
    {
      id: 'inbox',
      label: 'Pending Approvals Queue',
      icon: CheckSquare,
      badge: `${tasks.length} Actionable`,
    },
    {
      id: 'history',
      label: 'Decision History & Audit Trail',
      icon: History,
      badge: `${history.length} Logged`,
    },
    {
      id: 'rules',
      label: 'Multi-Tier Approval Rules',
      icon: GitFork,
      badge: 'Active Policies',
    },
  ];

  const getModuleBadge = (module: ApprovalTask['module']) => {
    switch (module) {
      case 'leave':
        return <Badge variant="indigo" className="gap-1 text-[10px]"><Briefcase className="h-3 w-3" /> Leave</Badge>;
      case 'fee_concession':
        return <Badge variant="warning" className="gap-1 text-[10px]"><DollarSign className="h-3 w-3" /> Concession</Badge>;
      case 'indent':
        return <Badge variant="secondary" className="gap-1 text-[10px]"><Boxes className="h-3 w-3" /> Indent</Badge>;
      case 'transfer_certificate':
        return <Badge variant="default" className="gap-1 text-[10px]"><FileText className="h-3 w-3" /> TC Clearance</Badge>;
    }
  };

  const inboxColumns: DataTableColumn<ApprovalTask>[] = [
    {
      key: 'module',
      header: 'Category',
      render: (row) => getModuleBadge(row.module),
    },
    {
      key: 'title',
      header: 'Request Summary',
      render: (row) => (
        <div className="max-w-md">
          <span className="font-bold text-slate-900 block text-xs">{row.title}</span>
          <span className="text-[11px] text-slate-600 line-clamp-1">{row.summary}</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
            By: {row.applicantName} ({row.applicantRole}) • {row.department}
          </span>
        </div>
      ),
    },
    {
      key: 'amountOrDays',
      header: 'Scope / Value',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
          {row.amountOrDays || '—'}
        </span>
      ),
    },
    {
      key: 'currentStep',
      header: 'Workflow Stage',
      align: 'center',
      render: (row) => (
        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
          Step {row.currentStep} of {row.totalSteps}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Decision',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            onClick={() => {
              setSelectedTask(row);
              setActionType('approve');
            }}
            className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1 shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTask(row);
              setActionType('reject');
            }}
            className="h-7 px-2.5 text-xs text-rose-700 hover:bg-rose-50 border-rose-200 font-semibold gap-1"
          >
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-indigo-600" />
              Central Executive Approvals &amp; Governance Inbox
            </h1>
            <Badge variant="indigo" className="text-[11px] font-semibold py-0.5">
              Multi-Tier Delegation
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Unified authority desk for school administrators, principals, and directors: review and clear inter-departmental
            leave applications, fee concessions, capital procurement indents, and Transfer Certificate sign-offs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            Zero Pending SLA Overdues
          </Badge>
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Actionable Inbox Queue */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Pending Executive Requests Awaiting Sign-off</span>
            </div>
            <span className="text-xs text-slate-500 font-medium font-mono">
              {tasks.length} items requiring decision
            </span>
          </div>

          <DataTable
            data={tasks}
            columns={inboxColumns}
            rowKey="id"
            searchPlaceholder="Search approvals by title, applicant, or department..."
            exportCsvFilename="pending_approvals_inbox"
          />
        </div>
      )}

      {/* Tab 2: Decision History & Audit Trail */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <DataTable
            data={history}
            columns={[
              {
                key: 'module',
                header: 'Category',
                render: (row) => getModuleBadge(row.module),
              },
              {
                key: 'title',
                header: 'Request Summary',
                render: (row) => (
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">{row.title}</span>
                    <span className="text-[11px] text-slate-500">{row.applicantName} • {row.department}</span>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Outcome',
                align: 'center',
                render: (row) =>
                  row.status === 'approved' ? (
                    <Badge variant="success" className="gap-1 text-[10px] font-semibold">
                      <CheckCircle2 className="h-3 w-3" /> Approved
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1 text-[10px] font-semibold">
                      <XCircle className="h-3 w-3" /> Rejected
                    </Badge>
                  ),
              },
              {
                key: 'decisionRemarks',
                header: 'Approver Decision Notes',
                render: (row) => <span className="text-xs text-slate-700 italic">&ldquo;{row.decisionRemarks}&rdquo;</span>,
              },
              {
                key: 'decidedAt',
                header: 'Timestamp',
                render: (row) => <span className="font-mono text-xs text-slate-500">{row.decidedAt}</span>,
              },
            ]}
            rowKey="id"
            exportCsvFilename="approvals_decision_audit"
          />
        </div>
      )}

      {/* Tab 3: Multi-Tier Approval Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="border-slate-200 shadow-xs">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      {rule.module}
                    </span>
                    <CardTitle className="text-sm font-bold text-slate-900">
                      {rule.ruleName}
                    </CardTitle>
                  </div>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-500 block text-[10px] font-medium uppercase">Trigger Condition:</span>
                    <strong className="text-slate-800">{rule.condition}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-medium uppercase block mb-1">
                      Sequential Approval Chain:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {rule.approverChain.map((approver, idx) => (
                        <React.Fragment key={approver}>
                          <span className="px-2 py-1 rounded bg-indigo-50 border border-indigo-200 text-[11px] font-semibold text-indigo-900">
                            {idx + 1}. {approver}
                          </span>
                          {idx < rule.approverChain.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {selectedTask && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl border-slate-200 animate-in fade-in zoom-in-95">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {actionType === 'approve' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-600" />
                )}
                {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
              </CardTitle>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong>Request:</strong> {selectedTask.title}</div>
                <div><strong>Applicant:</strong> {selectedTask.applicantName} ({selectedTask.department})</div>
                <div><strong>Scope / Value:</strong> {selectedTask.amountOrDays}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Decision Remarks {actionType === 'reject' && '*'}
                </label>
                <textarea
                  rows={3}
                  required={actionType === 'reject'}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'Add any conditions, sanctions, or approval notes...'
                      : 'State the specific reason for rejecting this request...'
                  }
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTask(null);
                    setActionType(null);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmDecision}
                  className={
                    actionType === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold'
                      : 'bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold'
                  }
                >
                  Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
