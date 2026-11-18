import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const visionFiles = [
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_module_internal.js",
  "vision_wasm_module_internal.wasm",
];
const visionSource = join(process.cwd(), "node_modules", "@mediapipe", "tasks-vision", "wasm");

function serveVisionRuntime(): Plugin {
  return {
    name: "dualmind-local-vision-runtime",
    configureServer(server) {
      server.middlewares.use("/mediapipe", async (req, res, next) => {
        const name = decodeURIComponent((req.url || "").split("?")[0]).replace(/^\/+/, "");
        if (!visionFiles.includes(name)) return next();
        try {
          const content = await readFile(join(visionSource, name));
          res.setHeader("Content-Type", name.endsWith(".wasm") ? "application/wasm" : "text/javascript; charset=utf-8");
          res.end(content);
        } catch { next(); }
      });
    },
    async closeBundle() {
      const output = join(process.cwd(), "dist", "mediapipe");
      await mkdir(output, { recursive: true });
      await Promise.all(visionFiles.map((name) => copyFile(join(visionSource, name), join(output, name))));
    },
  };
}

export default defineConfig({
  plugins: [react(), serveVisionRuntime()],
  server: { proxy: { "/api": "http://localhost:3001" } },
});
