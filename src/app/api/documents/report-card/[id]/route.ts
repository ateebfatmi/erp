import { NextRequest, NextResponse } from 'next/server';
import { generateReportCardPdf } from '@/modules/documents/pdf-generator';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const enrollments = await repository.getEnrollments(MOCK_TENANT.id);
  const student = enrollments.find((e) => e.id === id || e.student_id === id) || enrollments[0];

  const pdfBytes = await generateReportCardPdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city}`,
    affiliation: 'CBSE (Board Affiliation 2130894)',
    termName: 'Mid-Term Summative Assessment',
    sessionName: 'AY 2025-2026',
    studentName: student?.student?.full_name || 'Aarav Mehta',
    admissionNumber: student?.student?.admission_number || 'DPGA/2021/1042',
    className: student?.class_name || 'Class 10',
    sectionName: student?.section_name || 'A',
    rollNumber: student?.roll_number || 1,
    marks: [
      { subject: 'Mathematics Standard (041)', maxMarks: 80, obtainedMarks: 74, grade: 'A1' },
      { subject: 'Science & Technology (086)', maxMarks: 80, obtainedMarks: 71, grade: 'A2' },
      { subject: 'English Communicative (101)', maxMarks: 80, obtainedMarks: 76, grade: 'A1' },
      { subject: 'Social Science (087)', maxMarks: 80, obtainedMarks: 69, grade: 'B1' },
      { subject: 'Hindi Course-A (002)', maxMarks: 80, obtainedMarks: 75, grade: 'A1' },
      { subject: 'Information Technology (402)', maxMarks: 50, obtainedMarks: 47, grade: 'A1' },
    ],
    overallPercentage: 92.5,
    overallGrade: 'A1 (Outstanding Performance)',
    attendancePercentage: 96.2,
    teacherRemarks: 'Exhibits exemplary mathematical aptitude, active classroom leadership, and consistent diligence.',
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="report_card_${student?.student?.admission_number || '1042'}.pdf"`,
    },
  });
}
