import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Guard: only load Replit-specific plugins when running on Replit
const isReplit = !!process.env.REPL_ID;

export default defineConfig({
  plugins: [
    react(),
    ...(isReplit
      ? [
          (await import("@replit/vite-plugin-shadcn-theme-json")).default(),
          (await import("@replit/vite-plugin-runtime-error-modal")).runtimeErrorModal(),
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
