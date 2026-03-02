import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const STORAGE_KEY = 'sovereignty_leaderboard';
const MAX_LOCAL_ENTRIES = 50;

let supabase: SupabaseClient | null = null;

const isConfigured =
  SUPABASE_URL &&
  SUPABASE_URL !== 'https://your-project.supabase.co' &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== 'your-anon-key-here';

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  } catch {
    supabase = null;
  }
}

// ── Local storage fallback ──────────────────────────────────────────────────

function readLocal(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(entries: LeaderboardEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_LOCAL_ENTRIES)));
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function weekAgoISO() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ── Real-time subscription ──────────────────────────────────────────────────

/**
 * Subscribe to new leaderboard inserts for live display updates.
 * Returns an unsubscribe function. No-op when Supabase is not configured.
 */
export function subscribeToLeaderboard(onNewEntry: () => void): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('leaderboard_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'leaderboard' },
      onNewEntry
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export const db = {
  isLive: isConfigured && supabase !== null,

  async submitScore(entry: Omit<LeaderboardEntry, 'id' | 'played_at' | 'session_date'>): Promise<void> {
    const record: LeaderboardEntry = {
      ...entry,
      played_at: new Date().toISOString(),
      session_date: todayStr(),
    };

    if (supabase) {
      try {
        await supabase.from('leaderboard').insert(record);
        return;
      } catch {
        // fall through to local
      }
    }

    // localStorage fallback
    const existing = readLocal();
    existing.unshift(record);
    existing.sort((a, b) => b.score - a.score);
    writeLocal(existing);
  },

  async getTodayLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('session_date', todayStr())
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data) return data as LeaderboardEntry[];
      } catch {
        // fall through to local
      }
    }

    const entries = readLocal().filter((e) => e.session_date === todayStr());
    return entries.slice(0, limit);
  },

  async getWeekLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .gte('played_at', weekAgoISO())
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data) return data as LeaderboardEntry[];
      } catch {
        // fall through to local
      }
    }

    const cutoff = new Date(weekAgoISO());
    const entries = readLocal().filter(
      (e) => e.played_at && new Date(e.played_at) >= cutoff
    );
    return entries.slice(0, limit);
  },

  async getAllTimeLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data) return data as LeaderboardEntry[];
      } catch {
        // fall through to local
      }
    }

    return readLocal().slice(0, limit);
  },
};
