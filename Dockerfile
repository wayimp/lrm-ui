FROM node:16

COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

RUN npm run-script build

EXPOSE 8055

CMD [ "npm", "start" ]
