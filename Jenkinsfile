pipeline {
    agent any

    stages {
        stage('SCM Checkout') {
            steps{
                git url:'https://github.com/javvajiyashwanth/major-project.git', branch:'master'
            }
        }        
        stage('Build Docker Images') {
            steps {
                sh 'chmod -R 777 ./docker.sh'
                sh './docker.sh'
            }   
        }
        stage('Testing') {
            steps {
                sh 'chmod -R 777 ./jest.sh'
                //sh './jest.sh'
            }
        }
        stage('Deployment') {
            steps {
                sh 'chmod -R 777 ./kubernetes.sh'
                //sh 'sudo -S su ubuntu -c "./kubernetes.sh" '
                sh   'sudo  "./kubernetes.sh" '
            }   
        }
    }
}