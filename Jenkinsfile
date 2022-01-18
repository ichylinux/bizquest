pipeline {
  agent { kubernetes { inheritFrom 'default' } }
  stages {
    stage('build') {
      steps {
        container('kaniko') {
          ansiColor('xterm') {
            sh '/kaniko/executor -f `pwd`/Dockerfile.base -c `pwd` --cache=${CACHE} -d=${ECR}/bizquest/base:latest --build-arg registry=${ECR}'
            sh '/kaniko/executor -f `pwd`/Dockerfile.test -c `pwd` --cache=${CACHE} -d=${ECR}/bizquest/test:latest --build-arg registry=${ECR}'
          }
        }
      }
    }
    stage('test') {
      agent {
        kubernetes {
          yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: bizquest
    image: ${ECR}/bizquest/test:latest
    imagePullPolicy: Always
    command:
    - cat
    tty: true
"""
        }
      }
      environment {
        DISABLE_SPRING = true
      }
      steps {
        container('bizquest') {
          ansiColor('xterm') {
            sh "rails db:reset"
            sh "rails test"
          }
        }
      }
    }
    stage('release') {
      environment {
        RELEASE_TAG = "v0.0.1-${BUILD_NUMBER}"
      }
      steps {
        container('kaniko') {
          ansiColor('xterm') {
            sh '/kaniko/executor -f `pwd`/Dockerfile.app -c `pwd` --cache=${CACHE} -d=${ECR}/bizquest/app:${RELEASE_TAG} --build-arg registry=${ECR}'
          }
        }
        container('jnlp') {
          sshagent(credentials: [env.GITHUB_SSH_KEY]) {
            sh "git push origin HEAD:release"
            sh "git tag ${RELEASE_TAG}"
            sh "git push origin ${RELEASE_TAG}"
          }
        }
      }
    }
  }
}
