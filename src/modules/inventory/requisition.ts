/**
 * VidyaOS - Institutional Inventory Stock Requisition & Indent Workflow Engine
 * Manages faculty supply requests, lab consumables, exam stationery, and central store issue vouchers.
 */

export type DepartmentType =
  | 'SCIENCE_LAB'
  | 'COMPUTER_LAB'
  | 'EXAM_CELL'
  | 'SPORTS_DEPT'
  | 'ART_CULTURE'
  | 'ADMIN_OFFICE'
  | 'INFIRMARY';

export type RequisitionPriority = 'ROUTINE' | 'HIGH_EXAM_PREP' | 'URGENT_EMERGENCY';

export type RequisitionStatus =
  | 'PENDING_APPROVAL'
  | 'SANCTIONED'
  | 'ISSUED_FROM_STORE'
  | 'REJECTED';

export interface StockCatalogItem {
  id: string;
  name: string;
  category: DepartmentType;
  unit: string;
  currentStock: number;
  minimumThreshold: number;
}

export interface IndentRequisition {
  id: string;
  requisitionNumber: string;
  department: DepartmentType;
  requesterName: string;
  requesterEmployeeCode: string;
  itemName: string;
  quantityRequested: number;
  unit: string;
  priority: RequisitionPriority;
  justificationPurpose: string;
  requestedAt: string;
  status: RequisitionStatus;
  storeVoucherNumber?: string;
  approverRemarks?: string;
  actionedAt?: string;
}

/**
 * Generates official institutional store requisition voucher code (e.g. IND-2024-0104).
 */
export function generateRequisitionNumber(seq: number, year: number = 2024): string {
  const padded = seq.toString().padStart(4, '0');
  return `IND-${year}-${padded}`;
}

/**
 * Creates and registers a new departmental material indent requisition.
 */
export function createRequisition(
  params: {
    department: DepartmentType;
    requesterName: string;
    requesterEmployeeCode: string;
    itemName: string;
    quantityRequested: number;
    unit: string;
    priority: RequisitionPriority;
    justificationPurpose: string;
    sequence?: number;
  }
): IndentRequisition {
  const seq = params.sequence || Math.floor(100 + Math.random() * 900);
  const requisitionNumber = generateRequisitionNumber(seq);

  return {
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    requisitionNumber,
    department: params.department,
    requesterName: params.requesterName,
    requesterEmployeeCode: params.requesterEmployeeCode,
    itemName: params.itemName,
    quantityRequested: params.quantityRequested,
    unit: params.unit,
    priority: params.priority,
    justificationPurpose: params.justificationPurpose,
    requestedAt: new Date().toISOString().split('T')[0],
    status: 'PENDING_APPROVAL',
  };
}

/**
 * Updates status of a requisition (SANCTIONED, ISSUED_FROM_STORE, or REJECTED) with store issue voucher.
 */
export function updateRequisitionStatus(
  records: IndentRequisition[],
  reqId: string,
  newStatus: RequisitionStatus,
  remarks?: string,
  voucherNo?: string
): { updatedRecords: IndentRequisition[]; updatedItem: IndentRequisition | null } {
  let updatedItem: IndentRequisition | null = null;
  const now = new Date().toISOString().split('T')[0];

  const updatedRecords = records.map((r) => {
    if (r.id === reqId) {
      updatedItem = {
        ...r,
        status: newStatus,
        approverRemarks: remarks || r.approverRemarks,
        storeVoucherNumber: voucherNo || (newStatus === 'ISSUED_FROM_STORE' ? `SIV-2024-${Math.floor(1000 + Math.random() * 9000)}` : r.storeVoucherNumber),
        actionedAt: now,
      };
      return updatedItem;
    }
    return r;
  });

  return { updatedRecords, updatedItem };
}

/**
 * Aggregates summary statistics across all pending and fulfilled material requisitions.
 */
export function calculateRequisitionStats(records: IndentRequisition[]): {
  total: number;
  pending: number;
  sanctioned: number;
  issued: number;
  rejected: number;
} {
  return {
    total: records.length,
    pending: records.filter((r) => r.status === 'PENDING_APPROVAL').length,
    sanctioned: records.filter((r) => r.status === 'SANCTIONED').length,
    issued: records.filter((r) => r.status === 'ISSUED_FROM_STORE').length,
    rejected: records.filter((r) => r.status === 'REJECTED').length,
  };
}

export const INITIAL_STOCK_ITEMS: StockCatalogItem[] = [
  {
    id: 'stk-01',
    name: 'A4 Copier Printing Paper (75 GSM)',
    category: 'EXAM_CELL',
    unit: 'Reams',
    currentStock: 140,
    minimumThreshold: 50,
  },
  {
    id: 'stk-02',
    name: 'Copper Sulphate Crystals (CuSO4.5H2O)',
    category: 'SCIENCE_LAB',
    unit: 'Bottles (500g)',
    currentStock: 18,
    minimumThreshold: 10,
  },
  {
    id: 'stk-03',
    name: 'Cat-6 Gigabit RJ45 Patch Cables (2m)',
    category: 'COMPUTER_LAB',
    unit: 'Units',
    currentStock: 45,
    minimumThreshold: 20,
  },
  {
    id: 'stk-04',
    name: 'Tournament Feather Shuttlecocks (Speed 77)',
    category: 'SPORTS_DEPT',
    unit: 'Boxes (12 pcs)',
    currentStock: 12,
    minimumThreshold: 15,
  },
  {
    id: 'stk-05',
    name: 'Cartridge Paper Sheets (A3 Size 200 GSM)',
    category: 'ART_CULTURE',
    unit: 'Packs (100 sheets)',
    currentStock: 8,
    minimumThreshold: 10,
  },
];

export const INITIAL_REQUISITIONS: IndentRequisition[] = [
  {
    id: 'req-001',
    requisitionNumber: 'IND-2024-0081',
    department: 'EXAM_CELL',
    requesterName: 'Dr. Meenakshi Sundaram',
    requesterEmployeeCode: 'DPGA/EMP/2019/012',
    itemName: 'A4 Copier Printing Paper (75 GSM)',
    quantityRequested: 35,
    unit: 'Reams',
    priority: 'HIGH_EXAM_PREP',
    justificationPurpose: 'Printing Question Papers & Answer Booklets for CBSE Mid-Term Exams',
    requestedAt: '2024-11-20',
    status: 'ISSUED_FROM_STORE',
    storeVoucherNumber: 'SIV-2024-1042',
    approverRemarks: 'Issued from central warehouse stack 4.',
    actionedAt: '2024-11-21',
  },
  {
    id: 'req-002',
    requisitionNumber: 'IND-2024-0082',
    department: 'SCIENCE_LAB',
    requesterName: 'Smt. Ananya Sen',
    requesterEmployeeCode: 'DPGA/EMP/2021/048',
    itemName: 'Copper Sulphate Crystals (CuSO4.5H2O)',
    quantityRequested: 6,
    unit: 'Bottles (500g)',
    priority: 'ROUTINE',
    justificationPurpose: 'Class 10 Practical Board Exam Chemistry qualitative analysis titration',
    requestedAt: '2024-11-22',
    status: 'SANCTIONED',
    approverRemarks: 'Sanctioned by Estate Manager. Ready for collection.',
    actionedAt: '2024-11-23',
  },
  {
    id: 'req-003',
    requisitionNumber: 'IND-2024-0083',
    department: 'SPORTS_DEPT',
    requesterName: 'Coach Ranveer Singh',
    requesterEmployeeCode: 'DPGA/EMP/2020/033',
    itemName: 'Tournament Feather Shuttlecocks (Speed 77)',
    quantityRequested: 8,
    unit: 'Boxes (12 pcs)',
    priority: 'HIGH_EXAM_PREP',
    justificationPurpose: 'Inter-House Zonal Badminton Championship Trials',
    requestedAt: '2024-11-24',
    status: 'PENDING_APPROVAL',
  },
];
