/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        suse: {
          green:  '#30ba78',
          orange: '#fe7c3f',
          dark:   '#0c322c',
          darker: '#07201b',
          light:  '#5fd4a0',
        },
        dark: {
          900: '#061a16',
          800: '#0c322c',
          700: '#0f3d34',
          600: '#154d42',
        },
      },
      fontFamily: {
        suse:    ['SUSE', 'Inter', 'system-ui', 'sans-serif'],
        display: ['SUSE', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
        'float':          'float 6s ease-in-out infinite',
        'glitch':         'glitch 3s infinite',
        'score-pop':      'scorePop 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-out-left': 'slideOutLeft 0.4s ease-in forwards',
        'shake':          'shake 0.4s ease-in-out',
        'correct-flash':  'correctFlash 0.5s ease-out',
        'countdown':      'countdown 3s steps(3, end)',
        'scanline':       'scanline 8s linear infinite',
        'ticker':         'ticker 30s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '50%':      { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-3px, 1px)', filter: 'hue-rotate(90deg)' },
          '94%': { transform: 'translate(3px, -1px)',  filter: 'hue-rotate(-90deg)' },
          '96%': { transform: 'translate(-2px, 2px)' },
          '98%': { transform: 'translate(2px, -2px)' },
        },
        scorePop: {
          '0%':   { transform: 'scale(0) translateY(0)',   opacity: '1' },
          '60%':  { transform: 'scale(1.3) translateY(-30px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(-60px)',   opacity: '0' },
        },
        slideInRight: {
          from: { transform: 'translateX(80px)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        slideOutLeft: {
          from: { transform: 'translateX(0)',    opacity: '1' },
          to:   { transform: 'translateX(-80px)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':  { transform: 'translateX(-8px)' },
          '40%':  { transform: 'translateX(8px)' },
          '60%':  { transform: 'translateX(-6px)' },
          '80%':  { transform: 'translateX(6px)' },
        },
        correctFlash: {
          '0%':   { backgroundColor: 'rgba(48, 186, 120, 0)' },
          '30%':  { backgroundColor: 'rgba(48, 186, 120, 0.3)' },
          '100%': { backgroundColor: 'rgba(48, 186, 120, 0)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
