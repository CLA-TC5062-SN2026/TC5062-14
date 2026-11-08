/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Prefijo base de la API (por defecto "/api", atendido por el proxy de Vite en desarrollo). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
