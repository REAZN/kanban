import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

module.exports = {
  darkMode: ["class"],
  safelist: ["light", "dark"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        primary: ["var(--font-inter)", ...fontFamily.sans],
        XD: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    require("tailwindcss-themer")({
      defaultTheme: {
        extend: {
          colors: {
            border: "hsl(214 32% 91%)",
            input: "hsl(214 32% 91%)",
            ring: "hsl(215 20% 65%)",
            background: "hsl(0 0% 100%)",
            foreground: "hsl(222 47% 11%)",
            primary: {
              DEFAULT: "hsl(222 47% 11%)",
              foreground: "hsl(210 40% 98%)",
            },
            secondary: {
              DEFAULT: "hsl(210 40% 96%)",
              foreground: "hsl(222 47% 11%)",
            },
            destructive: {
              DEFAULT: "hsl(0 100% 50%)",
              foreground: "hsl(210 40% 98%)",
            },
            muted: {
              DEFAULT: "hsl(210 40% 96%)",
              foreground: "hsl(215 16% 40%)",
            },
            accent: {
              DEFAULT: "hsl(210 40% 96%)",
              foreground: "hsl(222 47% 11%)",
            },
            popover: {
              DEFAULT: "hsl(0 0% 100%)",
              foreground: "hsl(222 47% 11%)",
            },
            card: {
              DEFAULT: "hsl(0 0% 100%)",
              foreground: "hsl(222 47% 11%)",
            },
          },

        },
      },
      themes: [{
          name: "dark",
          extend: {
            colors: {
              border: "hsl(216 34% 17%)",
              input: "hsl(216 34% 17%)",
              ring: "hsl(216 34% 17%)",
              background: "hsl(224 71% 4%)",
              foreground: "hsl(213 31% 91%)",
              primary: {
                DEFAULT: "hsl(210 40% 98%)",
                foreground: "hsl(222 47% 1%)",
              },
              secondary: {
                DEFAULT: "hsl(222 47% 11%)",
                foreground: "hsl(210 40% 98%)",
              },
              destructive: {
                DEFAULT: "hsl(0 63% 31%)",
                foreground: "hsl(210 40% 98%)",
              },
              muted: {
                DEFAULT: "hsl(223 47% 11%)",
                foreground: "hsl(215 16% 40%)",
              },
              accent: {
                DEFAULT: "hsl(216 34% 17%)",
                foreground: "hsl(210 40% 98%)",
              },
              popover: {
                DEFAULT: "hsl(224 71% 4%)",
                foreground: "hsl(215 20% 65%)",
              },
              card: {
                DEFAULT: "hsl(224 71% 4%)",
                foreground: "hsl(213 31% 91%)",
              },
            },
          }
        }]
    })
  ],
} satisfies Config;
