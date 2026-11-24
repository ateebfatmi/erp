import { NextRequest, NextResponse } from 'next/server';
import { generateAdmissionOfferLetterPdf } from '@/modules/documents/pdf-generator';
import { MOCK_TENANT } from '@/lib/database/mock-data';

const APPLICANTS: Record<string, any> = {
  'lead-01': {
    name: 'Vihaan Malhotra',
    targetClass: 'Class 9',
    parentName: 'Mr. Sanjay Malhotra',
    parentAddress: 'C-2/45 Safdarjung Enclave, New Delhi - 110029',
    totalFee: 54500,
  },
  'lead-02': {
    name: 'Saanvi Sharma',
    targetClass: 'Class 11 (Science Stream)',
    parentName: 'Dr. Neeraj Sharma',
    parentAddress: 'Flat 402, Green Glen Apartments, Rohini Sector 13, Delhi',
    totalFee: 58500,
  },
  'lead-03': {
    name: 'Kabir Sengupta',
    targetClass: 'Class 6',
    parentName: 'Mrs. Ananya Sengupta',
    parentAddress: 'B-14/8 Vasant Vihar, New Delhi - 110057',
    totalFee: 49500,
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = APPLICANTS[id] || APPLICANTS['lead-01'];

  const pdfBytes = await generateAdmissionOfferLetterPdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city}`,
    affiliationNumber: MOCK_TENANT.affiliation_number || '2130894',
    letterNumber: `DPGA/ADM-OFFER/2026/${id.toUpperCase()}`,
    issueDate: new Date().toLocaleDateString('en-IN'),
    parentName: lead.parentName,
    parentAddress: lead.parentAddress,
    studentName: lead.name,
    targetClass: lead.targetClass,
    academicSession: '2026–2027',
    admissionFee: 25000,
    cautionMoney: 10000,
    tuitionQuarterFee: lead.totalFee - 35000,
    totalPayable: lead.totalFee,
    paymentDeadline: '15 December 2026',
    orientationDate: '28 March 2027 (09:00 AM)',
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="admission_offer_${lead.name.replace(/\s+/g, '_')}.pdf"`,
    },
  });
}
