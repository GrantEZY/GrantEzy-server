# -----------------------------
# Base Image
# -----------------------------
FROM node:25-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

EXPOSE 5000

# -----------------------------
# Dependencies
# -----------------------------
FROM base AS deps
WORKDIR /app

# Copy lockfiles
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# -----------------------------
# Builder
# -----------------------------
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

# Build the application
RUN pnpm build

# -----------------------------
# Production Image
# -----------------------------
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Copy necessary files from builder stage (not "build")
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER nestjs

CMD ["node", "dist/main.js"]

# -----------------------------
# Development Image
# -----------------------------
FROM base AS dev
WORKDIR /app

ENV NODE_ENV=development
ENV PORT=5000

# Install ALL dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
