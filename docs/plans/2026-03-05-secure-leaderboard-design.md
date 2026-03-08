# Secure Leaderboard via Supabase Edge Function

## Problem
The leaderboard allows direct INSERT via the Supabase anon key. Anyone can open DevTools and submit fake high scores.

## Solution
A Supabase Edge Function (`submit-score`) that validates scores server-side. The anon key loses INSERT access entirely — only the Edge Function can write to the leaderboard using the `service_role` key.

## Game Rules (validation bounds)
- 10 questions, 20s each, 1000 base pts per correct answer
- Speed factor 0.5-1.0 per question, so per-question range: 500-1000
- Max possible score: 10,000
- `correct_answers`: 0-10
- `score` <= `correct_answers * 1000`
- `max_streak`: 0-10, <= `correct_answers`

## Database

Table `leaderboard` with columns: `id` (UUID), `player_name` (TEXT), `score` (INT), `correct_answers` (INT), `max_streak` (INT), `played_at` (TIMESTAMPTZ), `session_date` (DATE).

CHECK constraints enforce score bounds at the DB level as a second defense.

RLS: SELECT only for anon key. No INSERT/UPDATE/DELETE. The Edge Function uses `service_role` which bypasses RLS.

## Edge Function: `submit-score`

Location: `supabase/functions/submit-score/index.ts`

1. Receives `{ player_name, score, correct_answers, max_streak }`
2. Validates all fields against game rules
3. Rate-limits: rejects if same `player_name` submitted in last 30s
4. Inserts via `service_role` Supabase client
5. Returns `{ success: true }` or `{ error: "message" }`

CORS: Allow `sovereigntyquiz.com` and `ravan.github.io`.

## Client Change

`src/supabase.ts` — change `submitScore` from `supabase.from('leaderboard').insert()` to `supabase.functions.invoke('submit-score', { body })`.

localStorage fallback unchanged.

## Supabase Project
- Project ref: `iaurojpexxyynfggqgbx`
- Managed via Supabase CLI (`supabase db push`, `supabase functions deploy`)
