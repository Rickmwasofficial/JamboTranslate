# Build stage
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
# This generates the 'dist' folder
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/server.ts ./

# Install production dependencies
# We need express for the server and tsx to run the typescript server file
RUN npm install --omit=dev && npm install -g tsx

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server
CMD ["tsx", "server.ts"]
