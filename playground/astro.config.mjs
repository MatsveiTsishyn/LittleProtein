import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://Benoitdw.github.io',
  base: '/LittleProtein',
  vite: {
    plugins: [
      {
        name: 'p5-global-shim',
        resolveId(id, importer) {
          if (importer && id.endsWith('libs/p5.min.js')) {
            return '\0virtual:p5-global';
          }
        },
        load(id) {
          if (id === '\0virtual:p5-global') {
            return `import p5 from 'p5'; if (typeof window !== 'undefined') window.p5 = p5;`;
          }
        },
      },
    ],
  },
});
