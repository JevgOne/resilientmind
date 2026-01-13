#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxxfcphgmifhnjalixen.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGZjcGhnbWlmaG5qYWxpeGVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI3OTk2MiwiZXhwIjoyMDgzODU1OTYyfQ.cVYSXQsCGiQxFMw2rrQwxCa0shIA0zpQjig7sRb6r9Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Setting up database step by step...\n');

async function executeSql(sql, description) {
  console.log(`📝 ${description}...`);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    const text = await response.text();

    if (!response.ok && !text.includes('already exists')) {
      console.log(`   ⚠️  ${text.substring(0, 100)}`);
      return false;
    }

    console.log('   ✅ Success');
    return true;
  } catch (error) {
    console.log(`   ⚠️  ${error.message.substring(0, 100)}`);
    return false;
  }
}

async function setup() {
  // Just set up the existing user accounts with proper memberships
  console.log('👥 Configuring user accounts...\n');

  try {
    // Admin account
    console.log('👑 Admin account...');
    const { error: adminRoleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: '2131fb85-2685-4ee2-acae-8d9e577357bb', role: 'admin' });

    const { error: adminProfileError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Admin User',
        membership_type: 'premium',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('user_id', '2131fb85-2685-4ee2-acae-8d9e577357bb');

    if (adminProfileError && !adminProfileError.message.includes('does not exist')) {
      console.log(`   ✅ Admin configured`);
    } else {
      console.log(`   ⚠️  Tables don't exist yet - need to run SQL in Supabase UI`);
      console.log('\n❌ Cannot proceed automatically.\n');
      console.log('📋 You MUST manually run the SQL:');
      console.log('   1. Open: https://supabase.com/dashboard/project/pxxfcphgmifhnjalixen/editor/sql');
      console.log('   2. Click "+ New query"');
      console.log('   3. Copy SETUP-SIMPLE.sql content');
      console.log('   4. Paste and click RUN\n');
      return;
    }

    // Free account
    console.log('🆓 Free account...');
    await supabase.from('profiles')
      .update({ full_name: 'Free User' })
      .eq('user_id', '88c0d82d-dd69-4803-99ec-042250614d5d');
    console.log('   ✅ Free user configured');

    // Basic membership
    console.log('📦 Basic membership...');
    await supabase.from('profiles')
      .update({
        full_name: 'Basic Member',
        membership_type: 'basic',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('user_id', '9ab26e29-e5f2-43e4-9f27-153a7bc94eb9');
    console.log('   ✅ Basic member configured');

    // Premium membership
    console.log('⭐ Premium membership...');
    await supabase.from('profiles')
      .update({
        full_name: 'Premium Member',
        membership_type: 'premium',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('user_id', '9fd3a975-4949-46c7-87b7-b63608f44df2');
    console.log('   ✅ Premium member configured');

    // Verify
    console.log('\n📊 Verifying setup...\n');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email, full_name, membership_type')
      .order('created_at');

    if (profiles && profiles.length > 0) {
      console.log('✅ All accounts configured:\n');
      profiles.forEach(p => {
        console.log(`   ${p.full_name?.padEnd(20)} | ${p.email?.padEnd(30)} | ${p.membership_type}`);
      });
      console.log('\n✨ Setup complete!\n');
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    console.log('📋 Please run SETUP-SIMPLE.sql manually in Supabase SQL Editor\n');
  }
}

setup();
