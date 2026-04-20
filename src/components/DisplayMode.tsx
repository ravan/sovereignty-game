import { useEffect, useState, ReactNode } from 'react';
import { useLeaderboard, LeaderboardScope } from '../hooks/useLeaderboard';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { DashboardLeftPanel } from './DashboardLeftPanel';

interface DisplayModeProps {
  gameUrl: string;
  slideIndicator?: ReactNode;
  conferenceMode?: boolean;
}

const RANKS = [
  { min: 9500, label: 'Sovereign', color: '#30ba78' },
  { min: 8000, label: 'Master',    color: '#ffffff' },
  { min: 6500, label: 'Champion',  color: '#5fd4a0' },
  { min: 4500, label: 'Guardian',  color: '#bd3314' },
  { min: 2500, label: 'Defender',  color: '#ffffff' },
  { min: 0,    label: 'Rookie',    color: '#8fba9e' },
];

function getRank(score: number) {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}

const MEDAL = ['🥇', '🥈', '🥉'];

const SCOPE_CYCLE: LeaderboardScope[] = ['today', 'week', 'alltime'];
const SCOPE_DURATION_MS = 4_000;

const SCOPE_META: Record<LeaderboardScope, { title: string; subtitle: string }> = {
  today:   { title: "Today's Champions", subtitle: 'Live Scores' },
  week:    { title: "This Week's Best",  subtitle: 'Weekly Rankings' },
  alltime: { title: 'All-Time Legends',  subtitle: 'Hall of Fame' },
};


function ScopeProgressBar({ scopeIndex }: { scopeIndex: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / SCOPE_DURATION_MS) * 100, 100));
    }, 100);
    return () => clearInterval(id);
  }, [scopeIndex]);

  return (
    <div className="flex gap-1.5 mt-3">
      {SCOPE_CYCLE.map((_, i) => (
        <div
          key={i}
          className="flex-1 h-0.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          {i === scopeIndex ? (
            <div
              className="h-full rounded-full transition-none"
              style={{ width: `${progress}%`, background: '#30ba78' }}
            />
          ) : i < scopeIndex ? (
            <div className="h-full rounded-full w-full" style={{ background: 'rgba(48,186,120,0.4)' }} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const rank = getRank(entry.score);
  return (
    <div
      className="flex items-center gap-4 3xl:gap-6 4xl:gap-8 px-6 py-4 3xl:px-10 3xl:py-6 4xl:px-14 4xl:py-8 rounded-xl"
      style={{
        background: index === 0
          ? 'rgba(48,186,120,0.08)'
          : index === 1 ? 'rgba(192,192,192,0.05)'
          : index === 2 ? 'rgba(205,127,50,0.05)'
          : 'rgba(255,255,255,0.02)',
        border: index === 0
          ? '1px solid rgba(48,186,120,0.35)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        className={`font-orbitron font-black text-center shrink-0 min-w-[3.5rem] 3xl:min-w-[5.5rem] 4xl:min-w-[7rem] ${index < 3 ? 'text-3xl 3xl:text-5xl 4xl:text-6xl' : 'text-xl 3xl:text-3xl 4xl:text-4xl'}`}
        style={{ color: index === 0 ? '#30ba78' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.3)' }}
      >
        {index < 3 ? MEDAL[index] : `#${index + 1}`}
      </span>
      <span className="flex-1 font-orbitron font-bold text-2xl 3xl:text-4xl 4xl:text-5xl truncate" style={{ color: '#d6f0e5' }}>
        {entry.player_name}
      </span>
      <span className="font-orbitron text-sm 3xl:text-xl 4xl:text-2xl shrink-0" style={{ color: rank.color }}>{rank.label}</span>
      <span className="font-orbitron font-black text-3xl 3xl:text-5xl 4xl:text-6xl shrink-0" style={{ color: rank.color }}>
        {entry.score.toLocaleString()}
      </span>
    </div>
  );
}

function getRefreshIntervalMs(): number {
  const params = new URLSearchParams(window.location.search);
  const val = params.get('refresh');
  if (val) {
    const secs = Number(val);
    if (secs > 0) return secs * 1000;
  }
  return 15_000;
}

export function DisplayMode({ gameUrl, slideIndicator, conferenceMode }: DisplayModeProps) {
  const [scopeIndex, setScopeIndex] = useState(0);
  const scope = conferenceMode ? 'today' : SCOPE_CYCLE[scopeIndex];
  const meta = SCOPE_META[scope];
  const refreshIntervalMs = getRefreshIntervalMs();

  const { entries, totalPlayers, loading, lastUpdated } = useLeaderboard(scope, true, refreshIntervalMs);

  // Auto-cycle through scopes (disabled in conference mode)
  useEffect(() => {
    if (conferenceMode) return;
    const id = setInterval(() => {
      setScopeIndex((i) => (i + 1) % SCOPE_CYCLE.length);
    }, SCOPE_DURATION_MS);
    return () => clearInterval(id);
  }, [conferenceMode]);

  return (
    <div className="relative z-10 flex h-screen w-screen overflow-hidden">
      {/* Left panel: Title + QR Code */}
      <DashboardLeftPanel gameUrl={gameUrl} slideIndicator={slideIndicator} />

      {/* Right panel: Leaderboard */}
      <div className="flex flex-col flex-1 p-8 gap-4 3xl:p-14 3xl:gap-6 4xl:p-20 4xl:gap-10 overflow-hidden">
        {/* Header with scope title */}
        <div>
          <div className="flex items-center gap-3 3xl:gap-5 4xl:gap-7">
            <Trophy className="w-8 h-8 3xl:w-14 3xl:h-14 4xl:w-20 4xl:h-20" style={{ color: '#bd3314' }} />
            <div>
              <h2 className="font-orbitron font-black text-3xl 3xl:text-5xl 4xl:text-6xl" style={{ color: '#bd3314' }}>
                {meta.title}
              </h2>
              <p className="font-orbitron text-xs 3xl:text-base 4xl:text-lg opacity-40">{meta.subtitle}</p>
            </div>
            {loading && <div className="w-3 h-3 3xl:w-5 3xl:h-5 rounded-full border-2 border-t-transparent animate-spin ml-2" style={{ borderColor: '#30ba78', borderTopColor: 'transparent' }} />}
            {lastUpdated && (
              <div className="ml-auto flex items-center gap-2 3xl:gap-3">
                <span className="relative flex h-2 w-2 3xl:h-3 3xl:w-3 4xl:h-4 4xl:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#30ba78' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2 3xl:h-3 3xl:w-3 4xl:h-4 4xl:w-4" style={{ background: '#30ba78' }} />
                </span>
                <span className="font-orbitron text-xs 3xl:text-lg 4xl:text-xl opacity-40">
                  {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            )}
          </div>
          {!conferenceMode && <ScopeProgressBar scopeIndex={scopeIndex} />}
        </div>

        <div className="flex flex-col gap-2 3xl:gap-4 4xl:gap-5 flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 3xl:gap-7">
              <Trophy className="w-20 h-20 3xl:w-32 3xl:h-32 4xl:w-44 4xl:h-44 opacity-10" style={{ color: '#bd3314' }} />
              <p className="font-orbitron text-xl 3xl:text-3xl 4xl:text-4xl opacity-30">No Scores Yet</p>
              <p className="font-orbitron text-sm 3xl:text-xl 4xl:text-2xl opacity-20">Scan the QR code to be first!</p>
            </div>
          ) : (
            entries.map((entry, i) => (
              <LeaderboardRow key={`${entry.id}-${i}`} entry={entry} index={i} />
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="flex justify-around glass rounded-xl px-6 py-3 3xl:px-10 3xl:py-6 4xl:px-14 4xl:py-8 neon-border-cyan">
            <div className="text-center">
              <div className="font-orbitron font-bold text-2xl 3xl:text-4xl 4xl:text-5xl neon-green">{totalPlayers}</div>
              <div className="font-orbitron text-xs 3xl:text-lg 4xl:text-xl opacity-40">
                {scope === 'today' ? 'PLAYERS TODAY' : scope === 'week' ? 'PLAYERS THIS WEEK' : 'ALL-TIME PLAYERS'}
              </div>
            </div>
            <div className="text-center">
              <div className="font-orbitron font-bold text-2xl 3xl:text-4xl 4xl:text-5xl" style={{ color: '#ffffff' }}>{entries[0]?.score.toLocaleString() ?? '—'}</div>
              <div className="font-orbitron text-xs 3xl:text-lg 4xl:text-xl opacity-40">TOP SCORE</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron font-bold text-2xl 3xl:text-4xl 4xl:text-5xl" style={{ color: '#5fd4a0' }}>
                {Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length).toLocaleString()}
              </div>
              <div className="font-orbitron text-xs 3xl:text-lg 4xl:text-xl opacity-40">AVG SCORE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
