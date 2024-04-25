FROM node:21-alpine AS builder
WORKDIR /app/sveltekit
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:21-alpine
WORKDIR /app/sveltekit
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]

# Flask:
# FROM python:

FROM python:3.8:alpine

WORKDIR /app/flaskpart

RUN pip install Flask
RUN pip install U- flask-cors