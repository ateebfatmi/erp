# API Specification & Route Handlers

## 1. Design Conventions
* **Internal APIs:** Implemented primarily using Next.js **Server Actions** (`'use server'`) for type-safe RPC with automatic CSRF protection, optimistic UI updates, and zero extra boilerplate.
* **External & Webhook Endpoints:** Implemented as Next.js Route Handlers in `src/app/api/...`.
* **Standard Response Envelope:**
```typescript
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};
```

## 2. Core Route Endpoints

### 2.1 Payments & Webhooks
* `POST /api/webhooks/razorpay`
  * Validates `x-razorpay-signature` against `RAZORPAY_WEBHOOK_SECRET`.
  * Processes `order.paid`, `payment.captured`, `payment.failed`, `refund.processed`.
  * Idempotency ledger check prevents duplicate ledger entries.

* `POST /api/payments/create-order`
  * Creates Razorpay Order for student fee dues or SaaS subscription renewal.
  * Inputs: `{ tenantId, enrollmentId, feeAllocationIds: string[], amount: number }`.
  * Returns: `{ orderId, amount, currency, keyId }`.

### 2.2 Admissions & Public Inquiries
* `POST /api/admissions/inquiry`
  * Publicly accessible endpoint for prospective parents.
  * Inputs: `{ tenantSlug, studentName, targetGrade, parentEmail, parentPhone }`.
  * Captures lead, triggers SMS/email acknowledgement, and notifies admission desk.

### 2.3 Data Migration & Ingestion
* `POST /api/imports/students`
  * Multi-part form-data CSV/XLSX file upload.
  * Runs dry-run validation, duplicate detection, and batch insertion inside transaction.

### 2.4 Document Generation & Streaming
* `GET /api/documents/fee-receipt/:transactionId`
  * Streams generated PDF receipt with school logo, QR code verification, and fee ledger breakdown.
* `GET /api/documents/report-card/:enrollmentId/:termId`
  * Generates CBSE/ICSE standard term progress report card.
* `GET /api/documents/transfer-certificate/:studentId`
  * Generates statutory School Leaving / Transfer Certificate with anti-fraud hash.

### 2.5 Health & Monitoring
* `GET /api/health`
  * Verifies database connectivity, memory usage, and uptime.
