FROM node:0.12.6
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

CMD ["npm", "start"]

EXPOSE 8080
