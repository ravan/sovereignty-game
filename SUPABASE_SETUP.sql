-- ============================================================
-- Sovereignty Strike — Supabase Database Setup
-- Run this in your Supabase project: SQL Editor > New query
-- ============================================================

-- 1. Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name      TEXT         NOT NULL,
  score            INTEGER      NOT NULL,
  correct_answers  INTEGER,
  max_streak       INTEGER,
  played_at        TIMESTAMPTZ  DEFAULT NOW(),
  session_date     DATE         DEFAULT CURRENT_DATE
);

-- 2. Indexes for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_session_date ON leaderboard (session_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_played_at   ON leaderboard (played_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score       ON leaderboard (score DESC);

-- 3. Row Level Security — allow public read + insert (no auth required)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert" ON leaderboard
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "public_select" ON leaderboard
  FOR SELECT TO anon USING (true);

-- 4. Enable real-time so the display screen updates instantly
--    when a mobile player submits their score
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;

-- ============================================================
-- After running this SQL:
--   1. Go to Project Settings > API
--   2. Copy "Project URL" and "anon public" key
--   3. Create sovereignty-game/.env with:
--        VITE_SUPABASE_URL=https://xxxx.supabase.co
--        VITE_SUPABASE_ANON_KEY=eyJ...
--   4. For Vercel deployment, add the same vars in:
--        Vercel Dashboard > Project > Settings > Environment Variables
-- ============================================================
