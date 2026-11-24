import React from 'react';
import { Boxes, PackageCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StockRequisitionManager } from '@/components/modules/inventory/stock-requisition-manager';

export default function TeacherRequisitionPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            Departmental Material Indents & Store Requisitions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Raise supply requisitions for science lab consumables, computer lab accessories, exam stationery, and sports equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <PackageCheck className="h-3 w-3" />
            Central Store Connected
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <StockRequisitionManager role="teacher" userDepartment="SCIENCE_LAB" userName="Smt. Ananya Sen" />
    </div>
  );
}
