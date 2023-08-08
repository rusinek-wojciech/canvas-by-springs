import { defineConfig, loadEnv } from 'vite'

type Env = {
  PUBLISH_URI: string
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as Env
  return {
    base: `/${env.PUBLISH_URI}/`,
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
