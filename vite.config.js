import { defineConfig } from 'vite';
import vinext from 'vinext';
import { sites } from './build/sites-vite-plugin.js';

export default defineConfig(async () => {
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return {
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          main: './worker/index.ts',
          compatibility_flags: ['nodejs_compat'],
          d1_databases: [],
          r2_buckets: [],
        },
      }),
    ],
  };
});
