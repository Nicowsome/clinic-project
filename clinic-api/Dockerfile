# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment variables (in production, these should be mounted)
COPY --chown=node:node .env* ./

# Create a non-root user and switch to it
RUN chown -R node:node /app
USER node

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
