# FROM node:lts-alpine AS dependencies
# # RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY ./package.json ./package-lock.json ./
# RUN npm install

# FROM node:lts-alpine AS builder
# WORKDIR /app
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY . .
# RUN npm run build && npm install --production --ignore-scripts --prefer-offline

# FROM node:lts-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# CMD ["npm", "run", "start"]

FROM node

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]