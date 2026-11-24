import { NextRequest, NextResponse } from 'next/server';
import { generateMeritCertificatePdf } from '@/modules/documents/pdf-generator';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const enrollments = await repository.getEnrollments(MOCK_TENANT.id);
  const enr = enrollments.find((e) => e.id === id || e.student_id === id) || enrollments[0];

  const pdfBytes = await generateMeritCertificatePdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city}`,
    affiliationNumber: MOCK_TENANT.affiliation_number || 'CBSE/AFF/2130894',
    certificateNumber: `DPGA/MERIT/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toLocaleDateString('en-IN'),
    studentName: enr?.student?.full_name || 'Aarav Mehta',
    admissionNumber: enr?.student?.admission_number || 'DPGA/2021/1042',
    className: enr?.class_name || 'Class 10',
    sectionName: enr?.section_name || 'A',
    title: 'Certificate of Merit & Academic Excellence',
    awardReason: 'For Securing 1st Rank with 98.4% Aggregate in CBSE Mid-Term Examination',
    achievementCategory: 'Senior Secondary Academic Distinction',
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="certificate_${enr?.student?.admission_number?.replace(/\//g, '_') || 'merit'}.pdf"`,
    },
  });
}
