import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: "postcss",   // force PostCSS only
    postcss: "./postcss.config.js",
    lightningcss: false       // disable lightningcss fully
  }
});
