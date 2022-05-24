FROM node:lts-alpine 
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]

#FROM node:lts-alpine AS runner
# WORKDIR /app
# COPY  /app ./


# FROM node:14-alpine
# WORKDIR /src
# COPY package.json package-lock.json /src/

# RUN npm install  

# COPY . /src
# CMD ["npm", "run", "start"]
