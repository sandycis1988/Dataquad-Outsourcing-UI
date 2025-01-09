pipeline {
  environment {
    registryCredential = 'docker-hub'
    DOCKER_IMAGE_NAME = 'react-app'
    registry = "sandycis476/dataquad"
  }
  agent any
  stages {
    stage('Cloning Git') {
      steps {
        git([url: 'https://github.com/sandycis1988/Dataquad-Outsourcing-UI.git', branch: 'master', credentialsId: 'sandy-github'])
 
      }
    }
    stage('Building image') {
      steps{
        script {
          docker.build("${DOCKER_IMAGE_NAME}:latest")
        }
      }
    }
    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            docker.image("${DOCKER_IMAGE_NAME}:latest").push('latest')
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $imagename:$BUILD_NUMBER"
         sh "docker rmi $imagename:latest"
 
      }
    }
  }
}
