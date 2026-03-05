CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  max_streak INTEGER NOT NULL,
  played_at TIMESTAMPTZ DEFAULT now(),
  session_date DATE DEFAULT CURRENT_DATE
);

-- Indexes for common query patterns
CREATE INDEX idx_leaderboard_score ON leaderboard (score DESC);
CREATE INDEX idx_leaderboard_session_date ON leaderboard (session_date);
CREATE INDEX idx_leaderboard_played_at ON leaderboard (played_at);

-- DB-level constraints as second layer of defense
ALTER TABLE leaderboard ADD CONSTRAINT valid_score
  CHECK (score >= 0 AND score <= 10000);
ALTER TABLE leaderboard ADD CONSTRAINT valid_correct
  CHECK (correct_answers >= 0 AND correct_answers <= 10);
ALTER TABLE leaderboard ADD CONSTRAINT valid_streak
  CHECK (max_streak >= 0 AND max_streak <= 10);

-- Row Level Security: read-only for anon key
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies = anon key cannot write.
-- The Edge Function uses service_role which bypasses RLS.
