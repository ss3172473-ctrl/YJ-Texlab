import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                archive: resolve(__dirname, 'archive.html'),
                lines: resolve(__dirname, 'lines.html'),
                firsts: resolve(__dirname, 'firsts.html'),
                certified: resolve(__dirname, 'certified.html'),
                contact: resolve(__dirname, 'contact.html'),
            },
        },
    },
});
