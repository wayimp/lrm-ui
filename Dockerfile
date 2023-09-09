FROM node:17-alpine

COPY package*.json ./

RUN npm install

RUN npm ci --omit=dev

COPY . .

RUN npm run-script build

EXPOSE 8055

CMD [ "npm", "start" ]
