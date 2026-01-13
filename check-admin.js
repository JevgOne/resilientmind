#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxxfcphgmifhnjalixen.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGZjcGhnbWlmaG5qYWxpeGVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI3OTk2MiwiZXhwIjoyMDgzODU1OTYyfQ.cVYSXQsCGiQxFMw2rrQwxCa0shIA0zpQjig7sRb6r9Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_USER_ID = '2131fb85-2685-4ee2-acae-8d9e577357bb';

console.log('🔍 Checking admin role...\n');

async function checkAdmin() {
  // Check if admin role exists
  const { data: roles, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', ADMIN_USER_ID);

  if (error) {
    console.log(`❌ Error checking roles: ${error.message}\n`);
    return;
  }

  console.log(`📋 Current roles for admin@resilientmind.com:`);
  if (roles && roles.length > 0) {
    roles.forEach(r => console.log(`   ✅ ${r.role}`));
    console.log('\n✅ Admin has admin role!\n');
  } else {
    console.log('   ⚠️  No admin role found!\n');
    console.log('🔧 Adding admin role...\n');

    const { error: insertError } = await supabase
      .from('user_roles')
      .upsert({ user_id: ADMIN_USER_ID, role: 'admin' });

    if (insertError) {
      console.log(`❌ Error adding admin role: ${insertError.message}\n`);
    } else {
      console.log('✅ Admin role added successfully!\n');
    }
  }

  // Check all users and their roles
  console.log('👥 All users and their roles:\n');
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      email,
      full_name,
      membership_type,
      user_roles (role)
    `)
    .order('created_at');

  if (profiles) {
    profiles.forEach(p => {
      const roles = p.user_roles?.map(r => r.role).join(', ') || 'none';
      console.log(`   ${p.full_name?.padEnd(20)} | ${p.email?.padEnd(30)} | Membership: ${p.membership_type?.padEnd(10)} | Roles: ${roles}`);
    });
  }

  console.log('\n✨ Admin setup complete!\n');
}

checkAdmin().catch(console.error);
