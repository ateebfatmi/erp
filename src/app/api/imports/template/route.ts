import { NextResponse } from 'next/server';
import { generateSampleStudentCsv } from '@/modules/imports/importer';

export async function GET() {
  const csv = generateSampleStudentCsv();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="students_import_template.csv"',
    },
  });
}
