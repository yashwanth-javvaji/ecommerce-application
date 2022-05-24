# FROM node:lts-alpine 
# WORKDIR /app
# COPY ./package.json ./package-lock.json ./
# RUN npm install
# COPY . .
# #RUN npm run build

# #FROM node:lts-alpine AS runner
# # WORKDIR /app
# COPY  /app ./
# CMD ["npm", "run", "start"]


FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]