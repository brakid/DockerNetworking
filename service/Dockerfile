FROM oven/bun:1.4.3-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install
COPY . .

USER bun
EXPOSE 3000

CMD ["bun", "run", "index.ts"]
