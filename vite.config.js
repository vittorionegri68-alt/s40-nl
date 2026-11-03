import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Makes `npm run dev` and `npm run preview` serve /api/weather by running the same handler
// that Vercel runs in production (api/weather.js). On Vercel this plugin is not used.
function weatherApi() {
  const mount = (server) => {
    server.middlewares.use("/api/weather", async (req, res) => {
      const { default: handler } = await import("./api/weather.js");
      res.status = (c) => ((res.statusCode = c), res);
      res.json = (o) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(o));
      };
      await handler(req, res);
    });
  };
  return { name: "weather-api", configureServer: mount, configurePreviewServer: mount };
}

export default defineConfig({
  plugins: [react(), weatherApi()],
  build: { chunkSizeWarningLimit: 700 },
});
