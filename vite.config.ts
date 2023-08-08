import { defineConfig, loadEnv } from 'vite'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

type Env = {
  PUBLISH_URI: string
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as Env
  return {
    base: `/${env.PUBLISH_URI}/`,
    plugins: [cssInjectedByJsPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
          },
        },
      },
    },
  }
})
