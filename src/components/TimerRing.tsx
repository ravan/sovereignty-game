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

  // Green (#30ba78) when healthy, SUSE red (#bd3314) when urgent
  const isUrgent = seconds <= 5;
  const color = isUrgent ? '#bd3314' : '#30ba78';

  const center = size / 2;

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
          }}
        />
      </svg>
      {/* Center number */}
      <div
        className="absolute font-orbitron font-bold"
        style={{
          fontSize: size * 0.28,
          color: color,
          animation: isUrgent ? 'streakPulse 0.5s ease-in-out infinite' : 'none',
        }}
      >
        {Math.ceil(seconds)}
      </div>
    </div>
  );
}
