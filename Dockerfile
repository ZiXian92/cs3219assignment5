FROM node:latest
RUN npm install -g typescript mocha typings
WORKDIR /src
