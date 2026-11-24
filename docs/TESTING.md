# Testing Strategy & Automated Test Suite

## 1. Testing Pyramid Overview
* **Unit Tests (Vitest):** Core pure functions, financial calculations, grade algorithms, permission checks, and tenant resolvers.
* **Integration Tests:** Database transactions, mock webhook signature verifications, and batch ingestion.
* **Security & Multi-Tenant Isolation Tests:** Verifying that cross-tenant unauthorized data access attempts are blocked.
* **End-to-End Tests:** Complete flows: School registration -> Campus setup -> Student Admission -> Attendance -> Fee Payment -> Report Card.

## 2. Running Automated Tests
```bash
# Run unit & integration test suite
npm run test

# Run tests in watch mode
npx vitest

# Run with test coverage
npx vitest run --coverage
```

## 3. Critical Test Assertions
1. **Multi-Tenant Leak Prevention:**
   * An authenticated user from `tenant_a` requesting `/api/students/:id` where student belongs to `tenant_b` MUST return a `403` or empty set.
2. **Fee Calculation Accuracy:**
   * Base fee + Late fines - Scholarships must balance down to the paisa (0.01 INR).
3. **Attendance Uniqueness:**
   * Duplicate attendance records for the same student on the same date must fail with composite unique constraint violation.
4. **Webhook Security:**
   * Razorpay webhook with invalid signature must immediately abort with `400 Bad Request`.
