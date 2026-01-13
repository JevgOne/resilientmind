#!/usr/bin/env node

/**
 * Automatic database setup script
 * This will execute the SQL directly via Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import postgres from 'postgres';

const supabaseUrl = 'https://pxxfcphgmifhnjalixen.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGZjcGhnbWlmaG5qYWxpeGVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI3OTk2MiwiZXhwIjoyMDgzODU1OTYyfQ.cVYSXQsCGiQxFMw2rrQwxCa0shIA0zpQjig7sRb6r9Q';

// Connection string for direct Postgres connection
const connectionString = `postgresql://postgres.pxxfcphgmifhnjalixen:${process.env.DB_PASSWORD || 'your-db-password'}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

console.log('🚀 Starting automatic database setup...\n');

async function tryDirectConnection() {
  console.log('📡 Attempting direct PostgreSQL connection...\n');

  try {
    const sql = postgres(connectionString, {
      max: 1,
      ssl: 'require'
    });

    const sqlFile = readFileSync('./SETUP-CORRECT.sql', 'utf-8');

    console.log('✅ Connected to database');
    console.log('📝 Executing SQL setup...\n');

    await sql.unsafe(sqlFile);

    console.log('✅ SQL executed successfully!\n');

    // Verify
    const profiles = await sql`
      SELECT email, full_name, membership_type
      FROM public.profiles
      ORDER BY created_at
    `;

    console.log('✅ Database setup verified!\n');
    console.log('👥 User profiles:');
    profiles.forEach(p => {
      console.log(`   ${p.full_name?.padEnd(20)} | ${p.email?.padEnd(30)} | ${p.membership_type}`);
    });

    await sql.end();
    console.log('\n✨ Setup complete!\n');
    return true;

  } catch (error) {
    console.log(`⚠️  Direct connection failed: ${error.message}\n`);
    return false;
  }
}

async function trySupabaseAPI() {
  console.log('📡 Attempting via Supabase Management API...\n');

  try {
    const sqlFile = readFileSync('./SETUP-CORRECT.sql', 'utf-8');

    const response = await fetch(
      `https://api.supabase.com/v1/projects/pxxfcphgmifhnjalixen/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: sqlFile
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('✅ SQL executed successfully!\n');
    return true;

  } catch (error) {
    console.log(`⚠️  Management API failed: ${error.message}\n`);
    return false;
  }
}

async function tryRestAPI() {
  console.log('📡 Attempting via REST API...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Try to at least set up the user profiles
    console.log('👑 Setting up admin account...');

    await supabase.from('user_roles').upsert(
      { user_id: '2131fb85-2685-4ee2-acae-8d9e577357bb', role: 'admin' },
      { onConflict: 'user_id,role' }
    );

    await supabase.from('profiles').update({
      full_name: 'Admin User',
      membership_type: 'premium',
      membership_started_at: new Date().toISOString(),
      membership_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('user_id', '2131fb85-2685-4ee2-acae-8d9e577357bb');

    console.log('   ✅ Admin account configured\n');

    const { data: profiles } = await supabase
      .from('profiles')
      .select('email, full_name, membership_type')
      .order('created_at');

    if (profiles && profiles.length > 0) {
      console.log('✅ Profiles verified:\n');
      profiles.forEach(p => {
        console.log(`   ${p.full_name?.padEnd(20)} | ${p.email?.padEnd(30)} | ${p.membership_type}`);
      });
      console.log('\n✨ Partial setup complete!\n');
      return true;
    }

    return false;

  } catch (error) {
    console.log(`⚠️  REST API setup failed: ${error.message}\n`);
    return false;
  }
}

async function main() {
  // Try direct connection first (most reliable for DDL)
  if (await tryDirectConnection()) {
    return;
  }

  // Try Management API
  if (await trySupabaseAPI()) {
    return;
  }

  // Fallback to REST API (can only update existing data)
  if (await tryRestAPI()) {
    console.log('⚠️  Tables might not exist yet. Please run SETUP-CORRECT.sql manually in SQL Editor.\n');
    return;
  }

  console.log('❌ All automatic methods failed.\n');
  console.log('📋 Manual setup required:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/pxxfcphgmifhnjalixen/editor/sql');
  console.log('   2. Create new query');
  console.log('   3. Run this command in terminal: cat SETUP-CORRECT.sql | pbcopy');
  console.log('   4. Paste into SQL Editor (Cmd+V)');
  console.log('   5. Click RUN\n');
}

main().catch(console.error);
