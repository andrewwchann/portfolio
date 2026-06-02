import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set VITE_BASE_PATH=/your-repo-name/ when deploying a GitHub project site
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? "/",
  server: {
    host: true,
    port: 5173,
    open: true,
  },
});
