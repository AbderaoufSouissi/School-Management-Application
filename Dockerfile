# Stage 1: Build Angular app
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Inject API_URL from Docker build arg
ARG API_URL
RUN echo "export const environment = { production: true, apiUrl: '$API_URL' };" > src/environments/environment.prod.ts

# Use configuration instead of --prod flag
RUN npm run build -- --configuration production

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]