# Dockerfile for React client

FROM node:14-alpine as stage


ENV APP_DIR=/wish-cards/
WORKDIR /wish-cards/
COPY yarn.lock /wish-cards/
COPY package*.json /wish-cards/
RUN npm install
EXPOSE 4000

FROM stage as development
ENV NODE_ENV=development
CMD ["npm","start"]

FROM stage as production
ENV NODE_ENV=production
COPY . /wish-cards/
RUN yarn build
CMD node app.js
