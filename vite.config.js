import dns from 'dns';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
    server: {
        host: true,
        allowedHosts: true,
        port: 5151
    },
    build: {
        rollupOptions: {
            input: {
                index: './index.html',
                demo: './demo/index.html'
            }
        }
    }
});
