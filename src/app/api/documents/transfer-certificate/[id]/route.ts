import { NextRequest, NextResponse } from 'next/server';
import { generateTransferCertificatePdf } from '@/modules/documents/pdf-generator';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const enrollments = await repository.getEnrollments(MOCK_TENANT.id);
  const enr = enrollments.find((e) => e.id === id || e.student_id === id) || enrollments[0];

  const pdfBytes = await generateTransferCertificatePdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city} - 110070`,
    affiliationNumber: MOCK_TENANT.affiliation_number || '2130894',
    schoolCode: '20194',
    tcNumber: `TC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toLocaleDateString('en-IN'),
    studentName: enr?.student?.full_name || 'Aarav Mehta',
    fatherName: 'Mr. Rajesh Mehta',
    motherName: 'Mrs. Sunita Mehta',
    nationality: 'Indian',
    admissionNumber: enr?.student?.admission_number || 'DPGA/2021/1042',
    dateOfBirth: enr?.student?.dob || '14-04-2010',
    dateOfAdmission: '05-04-2021 in Class 5',
    lastClassStudied: `${enr?.class_name || 'Class 10'} (Tenth)`,
    schoolBoardExamLastTaken: 'CBSE Secondary School Examination (Passed)',
    whetherFailed: 'No',
    subjectsStudied: 'English, Mathematics, Science, Social Science, Hindi',
    qualifiedForPromotion: 'Yes, promoted to Class 11 (Senior Secondary)',
    monthUpToWhichDuesPaid: 'March 2026 (All Clear)',
    totalWorkingDays: 218,
    daysPresent: 204,
    generalConduct: 'Exemplary / Very Good',
    reasonForLeaving: 'Parent Relocation / Transfer',
    anyOtherRemarks: 'Diligent student with active participation in Science Olympiad',
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="tc_${enr?.student?.admission_number?.replace(/\//g, '_') || 'student'}.pdf"`,
    },
  });
}
