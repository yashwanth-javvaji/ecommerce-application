# FROM node:lts-alpine AS dependencies
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install --frozen-lockfile

# FROM node:lts-alpine AS builder
# WORKDIR /app
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY . .
# RUN npm run build
# RUN rm -rf node_modules
# RUN npm install --production --frozen-lockfile --ignore-scripts --prefer-offline

# FROM node:lts-alpine AS runner

# ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# WORKDIR /app

# COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# USER nextjs

# EXPOSE 3000

# CMD ["npm", "run", "start"]

FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]