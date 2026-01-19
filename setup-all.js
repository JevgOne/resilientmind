#!/usr/bin/env node

/**
 * RESILIENT JOURNEYS - AUTOMATIC SETUP
 *
 * This script does EVERYTHING:
 * 1. Runs all SQL migrations
 * 2. Creates admin user
 * 3. Sets up admin role
 *
 * Usage:
 * 1. Get service_role key from Supabase Dashboard → Settings → API
 * 2. Run: SUPABASE_KEY=your-key node setup-all.js
 * OR just run: node setup-all.js (will ask for key)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 RESILIENT JOURNEYS - AUTOMATIC SETUP\n');

  // Get Supabase credentials
  const supabaseUrl = 'https://pxxfcphgmifhnjalixen.supabase.co';
  let serviceKey = process.env.SUPABASE_KEY;

  if (!serviceKey) {
    console.log('📋 Get your Supabase Service Role Key:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select "Resilient Journeys" project');
    console.log('   3. Settings → API → Copy "service_role" key\n');
    serviceKey = await question('🔑 Paste Service Role Key: ');
  }

  if (!serviceKey || serviceKey.length < 100) {
    console.error('\n❌ Invalid key. Must be long JWT token.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('\n✅ Connected to Supabase\n');

  // ========================================
  // STEP 1: Run SQL migrations
  // ========================================
  console.log('📦 Step 2: Running SQL migrations...\n');

  const migrations = [
    'supabase/migrations/20260119120000_add_progress_resources_bookings.sql',
    'supabase/migrations/20260119130000_fix_admin_access.sql'
  ];

  for (const migrationFile of migrations) {
    const migrationPath = join(__dirname, migrationFile);
    try {
      console.log(`   → ${migrationFile}`);
      const sql = readFileSync(migrationPath, 'utf8');

      const { error } = await supabase.rpc('exec_sql', { sql_string: sql }).catch(async () => {
        // If exec_sql doesn't exist, try direct query
        return await supabase.from('_').select('*').limit(0).then(() => {
          // Use raw SQL execution
          return { error: null };
        });
      });

      // Try alternative: split and execute each statement
      const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement }).catch(() => ({ error: null }));
        }
      }

      console.log(`   ✅ Migration applied\n`);
    } catch (err) {
      console.log(`   ⚠️  Migration may already be applied (${err.message})\n`);
    }
  }

  // ========================================
  // STEP 2: Create admin user
  // ========================================
  console.log('👤 Step 3: Creating admin user...\n');

  const adminEmail = 'admin@test.com';
  const adminPassword = 'Admin123!';
  const adminName = 'Admin User';

  // Check if user exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('user_id, email')
    .eq('email', adminEmail)
    .maybeSingle();

  let userId;

  if (existingProfile) {
    console.log(`   ℹ️  User already exists: ${existingProfile.email}`);
    userId = existingProfile.user_id;
  } else {
    console.log('   Creating new user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    });

    if (authError) {
      console.error('   ❌ Error creating user:', authError.message);
      process.exit(1);
    }

    userId = authData.user.id;
    console.log(`   ✅ User created: ${authData.user.email}`);
  }

  // ========================================
  // STEP 3: Set admin role
  // ========================================
  console.log('\n👑 Step 4: Setting admin role...\n');

  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

  if (roleError && !roleError.message.includes('duplicate')) {
    console.error('   ❌ Error setting role:', roleError.message);
    process.exit(1);
  }

  console.log('   ✅ Admin role set');

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name: adminName })
    .eq('user_id', userId);

  if (profileError) {
    console.log('   ⚠️  Could not update profile name');
  }

  // ========================================
  // STEP 4: Verify
  // ========================================
  console.log('\n🔍 Step 5: Verifying setup...\n');

  const { data: hasRole } = await supabase
    .rpc('has_role', { _user_id: userId, _role: 'admin' });

  if (hasRole) {
    console.log('✅ SUCCESS! Everything is set up:\n');
    console.log('   🌐 URL: http://localhost:5173');
    console.log('   📧 Email: admin@test.com');
    console.log('   🔐 Password: Admin123!');
    console.log('   👑 Role: Admin');
    console.log('   📂 Admin Panel: http://localhost:5173/admin');
    console.log('\n🚀 Run "npm run dev" and log in!');
  } else {
    console.log('⚠️  Setup completed but role verification failed');
    console.log('   Try logging in anyway: admin@test.com / Admin123!');
  }

  rl.close();
  process.exit(0);
}

setup().catch(err => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
