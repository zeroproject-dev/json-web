FROM node:22-alpine3.19 AS build
ARG VITE_BASE_URL=./
WORKDIR /app
COPY package.json .
RUN npm install --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build -- --base ${VITE_BASE_URL}

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# artifact stage for deployment

FROM scratch AS artifact
ARG APP_NAME=json-web
COPY --from=build /app/dist /${APP_NAME}
