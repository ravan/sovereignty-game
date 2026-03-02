import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLeaderboard, LeaderboardScope } from '../hooks/useLeaderboard';
import { Trophy, Wifi } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface DisplayModeProps {
  gameUrl: string;
}

const RANKS = [
  { min: 9500, label: 'SOVEREIGN', color: '#30ba78' },
  { min: 8000, label: 'MASTER',    color: '#fe7c3f' },
  { min: 6500, label: 'CHAMPION',  color: '#5fd4a0' },
  { min: 4500, label: 'GUARDIAN',  color: '#f5c842' },
  { min: 2500, label: 'DEFENDER',  color: '#fe7c3f' },
  { min: 0,    label: 'ROOKIE',    color: '#8fba9e' },
];

function getRank(score: number) {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}

const MEDAL = ['🥇', '🥈', '🥉'];

const SCOPE_CYCLE: LeaderboardScope[] = ['today', 'week', 'alltime'];
const SCOPE_DURATION_MS = 4_000;

const SCOPE_META: Record<LeaderboardScope, { title: string; subtitle: string }> = {
  today:   { title: "TODAY'S CHAMPIONS", subtitle: 'LIVE SCORES' },
  week:    { title: "THIS WEEK'S BEST",  subtitle: 'WEEKLY RANKINGS' },
  alltime: { title: 'ALL-TIME LEGENDS',  subtitle: 'HALL OF FAME' },
};

const STATEMENTS = [
  "Somewhere, an algorithm knows you better than your mum does.",
  "Your playlist knows things your therapist doesn't.",
  "The terms & conditions you skipped were... interesting.",
  "Page 47 of the T&Cs was the important one.",
  "Is it YOUR cloud — or just someone else's server?",
  "The cloud has a landlord. Spoiler: it's not you.",
  "Cloud storage: your data, their rules.",
  "Your attention was sold before you finished reading this.",
  "In another tab, your data is being sold. Right now.",
  "Your phone knows where you sleep. Just saying.",
  "Your entire enterprise runs on someone else's subscription.",
  "Your software vendor audited you last quarter. You didn't notice.",
  "The vendor's roadmap is your roadmap. Was that the plan?",
];

type TypePhase = 'typing' | 'holding' | 'deleting';

function RotatingStatement() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<TypePhase>('typing');

  useEffect(() => {
    const target = STATEMENTS[idx];

    if (phase === 'typing') {
      if (displayed.length >= target.length) {
        setPhase('holding');
        return;
      }
      const id = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 45);
      return () => clearTimeout(id);
    }

    if (phase === 'holding') {
      const id = setTimeout(() => setPhase('deleting'), 20000);
      return () => clearTimeout(id);
    }

    if (phase === 'deleting') {
      if (displayed.length === 0) {
        setIdx((i) => (i + 1) % STATEMENTS.length);
        setPhase('typing');
        return;
      }
      const id = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 20);
      return () => clearTimeout(id);
    }
  }, [phase, displayed, idx]);

  return (
    <p
      className="font-orbitron"
      style={{
        fontSize: '1.05rem',
        color: 'rgba(214,240,229,0.8)',
        lineHeight: 1.5,
        minHeight: '4.5rem',
      }}
    >
      {displayed}
      <span className="typewriter-cursor">|</span>
    </p>
  );
}

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
              style={{ width: `${progress}%`, background: '#30ba78', boxShadow: '0 0 6px #30ba78' }}
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
      className="flex items-center gap-4 px-6 py-4 rounded-xl"
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
        className="font-orbitron font-black text-3xl w-10 text-center shrink-0"
        style={{ color: index === 0 ? '#f5c842' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.3)' }}
      >
        {index < 3 ? MEDAL[index] : `#${index + 1}`}
      </span>
      <span className="flex-1 font-orbitron font-bold text-2xl truncate" style={{ color: '#d6f0e5' }}>
        {entry.player_name}
      </span>
      <span className="font-orbitron text-sm shrink-0" style={{ color: rank.color }}>{rank.label}</span>
      <span className="font-orbitron font-black text-3xl shrink-0" style={{ color: rank.color, textShadow: `0 0 12px ${rank.color}` }}>
        {entry.score.toLocaleString()}
      </span>
    </div>
  );
}

export function DisplayMode({ gameUrl }: DisplayModeProps) {
  const [scopeIndex, setScopeIndex] = useState(0);
  const scope = SCOPE_CYCLE[scopeIndex];
  const meta = SCOPE_META[scope];

  const { entries, loading } = useLeaderboard(scope, true);

  // Auto-cycle through scopes
  useEffect(() => {
    const id = setInterval(() => {
      setScopeIndex((i) => (i + 1) % SCOPE_CYCLE.length);
    }, SCOPE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-10 flex h-screen w-screen overflow-hidden">
      {/* Left panel: Title + QR Code */}
      <div className="flex flex-col items-center justify-between w-[38%] p-10 border-r border-white/10">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <span className="suse-pill" style={{ fontSize: '0.85rem', padding: '4px 14px' }}>POWERED BY SUSE</span>
          </div>
          <h1
            className="glitch-text font-orbitron font-black uppercase tracking-widest"
            data-text="SOVEREIGNTY"
            style={{ fontSize: '2.8rem', color: '#30ba78', textShadow: '0 0 20px #30ba78, 0 0 40px #30ba78', lineHeight: 1.1 }}
          >
            SOVEREIGNTY
          </h1>
          <h1
            className="font-orbitron font-black uppercase tracking-widest mb-5"
            style={{ fontSize: '2.8rem', color: '#fe7c3f', textShadow: '0 0 20px #fe7c3f', lineHeight: 1.1 }}
          >
            STRIKE
          </h1>
          <RotatingStatement />
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="p-4 rounded-2xl"
            style={{ background: '#fff', border: '3px solid #30ba78', boxShadow: '0 0 30px rgba(48,186,120,0.5)' }}
          >
            <QRCodeSVG value={gameUrl} size={220} bgColor="#ffffff" fgColor="#0c322c" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Wifi className="w-4 h-4" style={{ color: '#30ba78' }} />
              <span className="font-orbitron text-sm tracking-widest neon-green">SCAN TO PLAY</span>
            </div>
            <p className="font-orbitron text-xs opacity-40">{gameUrl}</p>
          </div>
        </div>

      </div>

      {/* Right panel: Leaderboard */}
      <div className="flex flex-col flex-1 p-8 gap-4 overflow-hidden">
        {/* Header with scope title */}
        <div>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 neon-yellow" />
            <div>
              <h2 className="font-orbitron font-black text-3xl" style={{ color: '#f5c842', textShadow: '0 0 15px #f5c842' }}>
                {meta.title}
              </h2>
              <p className="font-orbitron text-xs tracking-widest opacity-40">{meta.subtitle}</p>
            </div>
            {loading && <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin ml-2" style={{ borderColor: '#30ba78', borderTopColor: 'transparent' }} />}
          </div>
          <ScopeProgressBar scopeIndex={scopeIndex} />
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <Trophy className="w-20 h-20 opacity-10" style={{ color: '#f5c842' }} />
              <p className="font-orbitron text-xl opacity-30">NO SCORES YET</p>
              <p className="font-orbitron text-sm opacity-20">SCAN THE QR CODE TO BE FIRST!</p>
            </div>
          ) : (
            entries.map((entry, i) => (
              <LeaderboardRow key={`${entry.id}-${i}`} entry={entry} index={i} />
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="flex gap-6 glass rounded-xl px-6 py-3 neon-border-cyan">
            <div className="text-center">
              <div className="font-orbitron font-bold text-2xl neon-green">{entries.length}</div>
              <div className="font-orbitron text-xs opacity-40">
                {scope === 'today' ? 'PLAYERS TODAY' : scope === 'week' ? 'PLAYERS THIS WEEK' : 'ALL-TIME PLAYERS'}
              </div>
            </div>
            <div className="text-center">
              <div className="font-orbitron font-bold text-2xl neon-orange">{entries[0]?.score.toLocaleString() ?? '—'}</div>
              <div className="font-orbitron text-xs opacity-40">TOP SCORE</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron font-bold text-2xl" style={{ color: '#5fd4a0', textShadow: '0 0 8px #5fd4a0' }}>
                {Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length).toLocaleString()}
              </div>
              <div className="font-orbitron text-xs opacity-40">AVG SCORE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
