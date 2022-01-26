pipeline {
  agent { kubernetes { inheritFrom 'default' } }
  environment {
    KANIKO_OPTIONS = "--cache=${CACHE} --compressed-caching=false --build-arg registry=${ECR}"
  }
  stages {
    stage('build') {
      steps {
        container('kaniko') {
          ansiColor('xterm') {
            sh '/kaniko/executor -f `pwd`/Dockerfile.base -c `pwd` -d=${ECR}/bizquest/base:latest ${KANIKO_OPTIONS}'
            sh '/kaniko/executor -f `pwd`/Dockerfile.test -c `pwd` -d=${ECR}/bizquest/test:latest ${KANIKO_OPTIONS}'
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
            sh '/kaniko/executor -f `pwd`/Dockerfile.app -c `pwd` -d=${ECR}/bizquest/app:${RELEASE_TAG} ${KANIKO_OPTIONS}'
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
