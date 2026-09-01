import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cosminlinca.github.io',
  base: '/pacos-wedding',
  trailingSlash: 'ignore',
  output: 'static',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: { prefixDefaultLocale: false }, // ro at "/", en at "/en/"
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ro',
        locales: { ro: 'ro-RO', en: 'en-GB' },
      },
    }),
  ],
});
