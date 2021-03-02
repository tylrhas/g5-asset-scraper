FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
RUN npm run build
COPY ./dist ./
CMD [ "npm", "start" ]
