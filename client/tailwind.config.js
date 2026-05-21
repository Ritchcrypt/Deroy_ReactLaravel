/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "oklch(var(--bg-dark))",
        "bg-main": "oklch(var(--bg-main))",
        "bg-light": "oklch(var(--bg-light))",

        text: "oklch(var(--text))",
        "text-muted": "oklch(var(--text-muted))",

        border: "oklch(var(--border))",
        "border-muted": "oklch(var(--border-muted))",

        primary: "oklch(var(--primary))",
        secondary: "oklch(var(--secondary))",

        danger: "oklch(var(--danger))",
        warning: "oklch(var(--warning))",
        success: "oklch(var(--success))",
        info: "oklch(var(--info))",
      },
    },
  },
  plugins: [],
};