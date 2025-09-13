/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL_DEV: string;  // Define the expected type for the env variable
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
