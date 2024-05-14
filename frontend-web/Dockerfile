FROM nginx:mainline-alpine3.18-slim

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

COPY dist /usr/share/nginx/html
