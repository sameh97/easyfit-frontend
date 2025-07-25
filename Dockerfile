# Stage 1 - Build the Angular app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Add this environment variable to fix OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build

# Stage 2 - Serve the Angular app with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/easyfit /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
