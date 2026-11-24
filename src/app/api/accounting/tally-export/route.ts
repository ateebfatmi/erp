import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TENANT } from '@/lib/database/mock-data';
import {
  createJournalVoucher,
  exportToTallyXml,
} from '@/modules/accounting/double-entry';

export async function GET(req: NextRequest) {
  // Sample operational school vouchers
  const v1 = createJournalVoucher(
    'RCPT/2026/10492',
    '20261124',
    'receipt',
    'Quarter 4 Tuition & Lab fee collected from Aarav Mehta (Class 10A) via Razorpay UPI',
    [
      { accountCode: '1001', debit: 19500, credit: 0 }, // Bank
      { accountCode: '3001', debit: 0, credit: 15000 }, // Tuition
      { accountCode: '3002', debit: 0, credit: 4500 }, // Lab Fee
    ]
  );

  const v2 = createJournalVoucher(
    'PYMT/2026/0891',
    '20261124',
    'payment',
    'November 2026 Faculty payroll disbursed via HDFC Corporate ACH transfer',
    [
      { accountCode: '4001', debit: 143450, credit: 0 }, // Gross Salary
      { accountCode: '1001', debit: 0, credit: 117175 }, // Net Bank Transfer
      { accountCode: '2002', debit: 0, credit: 11930 }, // EPF & PT
      { accountCode: '2003', debit: 0, credit: 14345 }, // TDS
    ]
  );

  const xml = exportToTallyXml(MOCK_TENANT.name, [v1, v2]);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="tally_school_vouchers.xml"',
    },
  });
}
