/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './assets/**/*.js'
  ],
  theme: {
    extend: {
      // Custom club branding colors can be added here
      colors: {
        // Example: 'club-primary': '#1a365d',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          // Override theme colors here for club branding
          // primary: '#1a365d',
          // secondary: '#2d3748',
        },
      },
    ],
    // Set base theme
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
}
