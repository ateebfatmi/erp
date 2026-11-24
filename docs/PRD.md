# Product Requirements Document (PRD): VidyaOS Enterprise School ERP SaaS

## 1. Executive Summary & Vision
VidyaOS is an enterprise-grade, multi-tenant School ERP SaaS platform engineered to digitize, unify, and elevate operational efficiency across educational institutions in India and emerging markets. Catering to CBSE, ICSE, State Boards, and International curriculums (IB/Cambridge), the platform encompasses multi-campus conglomerates, independent senior secondary schools, and early childhood networks.

## 2. Key Objectives & Target Market
* **Target Segments:**
  * K-12 Multi-Campus School Chains (Group/Trust management).
  * Private unaided CBSE and ICSE institutions (500–6,000+ students).
  * State Board institutions seeking statutory compliance and automation.
  * Standalone preschools and primary chains.
* **Core Commercial Value:**
  * Consolidated digital operating system replacing fragmented vendors (attendance apps, fee software, Excel ledgers, SMS portals).
  * 100% auditable double-entry accounting and tamper-proof fee collections.
  * Native Razorpay and UPI reconciliation with zero manual ledger matching.
  * Automated compliance (DPDP Act, CBSE Affiliation Bye-Laws, RTE compliance).

## 3. Product Portals & Stakeholders
1. **Platform Super Admin:** Global tenant provisioning, subscription billing, resource quotas, feature flags, health metrics, and audit logs.
2. **School Administrator Portal:** Comprehensive operations hub spanning student lifecycles, admissions, payroll, fees, timetable, library, inventory, and transport.
3. **Teacher Portal:** Class/subject gradebook, daily period attendance, assignments, syllabus progress, lesson plans, and guardian communication.
4. **Parent Portal:** Multi-child switcher, automated fee dues, instant UPI/card fee checkout, live bus tracking readiness, academic transcripts, and leave requests.
5. **Student Portal:** Timetable schedule, homework submission, study resources, report cards, and notices.

## 4. Comprehensive Feature Specifications
### 4.1 Academic & Operational Structure
* Dynamic multi-campus hierarchies under single trust/organization tenants.
* Academic session partitioning with historical rollover preservation.
* Granular period-by-period conflict-free timetable engine.
### 4.2 Financial Engineering & Fee Management
* Multi-tier fee heads (Tuition, Transport, Science Lab, Annual charges, Late fines).
* Configurable payment cycles (Monthly, Bi-monthly, Quarterly, Annual).
* Sibling discounts, scholarship concessions, and staff fee waivers.
* Double-entry ledger integration and immutable transaction records.
### 4.3 Student & Staff Information Management (SIS & HRIS)
* Complete lifecycle from online lead/inquiry to alumni transition.
* Indian regulatory compliance: Transfer Certificate (TC) generation, Bonafide certificates, U-DISE+ data exports.
* Staff payroll with statutory EPF, ESI, Professional Tax, and TDS calculations.
### 4.4 Communication & Multi-Channel Engagement
* Resend transactional emails, WhatsApp Cloud API notices, and SMS fallbacks.
* Role-scoped broadcast channels preventing spam and maintaining audit trails.

## 5. Non-Functional Requirements
* **Data Isolation:** Strict PostgreSQL Row Level Security (RLS) enforcing tenant & campus boundaries.
* **High Availability:** 99.95% uptime SLA backed by Supabase PostgreSQL and serverless Next.js edge-ready deployment.
* **Security & Compliance:** Digital Personal Data Protection (DPDP) Act compliance, parental consent audits, AES-256 encryption at rest, TLS 1.3 in transit.
