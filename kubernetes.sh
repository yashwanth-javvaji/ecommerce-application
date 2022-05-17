kubectl delete all --all

cd infra/k8s

kubectl apply -f auth-mongo.yaml
kubectl apply -f auth.yaml

kubectl apply -f products-mongo.yaml
kubectl apply -f products.yaml

kubectl apply -f orders-mongo.yaml
kubectl apply -f orders.yaml

kubectl apply -f expiration-redis.yaml
kubectl apply -f expiration.yaml

kubectl apply -f payments-mongo.yaml
kubectl apply -f payments.yaml

kubectl apply -f client.yaml

kubectl apply -f ingress-service.yaml