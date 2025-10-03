import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    minify: 'esbuild' // or 'terser' if you want slower but better minification
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // allows SW in dev
      },
      workbox: {
        // extend the SW with your custom code
        navigateFallback: "/index.html"
      },
      srcDir: "src",          // where your custom SW file will live
      filename: "custom-sw.ts" // name of your custom SW
    })
  ]
});
