FROM node:18-alpine AS base 

FROM base AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

FROM dependencies AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000

CMD [ "npm", "start" ]
