import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#10B981",
          50: "#6EE7B7",
          100: "#A7F3D0", 
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          900: "#064E3B"
        }
      },
    },
  },
  plugins: [],
};
export default config;
