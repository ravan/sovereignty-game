import { useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { DisplayMode } from './DisplayMode';
import { SovereigntyAssessmentCTA } from './SovereigntyAssessmentCTA';
import { DigitalResilienceCTA } from './DigitalResilienceCTA';
import { GameSimulation } from './GameSimulation';

interface ConferenceDisplayProps {
  gameUrl: string;
}

const PAGE_CONFIG = [
  { duration: 12_000, label: 'Dashboard' },
  { duration: 10_000, label: 'Assessment' },
  { duration: 0,      label: 'Demo' },       // dynamic — GameSimulation calls onComplete
  { duration: 12_000, label: 'Report' },
];

type TransitionPhase = 'active' | 'fading-out' | 'fading-in';

export function ConferenceDisplay({ gameUrl }: ConferenceDisplayProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('active');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToPage = useCallback((nextIndex: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    // Start fade-out
    setTransitionPhase('fading-out');

    setTimeout(() => {
      // Swap page while invisible
      setCurrentPage(nextIndex);
      setTransitionPhase('fading-in');
      setProgress(0);

      // Fade back in
      setTimeout(() => {
        setTransitionPhase('active');
      }, 50); // small delay so browser picks up the fading-in class before transitioning to active
    }, 600); // match CSS transition duration
  }, []);

  const advanceToNextPage = useCallback(() => {
    goToPage((currentPage + 1) % PAGE_CONFIG.length);
  }, [goToPage, currentPage]);

  // Auto-advance timer for pages with fixed duration
  useEffect(() => {
    const config = PAGE_CONFIG[currentPage];
    if (config.duration === 0) return; // GameSimulation controls its own timing
    if (transitionPhase !== 'active') return;

    // Progress bar
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / config.duration) * 100, 100));
    }, 100);

    // Page advance timer
    timerRef.current = setTimeout(advanceToNextPage, config.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentPage, transitionPhase, advanceToNextPage]);

  // GameSimulation completion handler
  const handleDemoComplete = useCallback(() => {
    advanceToNextPage();
  }, [advanceToNextPage]);

  const transitionClass =
    transitionPhase === 'fading-out' ? 'conference-page conference-page-exit' :
    transitionPhase === 'fading-in' ? 'conference-page conference-page-enter' :
    'conference-page';

  const handleIndicatorClick = useCallback((i: number) => {
    if (i === currentPage || transitionPhase !== 'active') return;
    goToPage(i);
  }, [currentPage, transitionPhase, goToPage]);

  // Slide indicator widget — passed into the left panel
  const slideIndicator: ReactNode = (
    <div className="flex gap-2 justify-center">
      {PAGE_CONFIG.map((config, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleIndicatorClick(i)}
          aria-label={`Go to ${config.label}`}
          className="flex flex-col items-center gap-1 bg-transparent border-0 p-0 cursor-pointer"
          style={{ cursor: i === currentPage ? 'default' : 'pointer' }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{
              width: i === currentPage ? '80px' : '32px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              transition: 'width 0.3s ease',
            }}
          >
            {i === currentPage && transitionPhase === 'active' ? (
              <div
                className="h-full rounded-full"
                style={{
                  width: config.duration > 0 ? `${progress}%` : '100%',
                  background: '#30ba78',
                  transition: config.duration > 0 ? 'none' : undefined,
                }}
              />
            ) : i < currentPage || (i === currentPage && transitionPhase !== 'active') ? (
              <div className="h-full rounded-full w-full" style={{ background: 'rgba(48,186,120,0.4)' }} />
            ) : null}
          </div>
          <span
            className="font-orbitron text-center"
            style={{
              fontSize: '8px',
              color: i === currentPage ? '#30ba78' : 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s',
            }}
          >
            {config.label}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Page content */}
      <div className={transitionClass} style={{ position: 'absolute', inset: 0 }}>
        {currentPage === 0 && <DisplayMode gameUrl={gameUrl} slideIndicator={slideIndicator} conferenceMode />}
        {currentPage === 1 && <SovereigntyAssessmentCTA gameUrl={gameUrl} slideIndicator={slideIndicator} />}
        {currentPage === 2 && <GameSimulation gameUrl={gameUrl} onComplete={handleDemoComplete} slideIndicator={slideIndicator} />}
        {currentPage === 3 && <DigitalResilienceCTA slideIndicator={slideIndicator} />}
      </div>
    </div>
  );
}
