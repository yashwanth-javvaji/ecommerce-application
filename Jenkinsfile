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

                sh 'ansible-playbook -i ansible/hosts ansible/playbook_configuration_master.yml'
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
                sh "sed -i .bak -e 's/v1alpha1/v1beta1/' ~/.kube/config"
                sh   'sudo  "./kubernetes.sh" '
                
            }   
        }

    }
}