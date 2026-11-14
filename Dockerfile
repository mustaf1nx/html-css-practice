FROM node:22-alpine
WORKDIR /app
COPY package.json server.js index.html app.js questions.js style.css ./
ENV NODE_ENV=production
USER node
CMD ["node", "server.js"]
