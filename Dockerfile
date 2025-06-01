# Stage 1: Build
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
# Install only dependencies (layer caching)
COPY package.json ./
COPY package-lock.json ./
# Install dependencies
RUN npm ci --legacy-peer-deps
# Copy the rest of the source code
COPY . .
# Build the Vite app
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine AS runner
# Use non-root user for security
ENV NODE_ENV=production
WORKDIR /app
# Install lightweight static server
RUN npm install -g serve
# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
# Expose port (optional, for documentation)
EXPOSE 3000
# Set entrypoint
ENTRYPOINT ["serve", "-s", "dist", "-l", "3000"]