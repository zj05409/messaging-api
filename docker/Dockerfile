# Base image stage
FROM node:16-alpine as node

ARG registry=https://registry.npm.taobao.org
ARG PORT=5000
ARG disturl=https://npm.taobao.org/dist
RUN yarn config set disturl $disturl
RUN yarn config set registry $registry
ENV PORT $PORT
EXPOSE $PORT

RUN apk --no-cache -U upgrade
RUN apk update
RUN npm i yarn@latest -g --force

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

# Builder stage
FROM node AS builder

WORKDIR /code
COPY package*.json ./
COPY ./src/infrastructure/shared/persistence/prisma/schema.prisma ./prisma/schema.prisma

RUN yarn --ignore-scripts --no-optional && yarn cache clean --force
RUN npx -y prisma generate --schema ./prisma/schema.prisma

ENV PATH /code/node_modules/.bin:$PATH
WORKDIR /code/app
COPY . ./
RUN yarn build

# Dev stage
FROM builder as dev

LABEL maintainer "Borja Paz Rodríguez (@borjapazr)"

ENV NODE_ENV=development
ENV FORCE_COLOR=1
CMD /wait && yarn dev

# Prod stage
FROM node as prod

LABEL maintainer "Borja Paz Rodríguez (@borjapazr)"

ENV NODE_ENV=production
ENV FORCE_COLOR=1
WORKDIR /home/node/app
RUN mkdir dist logs
RUN chown -R node:node /home/node/app
RUN npm install -g pm2
USER node
COPY --chown=node:node package*.json ./docker/pm2/process.json ./
COPY --chown=node:node ./src/infrastructure/shared/persistence/prisma/schema.prisma ./prisma/schema.prisma

RUN yarn ci --production --ignore-scripts
RUN npx -y prisma generate --schema ./prisma/schema.prisma

ENV PATH /home/node/app/node_modules/.bin:$PATH
COPY --chown=node:node --from=builder /code/app/dist ./dist
HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 CMD node ./dist/healthcheck.js
CMD /wait && pm2-runtime ./process.json
