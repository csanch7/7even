FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install

COPY . .
RUN npm --workspace apps/api run build

CMD ["node", "apps/api/dist/main.js"]
