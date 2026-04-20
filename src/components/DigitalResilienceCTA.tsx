import { ReactNode, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Globe, ShieldAlert, Bot, Leaf } from 'lucide-react';
import { useViewportTier } from '../hooks/useViewportTier';

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
  const tier = useViewportTier();
  const danglingWidth = tier === 'xl4' ? '44rem' : tier === 'xl3' ? '34rem' : '20rem';
  const sittingWidth = tier === 'xl4' ? '46rem' : tier === 'xl3' ? '36rem' : '22rem';
  const qrSize = tier === 'xl4' ? 440 : tier === 'xl3' ? 340 : 220;

  return (
    <div className="relative z-10 flex h-screen w-screen overflow-hidden">
      {/* Dangling Geeko — hangs from top-right edge */}
      <InlineSVG
        src="/geeko/geeko-dangling.svg"
        className="stagger-1 dr-dangling-geeko fixed top-0 right-0 z-20"
        style={{ width: danglingWidth }}
      />

      {/* Full-width layout — no left panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Report content */}
        <div className="flex flex-col justify-center flex-[1.1] px-12 py-8 gap-5 3xl:px-24 3xl:py-16 3xl:gap-10 4xl:px-36 4xl:py-20 4xl:gap-14 overflow-hidden">

          {/* Report header */}
          <div className="stagger-1">
            <div className="font-orbitron text-xs 3xl:text-lg 4xl:text-xl tracking-[0.3em] uppercase mb-2 3xl:mb-4" style={{ color: '#5fd4a0' }}>
              SUSE Research Report
            </div>
            <h1 className="font-orbitron font-black text-5xl 3xl:text-8xl 4xl:text-9xl leading-[1.05]" style={{ color: '#ffffff' }}>
              Navigating
            </h1>
            <h1 className="font-orbitron font-black text-5xl 3xl:text-8xl 4xl:text-9xl leading-[1.05]" style={{ color: '#30ba78' }}>
              Digital Resilience
            </h1>
            <div className="font-orbitron font-bold text-2xl 3xl:text-4xl 4xl:text-5xl mt-1 3xl:mt-3" style={{ color: 'rgba(214,240,229,0.5)' }}>
              2026
            </div>
          </div>

          {/* Survey scope */}
          <div className="stagger-2">
            <p className="font-suse text-lg 3xl:text-2xl 4xl:text-3xl" style={{ color: 'rgba(214,240,229,0.7)' }}>
              Surveying <span style={{ color: '#30ba78', fontWeight: 700 }}>309 IT leaders</span> across{' '}
              <span style={{ color: '#30ba78', fontWeight: 700 }}>5 countries</span> on digital sovereignty,
              cybersecurity, AI transparency & infrastructure strategy
            </p>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 gap-4 3xl:gap-8 4xl:gap-12 stagger-3">
            {KEY_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="glass rounded-xl px-5 py-4 3xl:px-10 3xl:py-8 4xl:px-14 4xl:py-12 flex items-start gap-4 3xl:gap-7 4xl:gap-10"
                style={{ border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-6 h-6 3xl:w-10 3xl:h-10 4xl:w-14 4xl:h-14 mt-1 3xl:mt-2 shrink-0" style={{ color: stat.color }} />
                <div>
                  <div className="font-orbitron font-black text-3xl 3xl:text-6xl 4xl:text-7xl" style={{ color: stat.color }}>
                    <AnimatedStat target={stat.value} delay={400 + i * 200} />%
                  </div>
                  <p className="font-suse text-sm 3xl:text-lg 4xl:text-xl leading-snug mt-1 3xl:mt-3" style={{ color: 'rgba(214,240,229,0.7)' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quiz connection */}
          <div className="stagger-4">
            <div
              className="rounded-xl px-6 py-4 3xl:px-12 3xl:py-8 4xl:px-16 4xl:py-10"
              style={{
                background: 'rgba(48,186,120,0.06)',
                border: '1px solid rgba(48,186,120,0.2)',
              }}
            >
              <p className="font-suse text-base 3xl:text-2xl 4xl:text-3xl" style={{ color: 'rgba(214,240,229,0.85)' }}>
                These findings shape the questions in our{' '}
                <span className="font-bold" style={{ color: '#30ba78' }}>Sovereignty Quiz</span>.
                Play the game, then dive into the full research.
              </p>
            </div>
          </div>
        </div>

        {/* Right: QR code + Geekos */}
        <div className="flex flex-col items-center justify-center w-[38%] px-8 py-8 gap-6 3xl:px-14 3xl:py-14 3xl:gap-10 4xl:px-20 4xl:py-20 4xl:gap-14 border-l border-white/10">

          {/* QR Code */}
          <div className="stagger-3 flex flex-col items-center gap-4 3xl:gap-7 mt-auto mb-auto pt-48 3xl:pt-64 4xl:pt-80">
            <div
              className="p-5 3xl:p-8 4xl:p-10 rounded-2xl"
              style={{ background: '#fff', border: '3px solid #30ba78' }}
            >
              <QRCodeSVG value={REPORT_URL} size={qrSize} bgColor="#ffffff" fgColor="#0c322c" />
            </div>
            <div className="text-center">
              <div className="font-orbitron font-bold text-lg 3xl:text-3xl 4xl:text-4xl mb-1 3xl:mb-3" style={{ color: '#30ba78' }}>
                Read the Full Report
              </div>
              <p className="font-suse text-xs 3xl:text-base 4xl:text-lg" style={{ color: 'rgba(214,240,229,0.4)' }}>
                suse.com/navigating-digital-resilience-2026
              </p>
            </div>
          </div>

          {/* Sitting Geeko — bottom decoration */}
          <InlineSVG
            src="/geeko/geeko-sitting.svg"
            className="stagger-5 mt-auto dr-sitting-geeko"
            style={{ width: sittingWidth }}
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
