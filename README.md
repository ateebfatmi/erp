# Enterprise ERP System

A modern, high-performance Enterprise Resource Planning (ERP) platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and secured by **Clerk Authentication**.

---

## 🚀 Features

- **Enterprise Authentication**: User sign-in, sign-up, user profiles, and organization management powered by Clerk (`@clerk/nextjs`).
- **Operational Modules**:
  - 📦 **Inventory & Warehouse**: Multi-location SKU management, stock level alerts, and catalog audits.
  - 💳 **Financials & Ledgers**: Automated ledger tracking, invoicing, and tax calculation.
  - 👥 **Human Capital**: Staff onboarding, permissions, and payroll alignment.
  - 🚚 **Procurement & Supply Chain**: Purchase orders, vendor tracking, and logistics pipeline.
- **Dynamic Security & Proxy**: Modern Next.js 16 proxy request protection and route middleware.
- **Next.js 16 Cache Components**: Partial prerendering and instantaneous page streaming.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Authentication**: [Clerk](https://clerk.com/) (`@clerk/nextjs` v7)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ateebfatmi/erp.git
cd erp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Populate your Clerk API keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

Or sync directly via Clerk CLI:

```bash
npx clerk env pull
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx       # Root layout wrapped with <ClerkProvider>
│   │   └── page.tsx         # Dashboard (signed in) / Landing (signed out)
│   └── proxy.ts             # Clerk Next.js 16 proxy matcher & handler
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```
