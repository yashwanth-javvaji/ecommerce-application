sudo yum update -y
sudo yum install git -y

if [ -d "major-project" ] ;then
    cd major-project 
    git pull
else

git clone https://github.com/javvajiyashwanth/major-project.git

fi
cd major-project
chmod 777 ./docker.sh
./docker.sh 
