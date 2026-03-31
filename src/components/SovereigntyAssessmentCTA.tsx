import { ReactNode } from 'react';
import { Shield, ClipboardCheck, Target, TrendingUp, Lock, Monitor, FileText } from 'lucide-react';

interface SovereigntyAssessmentCTAProps {
  slideIndicator?: ReactNode;
}

const SEAL_LEVELS = [
  { level: 0, label: 'No Sovereignty', color: '#bd3314' },
  { level: 1, label: 'Jurisdictional', color: '#d4622b' },
  { level: 2, label: 'Data Sovereignty', color: '#e89a2e' },
  { level: 3, label: 'Digital Resilience', color: '#5fd4a0' },
  { level: 4, label: 'Full Digital Sovereignty', color: '#30ba78' },
];

const ASSESSMENT_AREAS = [
  { id: 'SOV-1', label: 'Strategic', pct: '13%' },
  { id: 'SOV-2', label: 'Legal', pct: '18%' },
  { id: 'SOV-3', label: 'Data & AI', pct: '18%' },
  { id: 'SOV-4', label: 'Operational', pct: '13%' },
  { id: 'SOV-5', label: 'Supply Chain', pct: '20%' },
  { id: 'SOV-6', label: 'Technology', pct: '15%' },
  { id: 'SOV-7', label: 'Security', pct: '18%' },
  { id: 'SOV-8', label: 'Environmental', pct: '5%' },
];

const STEPS = [
  { step: 1, title: 'Answer', desc: '32 questions across 8 sovereignty areas', icon: ClipboardCheck, color: '#30ba78' },
  { step: 2, title: 'Score', desc: 'See your gaps and compliance level', icon: Target, color: '#5fd4a0' },
  { step: 3, title: 'Improve', desc: 'Get SUSE solution recommendations', icon: TrendingUp, color: '#fe7c3f' },
];

export function SovereigntyAssessmentCTA({ slideIndicator }: SovereigntyAssessmentCTAProps = {}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-12 py-8 pb-14 gap-6 max-w-6xl mx-auto w-full overflow-hidden">

      {/* Header */}
      <div className="text-center stagger-1">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Shield className="w-10 h-10" style={{ color: '#30ba78' }} />
        </div>
        <h1 className="font-orbitron font-black text-4xl md:text-5xl" style={{ color: '#ffffff', lineHeight: 1.15 }}>
          Cloud Sovereignty Framework
        </h1>
        <h2 className="font-orbitron font-bold text-3xl md:text-4xl mt-1" style={{ color: '#30ba78' }}>
          Self Assessment
        </h2>
      </div>

      {/* Hero tagline */}
      <div className="text-center stagger-2">
        <p className="font-suse text-xl md:text-2xl" style={{ color: 'rgba(214,240,229,0.85)' }}>
          Identify compliance gaps and get a prioritized plan
        </p>
        <p className="font-suse text-lg md:text-xl italic mt-1" style={{ color: '#fe7c3f' }}>
          in about 10 minutes
        </p>
      </div>

      {/* 3-Step Process */}
      <div className="grid grid-cols-3 gap-6 w-full stagger-3">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="glass rounded-2xl p-6 text-center"
            style={{ border: `1px solid ${s.color}33` }}
          >
            <s.icon className="w-8 h-8 mx-auto mb-3" style={{ color: s.color }} />
            <div className="font-orbitron text-xs tracking-widest mb-1 opacity-50">STEP {s.step}</div>
            <div className="font-orbitron font-bold text-xl mb-2" style={{ color: s.color }}>{s.title}</div>
            <p className="font-suse text-sm opacity-70">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* SEAL Rating Scale */}
      <div className="w-full stagger-4">
        <h3 className="font-orbitron text-sm tracking-widest text-center mb-4 opacity-50">
          SOVEREIGNTY EFFECTIVENESS ASSURANCE LEVEL (SEAL) RATING
        </h3>
        <div className="flex gap-1 w-full h-12 rounded-xl overflow-hidden">
          {SEAL_LEVELS.map((seal) => (
            <div
              key={seal.level}
              className="flex-1 flex items-center justify-center seal-bar-fill"
              style={{
                background: seal.color,
                '--seal-width': '100%',
              } as React.CSSProperties}
            >
              <div className="text-center">
                <div className="font-orbitron font-bold text-xs" style={{ color: seal.level <= 1 ? '#fff' : '#0c322c' }}>
                  SEAL-{seal.level}
                </div>
                <div className="font-suse text-[10px] leading-tight" style={{ color: seal.level <= 1 ? 'rgba(255,255,255,0.8)' : 'rgba(12,50,44,0.7)' }}>
                  {seal.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 Assessment Areas */}
      <div className="w-full stagger-5">
        <h3 className="font-orbitron text-sm tracking-widest text-center mb-4 opacity-50">
          8 SOVEREIGNTY OBJECTIVES ALIGNED WITH THE EU CLOUD SOVEREIGNTY FRAMEWORK
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {ASSESSMENT_AREAS.map((area) => (
            <div
              key={area.id}
              className="glass rounded-xl px-4 py-3 text-center"
              style={{ border: '1px solid rgba(48,186,120,0.2)' }}
            >
              <div className="font-orbitron text-[10px] tracking-wider opacity-40 mb-1">{area.id}</div>
              <div className="font-orbitron font-bold text-sm" style={{ color: '#d6f0e5' }}>{area.label}</div>
              <div className="font-suse text-xs mt-1" style={{ color: '#5fd4a0' }}>{area.pct}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex justify-center gap-8 stagger-6">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: '#5fd4a0' }} />
          <span className="font-suse text-sm" style={{ color: '#5fd4a0' }}>No signup required</span>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4" style={{ color: '#5fd4a0' }} />
          <span className="font-suse text-sm" style={{ color: '#5fd4a0' }}>Data stays in your browser</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" style={{ color: '#5fd4a0' }} />
          <span className="font-suse text-sm" style={{ color: '#5fd4a0' }}>Instant PDF report</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="stagger-7 text-center">
        <div
          className="inline-block rounded-2xl px-10 py-4"
          style={{
            background: 'rgba(48,186,120,0.1)',
            border: '2px solid rgba(48,186,120,0.4)',
          }}
        >
          <p className="font-orbitron font-bold text-lg" style={{ color: '#30ba78' }}>
            Play the quiz and request your assessment at the end!
          </p>
        </div>
      </div>

      {/* Slide indicator — fixed bottom center on assessment page */}
      {slideIndicator && (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 rounded-full px-3 py-1" style={{ background: 'rgba(6,24,22,0.7)', backdropFilter: 'blur(4px)' }}>
          {slideIndicator}
        </div>
      )}
    </div>
  );
}
