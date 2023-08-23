FROM node:19

RUN apt-get -y update
RUN apt-get -y upgrade

COPY serve /app
COPY build /app/build

WORKDIR /app

RUN npm i

CMD npm run start