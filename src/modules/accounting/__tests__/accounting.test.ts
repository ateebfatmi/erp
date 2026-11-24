import { describe, it, expect } from 'vitest';
import {
  createJournalVoucher,
  calculateTrialBalance,
  exportToTallyXml,
} from '../double-entry';

describe('Double-Entry School Accounting & Daybook Engine', () => {
  it('strictly validates mathematical balance (Total Debits === Total Credits)', () => {
    // Valid balanced receipt voucher
    const v1 = createJournalVoucher(
      'VCH-001',
      '2026-11-24',
      'receipt',
      'Fee Collection',
      [
        { accountCode: '1001', debit: 19500, credit: 0 },
        { accountCode: '3001', debit: 0, credit: 15000 },
        { accountCode: '3002', debit: 0, credit: 4500 },
      ]
    );

    expect(v1.totalDebit).toBe(19500);
    expect(v1.totalCredit).toBe(19500);
    expect(v1.isBalanced).toBe(true);

    // Unbalanced voucher should be flagged
    const vBad = createJournalVoucher(
      'VCH-ERR',
      '2026-11-24',
      'payment',
      'Erroneous Entry',
      [
        { accountCode: '1001', debit: 1000, credit: 0 },
        { accountCode: '4001', debit: 0, credit: 800 },
      ]
    );

    expect(vBad.totalDebit).toBe(1000);
    expect(vBad.totalCredit).toBe(800);
    expect(vBad.isBalanced).toBe(false);
  });

  it('computes Trial Balance and verifies zero net variance across ledger', () => {
    const v1 = createJournalVoucher('V1', '2026-11-24', 'receipt', 'Fee', [
      { accountCode: '1001', debit: 20000, credit: 0 },
      { accountCode: '3001', debit: 0, credit: 20000 },
    ]);

    const v2 = createJournalVoucher('V2', '2026-11-24', 'payment', 'Salary', [
      { accountCode: '4001', debit: 15000, credit: 0 },
      { accountCode: '1001', debit: 0, credit: 15000 },
    ]);

    const tb = calculateTrialBalance([v1, v2]);

    expect(tb.totalDebit).toBe(35000);
    expect(tb.totalCredit).toBe(35000);
    expect(tb.isBalanced).toBe(true);
  });

  it('exports vouchers into valid Tally Prime XML structure', () => {
    const v = createJournalVoucher('V1', '20261124', 'receipt', 'Fee', [
      { accountCode: '1001', debit: 10000, credit: 0 },
      { accountCode: '3001', debit: 0, credit: 10000 },
    ]);

    const xml = exportToTallyXml('Delhi Public Global Academy', [v]);

    expect(xml).toContain('<ENVELOPE>');
    expect(xml).toContain('<TALLYREQUEST>Import Data</TALLYREQUEST>');
    expect(xml).toContain('<SVCURRENTCOMPANY>Delhi Public Global Academy</SVCURRENTCOMPANY>');
    expect(xml).toContain('<VOUCHER VCHTYPE="RECEIPT"');
    expect(xml).toContain('<VOUCHERNUMBER>V1</VOUCHERNUMBER>');
    expect(xml).toContain('</ENVELOPE>');
  });
});
