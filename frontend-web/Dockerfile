FROM node:20-alpine AS build

LABEL maintainer="Thibaut MOUTON <thibautmouton22@gmail.com>"

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:mainline-alpine3.18-slim

LABEL maintainer="Thibaut MOUTON <thibautmouton22@gmail.com>"

RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { \
              listen       80; \
              server_name  localhost; \
          \
              location / { \
                  root   /usr/share/nginx/html; \
                  index  index.html index.htm; \
                  try_files $uri $uri/ /index.html; \
              } \
          }' >> /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /build /usr/share/nginx/html
