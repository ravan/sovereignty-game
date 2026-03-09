import { useState, useEffect } from 'react';
import { Zap, Trophy } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface IntroScreenProps {
  onStart: (playerName: string) => void;
}

const RANK_TIERS = [
  { min: 9000, label: 'SUSE Certified Sovereign',  color: '#30ba78' },
  { min: 7500, label: 'Digital Freedom Master',    color: '#ffffff' },
  { min: 6000, label: 'Open Source Guardian',      color: '#5fd4a0' },
  { min: 4000, label: 'Sovereignty Advocate',      color: '#bd3314' },
  { min: 0,    label: 'Data Defender',             color: '#8fba9e' },
];

export function getRankTier(score: number) {
  return RANK_TIERS.find((t) => score >= t.min) ?? RANK_TIERS[RANK_TIERS.length - 1];
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [name, setName] = useState('');
  const [showHighlights, setShowHighlights] = useState(false);
  const { entries } = useLeaderboard('today');

  useEffect(() => {
    const t = setTimeout(() => setShowHighlights(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 1) onStart(name.trim());
  };

  return (
    <div className="screen-enter relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8">
      {/* Logo / Title */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <span className="suse-pill">Powered by SUSE</span>
        </div>
        <h1
          className="font-orbitron font-black "
          style={{ fontSize: 'clamp(1.6rem, 5vw, 3.5rem)', color: '#30ba78' }}
        >
          Sovereignty Quiz
        </h1>
        <p className="font-orbitron text-sm md:text-base  mt-2" style={{ color: '#ffffff' }}>
          Can You Defend Digital Independence?
        </p>
      </div>

      {/* Stats row */}
      {showHighlights && (
        <div className="flex gap-4 md:gap-8 text-center screen-enter">
          <div className=" rounded-lg px-4 py-2 glass">
            <div className="font-orbitron font-bold text-lg md:text-2xl neon-green">10</div>
            <div className="text-xs opacity-60 mt-0.5">QUESTIONS</div>
          </div>
          <div className="n rounded-lg px-4 py-2 glass">
            <div className="font-orbitron font-bold text-lg md:text-2xl" style={{ color: '#ffffff' }}>20s</div>
            <div className="text-xs opacity-60 mt-0.5">PER QUESTION</div>
          </div>
          <div className="  rounded-lg px-4 py-2 glass">
            <div className="font-orbitron font-bold text-lg md:text-2xl" style={{ color: '#5fd4a0' }}>10K</div>
            <div className="text-xs opacity-60 mt-0.5">MAX SCORE</div>
          </div>
        </div>
      )}

      {/* Name input + Play */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <div>
          <label className="block font-orbitron text-xs   mb-2" style={{ color: '#ffffff' }}>
            Choose a game name
          </label>
          <input
            type="text"
            className="neon-input w-full rounded-lg px-4 py-3 font-orbitron text-sm md:text-base"
            placeholder="e.g. SovereigntyHero"
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={name.trim().length < 1}
          className="relative overflow-hidden rounded-lg px-6 py-4 font-orbitron font-bold text-sm md:text-lg  uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: name.trim().length >= 1
              ? 'linear-gradient(135deg, rgba(48,186,120,0.2), rgba(255,255,255,0.08))'
              : 'rgba(255,255,255,0.05)',
            border: '1px solid',
            borderColor: name.trim().length >= 1 ? '#30ba78' : 'rgba(255,255,255,0.15)',
            color: name.trim().length >= 1 ? '#30ba78' : 'rgba(255,255,255,0.4)',
          }}
        >
          <Zap className="inline-block mr-2 w-4 h-4" />
          Play Now
        </button>
        {name.trim().length === 0 && (
          <p className="font-orbitron text-xs text-center opacity-40">Type your name above to begin</p>
        )}
        <p className="font-orbitron text-xs text-center opacity-30">
          Your name is stored only for today's leaderboard.
        </p>
      </form>

      {/* Today's leaderboard preview */}
      {entries.length > 0 && (
        <div className="w-full max-w-sm glass rounded-xl neon-border-cyan overflow-hidden screen-enter">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <Trophy className="w-4 h-4" style={{ color: '#bd3314' }} />
            <span className="font-orbitron text-xs  " style={{ color: '#bd3314' }}>
              Today's Top Players
            </span>
          </div>
          <div className="p-3 space-y-2">
            {entries.slice(0, 5).map((entry, i) => {
              const rank = getRankTier(entry.score);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="font-orbitron font-bold text-sm w-5 text-center"
                    style={{ color: i === 0 ? '#30ba78' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#555' }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm opacity-80 truncate">{entry.player_name}</span>
                  <span className="font-orbitron font-bold text-sm" style={{ color: rank.color }}>
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
