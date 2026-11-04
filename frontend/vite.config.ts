import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/  ·  https://vitest.dev/config/
export default defineConfig(({ mode }) => {
  // Variables sin prefijo VITE_: solo las lee esta configuración y no llegan al bundle del navegador.
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.BACKEND_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react()],
    css: {
      modules: {
        // Las clases `.mi-clase` de un *.module.css se importan como `styles.miClase`.
        localsConvention: 'camelCaseOnly',
      },
    },
    server: {
      port: 5173,
      // El backend Flask (rama feature/s05-s06-a2-auth) no configura CORS. En desarrollo,
      // el servidor de Vite reenvía /api/* al backend y el navegador ve un solo origen.
      // La ruta se conserva tal cual: /api/auth/login -> http://localhost:5000/api/auth/login.
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      css: {
        // Nombres de clase legibles en las pruebas (sin hash).
        modules: { classNameStrategy: 'non-scoped' },
      },
    },
  }
})
