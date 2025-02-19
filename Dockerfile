FROM node:21

WORKDIR /usr/src/token-file-api

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/* && \
    npm install --omit=dev

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
