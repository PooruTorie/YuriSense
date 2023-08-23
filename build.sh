#!/bin/bash

wait_exit() {
  echo "Press enter to exit";
  read -r;
  exit;
}

cd backend || wait_exit
node env_collector.js || wait_exit
cd ..

cd frontend || wait_exit
npm run build || wait_exit
cd ..

docker-compose build || wait_exit

echo "Build Complete"
wait_exit