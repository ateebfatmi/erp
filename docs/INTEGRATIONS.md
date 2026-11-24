# Third-Party Integrations & Gateway Specifications

## 1. Authentication: Clerk
* Handles passwordless OTP, Google OAuth, Enterprise SSO, Session cookies, and user device management.
* Webhook sync (`user.created`, `user.updated`, `user.deleted`) keeps internal PostgreSQL `users` table synchronized.

## 2. Payment Gateway: Razorpay
* **Currency:** INR (`₹`) as primary, multi-currency support for international schools.
* **Payment Methods:** UPI (Google Pay, PhonePe, Paytm), NetBanking (all Indian scheduled banks), Debit/Credit Cards, Wallets, EMI.
* **Architecture:**
  1. Server creates order via Razorpay SDK with tenant-tagged metadata.
  2. Client launches Razorpay Standard Checkout modal.
  3. Server webhook (`/api/webhooks/razorpay`) validates cryptographic HMAC and commits transaction to PostgreSQL ledger.
  4. Realtime fee status update reflected on Parent and Accountant dashboards.

## 3. Communication Engines
* **Email:** Resend API for high-deliverability transactional emails (fee receipts, admission acknowledgements, password resets).
* **WhatsApp Cloud API:** Official WhatsApp Business Cloud API for high-priority broadcast messages (bus delay notices, emergency closures, fee due reminders).
* **SMS Gateway:** DLT-registered transactional SMS gateway (Fast2SMS / MSG91) for parent mobile alerts in remote or non-smartphone environments.

## 4. Background Workers & Orchestration: Inngest
* Event-driven serverless workflow orchestration:
  * Nightly automated fee fine calculation.
  * Daily period attendance SMS/WhatsApp dispatch to absent students' parents at 10:30 AM.
  * End-of-month payroll computation and salary slip PDF batch generation.
  * End-of-session academic rollover and student promotion pipeline.

## 5. Storage & CDN: Supabase Storage
* Encrypted buckets:
  * `student-documents` (private)
  * `staff-contracts` (private)
  * `school-assets` (public: logos, banners)
  * `generated-certificates` (private signed URLs)
