# Stage 1: Dependencies stage
FROM node:20-alpine AS deps

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_API_URL
ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL

# Copy dependencies and application source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# Stage 3: Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependency manifests and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy Next.js build output and configuration
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.next ./.next

# Set ownership to non-root node user
RUN chown -R node:node /app

# Run as non-root user node
USER node

EXPOSE 3000

CMD ["npm", "start"]
