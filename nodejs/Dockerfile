FROM node:19.8-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install --omit=dev

COPY . .

RUN npm install -g pm2

RUN npm run build

ENV ACCOUNT_MANAGER_RAZZLE_AGENT_ID=
ENV ACCOUNT_MANAGER_RAZZLE_API_KEY=
ENV SERP_API_RAZZLE_AGENT_ID=
ENV SERP_API_RAZZLE_API_KEY=
ENV SERP_API_KEY=
ENV RAZZLE_WS_URL=

EXPOSE 3000

CMD ["pm2-runtime", "./dist/src/index.js"]