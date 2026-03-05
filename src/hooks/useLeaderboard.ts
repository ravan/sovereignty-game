import { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from '../types';
import { db, subscribeToLeaderboard } from '../supabase';

export type LeaderboardScope = 'today' | 'week' | 'alltime';

export function useLeaderboard(scope: LeaderboardScope = 'today', autoRefresh = false, refreshIntervalMs = 15_000) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      let data: LeaderboardEntry[];
      if (scope === 'today') {
        data = await db.getTodayLeaderboard(20);
      } else if (scope === 'week') {
        data = await db.getWeekLeaderboard(20);
      } else {
        data = await db.getAllTimeLeaderboard(20);
      }
      setEntries(data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Polling fallback — also catches cases where realtime isn't enabled in Supabase
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetch, refreshIntervalMs);
    return () => clearInterval(id);
  }, [autoRefresh, fetch, refreshIntervalMs]);

  // Real-time subscription: instantly refresh when a new score is inserted
  useEffect(() => {
    if (!autoRefresh) return;
    const unsub = subscribeToLeaderboard(fetch);
    return unsub;
  }, [autoRefresh, fetch]);

  return { entries, loading, lastUpdated, refresh: fetch };
}
