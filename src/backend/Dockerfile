FROM node:19

RUN apt-get -y update
RUN apt-get -y upgrade

COPY . /app

WORKDIR /app

RUN npm i

CMD npm run start