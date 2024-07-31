import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const basenameProd = '/react-shadcn-starter'

export default defineConfig(({ command }) => {
  const isProd = command === 'build'

  return {
    base: isProd ? basenameProd : '',
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global: {
        basename: isProd ? basenameProd : '',
      },
    },
    build: {
      "target": "es2020",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
        define: {
          global: "globalThis",
        },
        supported: {
          bigint: true,
        },
      },
    },
  }
})