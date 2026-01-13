/**
 * Direct database setup using service role key
 * Run: node setup-database.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://pxxfcphgmifhnjalixen.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGZjcGhnbWlmaG5qYWxpeGVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI3OTk2MiwiZXhwIjoyMDgzODU1OTYyfQ.cVYSXQsCGiQxFMw2rrQwxCa0shIA0zpQjig7sRb6r9Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// User IDs from created accounts
const USER_IDS = {
  admin: '2131fb85-2685-4ee2-acae-8d9e577357bb',
  free: '88c0d82d-dd69-4803-99ec-042250614d5d',
  basic: '9ab26e29-e5f2-43e4-9f27-153a7bc94eb9',
  premium: '9fd3a975-4949-46c7-87b7-b63608f44df2'
};

async function executeSQL(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up Resilient Mind database...\n');

  try {
    // Read the SQL file
    console.log('📖 Reading COMPLETE-SETUP.sql...');
    const sql = readFileSync('./COMPLETE-SETUP.sql', 'utf-8');

    // Try to execute via REST API
    console.log('⚡ Executing SQL setup...');

    try {
      await executeSQL(sql);
      console.log('✅ SQL executed successfully!\n');
    } catch (apiError) {
      console.log('⚠️  REST API method failed, trying alternative approach...\n');

      // Alternative: Execute statements individually using Supabase client
      console.log('📝 Creating tables individually...\n');

      // Split SQL into statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`Found ${statements.length} SQL statements to execute\n`);

      // This won't work for DDL, but let's try for DML
      let successCount = 0;
      let skipCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (stmt.toUpperCase().includes('CREATE') ||
            stmt.toUpperCase().includes('ALTER') ||
            stmt.toUpperCase().includes('DROP')) {
          skipCount++;
          continue;
        }

        try {
          // Only try to execute INSERT/UPDATE statements
          if (stmt.toUpperCase().includes('INSERT') ||
              stmt.toUpperCase().includes('UPDATE')) {
            await executeSQL(stmt + ';');
            successCount++;
            console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1}/${statements.length} failed: ${err.message}`);
        }
      }

      console.log(`\n📊 Results: ${successCount} succeeded, ${skipCount} skipped (DDL)\n`);

      if (skipCount > 0) {
        console.log('⚠️  DDL statements (CREATE TABLE, ALTER, etc) cannot be executed via REST API');
        console.log('📋 Please run COMPLETE-SETUP.sql manually in Supabase SQL Editor:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/pxxfcphgmifhnjalixen/editor/sql');
        console.log('   2. Create a new query');
        console.log('   3. Copy the ENTIRE content of COMPLETE-SETUP.sql');
        console.log('   4. Paste and click RUN\n');
        return false;
      }
    }

    // If tables exist, setup profiles
    console.log('👥 Setting up user profiles...\n');

    // Admin
    console.log('👑 Admin account...');
    try {
      await supabase.from('user_roles').upsert(
        { user_id: USER_IDS.admin, role: 'admin' },
        { onConflict: 'user_id,role' }
      );

      await supabase.from('profiles').update({
        full_name: 'Admin User',
        membership_type: 'premium',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()
      }).eq('user_id', USER_IDS.admin);

      console.log('   ✅ Admin setup complete');
    } catch (err) {
      console.log(`   ⚠️  ${err.message}`);
    }

    // Free
    console.log('🆓 Free account...');
    try {
      await supabase.from('profiles').update({
        full_name: 'Free User'
      }).eq('user_id', USER_IDS.free);
      console.log('   ✅ Free account setup complete');
    } catch (err) {
      console.log(`   ⚠️  ${err.message}`);
    }

    // Basic
    console.log('📦 Basic membership...');
    try {
      await supabase.from('profiles').update({
        full_name: 'Basic Member',
        membership_type: 'basic',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }).eq('user_id', USER_IDS.basic);
      console.log('   ✅ Basic membership setup complete');
    } catch (err) {
      console.log(`   ⚠️  ${err.message}`);
    }

    // Premium
    console.log('⭐ Premium membership...');
    try {
      await supabase.from('profiles').update({
        full_name: 'Premium Member',
        membership_type: 'premium',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }).eq('user_id', USER_IDS.premium);
      console.log('   ✅ Premium membership setup complete');
    } catch (err) {
      console.log(`   ⚠️  ${err.message}`);
    }

    // Verify
    console.log('\n📊 Verifying setup...\n');
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('email, full_name, membership_type')
      .order('created_at');

    if (error) {
      console.log(`⚠️  Tables may not exist yet: ${error.message}\n`);
      console.log('📋 Next step: Run COMPLETE-SETUP.sql in Supabase SQL Editor\n');
      return false;
    }

    if (profiles && profiles.length > 0) {
      console.log('✅ Database setup verified!\n');
      profiles.forEach(p => {
        console.log(`   ${p.full_name?.padEnd(20)} | ${p.email?.padEnd(30)} | ${p.membership_type}`);
      });
      console.log('\n✨ Setup complete!\n');
      return true;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Manual setup required:');
    console.log('   Go to: https://supabase.com/dashboard/project/pxxfcphgmifhnjalixen/editor/sql');
    console.log('   Run the COMPLETE-SETUP.sql file\n');
    return false;
  }
}

setupDatabase().catch(console.error);
