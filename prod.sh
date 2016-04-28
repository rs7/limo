#!/bin/bash

cd client
npm run prod
cd ..

cd server
npm run prod
cd ..
