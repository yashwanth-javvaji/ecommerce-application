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
                sh './docker.sh'
            }   
        }
        stage('Automation Testing') {
            parallel {
                stage('Auth Service') {
                    steps {
                        script {
                            try {
                                sh '''
                                    #!/bin/bash
                                    cd auth
                                    npm install
                                    npm run test
                                '''
                            } catch (err) {
                                if (currentBuild.result == 'UNSTABLE')
                                    currentBuild.result = 'FAILURE'
                                throw err
                            }
                        }
                    }
                }
                stage('Products Service') {
                    steps {
                        script {
                            try {
                                sh '''
                                    #!/bin/bash
                                    cd products
                                    npm install
                                    npm run test
                                '''
                            } catch (err) {
                                if (currentBuild.result == 'UNSTABLE')
                                    currentBuild.result = 'FAILURE'
                                throw err
                            }
                        }
                    }
                }
            }
        }
        stage('Deployment') {
            steps {
                sh './kubernetes.sh'                
            }   
        }

    }
}