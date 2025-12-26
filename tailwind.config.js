/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // ResXperience Design System Colors
        'midnight-slate': '#1E293B',
        'electric-emerald': '#10B981',
        'soft-white': '#F8FAFC',
        'alert-amber': '#F59E0B',
        'system-blue': '#3B82F6',
        'ember-red': '#EF4444',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

