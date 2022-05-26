
sudo cat<<EOF | sudo tee -a /etc/sudoers
ec2-user ALL=(ALL) NOPASSWD: ALL
EOF


sudo yum update -y
 
#Install git in your EC2 instance
sudo yum install git -y

