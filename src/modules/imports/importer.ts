import Papa from 'papaparse';
import { repository } from '@/lib/database/repository';

export interface StudentImportRow {
  full_name: string;
  admission_number: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  class_name: string;
  section_name: string;
  roll_number?: string | number;
  guardian_name?: string;
  guardian_phone?: string;
}

export interface ImportValidationResult {
  validRows: StudentImportRow[];
  invalidRows: Array<{
    row: number;
    data: any;
    errors: string[];
  }>;
  totalParsed: number;
}

/**
 * Validates parsed CSV rows against required schema and duplicate rules
 */
export function validateStudentRows(rows: any[]): ImportValidationResult {
  const validRows: StudentImportRow[] = [];
  const invalidRows: ImportValidationResult['invalidRows'] = [];
  const seenAdmissionNumbers = new Set<string>();

  rows.forEach((r, idx) => {
    const rowNum = idx + 2; // considering header as row 1
    const errors: string[] = [];

    const fullName = r.full_name || r['Full Name'] || r.fullName || '';
    const admNo = r.admission_number || r['Admission Number'] || r.admissionNumber || '';
    const dob = r.dob || r['Date of Birth'] || r['DOB'] || '2012-01-01';
    let gender = (r.gender || r['Gender'] || 'male').toLowerCase();
    if (!['male', 'female', 'other'].includes(gender)) gender = 'other';

    const className = r.class_name || r['Class'] || r.class || 'Class 10';
    const sectionName = r.section_name || r['Section'] || r.section || 'A';
    const rollNo = r.roll_number || r['Roll Number'] || r.rollNo || '';

    if (!fullName.trim()) errors.push('Full name is required');
    if (!admNo.trim()) errors.push('Admission number is required');
    if (seenAdmissionNumbers.has(admNo)) errors.push(`Duplicate admission number "${admNo}" in sheet`);
    seenAdmissionNumbers.add(admNo);

    if (errors.length > 0) {
      invalidRows.push({ row: rowNum, data: r, errors });
    } else {
      validRows.push({
        full_name: fullName.trim(),
        admission_number: admNo.trim(),
        dob: dob.trim(),
        gender: gender as any,
        class_name: className.trim(),
        section_name: sectionName.trim(),
        roll_number: rollNo,
      });
    }
  });

  return {
    validRows,
    invalidRows,
    totalParsed: rows.length,
  };
}

/**
 * Parses raw CSV string
 */
export function parseStudentCsv(csvContent: string): ImportValidationResult {
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  return validateStudentRows(parsed.data);
}

/**
 * Generates sample CSV template for school administrators
 */
export function generateSampleStudentCsv(): string {
  const sampleData = [
    {
      'Full Name': 'Vihaan Malhotra',
      'Admission Number': 'DPGA/2026/2001',
      'Date of Birth': '2011-04-15',
      'Gender': 'male',
      'Class': 'Class 10',
      'Section': 'A',
      'Roll Number': '15',
    },
    {
      'Full Name': 'Saanvi Sharma',
      'Admission Number': 'DPGA/2026/2002',
      'Date of Birth': '2011-09-22',
      'Gender': 'female',
      'Class': 'Class 10',
      'Section': 'A',
      'Roll Number': '16',
    },
    {
      'Full Name': 'Kabir Sengupta',
      'Admission Number': 'DPGA/2026/2003',
      'Date of Birth': '2011-12-05',
      'Gender': 'male',
      'Class': 'Class 10',
      'Section': 'B',
      'Roll Number': '17',
    },
  ];

  return Papa.unparse(sampleData);
}
