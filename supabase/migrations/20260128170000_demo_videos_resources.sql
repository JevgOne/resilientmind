-- ===============================================
-- COMPLETE DEMO CONTENT - All 12 Months
-- 48 Videos + Resources
-- Mix of FREE, BASIC, and PREMIUM content
-- ===============================================

-- ===== PROGRAM 1: ADAPTATION IN A FOREIGN COUNTRY =====

-- MONTH 1: First Steps: Finding Solid Ground
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 1),
 'Welcome: Your Journey Begins Here',
 'An introduction to your transformation journey. Learn what to expect in the first steps of building resilience abroad.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 8, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 1),
 'Calming Your Nervous System in New Environments',
 'Practical breathing techniques and grounding exercises for managing stress when everything feels unfamiliar.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 15, false, 'basic', 2),

((SELECT id FROM video_categories WHERE month_number = 1),
 'Daily Safety Rituals: Building Certainty in Uncertainty',
 'Create simple daily rituals that provide structure and comfort even when your external world is chaotic.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 12, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 1),
 'Language Anxiety: Overcoming Fear of Communication',
 'Practical strategies for building confidence when speaking a foreign language, even if you feel like a beginner.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 18, false, 'premium', 4);

-- MONTH 2: Creating Your New Roots
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 2),
 'What is Your Inner Home?',
 'Understanding the concept of creating stability within yourself, regardless of where you live.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 10, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 2),
 'Identity Transformation: The Hidden Gift of Expatriation',
 'Explore how living abroad reveals new dimensions of who you are and how to embrace this evolution.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 18, false, 'basic', 2),

((SELECT id FROM video_categories WHERE month_number = 2),
 'Silk Painting Meditation: Creating Your Inner Sanctuary',
 'Guided art expressive therapy session using silk painting to visualize and anchor your inner home.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 25, false, 'premium', 3),

((SELECT id FROM video_categories WHERE month_number = 2),
 'Energetic Anchoring: Grounding in Your New Place',
 'Rituals for energetically connecting with your new environment without losing your essence.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 14, false, 'basic', 4);

-- MONTH 3: The Integration Path
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 3),
 'Balancing Two Worlds (Preview)',
 'Introduction to preserving your cultural identity while opening to new ways of being.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 9, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 3),
 'Working Below Your Qualification: The Hidden Growth',
 'Transform career setbacks abroad into powerful opportunities for personal development.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 16, false, 'basic', 2),

((SELECT id FROM video_categories WHERE month_number = 3),
 'Advanced Gratitude Practices for Difficult Times',
 'Deep gratitude work that turns challenges into catalysts for resilience and self-knowledge.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 20, false, 'premium', 3),

((SELECT id FROM video_categories WHERE month_number = 3),
 'Cultural Integration: When to Adapt, When to Stand Firm',
 'Navigate the delicate balance between integration and maintaining your authentic values.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 17, false, 'basic', 4);

-- ===== PROGRAM 2: NAVIGATING INNER LANDSCAPES =====

-- MONTH 4: The Emotional Terrain of Expatriation
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 4),
 'The Phases of Expat Loneliness (Preview)',
 'A preview of the emotional phases most expatriates experience and why loneliness is not a sign of failure.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 7, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 4),
 'Transforming Isolation into Self-Discovery',
 'Advanced techniques for using alone time as a portal to deeper self-knowledge and personal power.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 22, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 4),
 'Creative Expression for Complex Emotions',
 'Art therapy methods for processing emotions that are too complex for words.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 19, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 4),
 'Building Your Internal Sanctuary',
 'Meditation and visualization practices for creating inner stability when external support is limited.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 15, false, 'basic', 4);

-- MONTH 5: Reclaiming Your Authentic Self
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 5),
 'Identity Beyond Cultural Labels (Introduction)',
 'How living between cultures reveals dimensions of yourself you never knew existed.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 11, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 5),
 'The Byron Katie Method for Expat Limiting Beliefs',
 'Transformational inquiry work specifically designed for common expat thought patterns.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 28, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 5),
 'Energy Work: Strengthening Inner Certainty',
 'Techniques for building unshakeable self-trust in environments where you feel "different".',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 16, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 5),
 'Integration Rituals: Your New Cohesive Self',
 'Rituals for integrating newly discovered parts of yourself into a complete self-image.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 14, false, 'basic', 4);

-- MONTH 6: Soul Alignment
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 6),
 'Finding Meaning in Your Expat Journey',
 'Discover the hidden purpose behind why you chose to live abroad.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 10, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 6),
 'Intuitive Practices: Revealing Your Purpose',
 'Guided intuitive exercises for uncovering the deeper meaning of your cross-cultural experience.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 21, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 6),
 'Daily Challenges as Growth Catalysts',
 'Transform everyday frustrations into powerful opportunities for personal evolution.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 13, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 6),
 'Creating Your Vision: Integrating Both Worlds',
 'Visioning work for a future that honors the best of your home and new country.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 18, false, 'basic', 4);

-- ===== PROGRAM 3: FINANCIAL FREEDOM ABROAD =====

-- MONTH 7: Money Energy Mastery
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 7),
 'Your Money Story: Free Exercise',
 'A gentle introduction to uncovering your inherited beliefs about money and how culture shapes them.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 9, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 7),
 'Money Mindset Transformation: The Complete Process',
 'Full workshop on identifying and rewriting limiting money beliefs specific to expat life.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 28, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 7),
 'Cultural Money Values: Navigating Different Systems',
 'Understanding how different cultures view money and how to navigate these differences.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 15, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 7),
 'Releasing Financial Blocks Through Energy Work',
 'Energy practices for releasing money blocks that emerge specifically during expatriation.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 17, false, 'basic', 4);

-- MONTH 8: Trust & Abundance
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 8),
 'Building Financial Confidence Anywhere',
 'Introduction to developing trust in your ability to create prosperity in any environment.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 8, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 8),
 'Inner Certainty Independent of Circumstances',
 'Deep work on building financial security from within, regardless of external conditions.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 24, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 8),
 'Creating Financial Reserves with Limited Income',
 'Practical strategies for building savings even when earning less than in your home country.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 16, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 8),
 'Trust & Safety: Energetic Vibration Work',
 'Rituals for strengthening the energetic vibration of trust and financial safety.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 14, false, 'basic', 4);

-- MONTH 9: Prosperity Consciousness
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 9),
 'Abundance Mindset for Expats (Preview)',
 'Introduction to shifting from scarcity to abundance thinking while living abroad.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 10, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 9),
 'Personal Manifestation Process for Opportunities',
 'Create your unique manifestation system for attracting financial opportunities abroad.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 26, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 9),
 'Recognizing Hidden Financial Opportunities',
 'Techniques for spotting and utilizing unexpected opportunities unique to your expat position.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 13, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 9),
 'Daily Prosperity Consciousness Practices',
 'Morning and evening rituals for maintaining abundance mindset in a foreign country.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 12, false, 'basic', 4);

-- ===== PROGRAM 4: LIFE BEYOND FAMILY BORDERS =====

-- MONTH 10: Heart Bridges
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 10),
 'Staying Connected Across Distance (Introduction)',
 'Simple rituals for maintaining emotional closeness with loved ones far away.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 11, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 10),
 'Creative Connection Rituals: Beyond Texts and Calls',
 'Advanced practices for sharing life and staying emotionally intimate despite physical distance.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 20, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 10),
 'Releasing Guilt: You Did Not Abandon Anyone',
 'Deep healing work for the hidden guilt of leaving family and friends behind.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 18, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 10),
 'Energy Practices for Long-Distance Love',
 'Energy work that creates tangible bonds of love and support across continents.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 15, false, 'basic', 4);

-- MONTH 11: Soul Family
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 11),
 'Building Community in a Foreign Land',
 'Strategies for finding authentic connections when you are new to a country.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 9, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 11),
 'Recognizing Your Kindred Spirits Abroad',
 'How to identify potential soul family members in your new environment.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 22, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 11),
 'The Courage to Be Vulnerable in New Relationships',
 'Overcoming fear and opening your heart to forming deep friendships abroad.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 16, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 11),
 'Creating Community Around Shared Values',
 'Building a tribe based on values rather than geography or shared history.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 14, false, 'basic', 4);

-- MONTH 12: The Integrated Self
INSERT INTO videos (category_id, title, description, video_url, duration_minutes, is_free, min_membership, sort_order)
VALUES
((SELECT id FROM video_categories WHERE month_number = 12),
 'Your Transformation Journey: A Celebration',
 'Reflection on how far you have come and the resilience you have built.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 12, true, 'free', 1),

((SELECT id FROM video_categories WHERE month_number = 12),
 'Integration Ritual: Honoring Both Worlds',
 'Personalized rituals for connecting your roots with your new life in a meaningful way.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 25, false, 'premium', 2),

((SELECT id FROM video_categories WHERE month_number = 12),
 'Your Global Perspective: A Rare Gift',
 'Celebrating your unique ability to see life through multiple cultural lenses.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 17, false, 'basic', 3),

((SELECT id FROM video_categories WHERE month_number = 12),
 'Personal Manifesto: Carrying Your Strength Forward',
 'Creating a personal manifesto that anchors your hard-won wisdom for future transitions.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 19, false, 'premium', 4);


-- ===============================================
-- RESOURCES (Worksheets, Meditations, PDFs)
-- ===============================================

-- Sample resources for different categories
INSERT INTO resources (category_id, title, description, resource_type, file_url, file_size_mb, min_membership, is_free, sort_order)
VALUES
-- Month 1 resources
((SELECT id FROM video_categories WHERE month_number = 1),
 'Nervous System Reset Worksheet',
 'Printable PDF with daily exercises for calming your nervous system in new environments.',
 'worksheet',
 'https://example.com/worksheets/nervous-system-reset.pdf',
 0.8,
 'basic',
 false,
 1),

((SELECT id FROM video_categories WHERE month_number = 1),
 'Grounding Meditation Audio',
 'Guided 10-minute meditation for feeling grounded when everything feels unfamiliar.',
 'meditation',
 'https://example.com/audio/grounding-meditation.mp3',
 12.5,
 'free',
 true,
 2),

-- Month 2 resources
((SELECT id FROM video_categories WHERE month_number = 2),
 'Inner Home Visualization Guide',
 'Step-by-step guide for creating your inner sanctuary through visualization.',
 'pdf',
 'https://example.com/guides/inner-home-visualization.pdf',
 1.2,
 'basic',
 false,
 1),

-- Month 5 resources
((SELECT id FROM video_categories WHERE month_number = 5),
 'Byron Katie Worksheet for Expats',
 'Customized worksheet with common expat limiting beliefs for The Work inquiry.',
 'worksheet',
 'https://example.com/worksheets/byron-katie-expat.pdf',
 0.6,
 'premium',
 false,
 1),

-- Month 7 resources
((SELECT id FROM video_categories WHERE month_number = 7),
 'Money Story Excavation Workbook',
 'Comprehensive workbook for uncovering your inherited money beliefs and patterns.',
 'worksheet',
 'https://example.com/worksheets/money-story.pdf',
 2.1,
 'premium',
 false,
 1),

((SELECT id FROM video_categories WHERE month_number = 7),
 'Abundance Affirmations Audio',
 'Daily affirmations for shifting money mindset (15 minutes).',
 'audio',
 'https://example.com/audio/abundance-affirmations.mp3',
 18.3,
 'basic',
 false,
 2),

-- Month 10 resources
((SELECT id FROM video_categories WHERE month_number = 10),
 'Connection Rituals Toolkit',
 'Collection of creative rituals for staying close to family across distance.',
 'pdf',
 'https://example.com/guides/connection-rituals.pdf',
 1.5,
 'premium',
 false,
 1),

-- Month 12 resources
((SELECT id FROM video_categories WHERE month_number = 12),
 'Personal Manifesto Template',
 'Guided template for creating your resilience manifesto.',
 'worksheet',
 'https://example.com/worksheets/personal-manifesto.pdf',
 0.9,
 'premium',
 false,
 1),

((SELECT id FROM video_categories WHERE month_number = 12),
 'Integration Meditation',
 'Powerful 20-minute meditation for integrating all you have learned.',
 'meditation',
 'https://example.com/audio/integration-meditation.mp3',
 24.7,
 'basic',
 false,
 2);
