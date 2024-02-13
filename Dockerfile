FROM node:21.6-alpine as dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# COPY entrypoint.sh /usr/src/app/entrypoint.sh
# RUN chmod +x /usr/src/app/entrypoint.sh

# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

## This might be used for production
# FROM node:21.6 as prod

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app

# COPY package*.json .

# RUN npm ci --only=production

# COPY --from=dev /app/dist ./dist

# CMD [ "node", "dist/src/server.js" ]