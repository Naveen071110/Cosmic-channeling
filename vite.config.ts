import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Guard: only load Replit-specific plugins when running on Replit
const isReplit = !!process.env.REPL_ID;

// WGSL shader loader plugin for WebGPU shaders
function wgslPlugin() {
  return {
    name: "wgsl-loader",
    transform(code: string, id: string) {
      if (id.endsWith(".wgsl")) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: "" },
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    wgslPlugin(),
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
