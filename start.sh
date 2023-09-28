#!/bin/bash

net stop winnat

docker compose up

net start winnat