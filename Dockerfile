FROM node:22.14.0-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]