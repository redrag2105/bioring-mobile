/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx,mdx}',
    './src/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(ring|txt|btn|ui|status)-(primary|secondary|accent|background|surface|main|body|muted|inverse|disabled|border|error|success|primary-hover)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        ring: {
          primary: '#1A3642',
          secondary: '#0C1F27',
          accent: '#B69B7A',
          background: '#F8F7F5',
          surface: '#FFFFFF',
        },
        txt: {
          main: '#1E2328',
          body: '#4A525A',
          muted: '#8C939A',
          inverse: '#FFFFFF',
        },
        btn: {
          primary: '#B69B7A',
          'primary-hover': '#A08768',
          disabled: '#EAE7E1',
        },
        ui: {
          border: '#E6E4E0',
        },
        border: {
          light: '#E6E4E0',
        },
        status: {
          error: '#A85A54',
          success: '#4A6B5C',
        },
      },
      textColor: {
        btn: {
          primary: '#1E2328',
          disabled: '#A8A39C',
        },
      },
      borderColor: {
        btn: {
          secondary: '#1A3642',
        },
      },
      fontFamily: {
        serif: ['Gretha-Regular'],
        'serif-italic': ['Gretha-SemiBoldItalic'],
        'serif-medium': ['Gretha-Medium'],
        'serif-semibold': ['Gretha-Medium'],
        'serif-bold': ['Gretha-Bold'],
        sans: ['Lato'],
        'sans-bold': ['Lato-Bold', 'Lato'],
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'tab-bar': '0px 8px 24px rgba(30, 35, 40, 0.08)',
      },
    },
  },
};
