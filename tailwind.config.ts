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
            border: "hsl(240 5.9% 90%)",
            input: "hsl(240 5.9% 90%)",
            ring: "hsl(240 5% 64.9%)",
            background: "hsl(0 0% 100%)",
            foreground: "hsl(240 10% 3.9%)",
            primary: {
              DEFAULT: "hsl(240 5.9% 10%)",
              foreground: "hsl(0 0% 98%)",
            },
            secondary: {
              DEFAULT: "hsl(240 4.8% 95.9%)",
              foreground: "hsl(240 5.9% 10%)",
            },
            destructive: {
              DEFAULT: "hsl(0 84.2% 60.2%)",
              // DEFAULT: "hsl(0, 100%, 96%)",
              foreground: "hsl(0 0% 98%)",
              // foreground: "hsl(358, 65%, 36%)",
            },
            muted: {
              DEFAULT: "hsl(240 4.8% 95.9%)",
              foreground: "hsl(240 3.8% 46.1%)",
            },
            accent: {
              DEFAULT: "hsl(240 4.8% 95.9%)",
              foreground: "hsl(240 5.9% 10%)",
            },
            popover: {
              DEFAULT: "hsl(0 0% 100%)",
              foreground: "hsl(240 10% 3.9%)",
            },
            card: {
              DEFAULT: "hsl(0 0% 100%)",
              foreground: "hsl(240 10% 3.9%)",
            },
          },

        },
      },
      themes: [{
          name: "dark",
          extend: {
            colors: {
              border: "hsl(240 3.7% 15.9%)",
              input: "hsl(240 3.7% 15.9%)",
              ring: "hsl(216 34% 17%)",
              background: "hsl(240 10% 3.9%)",
              foreground: "hsl(0 0% 98%)",
              primary: {
                DEFAULT: "hsl(0 0% 98%)",
                foreground: "hsl(240 5.9% 10%)",
              },
              secondary: {
                DEFAULT: "hsl(240 3.7% 15.9%)",
                foreground: "hsl(0 0% 98%)",
              },
              destructive: {
                // DEFAULT: "hsl(0 62.8% 30.6%)",
                DEFAULT: "hsl(357, 46%, 20%)",
                // foreground: "hsl(0 85.7% 97.3%)",
                foreground: "hsl(358, 100%, 69%)",
              },
              muted: {
                DEFAULT: "hsl(240 3.7% 15.9%)",
                foreground: "hsl(240 5% 64.9%)",
              },
              accent: {
                DEFAULT: "hsl(240 3.7% 15.9%)",
                foreground: "hsl(0 0% 98%)",
              },
              popover: {
                DEFAULT: "hsl(240 10% 3.9%)",
                foreground: "hsl(0 0% 98%)",
              },
              card: {
                DEFAULT: "hsl(240 10% 3.9%)",
                foreground: "hsl(0 0% 98%)",
              },
            },
          }
        }]
    })
  ],
} satisfies Config;
