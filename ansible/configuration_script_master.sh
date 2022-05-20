#https://stackoverflow.com/questions/53918841/how-to-install-docker-on-amazon-linux2
#https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html
#https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-centos-7
#https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/


sudo cat<<EOF | sudo tee -a /etc/sudoers
ubuntu ALL=(ALL) NOPASSWD: ALL
EOF


echo 'Docker instlalation'

#sudo yum update -y
sudo apt-get update

#sudo yum -y install docker
sudo apt install docker.io -y
#sudo service docker start
#sudo service enable docker
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl enable docker.service
sudo systemctl enable containerd.service


#sudo usermod -a -G docker ec2-user
sudo usermod -a -G docker ubuntu

#sudo usermod -aG docker $(whoami)
sudo chmod 666 /var/run/docker.sock

#sudo su 
sudo cat<<EOF | sudo tee /etc/docker/daemon.json
{
   "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
sudo systemctl restart docker


echo 'KUBERENETES INSTALLATION'


cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system

sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl


#sudo kubeadm reset

sudo kubeadm init


mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
sleep 10

hostname=$(hostname)
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
kubectl taint nodes  $hostname node-role.kubernetes.io/master-

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml

kubectl create secret generic jwt-secret --from-literal=JWT_SECRET=majorprojectsecret
kubectl create secret generic jwt-expiration-time --from-literal=JWT_EXPIRATION_TIME=7d
kubectl create secret generic jwt-access-token-secret --from-literal=JWT_ACCESS_TOKEN_SECRET=majorprojectsecret
kubectl create secret generic jwt-access-token-expiration-time --from-literal=JWT_ACCESS_TOKEN_EXPIRATION_TIME=1h
kubectl create secret generic jwt-refresh-token-secret --from-literal=JWT_REFRESH_TOKEN_SECRET=majorprojectsecret
kubectl create secret generic jwt-refresh-token-expiration-time --from-literal=JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
kubectl create secret generic admin-email --from-literal=ADMIN_EMAIL=admin@sky-ecommerce.com
kubectl create secret generic admin-password --from-literal=ADMIN_PASSWORD=SKY@1234
kubectl create secret generic stripe-secret-key --from-literal=STRIPE_SECRET_KEY=sk_test_51KLVyISGQJCC9tNftUaobPsIVzcqE17K0gIuhTUh5wB67dTy79BRHjq208aiDae5aZWNVyux0P48vJa02IWZS8t900VzOCO9eJ

sudo apt update
sudo apt install openjdk-8-jdk -y

#https://phoenixnap.com/kb/install-jenkins-ubuntu

curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins -y
sudo systemctl enable jenkins
sudo systemctl start jenkins


sudo ex +g/useSecurity/d +g/authorizationStrategy/d -scwq /var/lib/jenkins/config.xml

sudo cat<<EOF | sudo tee -a /etc/sudoers
jenkins ALL=(ALL) NOPASSWD: ALL
EOF
sudo usermod -a -G docker jenkins

sudo systemctl restart jenkins

#--------------NODE

### Node.js v16 ###
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install -y nodejs vim