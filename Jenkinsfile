pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
        disableRestartFromStage()
    }
    tools {
        nodejs "nodejs"
    }
    stages {
        stage('install') {
            when {
                anyOf{
                    expression{env.BRANCH_NAME == 'deploy-qa'}
                    expression{env.BRANCH_NAME == 'deploy-prod'}
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('create-env-dev') {
            when {
                branch 'deploy-qa'
            }
            environment {
                TSL_WEB_QA_API_URL = credentials("TSL_WEB_QA_API_URL")
                TSL_WEB_QA_ENVIRONMENT = credentials("TSL_WEB_QA_ENVIRONMENT")
                TSL_WEB_QA_instId = credentials("TSL_WEB_QA_instId")
                TSL_WEB_QA_currency = credentials("TSL_WEB_QA_currency")
                TSL_WEB_QA_WEB_URL = credentials("TSL_WEB_QA_WEB_URL")

                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash

                rm ./src/config.js
                touch ./src/config.js

                echo "export const API_URL = '$TSL_WEB_QA_API_URL';" >> src/config.js
                echo "export const ENVIRONMENT = '$TSL_WEB_QA_ENVIRONMENT';" >> src/config.js
                echo "export const instId = '$TSL_WEB_QA_instId';" >> src/config.js
                echo "export const currency = '$TSL_WEB_QA_currency';" >> src/config.js
                echo "export const WEB_URL = '$TSL_WEB_QA_WEB_URL';" >> src/config.js

                '''
            }
        }

        stage('deploy-dev') {
            when {
                branch 'deploy-qa'
            }
            environment {
                TSL_WEB_QA_IP = credentials("TSL_WEB_QA_IP")
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
                ]) {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    mkdir -p /var/lib/jenkins/.ssh
                    echo "Starting Build"
                    npm run build
                    echo "Build Completed"
                    ssh-keyscan ${TSL_WEB_QA_IP} >> /var/lib/jenkins/.ssh/known_hosts
                    echo "ssh-keyscan done"
                    ssh -i $sshkey deployer@${TSL_WEB_QA_IP} "mkdir -p /var/repo/snuslife-web/$BRANCH_NAME"
                    echo "directiry created"
                    rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./build deployer@${TSL_WEB_QA_IP}:/var/repo/snuslife-web/$BRANCH_NAME
                    echo "data moved"

                    '''
                }
            }
        }

        stage('create-env-prod') {
            when {
                branch 'deploy-prod'
            }
            environment {
                TSL_WEB_PROD_API_URL = credentials("TSL_WEB_PROD_API_URL")
                TSL_WEB_PROD_ENVIRONMENT = credentials("TSL_WEB_PROD_ENVIRONMENT")
                TSL_WEB_PROD_instId = credentials("TSL_WEB_PROD_instId")
                TSL_WEB_PROD_currency = credentials("TSL_WEB_PROD_currency")
                TSL_WEB_PROD_WEB_URL = credentials("TSL_WEB_PROD_WEB_URL")

                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash
                rm ./src/config.js
                touch ./src/config.js

                echo "export const API_URL = '$TSL_WEB_PROD_API_URL';" >> src/config.js
                echo "export const ENVIRONMENT = '$TSL_WEB_PROD_ENVIRONMENT';" >> src/config.js
                echo "export const instId = '$TSL_WEB_PROD_instId';" >> src/config.js
                echo "export const currency = '$TSL_WEB_PROD_currency';" >> src/config.js
                echo "export const WEB_URL = '$TSL_WEB_PROD_WEB_URL';" >> src/config.js

                '''
            }
        }

        stage('deploy-prod') {
            when {
                branch 'deploy-prod'
            }
            environment {
                TSL_WEB_PROD_IP = credentials("TSL_WEB_PROD_IP")
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
                ]) {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    mkdir -p /var/lib/jenkins/.ssh
                    echo "Starting Build"
                    npm run build
                    echo "Build Completed"
                    ssh-keyscan ${TSL_WEB_PROD_IP} >> /var/lib/jenkins/.ssh/known_hosts
                    echo "ssh-keyscan done"
                    ssh -i $sshkey deployer@${TSL_WEB_PROD_IP} "mkdir -p /var/repo/snuslife-web/$BRANCH_NAME"
                    echo "directiry created"
                    rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./build deployer@${TSL_WEB_PROD_IP}:/var/repo/snuslife-web/$BRANCH_NAME
                    echo "data moved"

                    '''
                }
            }
        }
    }
}