import { ArrowUpRight, BookOpenText, Compass, Gamepad2, ShieldCheck, Globe, LucideIcon } from 'lucide-react';

interface JumpLink {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
  color: string;
  accent: string;
}

const LINKS: JumpLink[] = [
  {
    title: 'Navigating Digital Resilience 2026',
    description: 'SUSE research report — 309 IT leaders, 5 countries.',
    url: 'https://www.suse.com/navigating-digital-resilience-2026/',
    icon: BookOpenText,
    color: '#30ba78',
    accent: 'rgba(48,186,120,0.4)',
  },
  {
    title: 'Pathways to Digital Sovereignty',
    description: 'Guided path through the sovereignty journey.',
    url: 'https://demo.suse.com/share/sovereignty-guided-path',
    icon: Compass,
    color: '#5fd4a0',
    accent: 'rgba(95,212,160,0.4)',
  },
  {
    title: 'Take the Sovereignty Quiz',
    description: 'Fast-paced 16-question challenge on digital sovereignty.',
    url: 'https://sovereigntyquiz.com/',
    icon: Gamepad2,
    color: '#fe7c3f',
    accent: 'rgba(254,124,63,0.45)',
  },
  {
    title: 'Cloud Sovereignty Self Assessment',
    description: 'Find your compliance gaps in about 10 minutes.',
    url: 'https://www.suse.com/cloud-sovereignty-framework-assessment/',
    icon: ShieldCheck,
    color: '#5fd4a0',
    accent: 'rgba(95,212,160,0.4)',
  },
  {
    title: 'Explore Sovereign Solutions',
    description: 'The SUSE portfolio for digital sovereignty.',
    url: 'https://www.suse.com/solutions/digital-sovereignty/',
    icon: Globe,
    color: '#30ba78',
    accent: 'rgba(48,186,120,0.4)',
  },
];

export function JumpPage() {
  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col items-center px-6 py-14 md:py-20">
      <div className="w-full max-w-6xl flex flex-col items-center">

        <div className="stagger-1 mb-3">
          <span className="suse-pill">DIGITAL SOVEREIGNTY</span>
        </div>

        <h1 className="stagger-1 font-suse font-black text-center text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
          <span style={{ color: '#ffffff' }}>Start your </span>
          <span style={{ color: '#30ba78' }}>sovereignty</span>
          <span style={{ color: '#ffffff' }}> journey</span>
        </h1>

        <p className="stagger-2 font-suse text-center mt-5 max-w-2xl text-base md:text-lg" style={{ color: 'rgba(214,240,229,0.7)' }}>
          One hub. Every SUSE resource for understanding, assessing, and advancing your digital sovereignty posture.
        </p>

        <div className="w-full mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {LINKS.map((link, i) => {
            const Icon = link.icon;
            const staggerClass = `stagger-${Math.min(i + 3, 7)}`;
            return (
              <a
                key={link.url + i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${staggerClass} group glass rounded-2xl p-6 md:p-7 flex flex-col gap-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                style={
                  {
                    border: `1px solid ${link.accent}`,
                    boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = link.color;
                  e.currentTarget.style.boxShadow = `0 20px 50px -10px ${link.accent}, 0 0 0 1px ${link.color} inset`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = link.accent;
                  e.currentTarget.style.boxShadow = `0 1px 0 rgba(255,255,255,0.04) inset`;
                }}
              >
                <div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none"
                  style={{ background: link.color }}
                />

                <div className="flex items-start justify-between relative">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: `${link.color}1a`,
                      border: `1px solid ${link.accent}`,
                    }}
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: link.color }} />
                  </div>
                  <ArrowUpRight
                    className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 opacity-40 group-hover:opacity-100"
                    style={{ color: link.color }}
                  />
                </div>

                <div className="relative">
                  <h2 className="font-suse font-bold text-xl md:text-2xl leading-tight" style={{ color: '#ffffff' }}>
                    {link.title}
                  </h2>
                  <p className="font-suse text-sm md:text-base mt-2" style={{ color: 'rgba(214,240,229,0.65)' }}>
                    {link.description}
                  </p>
                </div>

                <div
                  className="mt-auto pt-3 border-t flex items-center justify-between text-xs md:text-sm relative font-suse tracking-wide"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="opacity-40 truncate max-w-[70%]">
                    {new URL(link.url).hostname.replace(/^www\./, '')}
                  </span>
                  <span
                    className="font-semibold transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: link.color }}
                  >
                    Visit →
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="stagger-7 mt-14 md:mt-20 flex items-center gap-3 text-xs md:text-sm font-suse tracking-[0.2em] uppercase" style={{ color: 'rgba(214,240,229,0.35)' }}>
          <div className="h-px w-12" style={{ background: 'rgba(214,240,229,0.2)' }} />
          <span>Powered by SUSE</span>
          <div className="h-px w-12" style={{ background: 'rgba(214,240,229,0.2)' }} />
        </div>
      </div>
    </div>
  );
}
