import type { HtmlTagDescriptor, Plugin } from "vite";
import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticFilesPlugin = (envStaticPath: string, isDev: boolean, isPreview: boolean | undefined): Plugin => {
  const STATIC_KEY = '@forever-static';
  const STATIC_PACKAGE = path.resolve(__dirname, '../../../static');

  const MIME_TYPES: Record<string, string> = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
    '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2',
    '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf'
  };

  return {
    name: 'forever-static-file-plugin',
    transform(code) {
      if (!isDev && !isPreview && code.includes(STATIC_KEY)) {
        return {
          code: code.replace(new RegExp(STATIC_KEY, 'g'), envStaticPath),
          map: null,
        };
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        if (url?.includes(STATIC_KEY) && (isDev || isPreview)) {
          try {
            const parsedUrl = url.split('?')[0];
            const relativePath = parsedUrl.split(STATIC_KEY)[1];
            const filePath = path.join(STATIC_PACKAGE, relativePath);

            const data = await fs.readFile(filePath);

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': data.length,
            });

            res.end(data);
            return;
          } catch (err) {
            return next();
          }
        }
        next();
      });
    },
  };
};

const injectToHtmlPlugin = (tags: HtmlTagDescriptor[]) => {
  return {
    name: 'inject-to-html',
    transformIndexHtml() {
      return tags;
    }
  };
};

export { injectToHtmlPlugin, staticFilesPlugin };