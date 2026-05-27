FROM ghcr.io/pnpm/pnpm:11
RUN pnpm runtime set node 22 -g

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --force

EXPOSE 3000

CMD ["pnpm", "web"]