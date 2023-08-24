#!/bin/bash

wait_exit() {
  echo "Press enter to exit";
  read -r;
  exit;
}

if [ ! -f src/db/schema.sql ]; then
  echo "Please Export the Database Schema to src/db/schema.sql"
  wait_exit
fi

cd src/backend || wait_exit
npm i
node env_collector.js || wait_exit
cd ../..

cd src/frontend || wait_exit
npm i
npm run build || wait_exit
cd ../..

docker-compose build || wait_exit

echo "Build Complete"
wait_exit