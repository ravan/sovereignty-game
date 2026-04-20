import { useEffect, useState, ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wifi } from 'lucide-react';
import { useViewportTier } from '../hooks/useViewportTier';

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
        fontSize: 'clamp(1.05rem, 1.15vw, 2rem)',
        color: 'rgba(214,240,229,0.8)',
        lineHeight: 1.5,
        minHeight: 'clamp(4.5rem, 5vw, 8rem)',
      }}
    >
      {displayed}
      <span className="typewriter-cursor">|</span>
    </p>
  );
}

export function DashboardLeftPanel({ gameUrl, slideIndicator }: DashboardLeftPanelProps) {
  const tier = useViewportTier();
  const qrSize = tier === 'xl4' ? 440 : tier === 'xl3' ? 340 : 220;
  const geekoMaxWidth = tier === 'xl4' ? '52em' : tier === 'xl3' ? '42em' : '30em';
  const logoScale = tier === 'xl4' ? 'scale-[2]' : tier === 'xl3' ? 'scale-[1.6]' : '';

  return (
    <div className="flex flex-col items-center justify-between w-[38%] p-10 3xl:p-16 4xl:p-20 border-r border-white/10">
      {/* Logo */}
      <div className="text-center">
        <div className={`flex justify-center mb-3 3xl:mb-8 4xl:mb-10 ${logoScale} origin-center transition-transform`}>

<svg xmlns="http://www.w3.org/2000/svg" width="210.389" height="38.09"><path fill="#fff" d="M194.908 31.082a5.964 5.964 0 0 1-5.958-5.957V7.466a5.966 5.966 0 0 1 5.958-5.959h13.555c1.062 0 1.926.864 1.926 1.925a1.927 1.927 0 0 1-1.926 1.924h-13.555a2.11 2.11 0 0 0-2.107 2.11v6.95h13.294c1.006 0 1.824.82 1.824 1.825a1.826 1.826 0 0 1-1.824 1.824H192.8v7.06c0 1.163.945 2.107 2.107 2.107h13.555c1.062 0 1.926.865 1.926 1.926a1.926 1.926 0 0 1-1.926 1.924zm-60.782.39c-3.91 0-6.92-.993-8.95-2.95-2.028-1.955-3.056-4.895-3.056-8.74V3.354c0-1.23 1-2.232 2.23-2.232a2.234 2.234 0 0 1 2.232 2.232v15.84c0 2.876.62 5.033 1.843 6.407 1.229 1.384 3.146 2.085 5.7 2.085s4.473-.7 5.702-2.085c1.222-1.375 1.84-3.53 1.84-6.408V3.354a2.235 2.235 0 0 1 2.234-2.232 2.234 2.234 0 0 1 2.232 2.232v16.428c0 3.843-1.03 6.783-3.06 8.74s-5.038 2.95-8.947 2.95m33.526 0c-5.033 0-8.868-1.43-11.394-4.25-.731-.817-.685-2.076.106-2.866l.008-.009.008-.008a2.11 2.11 0 0 1 1.499-.616c.599 0 1.163.255 1.55.703a8.8 8.8 0 0 0 2.396 1.966c1.547.86 3.493 1.294 5.783 1.294 2.173 0 3.907-.383 5.154-1.14 1.284-.776 1.936-1.895 1.936-3.327 0-1.158-.59-2.103-1.754-2.805-1.132-.68-3.042-1.266-5.84-1.79-2.718-.508-4.91-1.142-6.513-1.886-1.586-.734-2.751-1.65-3.464-2.73-.713-1.073-1.074-2.404-1.074-3.957 0-1.639.46-3.153 1.367-4.498.909-1.348 2.242-2.435 3.963-3.229 1.73-.798 3.778-1.202 6.088-1.202 2.7 0 5.035.494 6.94 1.47a11.9 11.9 0 0 1 3.449 2.68c.77.861.698 2.194-.163 2.971a2.105 2.105 0 0 1-3.08-.28c-.572-.744-1.216-1.35-1.917-1.8-1.296-.833-3.04-1.255-5.183-1.255-2.116 0-3.787.432-4.966 1.284-1.2.867-1.808 2-1.808 3.362 0 1.28.596 2.306 1.773 3.052 1.143.727 3.122 1.337 6.049 1.863 2.656.477 4.792 1.09 6.35 1.816 1.54.717 2.677 1.621 3.377 2.686.697 1.061 1.05 2.4 1.05 3.977 0 1.696-.488 3.207-1.45 4.491-.97 1.291-2.348 2.295-4.093 2.984-1.762.695-3.83 1.048-6.147 1.048m-66.83.008c-5.035 0-8.868-1.43-11.395-4.25-.731-.816-.684-2.075.106-2.866l.012-.012c.402-.4.936-.62 1.504-.62.6 0 1.165.256 1.549.703a8.8 8.8 0 0 0 2.395 1.966c1.548.86 3.494 1.295 5.784 1.295 2.172 0 3.906-.383 5.155-1.14 1.284-.776 1.935-1.895 1.935-3.326 0-1.16-.591-2.103-1.754-2.805-1.133-.683-3.044-1.269-5.841-1.794-2.717-.506-4.908-1.14-6.513-1.883-1.585-.735-2.752-1.654-3.464-2.73-.712-1.074-1.073-2.405-1.073-3.957 0-1.64.46-3.152 1.366-4.497.909-1.35 2.243-2.436 3.964-3.23 1.728-.797 3.776-1.202 6.088-1.202 2.7 0 5.036.495 6.94 1.47a11.9 11.9 0 0 1 3.447 2.68 2.106 2.106 0 0 1-1.571 3.511 2.1 2.1 0 0 1-1.67-.82 7.7 7.7 0 0 0-1.917-1.8c-1.297-.835-3.04-1.257-5.183-1.257-2.117 0-3.787.433-4.968 1.285-1.198.87-1.806 2.001-1.806 3.362 0 1.28.596 2.306 1.772 3.053 1.144.727 3.122 1.336 6.05 1.863 2.654.475 4.79 1.086 6.352 1.815 1.54.72 2.674 1.624 3.374 2.685.698 1.06 1.052 2.398 1.052 3.98 0 1.696-.488 3.206-1.452 4.488-.97 1.292-2.347 2.297-4.094 2.986-1.761.695-3.828 1.047-6.144 1.047"/><path fill="#30ba78" d="M71.54 11.564a1.21 1.21 0 0 0-1.737 0 1.233 1.233 0 0 0 .192 1.897c.406.27.948.27 1.353 0a1.235 1.235 0 0 0 .193-1.897m-1.59-4.179c-3.283-.769-6.233 2.182-5.462 5.464a4.57 4.57 0 0 0 3.392 3.39c3.284.772 6.236-2.18 5.463-5.465a4.58 4.58 0 0 0-3.392-3.389M48.27 25.872c-2.14-.79-2.967-.632-5.703-.594-1.896.024-1.965-.04-4.13-.04-.668 0-.914 3.204 1.505 3.87 1.059.291 2.203.475 3 1.29.353.36.55.903-.264.903h-6.006c-1.051 0-2.043.024-2.846-.656-1.213-1.025-1.78-2.435-2.386-3.834-.63-1.455-1.31-2.888-2.107-4.259-1.586-2.726-3.683-5.192-6.496-6.699-3.512-1.884-9.473-2.818-14.193.807-4.974 3.82-3.91 10.973.442 14.473 1.718 1.383 3.958 1.961 6.16 1.831 4.303-.249 7.476-3.42 6.688-7.323-.263-1.306-1.025-2.543-2.173-3.217-.816-.477-1.784-.646-2.73-.648-1.015-.003-2.096.206-2.827.913-.864.837-1.004 2.316-.313 3.301.382.546 1.004 1.007.899 1.718-.072.481-.47.84-.943.945-.807.18-1.546-.28-2.091-.842-1.398-1.44-1.836-3.732-1.066-5.587 1.006-2.429 3.804-3.765 6.43-3.678 3.388.114 6.58 2.348 7.969 5.44s.973 6.887-.941 9.685c-4.253 6.216-14.756 5.482-19.636.24-3.061-3.289-4.724-6.48-4.491-12.423.164-4.199 2.587-8.336 5.676-11.246C10.73 5.5 17.358 2.256 24.104.858a41.5 41.5 0 0 1 12.483-.63c3.667.364 7.312 1.036 10.836 2.127a43 43 0 0 1 5.135 1.957c1.468.674 3.392 1.41 4.535 2.573 0-2.108-.082-4.424-.082-6.037 0-.615.647-1.03 1.2-.768 2.386 1.107 8.036 3.776 11.803 5.5 5.05 2.306 5.407 7.75 5.583 12.575.004.108.009.22-.04.315-.158.331-1.01.241-1.321.245-.604.006-1.515.002-2.12.03-1.204.052-2.378.03-3.584-.03-2.23-.108-4.384-1.102-5.827-2.309-.144-.122-.61-.254-.83-.026-.227.235-.15.603-.026.73.828.834 1.725 1.374 2.769 1.913 1.326.681 2.772.854 4.238.94 1.57.092 3.15.068 4.718-.092 1.308-.134 1.646-.224.355.735-1.134.843-2.45 1.45-3.783 1.897-1.914.652-3.934.973-5.951 1.03a23.4 23.4 0 0 1-3.66-.189c-.627-.078-1.25-.192-1.88-.256-.511-.052-1.041-.147-1.55-.037-.463.101-.89.351-1.181.728-.4.521-.537 1.951-.306 2.571.445 1.201 1.424 1.9 2.458 2.515 1.12.666 2.593.894 2.88 2.167.059.266-2.322.273-2.592.27h-3.17s-1.721.04-2.392-.204q-.03-.01-.061-.027c-.364-.196-.522-.684-.646-1.054-.177-.52-.487-1.042-.864-1.58-.716-1.023-1.816-2.14-2.96-2.565M72.268 11.81a3.36 3.36 0 1 1-6.72.004 3.36 3.36 0 0 1 6.72-.004"/></svg>
        </div>
        <h1
          className="font-orbitron font-bold "
          style={{ fontSize: 'clamp(2.8rem, 3.2vw, 5.5rem)', color: '#30ba78', lineHeight: 1.1 }}
        >
          Sovereignty
        </h1>
        <h1
          className="font-orbitron font-bold   mb-5"
          style={{ fontSize: 'clamp(2.8rem, 3.2vw, 5.5rem)', color: '#ffffff', lineHeight: 1.1 }}
        >
          Quiz
        </h1>
        <RotatingStatement />
      </div>

      {/* QR Code — centered in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="p-4 3xl:p-6 4xl:p-8 rounded-2xl"
          style={{ background: '#fff', border: '3px solid #30ba78' }}
        >
          <QRCodeSVG value={gameUrl} size={qrSize} bgColor="#ffffff" fgColor="#0c322c" />
        </div>
        <div className="text-center mt-4 3xl:mt-8 4xl:mt-10">
          <div className="flex items-center justify-center gap-2 3xl:gap-3 4xl:gap-4 mb-1 3xl:mb-2">
            <Wifi className="w-4 h-4 3xl:w-7 3xl:h-7 4xl:w-9 4xl:h-9" style={{ color: '#30ba78' }} />
            <span className="font-orbitron text-sm 3xl:text-xl 4xl:text-2xl neon-green">Scan to Play</span>
          </div>
          <p className="font-orbitron text-xs 3xl:text-base 4xl:text-lg opacity-40">{gameUrl}</p>
        </div>
      </div>

      {/* Geeko + slide indicator — anchored at bottom */}
      <div className="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" id="svg105" version="1.1" viewBox="0 0 520.51 341.62" preserveAspectRatio="xMidYMax meet" style={{maxWidth: geekoMaxWidth}}><defs id="defs71"><linearGradient id="gp-linearGradient116"><stop id="stop116" offset="0" style={{stopColor:'#08201c',stopOpacity:.60402685}}/><stop id="stop117" offset="1" style={{stopColor:'#091b17',stopOpacity:0}}/></linearGradient><linearGradient id="gp-linearGradient108"><stop id="stop108" offset="0" style={{stopColor:'#32b678',stopOpacity:1}}/><stop id="stop109" offset="1" style={{stopColor:'#008657',stopOpacity:1}}/></linearGradient><linearGradient id="gp-linear-gradient-4" x1="306.29" x2="306.29" y1="261.57" y2="162.6" gradientUnits="userSpaceOnUse"><stop id="stop22" offset="0" stopColor="#1b6936" stopOpacity="0"/><stop id="stop23" offset=".28" stopColor="#1b6936" stopOpacity=".09"/><stop id="stop24" offset=".76" stopColor="#1b6936" stopOpacity=".35"/><stop id="stop25" offset="1" stopColor="#1b6936" stopOpacity=".5"/></linearGradient><linearGradient id="gp-linear-gradient-7" x1="268.39" x2="315.77" y1="124.6" y2="97.24" gradientTransform="translate(0 33)" gradientUnits="userSpaceOnUse"><stop id="stop33" offset="0" stopColor="#1b6936" stopOpacity="0"/><stop id="stop34" offset=".2" stopColor="#1b6936" stopOpacity=".11"/><stop id="stop35" offset=".69" stopColor="#1b6936" stopOpacity=".32"/><stop id="stop36" offset="1" stopColor="#1b6936" stopOpacity=".4"/></linearGradient><linearGradient id="gp-linear-gradient-9" x1="-1917.03" x2="-1917.03" y1="-1260.12" y2="-1250.59" gradientTransform="rotate(149.6 -969 -288.83)" gradientUnits="userSpaceOnUse"><stop id="stop48" offset="0" stopColor="#fff" stopOpacity="0"/><stop id="stop49" offset=".07" stopColor="#fff" stopOpacity=".1"/><stop id="stop50" offset=".27" stopColor="#fff" stopOpacity=".37"/><stop id="stop51" offset=".46" stopColor="#fff" stopOpacity=".59"/><stop id="stop52" offset=".63" stopColor="#fff" stopOpacity=".77"/><stop id="stop53" offset=".78" stopColor="#fff" stopOpacity=".9"/><stop id="stop54" offset=".91" stopColor="#fff" stopOpacity=".97"/><stop id="stop55" offset="1" stopColor="#fff"/></linearGradient><linearGradient id="gp-linear-gradient-10" x1="200.44" x2="235.58" y1="-1847.87" y2="-1787" gradientTransform="rotate(-30.4 3852.22 -1133.28)" gradientUnits="userSpaceOnUse"><stop id="stop56" offset="0" stopColor="#fff" stopOpacity="0"/><stop id="stop57" offset="1" stopColor="#1b6936" stopOpacity=".5"/></linearGradient><linearGradient id="gp-linear-gradient-15" x1="358.4" x2="401.46" y1="198.07" y2="198.07" gradientUnits="userSpaceOnUse"><stop id="stop70" offset="0" stopColor="#1b6936" stopOpacity=".6"/><stop id="stop71" offset="1" stopColor="#1b6936" stopOpacity="0"/></linearGradient><linearGradient href="#gp-linear-gradient-15" id="gp-linear-gradient-16" x1="394.4" x2="394.4" y1="186.78" y2="157.09" gradientTransform="translate(0 33)"/><linearGradient href="#gp-linearGradient108" id="gp-linearGradient109" x1="473.74" x2="321.91" y1="184.15" y2="233.03" gradientTransform="translate(0 33)" gradientUnits="userSpaceOnUse"/><linearGradient href="#gp-linearGradient108" id="gp-linearGradient111" x1="296.09" x2="330.23" y1="193.5" y2="252.63" gradientTransform="translate(0 33)" gradientUnits="userSpaceOnUse"/><linearGradient href="#gp-linearGradient108" id="gp-linearGradient113" x1="322.48" x2="358.4" y1="120.03" y2="187.67" gradientTransform="translate(0 33)" gradientUnits="userSpaceOnUse"/><linearGradient href="#gp-linear-gradient-4" id="gp-linearGradient114" x1="306.29" x2="306.29" y1="261.57" y2="162.6" gradientTransform="translate(0 33)" gradientUnits="userSpaceOnUse"/><linearGradient href="#gp-linear-gradient-15" id="gp-linearGradient115" x1="358.4" x2="401.46" y1="198.07" y2="198.07" gradientTransform="translate(0 33)" gradientUnits="userSpaceOnUse"/><radialGradient id="gp-radial-gradient-2" cx="199" cy="-1887.07" r="69.07" fx="199" fy="-1887.07" gradientTransform="rotate(-30.4 3791.55 -1149.78)" gradientUnits="userSpaceOnUse"><stop id="stop42" offset="0" stopColor="#a6d7ba"/><stop id="stop43" offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient><radialGradient id="gp-radial-gradient-3" cx="219.65" cy="-1860.27" r="35.58" fx="219.65" fy="-1883.94" gradientTransform="rotate(-30.4 3852.22 -1133.28)" gradientUnits="userSpaceOnUse"><stop id="stop44" offset="0" stopColor="#fff"/><stop id="stop45" offset=".56" stopColor="#fdfdfd"/><stop id="stop46" offset=".76" stopColor="#f6f6f6"/><stop id="stop47" offset=".87" stopColor="#efeeee"/></radialGradient><radialGradient href="#gp-radial-gradient-2" id="gp-radial-gradient-4" cx="214.14" cy="-1806.16" r="37.95" fx="214.14" fy="-1806.16" gradientTransform="translate(0 33)"/><radialGradient href="#gp-radial-gradient-2" id="gp-radial-gradient-5" cx="210.05" cy="141.1" r="80.89" fx="210.05" fy="141.1" gradientTransform="translate(0 33)"/><radialGradient href="#gp-radial-gradient-2" id="gp-radial-gradient-6" cx="396.13" cy="166.74" r="31.64" fx="396.13" fy="166.74" gradientTransform="translate(0 33)"/><radialGradient href="#gp-radial-gradient-2" id="gp-radialGradient114" cx="199" cy="-1887.07" r="69.07" fx="199" fy="-1887.07" gradientTransform="rotate(-30.4 3852.22 -1133.28)" gradientUnits="userSpaceOnUse"/><radialGradient href="#gp-linearGradient116" id="gp-radialGradient117" cx="260.25" cy="237.5" r="260.25" fx="260.25" fy="237.5" gradientTransform="matrix(.929 0 0 .135 18.5 257.26)" gradientUnits="userSpaceOnUse"/><clipPath id="gp-clipPath115" clipPathUnits="userSpaceOnUse"><path id="path115" d="M377.5 22.21c18.21 19.08 10 50.67-15.19 58.47a35.8 35.8 0 0 1-36.29-9.42c-18.19-19.07-9.98-50.65 15.19-58.47a35.8 35.8 0 0 1 36.28 9.41"/></clipPath><style id="style1">.cls-18{'{'}fill:#32b678{'}'}</style></defs><path id="rect116" d="M0 251.52h520.51V327H0z" style={{fill:'url(#gp-radialGradient117)',stroke:'none',strokeWidth:14.38,strokeLinejoin:'round',strokeDasharray:'none',strokeOpacity:1}}/><g id="gp-tail"><path id="path72" d="M439.05 216.57c-2.02-19.46-18.13-36.38-37.41-39.02-11.71-1.88-24.6 1.28-33.15 9.74-13.18 12.29-15.37 35.89-1.41 48.4 7.23 6.43 18.89 7.83 27.03 2.39 9.63-6.48 10.19-20.44-.39-26.37-5.52-3.03-10.44 4.59-5.35 8.35 2.31 1.59 3.18 3.44 2.05 5.88-2.79 5.29-11.15 4.06-14.58.22-6.8-7.46-4.37-21.09 3.36-27.19 5.31-4.54 12.63-5.52 19.3-4.02 10.24 2.24 18.36 10.87 19.75 21.13 2.29 14.63-6.34 29.16-19.44 34.75l-.27.1c-31.95 12.1-75.48-6.45-82.34-10.76-10.13-6.37-13.46-9.14-20.11-13.67l20.11 52.73s47.24 3.74 75.48-1.19q.84-.02 1.7-.18c28.76-4.68 49.68-32.39 45.68-61.28z" className="cls-18" style={{isolation:'isolate',fill:'url(#gp-linearGradient109)',fillOpacity:1}}/><path id="path102" d="M367.08 235.69c7.23 6.43 18.89 7.83 27.03 2.39a16.4 16.4 0 0 0 7.35-12.5c-.17.36-1.75 3.65-3.44 5.96-1.79 2.45-25.34 19.55-39.62-10.87v.02a28.4 28.4 0 0 0 8.68 14.99z" style={{isolation:'isolate',fill:'url(#gp-linearGradient115)'}}/><path id="path103" d="M386.51 190.43c-16.38 2.23-16.9 23.6-14.07 29.35-2.2-10.77 3.1-17.93 6.75-20.81 5.31-4.54 12.63-5.52 19.3-4.02a25.7 25.7 0 0 1 19.18 18.34l-.1-.81c-2.26-15.25-14.68-24.28-31.06-22.05" style={{isolation:'isolate',fill:'url(#gp-linear-gradient-16)'}}/><path id="path104" d="M401.64 177.55c-11.71-1.88-24.6 1.28-33.15 9.74-9.33 8.7-13.14 23.06-9.63 35.15.02-.16 3.81-34.32 26.53-37.95 22.76-3.64 39.88 8.5 49.3 17.39-6.41-12.72-18.86-22.38-33.04-24.33z" style={{opacity:.3,isolation:'isolate',fill:'url(#gp-radial-gradient-6)'}}/></g><path id="path74" d="M315.28 246.9c-.11-2.42.09-4.92.52-7.43a60 60 0 0 1-13.04-8.79c-4.89-4.39-26.52-23.78-46.27-31.74l-.58.53a41 41 0 0 0-1.88-1.86c-29.73-14.23-54.67-3.45-61.53-.3-6.86 3.14-57.19 44.81-19.88 79.43 15.62 5.8 105.96 2.13 112.03 2.35 14.67.53 29.34.76 43.45-.33-8.56-8.26-12.31-20.26-12.83-31.85z" className="cls-18" style={{isolation:'isolate',fill:'#025937'}}/><path id="path77" d="M281.09 242.11c4.15 1.22-2.44 20.22 0 28.6 16.16.93 19.28 14.2 19.28 14.2-32.34.73-48.04 0-48.04 0v-35.34s4.7-14.53 28.76-7.46" className="cls-18" style={{isolation:'isolate',fill:'#009762',fillOpacity:1}}/><path id="path80" d="M303.57 277.37s-22.01 12.68-13.56 15.67 14.26 0 14.26 0 13.91-1.76 23.59-1.41c0 0 0 1.94 2.82 1.94s19.54.7 19.37-2.11c-.18-2.82-6.69-8.63-14.26-17.08s-30.28-54.37-30.02-63.63-15.76-19.6-27.55-13.11-21.3 26.45-11.8 35.4 33.63 27.26 37.15 44.34z" className="cls-18" style={{isolation:'isolate'}}/><path id="path81" d="M329.48 283.15c-1.95 2.53-1.62 8.48-1.62 8.48" style={{fill:'none',stroke:'#32b678',strokeMiterlimit:10,strokeWidth:'4.14px',isolation:'isolate'}}/><path id="path82" d="M303.57 277.37s-22.01 12.68-13.56 15.67 9.85.81 14.26 0 13.91-1.76 23.59-1.41c0 0 0 1.94 2.82 1.94s19.54.7 19.37-2.11c-.18-2.82-6.69-8.63-14.26-17.08s-30.28-54.37-30.02-63.63-15.76-19.6-27.55-13.11-21.3 26.45-11.8 35.4 33.63 27.26 37.15 44.34z" style={{isolation:'isolate',mixBlendMode:'multiply',fill:'url(#gp-linearGradient114)'}}/><path id="path84" d="M296.58 113.96s-64.48-31.67-127.83 25.08S115.91 246 127.64 259.21s36.05 21.82 55.58 15.35 42.47-15.17 51.61-17.26 48.06-6.31 61.26-30.8c13.2-24.48 50.56-88.77.5-112.54z" className="cls-18" style={{isolation:'isolate',fill:'url(#gp-linearGradient111)',fillOpacity:1}}/><path id="path86" d="M296.58 113.96s-19.88-9.76-48.41-8.73c0 0 17.38 38.4 23.71 56.04 6.32 17.64 18.49 31.4 34.42 35.43q2.27.56 4.67.36c12.65-28.97 21.14-66.24-14.38-83.1z" style={{mixBlendMode:'multiply',isolation:'isolate',fill:'url(#gp-linear-gradient-7)'}}/><path id="path94" d="M179.09 242.16c5.31 22.05 18.14 42.5 19.33 46.04.84 2.52 1.92 5.83 4.4 7.16.14.07 2.31 2.36 6.74 3.14s35.75.68 35.75.68c-.05-1.31.02-1.74-.18-2.29 5.21-.07 13.85-.4 13.53-1.8-1.95-8.65-19-16.51-19-16.51s-14.26-7.16-17.28-15.32c-.57-1.53-.81-3.8-.75-6.22v-.02c.04-1.71.22-3.48.54-5.16.24-4.18 1.28-4.74.59-15.65-.8-12.52 41.65-18.18 20.61-40.33-19.4-19.4-35.06-9.35-41.04-3.9s-28.54 28.11-23.23 50.16z" className="cls-18" style={{isolation:'isolate'}}/><path id="path96" d="M119.85 275.85s6.75-69.87 29.87-70.39 12.47 30.65 11.43 43.12-4.08 20.56 1.24 21.81 13.75 7.23 13.82 14.41c-1.88 1.43-15.84 0-15.84 0s2.34 1.97 2.08 4.04-28.83 1.56-37.92 0-4.68-12.99-4.68-12.99" className="cls-18" style={{isolation:'isolate'}}/><path id="path99" d="M252.33 131.9c21.79-1.56 39.2-9.69 49-15.4a57 57 0 0 0-4.75-2.54s-64.48-31.67-127.83 25.08c-47.67 42.7-53.52 81.7-48.49 104.02 20.6-89.99 97.84-108.71 132.08-111.16z" style={{opacity:.3,isolation:'isolate',fill:'url(#gp-radial-gradient-5)'}}/><path id="path101" d="M160.36 284.79s-7.17-6.16-10.87-8.04c0 0 13.15-.74 21.33 8.67 0 0-7.18-.17-10.46-.63m84.77 12.11s-4.75-6.51-9.75-8.46c0 0 12.65.24 19.38 7.98 0 0-6.13.51-9.63.48m82.73-5.27s-.33-5.94 1.62-8.48c0 0-21.03 3.5-25.21 9.88 0 0 14.64-1.94 23.59-1.41zm-46.77-20.93c-4.95-.72-11.03-.29-18.43 2.19 0 0 4.15-11.08 18.14-3.49z" style={{fill:'#008657'}}/><g id="gp-head"><path id="path87" d="M415.06 115.62a229 229 0 0 1-31.43 19.29c-10.22 5.23-20.65 9.79-32.28 10.45-9.17.5-17.36.41-26.24-1.94a4.46 4.46 0 0 1-2.71-5.02c.58-2.41 4.24-3.36 5.69-3.11 14.51 2.42 32.97.59 48.43-7.51a299 299 0 0 0 24.29-14c3.95-2.58 10.1-6.15 14.16-8.59 2.09-1.26 8.18-4.03 7.94-6.89a5 5 0 0 0-.98-2.28c-20.32-31.81-44.28-67.09-87.45-62.64-32.22 3.31-80.87 7.68-101.33 9.67a6.62 6.62 0 0 0-5.04 9.94c6.38 10.87 16.11 26.15 24.46 40.36 27.37 45.37 29.64 117.13 74.69 103.03 4.5-2.06 9.14-3.76 13.69-5.72q13.22-5.61 25.4-13.22c13.37-8.36 25.73-18.53 36.04-30.5 7.22-8.31 13.69-17.6 18-27.77 4.9-11.57 2.97-9.62-5.32-3.54z" className="cls-18" style={{isolation:'isolate',fill:'url(#gp-linearGradient113)',fillOpacity:1}}/><path id="path89" d="M416.02 86.92c-19.13-29.05-42.46-57.56-81.54-53.54-32.22 3.31-80.87 7.68-101.33 9.67a6.62 6.62 0 0 0-5.04 9.94c3.3 5.62 7.5 12.43 11.94 19.65 27.53-13.69 73.74-29.82 111.34-28.42 29.64 1.1 39.28 25.06 64.64 42.69h.01z" style={{opacity:.3,isolation:'isolate',fill:'url(#gp-radialGradient114)'}}/><path id="path90" d="M377.5 55.21c18.21 19.08 10 50.67-15.19 58.47a35.8 35.8 0 0 1-36.29-9.42c-18.19-19.07-9.98-50.65 15.19-58.47a35.8 35.8 0 0 1 36.28 9.41" style={{isolation:'isolate',fill:'url(#gp-radial-gradient-3)',stroke:'#32b678',strokeOpacity:1}}/><g id="gp-pupil"><path id="path91" d="M349.18 73.7a10.9 10.9 0 0 1-10.26 6.03c-7-.39-11.59-7.09-9.9-13.52a10.6 10.6 0 0 1 13.17-7.75 10.86 10.86 0 0 1 7 15.24" className="cls-18" style={{isolation:'isolate'}}/><circle id="circle91" cx="337.98" cy="64.29" r="4.76" style={{isolation:'isolate',fill:'url(#gp-linear-gradient-9)'}}/></g><path id="path92" d="M342.79 128.57c-27.91-.81-20.33 11.94-20.33 11.94h.01a4 4 0 0 1-.09-2.1c.58-2.41 4.24-3.36 5.69-3.11 14.51 2.42 32.97.59 48.43-7.51a299 299 0 0 0 24.29-14c3.95-2.58 10.1-6.15 14.16-8.59 2.09-1.26 8.18-4.03 7.94-6.89a5 5 0 0 0-.98-2.28l-1.38-2.16c-11.06 7.55-52.73 35.42-77.75 34.69z" style={{isolation:'isolate',fill:'url(#gp-linear-gradient-10)'}}/><path id="gp-path93" d="M415.06 115.62a229 229 0 0 1-31.43 19.29c-10.22 5.23-20.65 9.79-32.28 10.45-9.17.5-17.36.41-26.24-1.94-.93-.25-2.17-1.4-2.63-2.92 0 0 .56 11.14 26.46 12.49 20.71 1.08 57.1-22.94 70.85-32.61.18-.42.42-.81.6-1.23 4.9-11.57 2.97-9.62-5.32-3.54z" style={{opacity:.3,isolation:'isolate',fill:'url(#gp-radial-gradient-4)'}}/><path id="gp-eyelids" d="m312.43 104.37 114.2-45.61M282.1 33.59 396.31-12" clipPath="url(#gp-clipPath115)" style={{isolation:'isolate',fill:'none',fillOpacity:1,stroke:'#30ba78',strokeWidth:14.38,strokeLinejoin:'round',strokeDasharray:'none'}} transform="translate(0 33)"/></g></svg>
        {slideIndicator && (
          <div className="mt-4 3xl:mt-8 4xl:mt-10">
            {slideIndicator}
          </div>
        )}
      </div>
    </div>
  );
}
