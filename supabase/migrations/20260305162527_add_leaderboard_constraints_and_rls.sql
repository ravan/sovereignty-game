-- Idempotent: add constraints and RLS if not already present

-- Indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard (score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_session_date ON leaderboard (session_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_played_at ON leaderboard (played_at);

-- CHECK constraints (use DO block to skip if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_score') THEN
    ALTER TABLE leaderboard ADD CONSTRAINT valid_score CHECK (score >= 0 AND score <= 10000);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_correct') THEN
    ALTER TABLE leaderboard ADD CONSTRAINT valid_correct CHECK (correct_answers >= 0 AND correct_answers <= 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_streak') THEN
    ALTER TABLE leaderboard ADD CONSTRAINT valid_streak CHECK (max_streak >= 0 AND max_streak <= 10);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any, then create SELECT-only
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON leaderboard;
CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard FOR SELECT
  USING (true);

-- Remove any existing INSERT/UPDATE/DELETE policies
DROP POLICY IF EXISTS "Public insert" ON leaderboard;
DROP POLICY IF EXISTS "Public update" ON leaderboard;
DROP POLICY IF EXISTS "Public delete" ON leaderboard;
