/**
 * DEPRECATED: This file is no longer used in Tailwind CSS v4
 * 
 * All Tailwind CSS and daisyUI configuration is now done in the CSS file:
 * assets/css/main.css
 * 
 * This file is kept for reference only and can be deleted.
 * 
 * According to daisyUI 5 docs:
 * - Tailwind CSS v4 only needs `@import "tailwindcss";` in the CSS file
 * - daisyUI is added with `@plugin "daisyui";` in the CSS file
 * - Custom themes are configured with `@plugin "daisyui/theme" { ... }` blocks
 * 
 * See: https://daisyui.com/docs/install/
 */

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
        sportclub: {
          ...require('daisyui/src/theming/themes')['light'],
          // Club branding colors - customize these for your club
          'primary': '#1e40af',          // Sports blue
          'primary-content': '#ffffff',
          'secondary': '#059669',        // Victory green
          'secondary-content': '#ffffff',
          'accent': '#f59e0b',          // Energy orange
          'accent-content': '#ffffff',
          'neutral': '#1f2937',         // Dark gray
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',        // Background
          'base-200': '#f3f4f6',        // Secondary background
          'base-300': '#e5e7eb',        // Border
          'base-content': '#1f2937',    // Text
          'info': '#3b82f6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      },
      'dark',  // Optional dark mode
    ],
    // Set default theme
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
}
