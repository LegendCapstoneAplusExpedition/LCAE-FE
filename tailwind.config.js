/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',
        card: '#FFFFFF',
        ink: '#282A3B',
        ink2: '#3A3D52',
        inkDeep: '#1B1D2C',
        muted: '#6B6E80',
        muted2: '#9A9DAE',
        line: '#E8E9ED',
        line2: '#F1F2F5',
        chip: '#F2F3F6',
        yellow: '#FFC900',
        yellowDeep: '#E8B600',
        yellowSoft: '#FFF4C2',
        redSoft: '#FFE9E7',
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [],
};
