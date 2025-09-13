import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        https: {
            key: fs.readFileSync('./decrypted-key.pem'), // Path to your private key file
            cert: fs.readFileSync('./cert.pem'), // Path to your certificate file
        },
    },
});