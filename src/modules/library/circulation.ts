export interface BookLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  accessionNumber: string;
  borrowerId: string;
  borrowerName: string;
  borrowerType: 'student' | 'staff';
  borrowerCode: string; // Admission No or Employee Code
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  fineAmount: number;
  finePaid: boolean;
}

/**
 * Calculates overdue library fine according to standard institutional policy
 * @param dueDate Expected return date (YYYY-MM-DD)
 * @param returnDate Actual return date (defaults to current date)
 * @param dailyRate Fine in INR per day after grace period (default ₹5/day)
 * @param graceDays Number of grace days after due date before fine kicks in (default 1)
 */
export function calculateOverdueFine(
  dueDate: string,
  returnDate: string = new Date().toISOString().split('T')[0],
  dailyRate: number = 5,
  graceDays: number = 1
): {
  isOverdue: boolean;
  daysLate: number;
  chargeableDays: number;
  fineAmount: number;
} {
  const due = new Date(dueDate).getTime();
  const ret = new Date(returnDate).getTime();

  const diffMs = ret - due;
  const daysLate = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysLate <= 0) {
    return {
      isOverdue: false,
      daysLate: 0,
      chargeableDays: 0,
      fineAmount: 0,
    };
  }

  const chargeableDays = Math.max(0, daysLate - graceDays);
  const fineAmount = chargeableDays * dailyRate;

  return {
    isOverdue: true,
    daysLate,
    chargeableDays,
    fineAmount,
  };
}

/**
 * Validates whether a student or faculty member is eligible to borrow additional volumes
 * (Students max 3 books, Faculty max 6 books; no active un-paid fines > ₹50)
 */
export function validateBorrowerEligibility(
  borrowerType: 'student' | 'staff',
  currentActiveLoansCount: number,
  unpaidFinesTotal: number
): {
  isEligible: boolean;
  reason?: string;
} {
  const maxAllowed = borrowerType === 'staff' ? 6 : 3;

  if (currentActiveLoansCount >= maxAllowed) {
    return {
      isEligible: false,
      reason: `Borrowing limit reached (${currentActiveLoansCount}/${maxAllowed} volumes already checked out)`,
    };
  }

  if (unpaidFinesTotal > 50) {
    return {
      isEligible: false,
      reason: `Outstanding library fine penalty of ₹${unpaidFinesTotal} exceeds ₹50 borrowing threshold`,
    };
  }

  return {
    isEligible: true,
  };
}
