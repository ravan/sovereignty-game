import { useEffect, useState, ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wifi } from 'lucide-react';

interface DashboardLeftPanelProps {
  gameUrl: string;
  slideIndicator?: ReactNode;
}

const STATEMENTS = [
  "Somewhere, an algorithm knows you better than your mum does.",
  "Your playlist knows things your therapist doesn't.",
  "The terms & conditions you skipped were... interesting.",
  "Page 47 of the T&Cs was the important one.",
  "Is it YOUR cloud — or just someone else's server?",
  "The cloud has a landlord. Spoiler: it's not you.",
  "Cloud storage: your data, their rules.",
  "Your attention was sold before you finished reading this.",
  "In another tab, your data is being sold. Right now.",
  "Your whole enterprise runs on someone else's subscription.",
  "Your software vendor audited you last quarter. You didn't notice.",
  "The vendor's roadmap is your roadmap. Was that the plan?",
];

type TypePhase = 'typing' | 'holding' | 'deleting';

function RotatingStatement() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<TypePhase>('typing');

  useEffect(() => {
    const target = STATEMENTS[idx];

    if (phase === 'typing') {
      if (displayed.length >= target.length) {
        setPhase('holding');
        return;
      }
      const id = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 45);
      return () => clearTimeout(id);
    }

    if (phase === 'holding') {
      const id = setTimeout(() => setPhase('deleting'), 20000);
      return () => clearTimeout(id);
    }

    if (phase === 'deleting') {
      if (displayed.length === 0) {
        setIdx((i) => (i + 1) % STATEMENTS.length);
        setPhase('typing');
        return;
      }
      const id = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 20);
      return () => clearTimeout(id);
    }
  }, [phase, displayed, idx]);

  return (
    <p
      className="font-orbitron"
      style={{
        fontSize: '1.05rem',
        color: 'rgba(214,240,229,0.8)',
        lineHeight: 1.5,
        minHeight: '4.5rem',
      }}
    >
      {displayed}
      <span className="typewriter-cursor">|</span>
    </p>
  );
}

export function DashboardLeftPanel({ gameUrl, slideIndicator }: DashboardLeftPanelProps) {
  return (
    <div className="flex flex-col items-center justify-between w-[38%] p-10 border-r border-white/10">
      {/* Logo */}
      <div className="text-center">
        <div className="flex justify-center mb-3">

<svg xmlns="http://www.w3.org/2000/svg" width="210.389" height="38.09"><path fill="#fff" d="M194.908 31.082a5.964 5.964 0 0 1-5.958-5.957V7.466a5.966 5.966 0 0 1 5.958-5.959h13.555c1.062 0 1.926.864 1.926 1.925a1.927 1.927 0 0 1-1.926 1.924h-13.555a2.11 2.11 0 0 0-2.107 2.11v6.95h13.294c1.006 0 1.824.82 1.824 1.825a1.826 1.826 0 0 1-1.824 1.824H192.8v7.06c0 1.163.945 2.107 2.107 2.107h13.555c1.062 0 1.926.865 1.926 1.926a1.926 1.926 0 0 1-1.926 1.924zm-60.782.39c-3.91 0-6.92-.993-8.95-2.95-2.028-1.955-3.056-4.895-3.056-8.74V3.354c0-1.23 1-2.232 2.23-2.232a2.234 2.234 0 0 1 2.232 2.232v15.84c0 2.876.62 5.033 1.843 6.407 1.229 1.384 3.146 2.085 5.7 2.085s4.473-.7 5.702-2.085c1.222-1.375 1.84-3.53 1.84-6.408V3.354a2.235 2.235 0 0 1 2.234-2.232 2.234 2.234 0 0 1 2.232 2.232v16.428c0 3.843-1.03 6.783-3.06 8.74s-5.038 2.95-8.947 2.95m33.526 0c-5.033 0-8.868-1.43-11.394-4.25-.731-.817-.685-2.076.106-2.866l.008-.009.008-.008a2.11 2.11 0 0 1 1.499-.616c.599 0 1.163.255 1.55.703a8.8 8.8 0 0 0 2.396 1.966c1.547.86 3.493 1.294 5.783 1.294 2.173 0 3.907-.383 5.154-1.14 1.284-.776 1.936-1.895 1.936-3.327 0-1.158-.59-2.103-1.754-2.805-1.132-.68-3.042-1.266-5.84-1.79-2.718-.508-4.91-1.142-6.513-1.886-1.586-.734-2.751-1.65-3.464-2.73-.713-1.073-1.074-2.404-1.074-3.957 0-1.639.46-3.153 1.367-4.498.909-1.348 2.242-2.435 3.963-3.229 1.73-.798 3.778-1.202 6.088-1.202 2.7 0 5.035.494 6.94 1.47a11.9 11.9 0 0 1 3.449 2.68c.77.861.698 2.194-.163 2.971a2.105 2.105 0 0 1-3.08-.28c-.572-.744-1.216-1.35-1.917-1.8-1.296-.833-3.04-1.255-5.183-1.255-2.116 0-3.787.432-4.966 1.284-1.2.867-1.808 2-1.808 3.362 0 1.28.596 2.306 1.773 3.052 1.143.727 3.122 1.337 6.049 1.863 2.656.477 4.792 1.09 6.35 1.816 1.54.717 2.677 1.621 3.377 2.686.697 1.061 1.05 2.4 1.05 3.977 0 1.696-.488 3.207-1.45 4.491-.97 1.291-2.348 2.295-4.093 2.984-1.762.695-3.83 1.048-6.147 1.048m-66.83.008c-5.035 0-8.868-1.43-11.395-4.25-.731-.816-.684-2.075.106-2.866l.012-.012c.402-.4.936-.62 1.504-.62.6 0 1.165.256 1.549.703a8.8 8.8 0 0 0 2.395 1.966c1.548.86 3.494 1.295 5.784 1.295 2.172 0 3.906-.383 5.155-1.14 1.284-.776 1.935-1.895 1.935-3.326 0-1.16-.591-2.103-1.754-2.805-1.133-.683-3.044-1.269-5.841-1.794-2.717-.506-4.908-1.14-6.513-1.883-1.585-.735-2.752-1.654-3.464-2.73-.712-1.074-1.073-2.405-1.073-3.957 0-1.64.46-3.152 1.366-4.497.909-1.35 2.243-2.436 3.964-3.23 1.728-.797 3.776-1.202 6.088-1.202 2.7 0 5.036.495 6.94 1.47a11.9 11.9 0 0 1 3.447 2.68 2.106 2.106 0 0 1-1.571 3.511 2.1 2.1 0 0 1-1.67-.82 7.7 7.7 0 0 0-1.917-1.8c-1.297-.835-3.04-1.257-5.183-1.257-2.117 0-3.787.433-4.968 1.285-1.198.87-1.806 2.001-1.806 3.362 0 1.28.596 2.306 1.772 3.053 1.144.727 3.122 1.336 6.05 1.863 2.654.475 4.79 1.086 6.352 1.815 1.54.72 2.674 1.624 3.374 2.685.698 1.06 1.052 2.398 1.052 3.98 0 1.696-.488 3.206-1.452 4.488-.97 1.292-2.347 2.297-4.094 2.986-1.761.695-3.828 1.047-6.144 1.047"/><path fill="#30ba78" d="M71.54 11.564a1.21 1.21 0 0 0-1.737 0 1.233 1.233 0 0 0 .192 1.897c.406.27.948.27 1.353 0a1.235 1.235 0 0 0 .193-1.897m-1.59-4.179c-3.283-.769-6.233 2.182-5.462 5.464a4.57 4.57 0 0 0 3.392 3.39c3.284.772 6.236-2.18 5.463-5.465a4.58 4.58 0 0 0-3.392-3.389M48.27 25.872c-2.14-.79-2.967-.632-5.703-.594-1.896.024-1.965-.04-4.13-.04-.668 0-.914 3.204 1.505 3.87 1.059.291 2.203.475 3 1.29.353.36.55.903-.264.903h-6.006c-1.051 0-2.043.024-2.846-.656-1.213-1.025-1.78-2.435-2.386-3.834-.63-1.455-1.31-2.888-2.107-4.259-1.586-2.726-3.683-5.192-6.496-6.699-3.512-1.884-9.473-2.818-14.193.807-4.974 3.82-3.91 10.973.442 14.473 1.718 1.383 3.958 1.961 6.16 1.831 4.303-.249 7.476-3.42 6.688-7.323-.263-1.306-1.025-2.543-2.173-3.217-.816-.477-1.784-.646-2.73-.648-1.015-.003-2.096.206-2.827.913-.864.837-1.004 2.316-.313 3.301.382.546 1.004 1.007.899 1.718-.072.481-.47.84-.943.945-.807.18-1.546-.28-2.091-.842-1.398-1.44-1.836-3.732-1.066-5.587 1.006-2.429 3.804-3.765 6.43-3.678 3.388.114 6.58 2.348 7.969 5.44s.973 6.887-.941 9.685c-4.253 6.216-14.756 5.482-19.636.24-3.061-3.289-4.724-6.48-4.491-12.423.164-4.199 2.587-8.336 5.676-11.246C10.73 5.5 17.358 2.256 24.104.858a41.5 41.5 0 0 1 12.483-.63c3.667.364 7.312 1.036 10.836 2.127a43 43 0 0 1 5.135 1.957c1.468.674 3.392 1.41 4.535 2.573 0-2.108-.082-4.424-.082-6.037 0-.615.647-1.03 1.2-.768 2.386 1.107 8.036 3.776 11.803 5.5 5.05 2.306 5.407 7.75 5.583 12.575.004.108.009.22-.04.315-.158.331-1.01.241-1.321.245-.604.006-1.515.002-2.12.03-1.204.052-2.378.03-3.584-.03-2.23-.108-4.384-1.102-5.827-2.309-.144-.122-.61-.254-.83-.026-.227.235-.15.603-.026.73.828.834 1.725 1.374 2.769 1.913 1.326.681 2.772.854 4.238.94 1.57.092 3.15.068 4.718-.092 1.308-.134 1.646-.224.355.735-1.134.843-2.45 1.45-3.783 1.897-1.914.652-3.934.973-5.951 1.03a23.4 23.4 0 0 1-3.66-.189c-.627-.078-1.25-.192-1.88-.256-.511-.052-1.041-.147-1.55-.037-.463.101-.89.351-1.181.728-.4.521-.537 1.951-.306 2.571.445 1.201 1.424 1.9 2.458 2.515 1.12.666 2.593.894 2.88 2.167.059.266-2.322.273-2.592.27h-3.17s-1.721.04-2.392-.204q-.03-.01-.061-.027c-.364-.196-.522-.684-.646-1.054-.177-.52-.487-1.042-.864-1.58-.716-1.023-1.816-2.14-2.96-2.565M72.268 11.81a3.36 3.36 0 1 1-6.72.004 3.36 3.36 0 0 1 6.72-.004"/></svg>
        </div>
        <h1
          className="font-orbitron font-bold "
          style={{ fontSize: '2.8rem', color: '#30ba78', lineHeight: 1.1 }}
        >
          Sovereignty
        </h1>
        <h1
          className="font-orbitron font-bold   mb-5"
          style={{ fontSize: '2.8rem', color: '#ffffff', lineHeight: 1.1 }}
        >
          Quiz
        </h1>
        <RotatingStatement />
      </div>

      {/* QR Code — centered in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="p-4 rounded-2xl"
          style={{ background: '#fff', border: '3px solid #30ba78' }}
        >
          <QRCodeSVG value={gameUrl} size={220} bgColor="#ffffff" fgColor="#0c322c" />
        </div>
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Wifi className="w-4 h-4" style={{ color: '#30ba78' }} />
            <span className="font-orbitron text-sm   neon-green">Scan to Play</span>
          </div>
          <p className="font-orbitron text-xs opacity-40">{gameUrl}</p>
        </div>
      </div>

      {/* Geeko + slide indicator — anchored at bottom */}
      <div className="flex flex-col items-center">
        <img src="/dashboard-geeko.svg" alt="geeko looking" style={{maxWidth: '30em'}} />
        {slideIndicator && (
          <div className="mt-4">
            {slideIndicator}
          </div>
        )}
      </div>
    </div>
  );
}
