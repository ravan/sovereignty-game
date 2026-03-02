import { useEffect, useMemo, useState } from 'react';
import { GameState } from '../types';
import { Question } from '../types';
import { db } from '../supabase';
import { Trophy, Target, Zap, Flame } from 'lucide-react';

interface FinalScreenProps {
  state: GameState;
  questions: Question[];
  correctCount: number;
  onLeaderboard: () => void;
  onPlayAgain: () => void;
}

const RANKS = [
  {
    min: 9500,
    color: '#30ba78',
    variants: [
      { label: 'SUSE CERTIFIED SOVEREIGN',                       desc: 'Peak digital sovereignty mastery — SUSE would hire you!' },
      { label: "LINUS TORVALDS' EMERGENCY CONTACT",              desc: "He hasn't called yet, but he could." },
      { label: "TYPES 'SUDO MAKE ME A SANDWICH' AND IT WORKS",   desc: 'The terminal bends to your will now.' },
      { label: 'THE CLOUD IS JUST YOUR SERVER FARM',             desc: 'As it should be. As it always should have been.' },
    ],
  },
  {
    min: 8000,
    color: '#fe7c3f',
    variants: [
      { label: 'DIGITAL FREEDOM MASTER',                         desc: "Outstanding knowledge. You're ready for any sovereignty pathway." },
      { label: 'COMPILES KERNEL FOR FUN, NOT PROFIT',            desc: 'Some people do sudoku. You do this.' },
      { label: 'THEIR DOTFILES HAVE BETTER DOCS THAN MOST STARTUPS', desc: 'Meticulous. Possibly a little intense.' },
      { label: 'EXPLAINS CONTAINERS TO THEIR GRANDPARENTS',      desc: "They didn't ask, but they're very proud of you." },
    ],
  },
  {
    min: 6500,
    color: '#5fd4a0',
    variants: [
      { label: 'OPEN SOURCE GUARDIAN',                           desc: 'Strong advocate for open infrastructure. Keep learning!' },
      { label: 'HAS OPINIONS ABOUT PACKAGE MANAGERS',            desc: 'Strong ones. Loud ones. Unprompted ones.' },
      { label: "FRIENDS' UNOFFICIAL IT SUPPORT SINCE FOREVER",   desc: 'You said "it depends on your distro" and they nodded.' },
      { label: 'NAMED THEIR HOME SERVER AFTER A GREEK GOD',      desc: 'Prometheus runs beautifully, by the way.' },
    ],
  },
  {
    min: 4500,
    color: '#f5c842',
    variants: [
      { label: 'SOVEREIGNTY ADVOCATE',                           desc: 'Solid grasp of the fundamentals. The journey continues.' },
      { label: 'EXPLAINS OPEN SOURCE AT DINNER PARTIES',         desc: "You've been uninvited to three BBQs. Worth it." },
      { label: 'LINUX CURIOUS (IT\'S COMPLICATED)',              desc: "The relationship status nobody asked about." },
      { label: 'CHANGED DEFAULT SEARCH ENGINE. BIG STEP.',       desc: 'Humble beginnings. Revolutionary consequences.' },
    ],
  },
  {
    min: 2500,
    color: '#fe7c3f',
    variants: [
      { label: 'DATA DEFENDER',                                  desc: "Learning the path to independence — you've made a start!" },
      { label: 'SUDO APPRENTICE',                                desc: 'With great power comes great permission errors.' },
      { label: 'INSTALLS AD BLOCKER, FEELS DANGEROUS',           desc: 'The gateway drug to digital sovereignty.' },
      { label: 'SKIMS THE PRIVACY POLICY (TOP PARAGRAPH)',       desc: 'Baby steps. Informed-ish steps, but baby steps.' },
    ],
  },
  {
    min: 0,
    color: '#8fba9e',
    variants: [
      { label: 'SOVEREIGNTY ROOKIE',                             desc: 'Every sovereign journey begins with a single question.' },
      { label: "CLICKED 'I AGREE' WITHOUT READING",              desc: 'Every sovereign journey begins with a single checkbox.' },
      { label: 'STILL GOOGLES "WHAT IS LINUX"',                  desc: 'The search history is the first thing we fix.' },
      { label: 'PROPRIETARY AND PROUD (FOR NOW)',                 desc: 'Blissful ignorance has an expiry date.' },
    ],
  },
];

function getRank(score: number) {
  const tier = RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
  const variant = tier.variants[Math.floor(Math.random() * tier.variants.length)];
  return { color: tier.color, label: variant.label, desc: variant.desc };
}

function ScoreTicker({ target }: { target: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayed(current);
      if (current >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{displayed.toLocaleString()}</>;
}

export function FinalScreen({ state, questions, correctCount, onLeaderboard, onPlayAgain }: FinalScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const rank = useMemo(() => getRank(state.score), [state.score]);
  const avgTime = state.answers.length
    ? Math.round(state.answers.reduce((sum, a) => sum + a.timeMs, 0) / state.answers.length / 100) / 10
    : 0;

  useEffect(() => {
    const t = setTimeout(async () => {
      if (submitted || submitting) return;
      setSubmitting(true);
      try {
        await db.submitScore({
          player_name: state.playerName,
          score: state.score,
          correct_answers: correctCount,
          max_streak: state.maxStreak,
        });
        setSubmitted(true);
      } catch {
        setSubmitted(true);
      } finally {
        setSubmitting(false);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-6 max-w-2xl mx-auto w-full screen-enter">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <span className="suse-pill">POWERED BY SUSE</span>
        </div>
        <p className="font-orbitron text-xs tracking-widest mb-1" style={{ color: '#fe7c3f', textShadow: '0 0 8px #fe7c3f' }}>
          GAME OVER
        </p>
        <h1 className="font-orbitron font-black uppercase" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', color: '#30ba78', textShadow: '0 0 20px #30ba78' }}>
          MISSION COMPLETE
        </h1>
      </div>

      {/* Score */}
      <div className="text-center">
        <div
          className="font-orbitron font-black"
          style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', color: rank.color, textShadow: `0 0 20px ${rank.color}, 0 0 40px ${rank.color}`, lineHeight: 1 }}
        >
          <ScoreTicker target={state.score} />
        </div>
        <div className="font-orbitron text-xs tracking-widest mt-1 opacity-50">POINTS</div>
      </div>

      {/* Rank badge */}
      <div
        className="rank-glow rounded-2xl px-6 py-4 text-center glass"
        style={{ border: `2px solid ${rank.color}`, color: rank.color }}
      >
        <div className="font-orbitron font-black text-xl md:text-2xl tracking-widest">{rank.label}</div>
        <div className="text-xs mt-1 opacity-80">{rank.desc}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="glass rounded-xl p-3 text-center neon-border-cyan">
          <Target className="w-5 h-5 mx-auto mb-1" style={{ color: '#30ba78' }} />
          <div className="font-orbitron font-bold text-lg neon-green">{correctCount}/{questions.length}</div>
          <div className="text-xs opacity-50">CORRECT</div>
        </div>
        <div className="glass rounded-xl p-3 text-center neon-border-purple">
          <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: '#fe7c3f' }} />
          <div className="font-orbitron font-bold text-lg neon-orange">{avgTime}s</div>
          <div className="text-xs opacity-50">AVG TIME</div>
        </div>
        <div className="glass rounded-xl p-3 text-center" style={{ border: '1px solid rgba(245,200,66,0.3)' }}>
          <Flame className="w-5 h-5 mx-auto mb-1 neon-yellow" />
          <div className="font-orbitron font-bold text-lg neon-yellow">{state.maxStreak}</div>
          <div className="text-xs opacity-50">BEST STREAK</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full glass rounded-xl neon-border-cyan overflow-hidden">
        <div className="px-4 py-2 border-b border-white/10">
          <span className="font-orbitron text-xs tracking-widest neon-green">ANSWER BREAKDOWN</span>
        </div>
        <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
          {state.answers.map((ans, i) => {
            const q = questions[ans.questionIndex];
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2">
                <span className="font-orbitron text-xs w-4 shrink-0" style={{ color: ans.correct ? '#30ba78' : '#e8274b' }}>
                  {ans.correct ? '✓' : '✗'}
                </span>
                <span className="flex-1 text-xs opacity-70 truncate">{q?.question ?? ''}</span>
                <span className="font-orbitron text-xs shrink-0" style={{ color: ans.correct ? '#30ba78' : '#555' }}>
                  {ans.points > 0 ? `+${ans.points}` : '0'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {submitting && (
        <p className="font-orbitron text-xs tracking-widest" style={{ color: '#fe7c3f' }}>SUBMITTING SCORE...</p>
      )}
      {submitted && (
        <p className="font-orbitron text-xs tracking-widest" style={{ color: '#30ba78', textShadow: '0 0 8px #30ba78' }}>
          ✓ SCORE RECORDED
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-4 w-full">
        <button
          onClick={onLeaderboard}
          className="flex-1 py-3 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all"
          style={{ background: 'rgba(254,124,63,0.12)', border: '1px solid rgba(254,124,63,0.5)', color: '#fe7c3f' }}
        >
          <Trophy className="inline-block w-4 h-4 mr-1" />
          RANKINGS
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all"
          style={{ background: 'rgba(48,186,120,0.15)', border: '1px solid rgba(48,186,120,0.5)', color: '#30ba78' }}
        >
          <Zap className="inline-block w-4 h-4 mr-1" />
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
