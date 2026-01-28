-- ===============================================
-- Sample Videos for Demo
-- Free and Premium videos for each category
-- ===============================================

-- Get category IDs first (we'll use month_number to identify them)

-- MONTH 1: First Steps - 2 videos (1 free, 1 basic)
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
-- Free video
((SELECT id FROM video_categories WHERE month_number = 1),
 'Welcome: Your Journey Begins Here',
 'An introduction to your transformation journey. Learn what to expect in the first steps of building resilience abroad.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 8,
 true,
 'free',
 1),

-- Basic membership video
((SELECT id FROM video_categories WHERE month_number = 1),
 'Calming Your Nervous System in New Environments',
 'Practical breathing techniques and grounding exercises for managing stress when everything feels unfamiliar.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 15,
 false,
 'basic',
 2);

-- MONTH 2: Creating Your New Roots - 2 videos
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
-- Free video
((SELECT id FROM video_categories WHERE month_number = 2),
 'What is Your Inner Home?',
 'Understanding the concept of creating stability within yourself, regardless of where you live.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 10,
 true,
 'free',
 1),

-- Basic membership video
((SELECT id FROM video_categories WHERE month_number = 2),
 'Identity Transformation: The Hidden Gift of Expatriation',
 'Explore how living abroad reveals new dimensions of who you are and how to embrace this evolution.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 18,
 false,
 'basic',
 2);

-- MONTH 4: The Emotional Terrain - 2 videos
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
-- Free preview
((SELECT id FROM video_categories WHERE month_number = 4),
 'The Phases of Expat Loneliness (Preview)',
 'A preview of the emotional phases most expatriates experience and why loneliness is not a sign of failure.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 7,
 true,
 'free',
 1),

-- Premium video
((SELECT id FROM video_categories WHERE month_number = 4),
 'Transforming Isolation into Self-Discovery',
 'Advanced techniques for using alone time as a portal to deeper self-knowledge and personal power.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 22,
 false,
 'premium',
 2);

-- MONTH 7: Money Energy Mastery - 2 videos
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
-- Free sample
((SELECT id FROM video_categories WHERE month_number = 7),
 'Your Money Story: Free Exercise',
 'A gentle introduction to uncovering your inherited beliefs about money and how culture shapes them.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 9,
 true,
 'free',
 1),

-- Premium deep dive
((SELECT id FROM video_categories WHERE month_number = 7),
 'Money Mindset Transformation: The Complete Process',
 'Full workshop on identifying and rewriting limiting money beliefs specific to expat life.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 28,
 false,
 'premium',
 2);

-- MONTH 10: Heart Bridges - 2 videos
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
-- Free intro
((SELECT id FROM video_categories WHERE month_number = 10),
 'Staying Connected Across Distance (Introduction)',
 'Simple rituals for maintaining emotional closeness with loved ones far away.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 11,
 true,
 'free',
 1),

-- Premium content
((SELECT id FROM video_categories WHERE month_number = 10),
 'Creative Connection Rituals: Beyond Texts and Calls',
 'Advanced practices for sharing life and staying emotionally intimate despite physical distance.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 20,
 false,
 'premium',
 2);
