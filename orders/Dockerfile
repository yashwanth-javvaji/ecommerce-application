# FROM node:lts-alpine AS builder
# WORKDIR /app
# COPY ./package.json ./package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM node:lts-alpine AS runner
# WORKDIR /app
# COPY --from=builder /app ./
# CMD ["npm", "run", "start:prod"]


# FROM node

# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# #RUN npm run build

# CMD ["npm", "run", "start"]
# FROM node
# ADD package.json /tmp/package.json
# RUN cd /tmp && npm install
# RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/
# WORKDIR /usr/src/app
# COPY . /usr/src/app/
# CMD [ "npm", "run", "start" ]
# EXPOSE 4000


FROM node:13-alpine


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm update -g npm
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start" ]