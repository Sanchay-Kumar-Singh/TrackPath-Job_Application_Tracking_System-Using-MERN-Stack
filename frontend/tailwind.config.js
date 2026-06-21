/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Lexend'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0B1220",
          900: "#0F172A",
          800: "#16213A",
          700: "#1E2A47",
          600: "#2B3B5E",
        },
        slate: {
          50: "#F6F8FB",
          100: "#EEF1F7",
          200: "#E1E6EF",
          300: "#C7CFDE",
          400: "#9AA6BC",
          500: "#6B7892",
          600: "#4D5872",
          700: "#384259",
          800: "#252E45",
        },
        paper: "#FAFAF8",
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#5B9CF6",
          500: "#2E6BE6",
          600: "#1E50C4",
          700: "#173E9C",
          800: "#142F73",
        },
        positive: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        negative: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
        },
        pending: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
      },
      boxShadow: {
        panel: "0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)",
        card: "0 4px 14px rgba(15, 23, 42, 0.07)",
        popover: "0 12px 32px rgba(15, 23, 42, 0.16)",
        rail: "0 2px 8px rgba(15, 23, 42, 0.05), 0 12px 28px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        xl2: "0.875rem",
      },
    },
  },
  plugins: [],
};
