#kubectl delete all --all

cd infra/k8s


kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

kubectl apply -f ingress-srv-prod.yaml --record=true
sleep 5
kubectl apply -f ingress-srv-prod.yaml
#sleep 15

kubectl apply -f ingress-srv-prod.yaml
#sleep 15

export theIPaddress=$(ip addr show eth0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)

kubectl patch svc ingress-nginx-controller   -n ingress-nginx -p '{"spec": {"type": "LoadBalancer", "externalIPs":["'"$theIPaddress"'"]}}'


kubectl apply -f storageclass.yml 

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

kubectl apply -f ingress-srv-prod.yaml

kubectl rollout restart deployment/auth-deployment
kubectl rollout restart deployment/products-deployment
kubectl rollout restart deployment/orders-deployment
kubectl rollout restart deployment/expiration-deployment
kubectl rollout restart deployment/payments-deployment
kubectl rollout restart deployment/client-deployment

