import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  try {
    const envPath = path.resolve(import.meta.dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^['"]|['"]$/g, '');
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') url = val;
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceKey = val;
      }
    }
  } catch {}
}

if (!url || !serviceKey) {
  console.error('Missing Supabase configuration in environment or .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const TENANT_ID = '22222222-2222-2222-2222-222222222222';
const CAMPUS_ID = '33333333-3333-3333-3333-333333333331';
const SESSION_ID = '44444444-4444-4444-4444-444444444444';
const CLASS_ID = '66666666-6666-6666-6666-666666666602';
const SECTION_ID = '77777777-7777-7777-7777-777777777701';

async function testLiveCrud() {
  console.log('--- 1. Testing Live Student Admission Insertion ---');
  const studentId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const enrollmentId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  // Insert Student
  const { data: student, error: sErr } = await supabase.from('students').upsert({
    id: studentId,
    tenant_id: TENANT_ID,
    admission_number: 'DPGA/2026/LIVE01',
    full_name: 'Aarav Mehta (Cloud Verified)',
    dob: '2010-08-14',
    gender: 'male',
    blood_group: 'B+',
    status: 'active',
  }).select();

  if (sErr) console.error('Student upsert error:', sErr);
  else console.log('✓ Student inserted in cloud Supabase:', student[0]?.full_name);

  // Insert Enrollment
  const { data: enrollment, error: eErr } = await supabase.from('student_enrollments').upsert({
    id: enrollmentId,
    tenant_id: TENANT_ID,
    campus_id: CAMPUS_ID,
    student_id: studentId,
    academic_session_id: SESSION_ID,
    class_id: CLASS_ID,
    section_id: SECTION_ID,
    roll_number: 1,
    status: 'active',
  }).select();

  if (eErr) console.error('Enrollment upsert error:', eErr);
  else console.log('✓ Enrollment inserted in cloud Supabase with Roll #1');

  // Insert Fee Allocation
  const allocId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  const { data: alloc, error: aErr } = await supabase.from('student_fee_allocations').upsert({
    id: allocId,
    tenant_id: TENANT_ID,
    enrollment_id: enrollmentId,
    structure_id: '99999999-9999-9999-9999-999999999901',
    title: 'Quarter 4 Tuition Fee (Jan - Mar 2027)',
    due_date: '2027-01-15',
    due_amount: 19500,
    discount_amount: 0,
    paid_amount: 0,
    status: 'unpaid',
  }).select();

  if (aErr) console.error('Fee allocation error:', aErr);
  else console.log('✓ Fee Allocation of ₹19,500 created in cloud Supabase');

  console.log('--- 2. Testing Live Attendance Marking ---');
  const { data: att, error: attErr } = await supabase.from('student_attendance').upsert({
    tenant_id: TENANT_ID,
    enrollment_id: enrollmentId,
    attendance_date: '2026-11-24',
    status: 'present',
    remarks: 'Punctual arrival via Route 12',
  }).select();

  if (attErr) console.error('Attendance error:', attErr);
  else console.log('✓ Attendance successfully recorded in cloud Supabase');

  console.log('--- 3. Testing Live Fee Collection & Transaction Ledger ---');
  const txId = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
  const { data: tx, error: txErr } = await supabase.from('fee_transactions').upsert({
    id: txId,
    tenant_id: TENANT_ID,
    receipt_number: 'REC-2026-LIVE001',
    enrollment_id: enrollmentId,
    total_amount: 19500,
    payment_method: 'upi',
    reference_number: 'UPI/LIVE/29481920',
    status: 'successful',
  }).select();

  if (txErr) console.error('Transaction error:', txErr);
  else console.log('✓ Fee transaction receipt REC-2026-LIVE001 committed to cloud Supabase!');
}

testLiveCrud();
