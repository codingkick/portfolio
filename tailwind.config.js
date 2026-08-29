/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Marble neutrals
        marble: '#f2ece0',
        'marble-veil': '#e7e0d2',
        travertine: '#d8ccb4',
        shadow: '#20242a',
        ink: '#23272c',
        'ink-soft': '#5c626a',

        // Sparingly used accents
        flame: '#ff7a28',
        gold: '#c6a35a',
        'gold-deep': '#9a7736',
        aegean: '#1f5f74',
        terracotta: '#a8432b',
        laurel: '#57694a',
      },
      fontFamily: {
        inscription: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', '"EB Garamond"', 'Georgia', 'serif'],
        text: ['"EB Garamond"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      maxWidth: {
        chamber: '720px',
      },
      letterSpacing: {
        chisel: '0.28em',
      },
      keyframes: {
        'dust-rise': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '20%': { opacity: '0.7' },
          '100%': { transform: 'translateY(-14px)', opacity: '0' },
        },
        flicker: {
          '0%,100%': { opacity: '0.85' },
          '45%': { opacity: '1' },
          '55%': { opacity: '0.7' },
          '70%': { opacity: '0.95' },
        },
      },
      animation: {
        flicker: 'flicker 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
