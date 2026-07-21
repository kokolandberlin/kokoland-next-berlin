import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#134033",
          700: "#0E342C",
          900: "#0A2620",
        },
        lime: {
          DEFAULT: "#C0F252",
          300: "#D5F88C",
        },
        chili: "#F21B07",
        // Lighter red for body text on dark (forest) backgrounds — vivid
        // `chili` fails WCAG AA (2.73:1) as foreground text there; this
        // variant hits 4.57:1. Decorative/background use should keep `chili`.
        "chili-text": "#FB7D71",
        maroon: "#711101",
        cream: "#F9F1E4",
        bone: "#F9F9F9",
        teal: "#02664C",
        leaf: "#7BD348",
        rust: "#9C2704",
        gold: "#FFCA40",
        orange: "#FF7008",
      },
      fontFamily: {
        display: ['"Montserrat"', "sans-serif"],
        sans: ['"Poppins"', "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 34s linear infinite",
        "spin-slow": "spin 16s linear infinite",
        float: "float 6s ease-in-out infinite",
        sway: "sway 7s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
