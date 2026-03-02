import { useState } from 'react';
import { useLeaderboard, LeaderboardScope } from '../hooks/useLeaderboard';
import { Trophy, Zap, RefreshCw } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardScreenProps {
  playerScore: number;
  playerName: string;
  onPlayAgain: () => void;
}

const MEDAL = ['🥇', '🥈', '🥉'];

const RANKS = [
  { min: 9500, label: 'SOVEREIGN', color: '#30ba78' },
  { min: 8000, label: 'MASTER',    color: '#fe7c3f' },
  { min: 6500, label: 'CHAMPION',  color: '#5fd4a0' },
  { min: 4500, label: 'GUARDIAN',  color: '#f5c842' },
  { min: 2500, label: 'DEFENDER',  color: '#fe7c3f' },
  { min: 0,    label: 'ROOKIE',    color: '#8fba9e' },
];

function getRankLabel(score: number) {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}

function EntryRow({ entry, index, isPlayer }: { entry: LeaderboardEntry; index: number; isPlayer: boolean }) {
  const rank = getRankLabel(entry.score);
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
      style={{
        background: isPlayer ? 'rgba(48,186,120,0.08)' : 'rgba(255,255,255,0.02)',
        border: isPlayer ? '1px solid rgba(48,186,120,0.4)' : '1px solid transparent',
      }}
    >
      <span
        className="font-orbitron font-bold text-base w-7 text-center shrink-0"
        style={{ color: index === 0 ? '#f5c842' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.3)' }}
      >
        {index < 3 ? MEDAL[index] : `#${index + 1}`}
      </span>
      <span className={`flex-1 text-sm font-medium truncate ${isPlayer ? 'neon-green' : 'opacity-70'}`}>
        {entry.player_name}
        {isPlayer && <span className="ml-2 text-xs opacity-60">(you)</span>}
      </span>
      <span className="hidden md:block font-orbitron text-xs shrink-0" style={{ color: rank.color }}>
        {rank.label}
      </span>
      <span className="font-orbitron font-bold text-sm shrink-0" style={{ color: isPlayer ? '#30ba78' : 'rgba(214,240,229,0.7)' }}>
        {entry.score.toLocaleString()}
      </span>
      <span className="text-xs opacity-40 shrink-0 hidden sm:block">
        {entry.correct_answers ?? '?'}/16
      </span>
    </div>
  );
}

const TABS: { scope: LeaderboardScope; label: string }[] = [
  { scope: 'today',   label: "TODAY'S HEROES" },
  { scope: 'week',    label: 'THIS WEEK' },
  { scope: 'alltime', label: 'ALL TIME' },
];

export function LeaderboardScreen({ playerScore, playerName, onPlayAgain }: LeaderboardScreenProps) {
  const [scope, setScope] = useState<LeaderboardScope>('today');
  const { entries, loading, refresh } = useLeaderboard(scope, true);

  const playerRank = entries.findIndex(
    (e) => e.player_name === playerName && e.score === playerScore
  ) + 1;

  return (
    <div className="relative z-10 flex flex-col min-h-screen px-4 py-6 gap-5 max-w-2xl mx-auto w-full screen-enter">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <span className="suse-pill">POWERED BY SUSE</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-1">
          <Trophy className="w-8 h-8 neon-yellow" />
          <h1 className="font-orbitron font-black text-2xl md:text-4xl" style={{ color: '#f5c842', textShadow: '0 0 20px #f5c842' }}>
            LEADERBOARD
          </h1>
          <Trophy className="w-8 h-8 neon-yellow" />
        </div>
        {playerRank > 0 && (
          <p className="font-orbitron text-sm neon-green">YOUR RANK: #{playerRank}</p>
        )}
      </div>

      {/* Scope tabs */}
      <div className="flex gap-2 glass rounded-xl p-1 neon-border-cyan">
        {TABS.map(({ scope: s, label }) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className="flex-1 py-2 rounded-lg font-orbitron text-xs tracking-widest uppercase transition-all"
            style={{
              background: scope === s ? 'rgba(48,186,120,0.15)' : 'transparent',
              color: scope === s ? '#30ba78' : 'rgba(255,255,255,0.35)',
              border: scope === s ? '1px solid rgba(48,186,120,0.4)' : '1px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
        <button onClick={refresh} className="px-3 py-2 rounded-lg transition-all" style={{ color: 'rgba(48,186,120,0.6)' }} title="Refresh">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Entries */}
      <div className="flex-1 glass rounded-xl neon-border-cyan overflow-hidden">
        {loading && entries.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="font-orbitron text-sm animate-pulse neon-green">LOADING...</div>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Trophy className="w-10 h-10 opacity-20" style={{ color: '#f5c842' }} />
            <p className="font-orbitron text-sm opacity-40">NO SCORES YET — BE THE FIRST!</p>
          </div>
        ) : (
          <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
            {entries.map((entry, i) => (
              <EntryRow
                key={`${entry.id ?? i}-${i}`}
                entry={entry}
                index={i}
                isPlayer={entry.player_name === playerName && entry.score === playerScore}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action */}
      <button
        onClick={onPlayAgain}
        className="w-full py-4 rounded-xl font-orbitron font-bold text-base tracking-widest uppercase transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(48,186,120,0.18), rgba(254,124,63,0.12))',
          border: '1px solid rgba(48,186,120,0.5)',
          color: '#30ba78',
          boxShadow: '0 0 20px rgba(48,186,120,0.2)',
        }}
      >
        <Zap className="inline-block w-4 h-4 mr-2" />
        PLAY AGAIN
      </button>
    </div>
  );
}
