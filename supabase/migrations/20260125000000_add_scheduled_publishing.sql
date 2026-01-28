-- Add scheduled_at field to blog_posts table for scheduled publishing
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Add index for efficient querying of scheduled posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at
ON blog_posts(scheduled_at)
WHERE scheduled_at IS NOT NULL AND is_published = false;

-- Create function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET
    is_published = true,
    published_at = NOW()
  WHERE
    scheduled_at IS NOT NULL
    AND scheduled_at <= NOW()
    AND is_published = false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION auto_publish_scheduled_posts() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_publish_scheduled_posts() TO service_role;

COMMENT ON COLUMN blog_posts.scheduled_at IS 'Scheduled publication date/time. Post will auto-publish at this time if is_published=false.';
COMMENT ON FUNCTION auto_publish_scheduled_posts IS 'Function to automatically publish posts that have reached their scheduled_at time.';
