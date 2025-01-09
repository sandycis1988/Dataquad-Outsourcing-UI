pipeline {
  environment {
    imagename = "mulya123/dataquad"
    registryCredential = 'docker-hub'
    DOCKER_IMAGE_NAME = 'react-app'
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
          docker.withRegistry( 'https://hub.docker.com/repository/docker/mulya123/dataquad/', registryCredential ) {
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
