-- ===============================================
-- BLOG POSTS - Sample Content
-- ===============================================

INSERT INTO blog_posts (title, slug, excerpt, content, category, featured_image_url, tags, is_published, published_at)
VALUES
('5 Signs You Are Experiencing Expat Burnout (And What To Do About It)',
 '5-signs-expat-burnout',
 'Living abroad is rewarding, but the constant adaptation can lead to burnout. Learn to recognize the warning signs before it is too late.',
 '<h2>The Hidden Cost of Living Between Worlds</h2><p>Expatriation is often romanticized, but the reality involves constant cultural navigation that can drain your energy reserves...</p><h3>1. You Feel Exhausted Even After Rest</h3><p>Unlike regular tiredness, expat burnout leaves you depleted even after a full night sleep...</p>',
 'blog',
 'https://images.unsplash.com/photo-1494059980473-813e73ee784b',
 ARRAY['burnout', 'mental health', 'expat life', 'self-care'],
 true,
 NOW() - INTERVAL '5 days'),

('How I Built My Inner Home After Moving 7 Times in 10 Years',
 'building-inner-home-after-7-moves',
 'After a decade of constant relocation, I discovered the secret to feeling at home anywhere: building an unshakeable inner sanctuary.',
 '<h2>The Crisis Point</h2><p>By my sixth move, I was exhausted. Each new apartment felt temporary, each new city felt foreign. That is when I realized...</p><h3>What Is an Inner Home?</h3><p>Your inner home is not a physical place. It is a sense of belonging to yourself that travels with you...</p>',
 'blog',
 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
 ARRAY['identity', 'resilience', 'inner work', 'personal story'],
 true,
 NOW() - INTERVAL '12 days'),

('The Loneliness No One Talks About: Emotional Isolation as an Expat',
 'expat-emotional-isolation',
 'You can be surrounded by people and still feel profoundly alone. This type of loneliness is common among expats but rarely discussed.',
 '<h2>The Paradox of Connection</h2><p>I had friends, colleagues, and acquaintances. Yet I felt utterly alone. The loneliness I experienced was not about being physically isolated...</p><h3>Why Expat Loneliness Is Different</h3><p>When you live between cultures, you lose the implicit understanding that comes from shared context...</p>',
 'blog',
 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
 ARRAY['loneliness', 'connection', 'mental health', 'community'],
 true,
 NOW() - INTERVAL '20 days'),

('Money Mindset Abroad: Why Your Financial Blocks Get Amplified',
 'money-mindset-abroad',
 'Living abroad surfaces your deepest money fears. Here is why financial anxiety intensifies when you expatriate and what to do about it.',
 '<h2>The Hidden Financial Stress</h2><p>Even with a stable income, many expats experience intense financial anxiety. This is not about the numbers in your bank account...</p><h3>Cultural Money Values Clash</h3><p>When you move to a new country, you encounter different attitudes toward money, success, and security...</p>',
 'blog',
 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
 ARRAY['money', 'mindset', 'financial wellness', 'abundance'],
 true,
 NOW() - INTERVAL '28 days'),

('The Gift of Endometriosis: How Chronic Pain Taught Me Resilience',
 'endometriosis-taught-resilience',
 'Living with endometriosis while managing life abroad forced me to develop tools for resilience I never knew I needed.',
 '<h2>When Pain Becomes Your Teacher</h2><p>I was diagnosed with endometriosis at 24. Years of surgeries, treatments, and chronic pain followed...</p><h3>Navigating Healthcare in a Foreign Language</h3><p>One of the hardest parts of managing endometriosis abroad is explaining your medical history...</p>',
 'blog',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
 ARRAY['endometriosis', 'chronic pain', 'health', 'resilience'],
 true,
 NOW() - INTERVAL '35 days'),

('Creating Rituals That Travel: My Morning Practice Anywhere in the World',
 'morning-rituals-that-travel',
 'The key to feeling grounded despite constant change? Portable rituals that work in any timezone, any culture, any circumstance.',
 '<h2>The Power of Portable Rituals</h2><p>After years of moving between countries, I realized that elaborate morning routines do not work for expats...</p><h3>My 3-Part Travel-Proof Morning</h3><p>This practice takes 15 minutes and requires nothing but yourself...</p>',
 'blog',
 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
 ARRAY['rituals', 'routine', 'mindfulness', 'self-care'],
 true,
 NOW() - INTERVAL '42 days');


-- ===============================================
-- WORKSHOPS - Sample Content
-- ===============================================

INSERT INTO blog_posts (title, slug, excerpt, content, category, featured_image_url, tags, is_published, published_at)
VALUES
('Art Expressive Therapy: Silk Painting for Emotional Release',
 'silk-painting-emotional-release-workshop',
 'A transformative 3-hour workshop where you will use silk painting to process complex emotions that words cannot express.',
 '<h2>Workshop Overview</h2><p>This hands-on workshop combines art therapy with expressive techniques to help you access and release emotions stored in your body...</p><h3>What You Will Learn</h3><ul><li>Basic silk painting techniques</li><li>How to use color and movement for emotional expression</li><li>Methods for processing grief, anxiety, and cultural displacement</li></ul><h3>Who Is This For</h3><p>Perfect for expatriates experiencing emotional overwhelm, identity confusion, or difficulty articulating feelings...</p><h3>Materials Provided</h3><p>All art supplies included: silk scarves, dyes, brushes, and protective materials...</p><h3>Details</h3><p><strong>Duration:</strong> 3 hours<br><strong>Location:</strong> Online (Zoom) or In-Person (Barcelona, Spain)<br><strong>Language:</strong> English, Czech, or Spanish<br><strong>Price:</strong> €120</p>',
 'workshop',
 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
 ARRAY['art therapy', 'silk painting', 'emotional release', 'workshop'],
 true,
 NOW() - INTERVAL '10 days'),

('Building Resilience for Expat Families: Parent & Child Workshop',
 'resilience-expat-families-workshop',
 'A 2-hour interactive workshop designed for parents and children (ages 8-16) to build collective family resilience abroad.',
 '<h2>Why This Workshop</h2><p>Moving abroad affects the entire family. Children experience cultural transitions differently than adults, and families need tools to navigate these changes together...</p><h3>Workshop Activities</h3><ul><li>Family resilience mapping</li><li>Creative expression exercises for all ages</li><li>Communication rituals for maintaining connection</li><li>Cultural identity exploration for kids</li></ul><h3>What Families Will Gain</h3><p>Practical tools for supporting each other through transitions, activities to process emotions together, and a family action plan...</p><h3>Details</h3><p><strong>Duration:</strong> 2 hours<br><strong>Format:</strong> Interactive online session<br><strong>Recommended Ages:</strong> Children 8-16 with parent(s)<br><strong>Price:</strong> €150 per family</p>',
 'workshop',
 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
 ARRAY['family', 'children', 'resilience', 'workshop'],
 true,
 NOW() - INTERVAL '18 days'),

('Money Mindset Transformation: One-Day Intensive',
 'money-mindset-intensive-workshop',
 'A deep-dive 6-hour intensive for transforming your relationship with money, abundance, and financial security abroad.',
 '<h2>Transform Your Money Story</h2><p>This intensive workshop takes you through the complete process of identifying, understanding, and rewriting your money beliefs...</p><h3>Workshop Modules</h3><ol><li><strong>Morning:</strong> Excavating Your Money Story (9am-12pm)</li><li><strong>Afternoon:</strong> Rewriting Limiting Beliefs (1pm-4pm)</li><li><strong>Integration:</strong> Daily Abundance Practices (4pm-5pm)</li></ol><h3>What Is Included</h3><p>Comprehensive workbook, money mindset assessment, personalized action plan, 30-day follow-up support...</p><h3>Details</h3><p><strong>Duration:</strong> 6 hours (with breaks)<br><strong>Format:</strong> Online via Zoom<br><strong>Group Size:</strong> Maximum 8 participants<br><strong>Price:</strong> €280</p>',
 'workshop',
 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf',
 ARRAY['money', 'abundance', 'mindset', 'intensive', 'workshop'],
 true,
 NOW() - INTERVAL '25 days'),

('Navigating Career Transitions Abroad: Professional Identity Workshop',
 'career-transition-abroad-workshop',
 'A 4-hour workshop for expats facing career challenges, working below qualification, or reinventing their professional identity.',
 '<h2>When Your Career Does Not Translate</h2><p>Many highly qualified expats struggle with career setbacks abroad. This workshop transforms career challenges into opportunities for growth...</p><h3>Workshop Topics</h3><ul><li>Reframing "working below qualification"</li><li>Building a portable professional identity</li><li>Networking in a foreign culture</li><li>Leveraging your unique cross-cultural perspective</li></ul><h3>Who Should Attend</h3><p>Professionals experiencing career frustration abroad, those considering career pivots, or anyone rebuilding their professional identity...</p><h3>Details</h3><p><strong>Duration:</strong> 4 hours<br><strong>Format:</strong> Interactive online workshop<br><strong>Materials:</strong> Professional identity workbook included<br><strong>Price:</strong> €180</p>',
 'workshop',
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
 ARRAY['career', 'professional development', 'identity', 'workshop'],
 true,
 NOW() - INTERVAL '33 days'),

('The Inner Home Method: Weekend Immersion Retreat',
 'inner-home-weekend-retreat',
 'A transformative 2-day retreat for building your inner sanctuary through meditation, art therapy, and somatic practices.',
 '<h2>Two Days to Transform Your Relationship with Home</h2><p>This immersive retreat takes you deep into the process of creating an unshakeable inner home...</p><h3>Retreat Schedule</h3><p><strong>Day 1: Foundation</strong><br>Morning: Understanding Inner Home concept<br>Afternoon: Silk painting meditation<br>Evening: Energetic anchoring practices</p><p><strong>Day 2: Integration</strong><br>Morning: Somatic grounding exercises<br>Afternoon: Personal ritual creation<br>Evening: Integration ceremony</p><h3>What Is Included</h3><p>All materials, workbook, ongoing support group access, recorded meditations...</p><h3>Details</h3><p><strong>Duration:</strong> Saturday & Sunday, 9am-5pm<br><strong>Location:</strong> Barcelona, Spain (accommodation not included)<br><strong>Group Size:</strong> Limited to 6 participants<br><strong>Price:</strong> €480</p>',
 'workshop',
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
 ARRAY['retreat', 'inner home', 'transformation', 'workshop'],
 true,
 NOW() - INTERVAL '40 days');


-- ===============================================
-- TESTIMONIALS - Sample Content
-- ===============================================

INSERT INTO testimonials (name, role, content, rating, is_visible, sort_order)
VALUES
('Emma Thompson',
 'Expat in Berlin, Germany',
 'The Inner Home method completely transformed how I experience living abroad. After 3 years of feeling unrooted, I finally feel at home within myself. Silvie''s approach is gentle yet powerful.',
 5,
 true,
 1),

('Maria Garcia',
 'Digital Nomad',
 'I have worked with many coaches, but Silvie''s unique blend of art therapy and energy work reached parts of me that talk therapy never could. The silk painting sessions were life-changing.',
 5,
 true,
 2),

('Sarah Chen',
 'Expat Mom in Spain',
 'The family resilience workshop gave us tools we still use daily. My kids now have healthy ways to process their feelings about living far from grandparents.',
 5,
 true,
 3),

('Linda Petersen',
 'Living with Endometriosis in Portugal',
 'As someone managing chronic pain abroad, I felt so seen in Silvie''s work. The Endometriosis Hub gave me practical tools for nervous system regulation that actually work.',
 5,
 true,
 4),

('Anna Kowalski',
 'Career Changer in Netherlands',
 'Working below my qualification was destroying my confidence. Silvie helped me reframe the experience and see it as a growth opportunity. I am now thriving in a new field.',
 5,
 true,
 5),

('Sophie Martin',
 'Expat in Prague, Czech Republic',
 'The money mindset work was uncomfortable but necessary. I uncovered beliefs I did not even know I had. My financial anxiety has decreased significantly.',
 4,
 true,
 6);
