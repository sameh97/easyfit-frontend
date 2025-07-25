# Stage 1: Build Angular app
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration production

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy build to NGINX HTML folder
COPY --from=build /app/dist/easyfit-frontend /usr/share/nginx/html

# Optional: custom nginx config (if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80