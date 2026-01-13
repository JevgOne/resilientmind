#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxxfcphgmifhnjalixen.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGZjcGhnbWlmaG5qYWxpeGVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI3OTk2MiwiZXhwIjoyMDgzODU1OTYyfQ.cVYSXQsCGiQxFMw2rrQwxCa0shIA0zpQjig7sRb6r9Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Checking database...\n');

async function check() {
  // Check profiles table
  console.log('📋 Checking profiles table...');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (profilesError) {
    console.log(`   ❌ Error: ${profilesError.message}\n`);
  } else {
    console.log(`   ✅ Profiles table exists! Found ${profiles.length} rows\n`);
    if (profiles.length > 0) {
      profiles.forEach(p => console.log(`      ${p.email} - ${p.full_name}`));
      console.log('');
    }
  }

  // Check video_categories table
  console.log('📹 Checking video_categories table...');
  const { data: categories, error: categoriesError } = await supabase
    .from('video_categories')
    .select('*');

  if (categoriesError) {
    console.log(`   ❌ Error: ${categoriesError.message}\n`);
  } else {
    console.log(`   ✅ Video categories table exists! Found ${categories.length} rows\n`);
  }

  // Check auth users
  console.log('👤 Checking auth.users...');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.log(`   ❌ Error: ${usersError.message}\n`);
  } else {
    console.log(`   ✅ Found ${users.length} users in auth:\n`);
    users.forEach(u => console.log(`      ${u.email}`));
    console.log('');
  }

  // If profiles are empty but users exist, create them
  if (profiles && profiles.length === 0 && users && users.length > 0) {
    console.log('⚙️  Creating missing profiles...\n');

    for (const user of users) {
      console.log(`   Creating profile for ${user.email}...`);
      const { error } = await supabase.from('profiles').insert({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User'
      });

      if (error && !error.message.includes('duplicate')) {
        console.log(`      ⚠️  ${error.message}`);
      } else {
        console.log(`      ✅ Created`);
      }
    }

    console.log('\n✅ Profiles created! Now configuring memberships...\n');

    // Configure accounts
    const USER_IDS = {
      admin: '2131fb85-2685-4ee2-acae-8d9e577357bb',
      free: '88c0d82d-dd69-4803-99ec-042250614d5d',
      basic: '9ab26e29-e5f2-43e4-9f27-153a7bc94eb9',
      premium: '9fd3a975-4949-46c7-87b7-b63608f44df2'
    };

    // Admin
    await supabase.from('user_roles').upsert({ user_id: USER_IDS.admin, role: 'admin' });
    await supabase.from('profiles').update({
      full_name: 'Admin User',
      membership_type: 'premium',
      membership_started_at: new Date().toISOString(),
      membership_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('user_id', USER_IDS.admin);
    console.log('   ✅ Admin configured');

    // Free
    await supabase.from('profiles').update({ full_name: 'Free User' }).eq('user_id', USER_IDS.free);
    console.log('   ✅ Free user configured');

    // Basic
    await supabase.from('profiles').update({
      full_name: 'Basic Member',
      membership_type: 'basic',
      membership_started_at: new Date().toISOString(),
      membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('user_id', USER_IDS.basic);
    console.log('   ✅ Basic member configured');

    // Premium
    await supabase.from('profiles').update({
      full_name: 'Premium Member',
      membership_type: 'premium',
      membership_started_at: new Date().toISOString(),
      membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('user_id', USER_IDS.premium);
    console.log('   ✅ Premium member configured');

    console.log('\n✅ All accounts configured!\n');
  }

  // Final check
  console.log('📊 Final verification...\n');
  const { data: finalProfiles } = await supabase
    .from('profiles')
    .select('email, full_name, membership_type, membership_expires_at')
    .order('created_at');

  if (finalProfiles && finalProfiles.length > 0) {
    console.log('✅ All accounts:\n');
    finalProfiles.forEach(p => {
      const expires = p.membership_expires_at
        ? new Date(p.membership_expires_at).toLocaleDateString()
        : 'N/A';
      console.log(`   ${p.full_name?.padEnd(20)} | ${p.email?.padEnd(30)} | ${p.membership_type?.padEnd(10)} | ${expires}`);
    });
    console.log('\n✨ Database setup complete!\n');
  }
}

check().catch(console.error);
