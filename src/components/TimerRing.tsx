interface TimerRingProps {
  seconds: number;
  total: number;
  size?: number;
}

export function TimerRing({ seconds, total, size = 100 }: TimerRingProps) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, seconds / total);
  const offset = circumference * (1 - progress);

  // Color transitions: green → yellow → red
  const hue = Math.round(progress * 120); // 120=green, 0=red
  const color = `hsl(${hue}, 100%, 55%)`;
  const glowColor = `hsla(${hue}, 100%, 55%, 0.6)`;

  const center = size / 2;
  const isUrgent = seconds <= 5;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="timer-ring-track"
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="timer-ring-progress"
          stroke={color}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            filter: `drop-shadow(0 0 4px ${glowColor})`,
          }}
        />
      </svg>
      {/* Center number */}
      <div
        className="absolute font-orbitron font-bold"
        style={{
          fontSize: size * 0.28,
          color: color,
          textShadow: `0 0 10px ${glowColor}`,
          animation: isUrgent ? 'streakPulse 0.5s ease-in-out infinite' : 'none',
        }}
      >
        {Math.ceil(seconds)}
      </div>
    </div>
  );
}
