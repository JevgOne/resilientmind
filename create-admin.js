/**
 * Create Admin User Script
 *
 * Usage:
 * 1. Set your email below
 * 2. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
 * 3. Run: node create-admin.js
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  console.log('🔧 Resilient Journeys - Create Admin User\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.SUPABASE_URL || await question('Supabase URL: ');
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || await question('Supabase Service Role Key: ');

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('\n📧 Enter admin email (will create new user if doesn\'t exist):');
  const email = await question('Email: ');
  const password = await question('Password (min 6 chars): ');
  const fullName = await question('Full Name: ');

  try {
    console.log('\n🔍 Checking if user exists...');

    // Try to find existing user
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('email', email)
      .maybeSingle();

    let userId;

    if (existingUsers) {
      console.log('✅ User found:', existingUsers.email);
      userId = existingUsers.user_id;
    } else {
      console.log('👤 Creating new user...');

      // Create new user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName
        }
      });

      if (authError) throw authError;

      userId = authData.user.id;
      console.log('✅ User created:', authData.user.email);
    }

    // Add admin role
    console.log('\n👑 Adding admin role...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

    if (roleError) throw roleError;
    console.log('✅ Admin role added');

    // Update profile with premium membership
    console.log('\n💎 Setting Premium membership...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        membership_type: 'premium',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString() // 10 years
      })
      .eq('user_id', userId);

    if (profileError) throw profileError;
    console.log('✅ Premium membership set (10 years)');

    // Verify admin access
    console.log('\n🔐 Verifying admin access...');
    const { data: hasAdminRole } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' });

    if (hasAdminRole) {
      console.log('\n✅ SUCCESS! Admin user created:');
      console.log('   Email:', email);
      console.log('   User ID:', userId);
      console.log('   Role: Admin');
      console.log('   Membership: Premium (10 years)');
      console.log('\n🚀 You can now log in and access /admin');
    } else {
      console.log('⚠️  Warning: Admin role verification failed');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }

  rl.close();
  process.exit(0);
}

createAdmin();
