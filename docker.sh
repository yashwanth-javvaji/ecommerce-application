

cd auth
docker build -t yashwanthjavvaji/auth .
docker push yashwanthjavvaji/auth
cd ..

cd products
docker build -t yashwanthjavvaji/products .
docker push yashwanthjavvaji/products
cd ..

cd orders
docker build -t yashwanthjavvaji/orders .
docker push yashwanthjavvaji/orders
cd ..

cd expiration
docker build -t yashwanthjavvaji/expiration .
docker push yashwanthjavvaji/expiration
cd ..

cd payments
docker build -t yashwanthjavvaji/payments .
docker push yashwanthjavvaji/payments
cd ..

cd client
docker build -t yashwanthjavvaji/client .
docker push yashwanthjavvaji/client
cd ..