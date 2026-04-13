import { ReactNode, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Globe, ShieldAlert, Bot, Leaf } from 'lucide-react';

interface DigitalResilienceCTAProps {
  slideIndicator?: ReactNode;
}

const REPORT_URL = 'https://suse.com/navigating-digital-resilience-2026';

function InlineSVG({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch(src)
      .then((r) => r.text())
      .then(setHtml)
      .catch(() => {});
  }, [src]);

  return (
    <div
      className={className}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const KEY_STATS = [
  { value: 98, label: 'prioritize digital sovereignty today', icon: Globe, color: '#30ba78' },
  { value: 94, label: 'say open source is critical to resilience', icon: Leaf, color: '#5fd4a0' },
  { value: 51, label: 'confirm a foreign entity data breach', icon: ShieldAlert, color: '#fe7c3f' },
  { value: 64, label: 'say AI transparency drives resilience', icon: Bot, color: '#d6f0e5' },
];

function AnimatedStat({ target, delay }: { target: number; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1400;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return <>{count}</>;
}

export function DigitalResilienceCTA({ slideIndicator }: DigitalResilienceCTAProps) {
  return (
    <div className="relative z-10 flex h-screen w-screen overflow-hidden">
      {/* Full-width layout — no left panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Report content */}
        <div className="flex flex-col justify-center flex-[1.1] px-12 py-8 gap-5 overflow-hidden">

          {/* Report header */}
          <div className="stagger-1">
            <div className="font-orbitron text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#5fd4a0' }}>
              SUSE Research Report
            </div>
            <h1 className="font-orbitron font-black text-5xl leading-[1.05]" style={{ color: '#ffffff' }}>
              Navigating
            </h1>
            <h1 className="font-orbitron font-black text-5xl leading-[1.05]" style={{ color: '#30ba78' }}>
              Digital Resilience
            </h1>
            <div className="font-orbitron font-bold text-2xl mt-1" style={{ color: 'rgba(214,240,229,0.5)' }}>
              2026
            </div>
          </div>

          {/* Survey scope */}
          <div className="stagger-2">
            <p className="font-suse text-lg" style={{ color: 'rgba(214,240,229,0.7)' }}>
              Surveying <span style={{ color: '#30ba78', fontWeight: 700 }}>309 IT leaders</span> across{' '}
              <span style={{ color: '#30ba78', fontWeight: 700 }}>5 countries</span> on digital sovereignty,
              cybersecurity, AI transparency & infrastructure strategy
            </p>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 gap-4 stagger-3">
            {KEY_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="glass rounded-xl px-5 py-4 flex items-start gap-4"
                style={{ border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-6 h-6 mt-1 shrink-0" style={{ color: stat.color }} />
                <div>
                  <div className="font-orbitron font-black text-3xl" style={{ color: stat.color }}>
                    <AnimatedStat target={stat.value} delay={400 + i * 200} />%
                  </div>
                  <p className="font-suse text-sm leading-snug mt-1" style={{ color: 'rgba(214,240,229,0.7)' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quiz connection */}
          <div className="stagger-4">
            <div
              className="rounded-xl px-6 py-4"
              style={{
                background: 'rgba(48,186,120,0.06)',
                border: '1px solid rgba(48,186,120,0.2)',
              }}
            >
              <p className="font-suse text-base" style={{ color: 'rgba(214,240,229,0.85)' }}>
                These findings shape the questions in our{' '}
                <span className="font-bold" style={{ color: '#30ba78' }}>Sovereignty Quiz</span>.
                Play the game, then dive into the full research.
              </p>
            </div>
          </div>
        </div>

        {/* Right: QR code + Geekos */}
        <div className="flex flex-col items-center justify-center w-[38%] px-8 py-8 gap-6 border-l border-white/10">

          {/* Dangling Geeko — top decoration */}
          <InlineSVG
            src="/geeko/geeko-dangling.svg"
            className="stagger-1 dr-dangling-geeko"
            style={{ width: '14rem', marginTop: '-0.5rem' }}
          />

          {/* QR Code */}
          <div className="stagger-3 flex flex-col items-center gap-4">
            <div
              className="p-5 rounded-2xl"
              style={{ background: '#fff', border: '3px solid #30ba78' }}
            >
              <QRCodeSVG value={REPORT_URL} size={220} bgColor="#ffffff" fgColor="#0c322c" />
            </div>
            <div className="text-center">
              <div className="font-orbitron font-bold text-lg mb-1" style={{ color: '#30ba78' }}>
                Read the Full Report
              </div>
              <p className="font-suse text-xs" style={{ color: 'rgba(214,240,229,0.4)' }}>
                suse.com/navigating-digital-resilience-2026
              </p>
            </div>
          </div>

          {/* Sitting Geeko — bottom decoration */}
          <InlineSVG
            src="/geeko/geeko-sitting.svg"
            className="stagger-5 mt-auto dr-sitting-geeko"
            style={{ width: '22rem' }}
          />

          {/* Slide indicator */}
          {slideIndicator && (
            <div className="stagger-6">
              {slideIndicator}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
