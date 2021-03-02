FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./src /usr/src/app/src
RUN npm run build
COPY ./dist ./
CMD [ "node", "index.js" ]
