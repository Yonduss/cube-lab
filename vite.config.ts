import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const cubingWorkerResolver = 'return import.meta.resolve("./search-worker-entry.js");';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cubing-search-worker',
      apply: 'build',
      enforce: 'pre',
      transform(source, id) {
        if (!id.includes('/node_modules/cubing/') || !source.includes(cubingWorkerResolver)) return;

        // Use Vite's separate worker build to keep the page's preload code out of the worker.
        return {
          code: 'import searchWorkerURL from "./search-worker-entry.js?worker&url";\n'
            + source.replace(cubingWorkerResolver, 'return searchWorkerURL;'),
          map: null,
        };
      },
    },
  ],
  worker: { format: 'es' },
});
