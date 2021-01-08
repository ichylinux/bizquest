pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    volumeMounts:
      - name: ssh-config
        mountPath: /home/jenkins/.ssh/
  - name: docker
    image: ichylinux/docker:20.03
    command:
    - cat
    tty: true
    securityContext:
      privileged: true
    volumeMounts:
      - name: docker-config
        mountPath: /root/.docker/
      - name: aws-secret
        mountPath: /root/.aws/
      - name: docker-socket
        mountPath: /var/run/docker.sock
  volumes:
    - name: aws-secret
      secret:
        secretName: aws-secret
    - name: docker-config
      configMap:
        name: docker-config
    - name: docker-socket
      hostPath:
        path: /var/run/docker.sock
        type: File
    - name: ssh-config
      configMap:
        name: ssh-config
"""
    }
  }
  stages {
    stage('build') {
      steps {
        container('docker') {
          ansiColor('xterm') {
            sh "docker build --no-cache=${NO_CACHE} -f Dockerfile.base -t bizquest/base:latest --network=host ."
            sh "docker tag bizquest/base:latest ${ECR}/bizquest/base:latest"
            sh "docker push ${ECR}/bizquest/base:latest"
            sh "docker build --no-cache=${NO_CACHE} -f Dockerfile.test -t bizquest/test:latest --network=host ."
            sh "docker tag bizquest/test:latest ${ECR}/bizquest/test:latest"
            sh "docker push ${ECR}/bizquest/test:latest"
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
            sh "bundle exec rails db:reset"
            sh "bundle exec rails test"
          }
        }
      }
    }
    stage('release') {
      environment {
        RELEASE_TAG = "v0.0.1-${BUILD_NUMBER}"
      }
      steps {
        container('docker') {
          ansiColor('xterm') {
            sh "docker build --no-cache=${NO_CACHE} -f Dockerfile.app -t ${ECR}/bizquest/app:latest --network=host ."
            sh "docker tag ${ECR}/bizquest/app:latest ${ECR}/bizquest/app:${RELEASE_TAG}"
            sh "docker push ${ECR}/bizquest/app:latest"
            sh "docker push ${ECR}/bizquest/app:${RELEASE_TAG}"
          }
        }
        container('jnlp') {
          sshagent(credentials: [env.CODECOMMIT_SSH_KEY]) {
            sh "git push origin HEAD:release"
            sh "git tag ${RELEASE_TAG}"
            sh "git push origin ${RELEASE_TAG}"
          }
        }
      }
    }
  }
}
