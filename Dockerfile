# Usa una imagen base oficial de Node.js
FROM node:18-alpine
RUN npm i -g pnpm@9.4.0
RUN mkdir -p /app
RUN npm cache clear --force
WORKDIR /app
COPY package.json /app
COPY pnpm-lock.yaml /app
RUN pnpm install
COPY . /app

EXPOSE 300

CMD ["pnpm", "run", "dev"]