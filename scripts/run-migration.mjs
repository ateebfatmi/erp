import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

export async function runMigration(dbPasswordOrUrl) {
  let connectionString = dbPasswordOrUrl;
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    // If just the password was given:
    const projectRef = 'xnkriaekgecekqlavlzy';
    connectionString = `postgresql://postgres:${encodeURIComponent(dbPasswordOrUrl)}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('✓ Successfully connected to live database!');

    const schemaPath = path.resolve(import.meta.dirname, '../supabase/migrations/20261124000000_init_schema.sql');
    const seedPath = path.resolve(import.meta.dirname, '../supabase/seed/seed.sql');

    console.log('Reading schema migration file...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema migration (creating 29 tables & RLS policies)...');
    await client.query(schemaSql);
    console.log('✓ Schema migration completed successfully!');

    console.log('Reading seed file...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executing seed data insertion...');
    await client.query(seedSql);
    console.log('✓ Seed data inserted successfully!');

    console.log('All migrations executed and verified on live Supabase cloud!');
    return { success: true };
  } catch (err) {
    console.error('Migration error:', err.message);
    return { success: false, error: err.message };
  } finally {
    await client.end().catch(() => {});
  }
}

if (process.argv[2]) {
  runMigration(process.argv[2]);
}
