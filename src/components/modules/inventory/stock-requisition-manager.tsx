'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Boxes,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Building,
  User,
  ExternalLink,
} from 'lucide-react';
import {
  DepartmentType,
  RequisitionPriority,
  RequisitionStatus,
  IndentRequisition,
  StockCatalogItem,
  INITIAL_STOCK_ITEMS,
  INITIAL_REQUISITIONS,
  createRequisition,
  updateRequisitionStatus,
  calculateRequisitionStats,
} from '@/modules/inventory/requisition';

interface Props {
  role?: 'teacher' | 'admin';
  userDepartment?: DepartmentType;
  userName?: string;
}

export function StockRequisitionManager({
  role = 'teacher',
  userDepartment = 'SCIENCE_LAB',
  userName = 'Smt. Ananya Sen',
}: Props) {
  const [requisitions, setRequisitions] = useState<IndentRequisition[]>(INITIAL_REQUISITIONS);
  const [catalog] = useState<StockCatalogItem[]>(INITIAL_STOCK_ITEMS);
  const [activeTab, setActiveTab] = useState<'queue' | 'raise' | 'catalog'>('queue');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Requisition Form State
  const [reqDept, setReqDept] = useState<DepartmentType>(userDepartment);
  const [selectedStockId, setSelectedStockId] = useState<string>('stk-02');
  const [customItemName, setCustomItemName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(5);
  const [unit, setUnit] = useState<string>('Bottles (500g)');
  const [priority, setPriority] = useState<RequisitionPriority>('ROUTINE');
  const [justification, setJustification] = useState<string>('');

  const stats = calculateRequisitionStats(requisitions);

  const handleStockSelect = (stockId: string) => {
    setSelectedStockId(stockId);
    if (stockId === 'custom') {
      setCustomItemName('');
      setUnit('Units');
    } else {
      const item = catalog.find((c) => c.id === stockId);
      if (item) {
        setCustomItemName(item.name);
        setUnit(item.unit);
        setReqDept(item.category);
      }
    }
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const finalItemName = selectedStockId === 'custom' ? customItemName : (catalog.find((c) => c.id === selectedStockId)?.name || customItemName);
    if (!finalItemName.trim()) return;

    const newReq = createRequisition({
      department: reqDept,
      requesterName: userName,
      requesterEmployeeCode: 'DPGA/EMP/2021/048',
      itemName: finalItemName,
      quantityRequested: quantity,
      unit,
      priority,
      justificationPurpose: justification,
    });

    setRequisitions([newReq, ...requisitions]);
    setFeedback(`Requisition ${newReq.requisitionNumber} raised successfully for ${quantity} ${unit} of "${finalItemName}".`);
    setJustification('');
    setActiveTab('queue');
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleUpdateStatus = (reqId: string, newStatus: RequisitionStatus) => {
    const { updatedRecords, updatedItem } = updateRequisitionStatus(
      requisitions,
      reqId,
      newStatus,
      newStatus === 'SANCTIONED' ? 'Sanctioned by Estate Store' : newStatus === 'ISSUED_FROM_STORE' ? 'Dispatched from Central Warehouse' : 'Rejected'
    );
    setRequisitions(updatedRecords);
    if (updatedItem) {
      setFeedback(
        newStatus === 'ISSUED_FROM_STORE'
          ? `Requisition ${updatedItem.requisitionNumber} ISSUED! Store Voucher: ${updatedItem.storeVoucherNumber}.`
          : `Requisition ${updatedItem.requisitionNumber} status updated to ${newStatus}.`
      );
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const filteredRequisitions = requisitions.filter((r) => {
    if (departmentFilter !== 'ALL' && r.department !== departmentFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.itemName.toLowerCase().includes(q);
      const matchNum = r.requisitionNumber.toLowerCase().includes(q);
      const matchPerson = r.requesterName.toLowerCase().includes(q);
      if (!matchName && !matchNum && !matchPerson) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-700 h-7"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium">Total Indents</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1">{stats.total}</h3>
            <p className="text-[11px] text-slate-400">All Departments</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium">Pending Approval</p>
            <h3 className="text-2xl font-bold font-mono text-amber-600 mt-1">{stats.pending}</h3>
            <p className="text-[11px] text-amber-700">Awaiting Store Sign-Off</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium">Sanctioned & Ready</p>
            <h3 className="text-2xl font-bold font-mono text-blue-600 mt-1">{stats.sanctioned}</h3>
            <p className="text-[11px] text-blue-700">Ready for Store Pickup</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium">Fulfilled & Issued</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-700 mt-1">{stats.issued}</h3>
            <p className="text-[11px] text-emerald-700">SIV Vouchers Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'queue'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes className="h-4 w-4" />
          Requisitions Queue ({requisitions.length})
        </button>
        <button
          onClick={() => setActiveTab('raise')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'raise'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          Raise Material Indent
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PackageCheck className="h-4 w-4" />
          Central Store Buffer Stocks ({catalog.length})
        </button>
      </div>

      {/* TAB 1: REQUISITION QUEUE */}
      {activeTab === 'queue' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-blue-600" />
                  Departmental Store Requisitions & Issue Logs
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track science lab consumables, exam stationery, and sports equipment requests with store issue vouchers.
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item, requester, indent #..."
                  className="text-xs h-8 w-48"
                />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value as DepartmentType | 'ALL')}
                  className="text-xs border border-slate-300 rounded-md p-1.5 bg-white h-8"
                >
                  <option value="ALL">All Departments</option>
                  <option value="SCIENCE_LAB">Science Lab</option>
                  <option value="COMPUTER_LAB">Computer Lab</option>
                  <option value="EXAM_CELL">Exam Cell</option>
                  <option value="SPORTS_DEPT">Sports Dept</option>
                  <option value="ART_CULTURE">Art & Culture</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | 'ALL')}
                  className="text-xs border border-slate-300 rounded-md p-1.5 bg-white h-8"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="SANCTIONED">Sanctioned</option>
                  <option value="ISSUED_FROM_STORE">Issued from Store</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {filteredRequisitions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No requisitions found matching the selected criteria.
                </div>
              ) : (
                filteredRequisitions.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {req.requisitionNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {req.department}
                        </Badge>
                        {req.priority === 'HIGH_EXAM_PREP' && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                            High: Exam Prep
                          </Badge>
                        )}
                        {req.status === 'ISSUED_FROM_STORE' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                            Issued ({req.storeVoucherNumber})
                          </Badge>
                        ) : req.status === 'SANCTIONED' ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">
                            Sanctioned (Ready)
                          </Badge>
                        ) : req.status === 'PENDING_APPROVAL' ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                            Pending Store Review
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px]">
                            Rejected
                          </Badge>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">
                        {req.itemName} &bull;{' '}
                        <span className="text-blue-600 font-mono">
                          {req.quantityRequested} {req.unit}
                        </span>
                      </h4>

                      <p className="text-xs text-slate-600 italic">"{req.justificationPurpose}"</p>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                        <span>Requested by: {req.requesterName}</span>
                        <span>&bull;</span>
                        <span>Date: {req.requestedAt}</span>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    {role === 'admin' && req.status === 'PENDING_APPROVAL' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(req.id, 'SANCTIONED')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                        >
                          Sanction
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(req.id, 'ISSUED_FROM_STORE')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                        >
                          Issue from Store
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          className="text-rose-600 border-slate-300 text-xs h-8"
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {role === 'admin' && req.status === 'SANCTIONED' && (
                      <div className="shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(req.id, 'ISSUED_FROM_STORE')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                        >
                          Generate Store Issue Voucher (SIV)
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: RAISE MATERIAL INDENT FORM */}
      {activeTab === 'raise' && (
        <Card className="border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-blue-600" />
              Raise Departmental Material Indent Requisition
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Submit supply requests for science labs, exam cell, athletic sports, and computer centers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateRequisition} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Requisitioning Department
                </label>
                <select
                  value={reqDept}
                  onChange={(e) => setReqDept(e.target.value as DepartmentType)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="SCIENCE_LAB">Science & Chemistry Laboratory</option>
                  <option value="COMPUTER_LAB">Computer Science & AI Lab</option>
                  <option value="EXAM_CELL">Examination & Evaluation Cell</option>
                  <option value="SPORTS_DEPT">Physical Education & Sports Dept</option>
                  <option value="ART_CULTURE">Fine Arts & Cultural Activity</option>
                  <option value="INFIRMARY">School Medical Infirmary</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Select Item from Central Store Catalog or Custom
                </label>
                <select
                  value={selectedStockId}
                  onChange={(e) => handleStockSelect(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  {catalog.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.currentStock} {c.unit} in stock)
                    </option>
                  ))}
                  <option value="custom">+ Other Custom Item (Specify below)</option>
                </select>
              </div>

              {selectedStockId === 'custom' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Custom Item Name & Specification
                  </label>
                  <Input
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="e.g. Sodium Bicarbonate Powder (AR Grade)"
                    className="text-xs"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Quantity Required
                  </label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="text-xs font-mono"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Packaging Unit
                  </label>
                  <Input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Urgency & Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as RequisitionPriority)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="ROUTINE">Routine Semester Refill</option>
                  <option value="HIGH_EXAM_PREP">High: Practical Board Exam Prep</option>
                  <option value="URGENT_EMERGENCY">Urgent: Essential Replacement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Academic Justification / Class Usage Purpose
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={3}
                  placeholder="e.g. Required for Class 10 Board Practical examination batches starting next week."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Submit Indent to Central Store
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: CENTRAL STORE BUFFER STOCKS */}
      {activeTab === 'catalog' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-emerald-600" />
              Central Store Warehouse Buffer Stocks
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Live inventory levels vs minimum safety buffer thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Safety Buffer</th>
                    <th className="py-3 px-4">Stock Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {catalog.map((item) => {
                    const isLow = item.currentStock <= item.minimumThreshold;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {item.currentStock} {item.unit}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {item.minimumThreshold} {item.unit}
                        </td>
                        <td className="py-3 px-4">
                          {isLow ? (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] flex items-center gap-1 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock - PO Required
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              Adequate Stock
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
