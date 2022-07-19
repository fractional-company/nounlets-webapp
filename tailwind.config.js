module.exports = {
  safelist: process.env.NODE_ENV === 'development' ? [{ pattern: /.*/ }] : [],
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      londrina: ['Londrina Solid', 'cursive'],
      ptRootUI: ['PTRootUIWeb', 'sans-serif']
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1140px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      surface: '#121212',
      primary: '#AAED4A',
      secondary: {
        blue: '#3772FF',
        green: '#45B26B',
        red: '#EF466F',
        orange: '#FAA87A'
      },
      white: '#FFFFFF',
      black: '#060E25',
      gray: {
        DEFAULT: '#E4E6E9',
        0: '#FCFCFD',
        1: '#F4F5F6',
        2: '#E4E6E9',
        3: '#8F97A3',
        4: '#474C5C',
        5: '#1F263B'
      }
    },
    fontSize: {
      px10: '10px',
      px11: '11px',
      px12: '12px',
      px14: '14px',
      px16: '16px',
      px18: '18px',
      px20: '20px',
      px22: '22px',
      px24: '24px',
      px26: '26px',
      px28: '28px',
      px30: '30px',
      px32: '32px',
      px34: '34px',
      px36: '36px',
      px42: '42px',
      px48: '48px',
      px64: '64px'
    },
    lineHeight: {
      px10: '10px',
      px11: '11px',
      px12: '12px',
      px14: '14px',
      px16: '16px',
      px18: '18px',
      px20: '20px',
      px22: '22px',
      px24: '24px',
      px26: '26px',
      px28: '28px',
      px30: '30px',
      px32: '32px',
      px34: '34px',
      px36: '36px',
      px42: '42px',
      px48: '48px',
      px64: '64px'
    },
    fontWeight: {
      100: 100,
      200: 200,
      300: 300,
      400: 400,
      500: 500,
      600: 600,
      700: 700,
      800: 800,
      900: 900
    },
    extend: {
      borderRadius: {
        px4: '4px',
        px5: '5px',
        px6: '6px',
        px8: '8px',
        px9: '9px',
        px10: '10px',
        px11: '11px',
        px12: '12px',
        px14: '14px',
        px16: '16px',
        px18: '18px',
        px20: '20px',
        px22: '22px',
        px24: '24px',
        px26: '26px',
        px28: '28px',
        px30: '30px',
        px32: '32px',
        px34: '34px',
        px36: '36px',
        px42: '42px',
        px48: '48px',
        px64: '64px'
      }
    }
  },
  plugins: []
}
