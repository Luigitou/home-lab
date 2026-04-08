# ─────────────────────────────────────────
# Stage 1 – base (shared deps installation)
# ─────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ─────────────────────────────────────────
# Stage 2 – dev (hot-reload dev server)
# ─────────────────────────────────────────
FROM base AS dev
RUN npm install --legacy-peer-deps
# Source code is mounted as a volume at runtime, not copied here
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]

# ─────────────────────────────────────────
# Stage 3 – build (production bundle)
# ─────────────────────────────────────────
FROM base AS build
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ─────────────────────────────────────────
# Stage 4 – prod (static file server)
# ─────────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]

