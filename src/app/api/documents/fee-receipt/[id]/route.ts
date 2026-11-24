import { NextRequest, NextResponse } from 'next/server';
import { generateFeeReceiptPdf } from '@/modules/documents/pdf-generator';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const transactions = await repository.getFeeTransactions(MOCK_TENANT.id);
  const tx = transactions.find((t) => t.id === id || t.receipt_number === id) || transactions[0];

  const pdfBytes = await generateFeeReceiptPdf({
    schoolName: MOCK_TENANT.name,
    schoolAddress: `${MOCK_TENANT.address}, ${MOCK_TENANT.city}`,
    affiliationNumber: MOCK_TENANT.affiliation_number || 'CBSE/AFF/2130894',
    receiptNumber: tx?.receipt_number || 'REC-2026-10492',
    date: new Date().toLocaleDateString('en-IN'),
    studentName: tx?.student_name || 'Aarav Mehta',
    admissionNumber: tx?.admission_number || 'DPGA/2021/1042',
    className: 'Class 10',
    sectionName: 'A',
    rollNumber: 1,
    paymentMethod: tx?.payment_method || 'UPI',
    referenceNumber: tx?.reference_number || tx?.razorpay_payment_id || 'UPI/LIVE/29481920',
    items: [
      { title: 'Academic Tuition Fee', amount: tx?.total_amount ? tx.total_amount * 0.75 : 14625 },
      { title: 'Science Lab & Smart Class Facility Charge', amount: tx?.total_amount ? tx.total_amount * 0.25 : 4875 },
    ],
    totalAmount: tx?.total_amount || 19500,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="receipt_${tx?.receipt_number || '10492'}.pdf"`,
    },
  });
}
