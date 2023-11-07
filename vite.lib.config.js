import dns from 'dns';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
    publicDir: false, // Disable serving files from public directory
    server: {
        host: true
    },
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/index.js',
            name: 'flexy',
            formats: [
                'es',
                'umd',
                'cjs'
            ]
        }
    }
});