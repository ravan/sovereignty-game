import { useState, useEffect } from 'react';

interface CountdownScreenProps {
  onDone: () => void;
}

export function CountdownScreen({ onDone }: CountdownScreenProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 900);
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6">
      <p
        className="font-orbitron text-sm tracking-widest"
        style={{ color: '#fe7c3f', textShadow: '0 0 10px #fe7c3f' }}
      >
        GET READY, AGENT
      </p>

      <div
        key={count}
        className="countdown-num font-orbitron font-black"
        style={{
          fontSize: 'clamp(8rem, 25vw, 16rem)',
          color: count === 0 ? '#5fd4a0' : '#30ba78',
          textShadow: count === 0
            ? '0 0 20px #5fd4a0, 0 0 60px #5fd4a0'
            : '0 0 20px #30ba78, 0 0 60px #30ba78',
          lineHeight: 1,
        }}
      >
        {count === 0 ? 'GO!' : count}
      </div>

      <p
        className="font-orbitron text-xs tracking-widest opacity-60"
        style={{ color: '#30ba78' }}
      >
        CORRECT + FAST = MAX PTS • STREAK = BONUS
      </p>
    </div>
  );
}
