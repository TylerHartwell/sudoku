import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      screens: {
        "no-hover-device": { "raw": "(hover: none)" },
        "max-799": { "max": "799px" },
        "hover-fine-device-max-799": {
          "raw": "(hover: hover) and (pointer: fine) and (max-width: 799px)"
        },
        "hover-fine-device": {
          "raw": "(hover: hover) and (pointer: fine)"
        }
      }
    }
  },
  plugins: []
}
export default config
