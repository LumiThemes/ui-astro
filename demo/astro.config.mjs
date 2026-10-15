import { defineConfig } from 'astro/config';

// The demo: every piece on one page, for checking changes in a browser.
export default defineConfig({ server: { port: 4410, host: '127.0.0.1' }, devToolbar: { enabled: false } });
