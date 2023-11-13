import dns from 'dns';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
    server: {
        host: 'localhost'
    },
    build: {
        rollupOptions: {
            input: {
                main: './examples/base/index.html',
                curve: './examples/curve-helper/index.html'
            }
        }
    }
});