# FROM node:lts-alpine AS builder
# WORKDIR /app
# COPY ./package.json ./package-lock.json ./
# RUN npm config set registry https://registry.npmjs.org/
# RUN npm install --ignore-scripts --unsafe-perm
# COPY . .
# RUN npm run build

# FROM node:lts-alpine AS runner
# WORKDIR /app
# COPY --from=builder /app ./
# CMD ["npm", "run", "start:prod"]

# FROM node:14-alpine
# WORKDIR /src
# COPY package.json package-lock.json /src/

# RUN npm install  

# COPY . /src
# CMD ["npm", "run", "start"]

# FROM node:lts-alpine

# WORKDIR /app
# COPY package.json .
# RUN npm cache clean --force

# RUN  npm install -g npm@8.10.0
# RUN  npm install -g node-pre-gyp
# RUN npm install
# COPY . .
# RUN npm run build

# CMD ["npm", "run", "start"]


FROM node:lts-alpine

WORKDIR /app
RUN npm config rm proxy
RUN npm config rm https-proxy
COPY package.json .
RUN npm install
COPY . .
#RUN npm run build

CMD ["npm", "run", "start"]