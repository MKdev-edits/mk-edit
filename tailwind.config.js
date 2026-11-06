/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // BRAND — new canonical names. Use these going forward.
        // ============================================================
        brand: {
          DEFAULT: "#8b5cf6",       // primary accent (matches oklch(0.68 0.21 275))
          muted: "#7c3aed",         // deeper hover state
          soft: "rgba(139, 92, 246, 0.15)",  // for badge/tint backgrounds
          glow: "rgba(139, 92, 246, 0.35)",  // for glows
        },

        // ============================================================
        // LEGACY ALIASES
        // Same violet values, so existing classes keep working without
        // touching a single component. Delete these once you've renamed
        // every usage to `brand`.
        // ============================================================
        'supabase-green': '#8b5cf6',
        'supabase-dark': '#0A0A0A',
      },

      fontFamily: {
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },

      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};