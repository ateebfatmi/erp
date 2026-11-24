import { NextRequest, NextResponse } from 'next/server';
import { generateStudentIdCardPdf } from '@/modules/documents/pdf-generator';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const enrollments = await repository.getEnrollments(MOCK_TENANT.id);
  const enr = enrollments.find((e) => e.id === id || e.student_id === id) || enrollments[0];

  const pdfBytes = await generateStudentIdCardPdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city}`,
    affiliationNumber: MOCK_TENANT.affiliation_number || 'CBSE/AFF/2130894',
    academicSession: '2025-2026',
    studentName: enr?.student?.full_name || 'Aarav Mehta',
    admissionNumber: enr?.student?.admission_number || 'DPGA/2021/1042',
    className: enr?.class_name || 'Class 10',
    sectionName: enr?.section_name || 'A',
    rollNumber: enr?.roll_number || 1,
    dob: enr?.student?.dob || '2010-04-14',
    bloodGroup: enr?.student?.blood_group || 'B+',
    emergencyContact: '+91 98101 23456',
    guardianName: 'Rajesh Mehta',
    address: 'B-4/112 Vasant Kunj, New Delhi',
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="id_card_${enr?.student?.admission_number?.replace(/\//g, '_') || 'student'}.pdf"`,
    },
  });
}
