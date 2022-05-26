docker login -u yashwanthjavvaji -p Password@

cd major-project

echo 'auth'
cd auth
docker build -t yashwanthjavvaji/auth .
docker push yashwanthjavvaji/auth
cd ..


echo 'products'

cd products
docker build -t yashwanthjavvaji/products .
docker push yashwanthjavvaji/products
cd ..


echo 'orders'
cd orders
docker build -t yashwanthjavvaji/orders .
docker push yashwanthjavvaji/orders
cd ..


echo 'expiration'
cd expiration
docker build -t yashwanthjavvaji/expiration .
docker push yashwanthjavvaji/expiration
cd ..


echo 'payments'
cd payments
docker build -t yashwanthjavvaji/payments .
docker push yashwanthjavvaji/payments
cd ..


echo 'client'
cd client
docker build -t yashwanthjavvaji/client .
docker push yashwanthjavvaji/client
cd ..