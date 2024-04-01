FROM node:20-alpine as build-stage
ARG BUILD_ENV=production

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production --silent
RUN npm install typescript --save-dev
COPY . .
RUN npm run build:${BUILD_ENV}


# production stage
FROM nginx:1.25-alpine as production-stage
RUN mkdir /app

COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]