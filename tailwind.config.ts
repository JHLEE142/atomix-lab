import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#080a12",
          900: "#0d1220",
          850: "#121a2a",
          800: "#172133"
        },
        plasma: "#67e8f9",
        coral: "#fb7185",
        ion: "#a7f3d0",
        proton: "#fda4af",
        neutron: "#93c5fd"
      },
      boxShadow: {
        panel: "0 22px 70px rgba(0, 0, 0, 0.35)",
        glow: "0 0 32px rgba(103, 232, 249, 0.26)"
      }
    }
  },
  plugins: []
} satisfies Config;
