/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL_DEV: string;  // Define the expected type for the env variable
    readonly VITE_DEFAULT_LOCALE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
