pipeline {
  environment {
    imagename = "mulya123/dataquad"
    registryCredential = 'f3b9ffb0-6c23-44fe-97e3-0538eb3206e2'
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
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push("$BUILD_NUMBER")
             dockerImage.push('latest')
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
