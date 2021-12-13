# Dockerfile for React client

FROM node:14-alpine as stage


ENV APP_DIR=/wish-cards/
WORKDIR ${APP_DIR}
COPY yarn.lock ${APP_DIR}
COPY package*.json ${APP_DIR}
RUN npm install
EXPOSE 4000

FROM stage as development
ENV NODE_ENV=development
CMD ["npm","start"]

FROM stage as production
ENV NODE_ENV=production
COPY . ${APP_DIR}
RUN yarn build
CMD node app.js
