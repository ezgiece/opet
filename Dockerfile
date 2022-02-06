FROM node:16 as build-stage
WORKDIR /app
COPY . .
RUN npm install -g npm@7.11.1
RUN npm install
RUN ls
RUN npm run build:kubernetes

FROM nginx as production-stage
RUN ls
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/dist /usr/share/nginx/html/ux


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]