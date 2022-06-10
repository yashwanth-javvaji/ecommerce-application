pipeline {
    agent any
    stages {
        stage('SCM Checkout') {
            steps {
                script {
                    try {
                        git url:'https://github.com/javvajiyashwanth/major-project.git', branch:'master'
                    }  catch (err) {
                        if (currentBuild.result == 'UNSTABLE')
                            currentBuild.result = 'FAILURE'
                        sh "exit 1"
                    }
                }
            }
        }        
        stage('Build Docker Images') {
            steps {
                script {
                    try {
                        sh 'docker login -u yashwanthjavvaji -p Password@'
                        sh 'cd auth'
                        sh 'docker build --network host -t yashwanthjavvaji/auth .'
                        sh 'docker push yashwanthjavvaji/auth'
                        sh 'cd ..'
                        sh 'cd products'
                        sh 'docker build --network host -t yashwanthjavvaji/products .'
                        sh 'docker push yashwanthjavvaji/products'
                        sh 'cd ..'
                        sh 'cd orders'
                        sh 'docker build --network host -t yashwanthjavvaji/orders .'
                        sh 'docker push yashwanthjavvaji/orders'
                        sh 'cd ..'
                        sh 'cd payments'
                        sh 'docker build --network host -t yashwanthjavvaji/payments .'
                        sh 'docker push yashwanthjavvaji/payments'
                        sh 'cd ..'
                        sh 'cd expiration'
                        sh 'docker build --network host -t yashwanthjavvaji/expiration .'
                        sh 'docker push yashwanthjavvaji/expiration'
                        sh 'cd ..'
                        sh 'cd client'
                        sh 'docker build --network host -t yashwanthjavvaji/client .'
                        sh 'docker push yashwanthjavvaji/client'
                        sh 'cd ..'
                    } catch (err) {
                        if (currentBuild.result == 'UNSTABLE')
                            currentBuild.result = 'FAILURE'
                        sh "exit 1"
                    }
                }
            }   
        }
        stage('Automation Testing') {
            steps {
                script {
                    try {
                        sh 'cd auth'
                        sh 'npm install'
                        sh 'npm run test'
                        sh 'cd ..'
                        sh 'cd products'
                        sh 'npm install'
                        sh 'npm run test'
                        sh 'cd ..'
                        sh 'cd orders'
                        sh 'npm install'
                        sh 'npm run test'
                        sh 'cd ..'
                        sh 'cd payments'
                        sh 'npm install'
                        sh 'npm run test'
                        sh 'cd ..'
                        sh 'cd expiration'
                        sh 'npm install'
                        sh 'npm run test'
                        sh 'cd ..'
                    } catch (err) {
                        if (currentBuild.result == 'UNSTABLE')
                            currentBuild.result = 'FAILURE'
                        sh "exit 1"
                    }
                }
            }
        }
        stage('Deployment') {
            steps {
                script {
                    try {
                        sh 'cd infra'
                        sh 'kubectl apply -f k8s'                
                    }  catch (err) {
                        if (currentBuild.result == 'UNSTABLE')
                            currentBuild.result = 'FAILURE'
                        sh "exit 1"
                    }
                }
            } 
        }
    }
}