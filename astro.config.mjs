// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.flora-architecteinterieur.com',
  integrations: [tailwind(), sitemap()],
  image: {
    domains: ["i.imgur.com"],
  },
});