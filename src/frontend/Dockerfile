FROM node:19

RUN apt-get -y update
RUN apt-get -y upgrade

WORKDIR /app

COPY serve/package.json /app/package.json
RUN npm i

COPY serve /app
COPY ssl /app/ssl
COPY build /app/build

CMD npm run start