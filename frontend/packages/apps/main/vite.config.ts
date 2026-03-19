import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import fs from "fs"

const staticFilesPlugin = (envStaticPath: string, isDev: boolean, isPreview: boolean | undefined): Plugin => {
  const STATIC_KEY = '@forever-static';
  const STATIC_PACKAGE = path.resolve(__dirname, '../../static');

  return {
    name: 'forever-static-file-plugin',
    transform(code) {
      if (!isDev && code.includes(STATIC_KEY)) {
        return {
          code: code.replace(new RegExp(STATIC_KEY, 'g'), envStaticPath),
          map: null,
        };
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        if (url?.includes(STATIC_KEY) && (isDev || isPreview)) {
          const parsedUrl = url.split('?')[0];
          const relativePath = parsedUrl.split(STATIC_KEY)[1];

          const filePath = path.join(STATIC_PACKAGE, relativePath);

          const stream = fs.createReadStream(filePath);

          stream.on('open', () => stream.pipe(res));
          stream.on('error', () => next());

          return;
        }
        next();
      });
    },

  };
};
// https://vite.dev/config/
export default defineConfig(({ mode, isPreview }) => {
  const isDev = mode === "development";
  return {
    plugins: [react(), staticFilesPlugin("/static", isDev, isPreview)],
    base: '/',
    server: {
      port: 3000
    },
    preview: {
      port: 3000
    },
    build: {
      outDir: '../../../dist/',
      emptyOutDir: false,
    }
  }
})
