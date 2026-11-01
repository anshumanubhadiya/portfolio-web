/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050508',
          900: '#0a0a10',
          850: '#0e0e17',
          800: '#12121d',
          700: '#1a1a2a',
          600: '#26263a',
        },
        arion: {
          cyan: '#22d3ee',
          violet: '#8b5cf6',
          fuchsia: '#d946ef',
          blue: '#3b82f6',
          lime: '#a3e635',
          amber: '#fbbf24',
          rose: '#fb7185',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'aurora':
          'radial-gradient(60% 60% at 20% 20%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(50% 50% at 80% 10%, rgba(34,211,238,0.22) 0%, transparent 55%), radial-gradient(60% 60% at 60% 80%, rgba(217,70,239,0.18) 0%, transparent 60%)',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
}
