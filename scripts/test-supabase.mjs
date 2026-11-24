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

async function testAll() {
  console.log('--- Verifying Live Supabase Cloud Database ---');
  const { data: tenants, error: tErr } = await supabase.from('tenants').select('id, name, slug, affiliation');
  if (tErr) console.error('Tenant fetch error:', tErr);
  else console.log('Tenants:', tenants);

  const { data: campuses } = await supabase.from('campuses').select('name, code, is_main');
  console.log('Campuses:', campuses);

  const { data: classes } = await supabase.from('classes').select('name, display_order');
  console.log('Classes:', classes);

  const { data: feeCats } = await supabase.from('fee_categories').select('name, description');
  console.log('Fee Categories:', feeCats);
}

testAll();
