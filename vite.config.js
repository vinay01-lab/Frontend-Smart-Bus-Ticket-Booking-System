import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    lightningcss: false // FIXES THE TAILWIND @ RULE ERROR
  },
  build: {
    outDir: "dist"
  }
});
