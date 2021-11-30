/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WLED_DEVICE_HOST:string
}

interface ImportMeta {
  readonly env:ImportMetaEnv
}
