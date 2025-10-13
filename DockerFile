# ---------- Base Image ----------
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# ---------- Build Stage ----------
FROM base AS build

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build NestJS project
RUN pnpm run build


# ---------- Production Stage ----------
FROM base AS production

# Set environment to production
ENV NODE_ENV=production

# Install pnpm in runtime container
RUN npm install -g pnpm

# Copy necessary files from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./

# Expose app port (default for NestJS)
EXPOSE 3000

# Start the app
CMD ["pnpm", "start:prod"]
