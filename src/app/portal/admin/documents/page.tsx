import React from 'react';
import { Award, Stamp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentStudioManager } from '@/components/modules/documents/document-studio-manager';

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Official Certificate & Document Issuance Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and stamp Bonafide, Merit, Transfer (TC), and Conduct certificates, along with smart student ID cards and official dispatch registers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Stamp className="h-3 w-3" />
            Statutory Stamping Engine
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <DocumentStudioManager />
    </div>
  );
}
