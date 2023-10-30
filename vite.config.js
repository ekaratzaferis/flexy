import dns from 'dns';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
    server: {
        host: true
    },
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/index.js',
            name: 'four20',
            formats: [
                'es',
                'umd',
                'cjs'
            ]
        },
        rollupOptions: {
            // Exclude HTML files from the build
            external: ['*.html']
        }
    }
});