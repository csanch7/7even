FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/worker/package.json ./apps/worker/package.json
RUN npm install

COPY . .
RUN npm --workspace apps/worker run build

CMD ["node", "apps/worker/dist/main.js"]
