docker login -u yashwanthjavvaji -p Password@

echo 'auth'
cd auth
docker build --network host -t yashwanthjavvaji/auth .
docker push yashwanthjavvaji/auth
cd ..


echo 'products'

cd products
docker build --network host -t yashwanthjavvaji/products .
docker push yashwanthjavvaji/products
cd ..


echo 'orders'
cd orders
docker build --network host -t yashwanthjavvaji/orders .
docker push yashwanthjavvaji/orders
cd ..


echo 'expiration'
cd expiration
docker build --network host -t yashwanthjavvaji/expiration .
docker push yashwanthjavvaji/expiration
cd ..


echo 'payments'
cd payments
docker build --network host -t yashwanthjavvaji/payments .
docker push yashwanthjavvaji/payments
cd ..


echo 'client'
cd client
docker build --network host -t yashwanthjavvaji/client .
docker push yashwanthjavvaji/client
cd ..