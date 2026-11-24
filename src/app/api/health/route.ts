import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    platform: 'VidyaOS Enterprise ERP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
    services: {
      auth: 'clerk',
      database: 'supabase-postgresql',
      storage: 'supabase-storage',
      payments: 'razorpay-active',
    },
  });
}
