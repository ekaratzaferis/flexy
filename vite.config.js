import dns from 'dns';
import { resolve } from 'path';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
    server: {
        host: true
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                wrap: resolve(__dirname, 'wrap.html'),
                curve: resolve(__dirname, 'curve.html')
            }
        }
    }
});