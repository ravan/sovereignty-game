import { useEffect, useMemo, useState } from 'react';
import { GameState } from '../types';
import { Question } from '../types';
import { db } from '../supabase';
import { Trophy, Target, Zap, Flame, MessageSquare } from 'lucide-react';
import { ContactExpertModal, ContactFormData } from './ContactExpertModal';
import { MarketoFormData, MARKETO_FORM_ID } from '../hooks/useMarketo';

interface FinalScreenProps {
  state: GameState;
  questions: Question[];
  correctCount: number;
  onLeaderboard: () => void;
  onPlayAgain: () => void;
  isMarketoReady: boolean;
  submitMarketoForm: (data: MarketoFormData) => Promise<boolean>;
}

const RANKS = [
  {
    min: 9500,
    color: '#30ba78',
    variants: [
      { label: 'SUSE Certified Sovereign',                         desc: 'Peak digital sovereignty mastery — SUSE would hire you!' },
      { label: "Linus Torvalds' Emergency Contact",                desc: "He hasn't called yet, but he could." },
      { label: "Types 'sudo make me a sandwich' and it works",     desc: 'The terminal bends to your will now.' },
      { label: 'The Cloud Is Just Your Server Farm',               desc: 'As it should be. As it always should have been.' },
    ],
  },
  {
    min: 8000,
    color: '#ffffff',
    variants: [
      { label: 'Digital Freedom Master',                           desc: "Outstanding knowledge. You're ready for any sovereignty pathway." },
      { label: 'Compiles Kernel for Fun, Not Profit',              desc: 'Some people do sudoku. You do this.' },
      { label: 'Their Dotfiles Have Better Docs Than Most Startups', desc: 'Meticulous. Possibly a little intense.' },
      { label: 'Explains Containers to Their Grandparents',        desc: "They didn't ask, but they're very proud of you." },
    ],
  },
  {
    min: 6500,
    color: '#5fd4a0',
    variants: [
      { label: 'Open Source Guardian',                             desc: 'Strong advocate for open infrastructure. Keep learning!' },
      { label: 'Has Opinions About Package Managers',              desc: 'Strong ones. Loud ones. Unprompted ones.' },
      { label: "Friends' Unofficial IT Support Since Forever",     desc: 'You said "it depends on your distro" and they nodded.' },
      { label: 'Named Their Home Server After a Greek God',        desc: 'Prometheus runs beautifully, by the way.' },
    ],
  },
  {
    min: 4500,
    color: '#bd3314',
    variants: [
      { label: 'Sovereignty Advocate',                             desc: 'Solid grasp of the fundamentals. The journey continues.' },
      { label: 'Explains Open Source at Dinner Parties',           desc: "You've been uninvited to three BBQs. Worth it." },
      { label: "Linux Curious (It's Complicated)",                 desc: "The relationship status nobody asked about." },
      { label: 'Changed Default Search Engine. Big Step.',         desc: 'Humble beginnings. Revolutionary consequences.' },
    ],
  },
  {
    min: 2500,
    color: '#ffffff',
    variants: [
      { label: 'Data Defender',                                    desc: "Learning the path to independence — you've made a start!" },
      { label: 'Sudo Apprentice',                                  desc: 'With great power comes great permission errors.' },
      { label: 'Installs Ad Blocker, Feels Dangerous',             desc: 'The gateway drug to digital sovereignty.' },
      { label: 'Skims the Privacy Policy (Top Paragraph)',         desc: 'Baby steps. Informed-ish steps, but baby steps.' },
    ],
  },
  {
    min: 0,
    color: '#8fba9e',
    variants: [
      { label: 'Sovereignty Rookie',                               desc: 'Every sovereign journey begins with a single question.' },
      { label: "Clicked 'I Agree' Without Reading",                desc: 'Every sovereign journey begins with a single checkbox.' },
      { label: 'Still Googles "What Is Linux"',                    desc: 'The search history is the first thing we fix.' },
      { label: 'Proprietary and Proud (For Now)',                  desc: 'Blissful ignorance has an expiry date.' },
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

export function FinalScreen({ state, questions, correctCount, onLeaderboard, onPlayAgain, isMarketoReady, submitMarketoForm }: FinalScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (data: ContactFormData) => {
    setShowContactModal(false);
    setContactSubmitted(true);

    if (isMarketoReady) {
      const marketoData: MarketoFormData = {
        Email: data.email,
        FirstName: data.firstName,
        LastName: data.lastName,
        Phone: data.phone,
        Company: data.company,
        Country: data.country,
        State: data.state || undefined,
        optin: data.optin,
        customCampaignInput: import.meta.env.VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT || undefined,
      };
      submitMarketoForm(marketoData).then((success) => {
        console.log('[Marketo]', success ? 'submitted' : 'failed');
      });
    }
  };
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
          <span className="suse-pill">Powered by SUSE</span>
        </div>
        <p className="font-orbitron text-xs tracking-widest mb-1" style={{ color: '#ffffff' }}>
          Game Over
        </p>
        <h1 className="font-orbitron font-black" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', color: '#30ba78' }}>
          Mission Complete
        </h1>
      </div>

      {/* Score */}
      <div className="text-center">
        <div
          className="font-orbitron font-black"
          style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', color: rank.color, lineHeight: 1 }}
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
          <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: '#ffffff' }} />
          <div className="font-orbitron font-bold text-lg" style={{ color: '#ffffff' }}>{avgTime}s</div>
          <div className="text-xs opacity-50">AVG TIME</div>
        </div>
        <div className="glass rounded-xl p-3 text-center" style={{ border: '1px solid rgba(189,51,20,0.3)' }}>
          <Flame className="w-5 h-5 mx-auto mb-1" style={{ color: '#bd3314' }} />
          <div className="font-orbitron font-bold text-lg" style={{ color: '#bd3314' }}>{state.maxStreak}</div>
          <div className="text-xs opacity-50">BEST STREAK</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full glass rounded-xl neon-border-cyan overflow-hidden">
        <div className="px-4 py-2 border-b border-white/10">
          <span className="font-orbitron text-xs tracking-widest neon-green">Answer Breakdown</span>
        </div>
        <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
          {state.answers.map((ans, i) => {
            const q = questions[ans.questionIndex];
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2">
                <span className="font-orbitron text-xs w-4 shrink-0" style={{ color: ans.correct ? '#30ba78' : '#bd3314' }}>
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
        <p className="font-orbitron text-xs tracking-widest" style={{ color: '#ffffff' }}>Submitting score...</p>
      )}
      {submitted && (
        <p className="font-orbitron text-xs tracking-widest" style={{ color: '#30ba78' }}>
          ✓ Score Recorded
        </p>
      )}

      {/* Talk to Expert CTA */}
      {!contactSubmitted ? (
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full py-3.5 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: 'rgba(48,186,120,0.15)',
            border: '2px solid rgba(48,186,120,0.5)',
            color: '#30ba78',
          }}
        >
          <MessageSquare className="w-5 h-5" />
          Talk to an Expert
        </button>
      ) : (
        <p className="font-orbitron text-xs tracking-widest" style={{ color: '#30ba78' }}>
          ✓ Request Sent
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-4 w-full">
        <button
          onClick={onLeaderboard}
          className="flex-1 py-3 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}
        >
          <Trophy className="inline-block w-4 h-4 mr-1" />
          Rankings
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all"
          style={{ background: 'rgba(48,186,120,0.15)', border: '1px solid rgba(48,186,120,0.5)', color: '#30ba78' }}
        >
          <Zap className="inline-block w-4 h-4 mr-1" />
          Play Again
        </button>
      </div>

      <ContactExpertModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactSubmit}
      />

      {/* Hidden Marketo form element */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <form id={`mktoForm_${MARKETO_FORM_ID}`}></form>
      </div>
    </div>
  );
}
