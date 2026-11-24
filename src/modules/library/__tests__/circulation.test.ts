import { describe, it, expect } from 'vitest';
import {
  calculateOverdueFine,
  validateBorrowerEligibility,
} from '../circulation';

describe('Library Circulation & Overdue Fine Engine', () => {
  it('charges zero fine when returned on or before due date', () => {
    const res = calculateOverdueFine('2026-11-20', '2026-11-18');
    expect(res.isOverdue).toBe(false);
    expect(res.daysLate).toBe(0);
    expect(res.fineAmount).toBe(0);
  });

  it('applies grace day and correctly accrues daily penalty beyond threshold', () => {
    // 5 days late with 1 grace day = 4 chargeable days @ ₹5/day = ₹20
    const res = calculateOverdueFine('2026-11-15', '2026-11-20', 5, 1);
    expect(res.isOverdue).toBe(true);
    expect(res.daysLate).toBe(5);
    expect(res.chargeableDays).toBe(4);
    expect(res.fineAmount).toBe(20);
  });

  it('enforces student and faculty book borrowing limits', () => {
    // Student at limit (3 books)
    const s1 = validateBorrowerEligibility('student', 3, 0);
    expect(s1.isEligible).toBe(false);
    expect(s1.reason).toContain('Borrowing limit reached');

    // Student with unpaid fine > ₹50
    const s2 = validateBorrowerEligibility('student', 1, 65);
    expect(s2.isEligible).toBe(false);
    expect(s2.reason).toContain('Outstanding library fine');

    // Faculty within limit (4 of 6)
    const f1 = validateBorrowerEligibility('staff', 4, 0);
    expect(f1.isEligible).toBe(true);
  });
});
