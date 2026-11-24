# Security, Data Privacy & Compliance Specification

## 1. Regulatory Compliance (India DPDP Act & Global Standards)
* **Digital Personal Data Protection (DPDP) Act 2023 Compliance:**
  * Explicit parental/guardian consent is captured during online admission and profile creation.
  * No behavioral tracking or targeted advertising is allowed on any student portal.
  * Parental right to review, update, and request data erasure for their children upon graduation or withdrawal.
  * Strict confidentiality controls on student medical history (accessible only by authorized infirmary staff/principals).
* **CBSE Affiliation Bye-Laws & Right to Education (RTE):**
  * Automated RTE quota reporting (25% reserved category tracking without stigmatizing UI flags).
  * Standardized Transfer Certificate (TC) tamper-evident serial numbers.

## 2. Authentication & Identity
* Clerk handles passkeys, multi-factor authentication (MFA), password rotation, and brute-force protection.
* All Server Actions and API Route Handlers verify active session validity on every invocation.
* Expired sessions or invalidated Clerk accounts terminate database access immediately.

## 3. Storage & Document Security
* Student documents (Birth Certificates, Immunization records, Aadhaar cards, Income certificates) are stored in **private Supabase Storage buckets**.
* Direct public URL access is completely disabled.
* Document downloads require time-limited (max 15 minutes) cryptographic signed URLs issued only after permission evaluation.

## 4. Payment Security & Financial Immutability
* Razorpay webhook signatures are cryptographically verified using HMAC SHA256 before processing.
* Webhook events are processed idempotently based on `event_id` and `order_id` to eliminate double-crediting.
* Client-side callbacks never alter payment status; transactions remain pending until confirmed via verified server webhook or direct Razorpay server-to-server inquiry.
* Double-entry ledger logs are immutable: transactions cannot be deleted or updated in place. Adjustments require explicit contra entries.

## 5. Defense-in-Depth Checklist
- [x] Input sanitization and validation with Zod on all API and Server Action boundaries.
- [x] Prepared SQL parameterization eliminating SQL injection risks.
- [x] Content Security Policy (CSP) headers restricting script execution.
- [x] Rate limiting on sensitive endpoints (OTP, login, admission submission).
- [x] Audit log trails recording timestamp, user, IP, tenant, module, and state diff for all critical mutations.
