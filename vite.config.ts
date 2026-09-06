import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // "@data/profile.json" resolves to the canonical data folder at the repo root.
    alias: { "@data": fileURLToPath(new URL("./data", import.meta.url)) },
  },
  server: { port: 3000 },
});
