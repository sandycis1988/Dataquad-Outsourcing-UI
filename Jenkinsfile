pipeline {
    agent any  // Use any available agent
    environment {
        DOCKER_IMAGE = 'react-app'  // Docker image name
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from your repository
                git 'https://github.com/NaveenKumar-dataquad/Dataquad-Outsourcing-UI/tree/master'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image for the React app
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }
        stage('Run Docker Image') {
            steps {
                script {
                    // Run the Docker container
                    sh 'docker run -d -p 3000:3000 $DOCKER_IMAGE'
                }
            }
        }
        stage('Cleanup') {
            steps {
                script {
                    // Stop and remove the container after testing
                    sh 'docker ps -q --filter "ancestor=$DOCKER_IMAGE" | xargs docker stop | xargs docker rm'
                }
            }
        }
    }
    post {
        always {
            // Clean up any leftover Docker images or containers
            sh 'docker system prune -f'
        }
    }
}
                        