
#!/bin/bash


cd auth
npm install
npm run test
cd ..


cd products
npm install
npm run test
cd ..


cd orders
npm install
npm run test
cd ..

cd expiration
npm install
npm run test
cd ..

cd payments
npm install
npm run test
cd ..