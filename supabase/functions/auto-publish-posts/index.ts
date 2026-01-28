// Supabase Edge Function for auto-publishing scheduled blog posts
// Can be called by:
// 1. Vercel Cron (every 5-15 minutes)
// 2. GitHub Actions (scheduled workflow)
// 3. Manual trigger

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Verify request (optional: add secret token for security)
    const authHeader = req.headers.get('Authorization')
    const expectedSecret = Deno.env.get('CRON_SECRET')

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get current time
    const now = new Date().toISOString()

    // Find all posts scheduled for publication (scheduled_at <= now AND not published)
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, scheduled_at')
      .lte('scheduled_at', now)
      .eq('is_published', false)
      .not('scheduled_at', 'is', null)

    if (fetchError) {
      throw fetchError
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No posts to publish',
          published: 0
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Publish all scheduled posts
    const postIds = scheduledPosts.map(p => p.id)

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        is_published: true,
        published_at: now
      })
      .in('id', postIds)

    if (updateError) {
      throw updateError
    }

    console.log(`Published ${scheduledPosts.length} posts:`, scheduledPosts.map(p => p.title))

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${scheduledPosts.length} post(s)`,
        published: scheduledPosts.length,
        posts: scheduledPosts.map(p => ({
          id: p.id,
          title: p.title,
          scheduled_at: p.scheduled_at
        }))
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error auto-publishing posts:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
