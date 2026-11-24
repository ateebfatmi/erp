import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">ERP System</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to access your organization dashboard</p>
      </div>
      <Suspense fallback={<div className="text-slate-400 text-sm animate-pulse">Loading sign in...</div>}>
        <SignIn />
      </Suspense>
    </main>
  );
}
