/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        financial: {
          dark: '#0B0F19',
          card: '#111827',
          surface: '#1E293B',
          border: '#334155',
          muted: '#94A3B8',
          accent: '#3B82F6',
          positive: '#10B981',
          negative: '#EF4444',
          warning: '#F59E0B',
          neutral: '#64748B',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
