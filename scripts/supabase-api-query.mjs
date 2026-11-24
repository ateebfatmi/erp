import fs from 'fs';
import path from 'path';

const projectRef = 'xnkriaekgecekqlavlzy';

export async function runQueryWithToken(patToken) {
  const token = patToken.trim();
  const schemaPath = path.resolve(import.meta.dirname, '../supabase/migrations/20261124000000_init_schema.sql');
  const seedPath = path.resolve(import.meta.dirname, '../supabase/seed/seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  console.log(`Executing schema migration via Supabase Management API on project ${projectRef}...`);

  const res1 = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: schemaSql }),
  });

  if (!res1.ok) {
    const errText = await res1.text();
    console.error('Schema migration failed:', res1.status, errText);
    return { success: false, error: errText };
  }

  console.log('✓ Schema migration executed successfully!');

  console.log('Executing seed data insertion...');
  const res2 = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: seedSql }),
  });

  if (!res2.ok) {
    const errText = await res2.text();
    console.error('Seed insertion failed:', res2.status, errText);
    return { success: false, error: errText };
  }

  console.log('✓ Seed data executed successfully!');
  console.log('All 29 tables, RLS policies, and school seed data are now live in Supabase cloud!');
  return { success: true };
}

if (process.argv[2]) {
  runQueryWithToken(process.argv[2]);
}
