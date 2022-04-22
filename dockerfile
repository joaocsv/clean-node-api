FROM node:16
WORKDIR /usr/src/node-clean-code
COPY ./package.json .
RUN npm install --production