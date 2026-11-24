'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseStudentCsv, StudentImportRow } from '@/modules/imports/importer';
import { createStudentAction } from '@/modules/students/actions';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X, Download } from 'lucide-react';

export function BulkImportModal({ classId, sectionId, campusId }: { classId: string; sectionId: string; campusId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<StudentImportRow[]>([]);
  const [errors, setErrors] = useState<Array<{ row: number; errors: string[] }>>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseStudentCsv(content);
      setParsedRows(result.validRows);
      setErrors(result.invalidRows);
      setImportSuccessCount(null);
    };
    reader.readAsText(file);
  };

  const handleCommit = async () => {
    setIsImporting(true);
    let count = 0;

    for (const r of parsedRows) {
      const formData = new FormData();
      formData.set('fullName', r.full_name);
      formData.set('admissionNumber', r.admission_number);
      formData.set('dob', r.dob);
      formData.set('gender', r.gender);
      formData.set('classId', classId);
      formData.set('sectionId', sectionId);
      formData.set('campusId', campusId);

      const res = await createStudentAction(formData);
      if (res.success) count++;
    }

    setIsImporting(false);
    setImportSuccessCount(count);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs gap-1.5 cursor-pointer bg-white"
      >
        <Upload className="h-3.5 w-3.5 text-blue-600" />
        <span>Bulk CSV Import</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[85vh] flex flex-col bg-white shadow-xl border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Bulk Student CSV Ingestion Engine
            </CardTitle>
            <p className="text-xs text-slate-500">
              Upload class roster CSV file to batch-enroll students and provision ledger dues.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* Step 1: Download Template */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium">
              Need the official CBSE student import template?
            </span>
            <a href="/api/imports/template" download>
              <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 bg-white text-blue-600 border-blue-200">
                <Download className="h-3 w-3" /> Download Template (.csv)
              </Button>
            </a>
          </div>

          {/* Step 2: Upload Area */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 hover:border-blue-400 transition-colors">
            <Upload className="h-8 w-8 text-blue-600 mx-auto" />
            <div className="text-xs font-semibold text-slate-800">
              Select or Drop CSV File
            </div>
            <p className="text-[11px] text-slate-400">Supported formats: UTF-8 Comma-Separated Values (.csv)</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer cursor-pointer text-slate-500"
            />
          </div>

          {/* Validation & Preview */}
          {errors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
              <div className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Validation Warnings ({errors.length} invalid rows)
              </div>
              <ul className="list-disc pl-5 text-[11px] text-rose-700 space-y-0.5">
                {errors.slice(0, 3).map((e, i) => (
                  <li key={i}>Row {e.row}: {e.errors.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">Parsed Preview ({parsedRows.length} valid rows):</span>
                <Badge variant="success">Validation Passed</Badge>
              </div>

              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0">
                    <tr>
                      <th className="p-2">Admission No</th>
                      <th className="p-2">Full Name</th>
                      <th className="p-2">DOB</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">Roll</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        <td className="p-2 font-mono font-medium text-blue-600">{r.admission_number}</td>
                        <td className="p-2 font-semibold text-slate-900">{r.full_name}</td>
                        <td className="p-2 text-slate-500">{r.dob}</td>
                        <td className="p-2 capitalize text-slate-600">{r.gender}</td>
                        <td className="p-2 font-mono">#{r.roll_number || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importSuccessCount !== null && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Successfully enrolled {importSuccessCount} students into the school database!
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={parsedRows.length === 0 || isImporting}
              onClick={handleCommit}
              className="text-xs bg-blue-600 hover:bg-blue-700 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isImporting ? 'Enrolling Students...' : `Commit Import (${parsedRows.length} Students)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
