FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

EXPOSE ${PORT}