FROM node:lts-alpine AS builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .
#RUN npm run build

FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start"]