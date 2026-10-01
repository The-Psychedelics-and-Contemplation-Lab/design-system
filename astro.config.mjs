// The design-system repo also publishes its own living style guide
// (docs/) to GitHub Pages, so the lab can see every token and component.
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://the-psychedelics-and-contemplation-lab.github.io',
  base: '/design-system',
  srcDir: './docs',
  publicDir: './docs/public',
  outDir: './dist',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
