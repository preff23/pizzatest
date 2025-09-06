/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string
  readonly VITE_BOT_TOKEN: string
  readonly VITE_WEBAPP_URL: string
  readonly VITE_BOT_USERNAME: string
  readonly VITE_DEV_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
