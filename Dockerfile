# Stage 1: Build the React app
FROM node:16.14.0 AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build environment can be passed as --build-arg ENV=production|staging|development
ARG ENV=production
ENV NODE_ENV=$ENV

# Build the React app
RUN if [ "$NODE_ENV" = "development" ]; then \
    npm run build:staging; \
    else \
    npm run build; \
    fi
RUN echo "Building with ENV=$NODE_ENV"

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

WORKDIR /jiotvplus

# Copy the built app from the build stage to the Nginx public directory
COPY --from=builder /app/build /jiotvplus

# Copy required nginx file
COPY nginx/nginx.conf /etc/nginx/
COPY nginx/mime.types /etc/nginx/
COPY nginx/default.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]