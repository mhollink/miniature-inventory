/// <reference types="vite/client" />
declare const BUILD_VERSION: string;
declare const BUILD_DATE: string;

interface ImportMetaEnv {
  readonly FIREBASE_API_KEY: string;
  readonly FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
