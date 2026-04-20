import { useEffect, useState } from 'react';

export type ViewportTier = 'base' | 'xl3' | 'xl4';

const BREAKPOINT_3XL = 2560;
const BREAKPOINT_4XL = 3200;

function getTier(): ViewportTier {
  if (typeof window === 'undefined') return 'base';
  const w = window.innerWidth;
  if (w >= BREAKPOINT_4XL) return 'xl4';
  if (w >= BREAKPOINT_3XL) return 'xl3';
  return 'base';
}

export function useViewportTier(): ViewportTier {
  const [tier, setTier] = useState<ViewportTier>(getTier);

  useEffect(() => {
    const onResize = () => setTier(getTier());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return tier;
}
