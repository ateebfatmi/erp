export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export interface AccountHead {
  code: string;
  name: string;
  type: AccountType;
  normalBalance: 'debit' | 'credit';
}

export interface JournalLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  narration?: string;
}

export interface JournalVoucher {
  voucherNumber: string;
  date: string;
  voucherType: 'receipt' | 'payment' | 'journal';
  narration: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  type: AccountType;
  debitTotal: number;
  creditTotal: number;
  netBalance: number;
}

export const CHART_OF_ACCOUNTS: AccountHead[] = [
  { code: '1001', name: 'HDFC Bank Operations A/C', type: 'asset', normalBalance: 'debit' },
  { code: '1002', name: 'School Cash Counter / Petty Cash', type: 'asset', normalBalance: 'debit' },
  { code: '1003', name: 'Student Fee Receivables', type: 'asset', normalBalance: 'debit' },
  { code: '2001', name: 'Refundable Caution Money Payable', type: 'liability', normalBalance: 'credit' },
  { code: '2002', name: 'EPF & ESI Statutory Dues Payable', type: 'liability', normalBalance: 'credit' },
  { code: '2003', name: 'TDS Income Tax Withholding Payable', type: 'liability', normalBalance: 'credit' },
  { code: '3001', name: 'Tuition Fee Revenue', type: 'income', normalBalance: 'credit' },
  { code: '3002', name: 'Laboratory & Smart ICT Fee Revenue', type: 'income', normalBalance: 'credit' },
  { code: '3003', name: 'School Transport Bus Fee Revenue', type: 'income', normalBalance: 'credit' },
  { code: '4001', name: 'Faculty & Administrative Salaries Expense', type: 'expense', normalBalance: 'debit' },
  { code: '4002', name: 'Fleet Diesel & Bus Maintenance Expense', type: 'expense', normalBalance: 'debit' },
  { code: '4003', name: 'Electricity, Water & Utilities Expense', type: 'expense', normalBalance: 'debit' },
];

/**
 * Creates a verified double-entry journal voucher, strictly asserting Debit === Credit
 */
export function createJournalVoucher(
  voucherNumber: string,
  date: string,
  voucherType: 'receipt' | 'payment' | 'journal',
  narration: string,
  lines: Array<{ accountCode: string; debit: number; credit: number; narration?: string }>
): JournalVoucher {
  let totalDebit = 0;
  let totalCredit = 0;

  const resolvedLines: JournalLine[] = lines.map((l) => {
    const head = CHART_OF_ACCOUNTS.find((a) => a.code === l.accountCode);
    const debit = Math.round(l.debit || 0);
    const credit = Math.round(l.credit || 0);
    totalDebit += debit;
    totalCredit += credit;

    return {
      accountCode: l.accountCode,
      accountName: head?.name || 'General Ledger Account',
      debit,
      credit,
      narration: l.narration,
    };
  });

  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  return {
    voucherNumber,
    date,
    voucherType,
    narration,
    lines: resolvedLines,
    totalDebit,
    totalCredit,
    isBalanced,
  };
}

/**
 * Computes a live Trial Balance summary across vouchers
 */
export function calculateTrialBalance(vouchers: JournalVoucher[]): {
  items: TrialBalanceItem[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
} {
  const map: Record<string, { debit: number; credit: number }> = {};

  for (const v of vouchers) {
    for (const line of v.lines) {
      if (!map[line.accountCode]) map[line.accountCode] = { debit: 0, credit: 0 };
      map[line.accountCode].debit += line.debit;
      map[line.accountCode].credit += line.credit;
    }
  }

  let totalDebit = 0;
  let totalCredit = 0;

  const items: TrialBalanceItem[] = CHART_OF_ACCOUNTS.map((acc) => {
    const deb = map[acc.code]?.debit || 0;
    const cred = map[acc.code]?.credit || 0;
    totalDebit += deb;
    totalCredit += cred;

    const net = acc.normalBalance === 'debit' ? deb - cred : cred - deb;

    return {
      accountCode: acc.code,
      accountName: acc.name,
      type: acc.type,
      debitTotal: deb,
      creditTotal: cred,
      netBalance: net,
    };
  });

  return {
    items,
    totalDebit,
    totalCredit,
    isBalanced: totalDebit === totalCredit,
  };
}

/**
 * Exports Journal Vouchers into standard Tally XML format (compatible with Tally Prime / ERP 9)
 */
export function exportToTallyXml(schoolName: string, vouchers: JournalVoucher[]): string {
  const xmlVouchers = vouchers
    .map(
      (v) => `
    <TALLYMESSAGE xmlns:UDF="TallyUDF">
      <VOUCHER VCHTYPE="${v.voucherType.toUpperCase()}" ACTION="Create">
        <DATE>${v.date.replace(/-/g, '')}</DATE>
        <VOUCHERTYPENAME>${v.voucherType.toUpperCase()}</VOUCHERTYPENAME>
        <VOUCHERNUMBER>${v.voucherNumber}</VOUCHERNUMBER>
        <NARRATION>${v.narration}</NARRATION>
        ${v.lines
          .map(
            (l) => `
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${l.accountName}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${l.debit > 0 ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>
          <AMOUNT>${l.debit > 0 ? -l.debit : l.credit}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`
          )
          .join('')}
      </VOUCHER>
    </TALLYMESSAGE>`
    )
    .join('');

  return `<?xml version="1.0" encoding="utf-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${schoolName}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>${xmlVouchers}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
}
