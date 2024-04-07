// REGISTRY
REGISTRY_URL = 'registry.datlaid-regsitry.store'
REGISTRY_USER = 'admin'
REGISTRY_PASSWORD = '234555ax'
REGISTRY_PROJECT_BE = 'pharmacy_web_backend'
REGISTRY_PROJECT_FE = 'pharmacy_web_frontend'

// APP
appName = 'Pharmacy_Website_datlaid'
appUser = 'pharmacy-web'
appType_Frontend = 'front_end'
appType_Backend = 'back_end'
DOCKER_IMAGE_FRONTEND = "${REGISTRY_URL}/${REGISTRY_PROJECT}/${appType_Frontend}"
DOCKER_IMAGE_BACKEND = "${REGISTRY_URL}/${REGISTRY_PROJECT}/${appType_Backend}"

// BUILD PROCESS_STAGING
loginScript = "docker login -u ${REGISTRY_USER} -p ${REGISTRY_PASSWORD} ${REGISTRY_URL}"
buildFrontEnd_production = "docker build -t ${DOCKER_IMAGE_FRONTEND}:production --build-arg BUILD_ENV=production ."
buildBackEnd_production = "docker build -t ${DOCKER_IMAGE_BACKEND}:production ."
pushToRegistryFrontend_production = "docker push ${DOCKER_IMAGE_FRONTEND}:production"
pushToRegistryBackend_production = "docker push ${DOCKER_IMAGE_BACKEND}:production"
removeOldImage_production = "docker image rm -f ${DOCKER_IMAGE_FRONTEND}:production ${DOCKER_IMAGE_BACKEND}:production"

// PROJECT FOLDER
folderDeploy = "/home/${appUser}/project/pharmacy-website/run "     //folder chạy
folderBackup_FrontEnd = "/home/${appUser}/project/pharmacy-website/backups/front-end" //folder backup fe để rollback
folderBackup_BackEnd = "/home/${appUser}/project/pharmacy-website/backups/back-end" //folder backup be để rollback
folderMain = "/home/${appUser}/project/pharmacy-website" //folder origin

pathTo_Frontend = '/var/lib/jenkins/workspace/deployment-production/Pharmacy-website/pharmacy-website'
pathTo_Backend = '/var/lib/jenkins/workspace/deployment-production/Pharmacy-website/pharmacy-website-be'

// DEPLOY PROCESS
permissionScript = "sudo chown -R ${appUser}. ${folderDeploy}"
stopScript = 'docker compose down'
pullImageScript_Frontend = "docker pull ${DOCKER_IMAGE_FRONTEND}:production"
pullImageScript_Backend = "docker pull ${DOCKER_IMAGE_BACKEND}:production"
runScript = 'docker compose up -d'
deployScript = """
                sudo su ${appUser} -c '
                ${loginScript} &&
                cd ${folderDeploy} &&
                ${permissionScript} &&
                ${stopScript} &&
                ${removeOldImage_production} &&
                ${pullImageScript_Frontend} &&
                ${pullImageScript_Backend} &&
                ${runScript} '
             """

deployAfterRollBackScript = """
                sudo su ${appUser} -c '
                ${loginScript} &&
                cd ${folderDeploy} &&
                ${permissionScript} &&
                ${stopScript} &&
                ${runScript} '
             """

// CONTAINER
containerApp_Frontend = 'client'
containerApp_Backend = 'server'
containerDB = 'database'

// REPO LINK
gitLink_FrontEnd = 'http://gitlab.datlaid.tech/jenkins/pharmacy-website.git' //link dự án
gitLink_BackEnd = 'http://gitlab.datlaid.tech/jenkins/pharmacy-website-be.git'

// START
def startProcess() {
    stage('start') {
        sh(script: """ ${deployScript} """, label: 'deploy on staging server')
        sleep 5
        sh(script: ""' docker ps '"", label: 'check status')
    }
    echo('Pharmacy website with server ' + params.server + ' started')
}

// START AFTER ROLLBACK
def startAfterRollBackProcess() {
    stage('startAfterRollBack') {
        sh(script: """ ${deployAfterRollBackScript} """, label: 'deploy on staging server after rollback')
        sleep 5
        sh(script: ""' docker ps '"", label: 'check status')
    }
    echo("${appName} with server " + params.server + ' started')
}

// STOP
def stopProcess() {
    stage('stop') {
        // Lấy danh sách tất cả các container đang chạy
        def runningContainers = sh(script: 'docker ps --format "{{.Names}}"', returnStdout: true).trim().split('\n')

        // Kiểm tra xem containerApp và containerDB có trong danh sách không
        def isContainerAppFrontendRunning = containerApp_Frontend in runningContainers
        def isContainerAppBackendRunning = containerApp_Backend in runningContainers
        def isContainerDBRunning = containerDB in runningContainers

        if (isContainerAppFrontendRunning || isContainerAppBackendRunning || isContainerDBRunning) {
            // Nếu có ít nhất một trong 3 container đang chạy, thực hiện lệnh stop và remove
            sh(script: """ docker stop ${containerApp_Frontend} ${containerApp_Backend} ${containerDB} """, label: 'stop containers')
            sh(script: """ docker rm ${containerApp_Frontend} ${containerApp_Backend} ${containerDB} """, label: 'remove containers')
            echo('Containers stopped and removed successfully.')
        } else {
            // Nếu cả 3 container đều không chạy
            echo("There's no container to stop.")
        }
    }
    echo('Pharmacy website with server ' + params.server + ' stopped')
}

//BACKUP
def backupProcess() {
    stage('backup') {
        // appName_time ngày_time giờ_mã hash cần back up.tar
        def timeStamp = new Date().format('ddMMyyyy_HHmm')
        sh(script: """ sudo su ${appUser} -c "cd ${folderMain}; docker save -o ${folderBackup_FrontEnd}/${appType_Frontend}_${timeStamp}.tar ${DOCKER_IMAGE_FRONTEND}:staging " """, label: 'backup old fe version')
        sh(script: """ sudo su ${appUser} -c "cd ${folderMain}; docker save -o ${folderBackup_BackEnd}/${appType_Backend}_${timeStamp}.tar ${DOCKER_IMAGE_BACKEND}:staging " """, label: 'backup old be version')
    }
}

//UPCODE
def upcodeProcess() {
    if (params.project == 'frontend') {
        stage('checkout staging branch') {
            checkout([$class: 'GitSCM', branches: [[name: params.hash ]],
                  userRemoteConfigs: [[credentialsId: 'jenkins-gitlab-user-account', url: gitLink_FrontEnd]]])
        }
        stage('build for staging') {
            sh(script: """ ${loginScript} """, label: 'login to registry')
            sh(script: ""' whoami '"", label: 'check user')
            sh(script: """ cd ${pathTo_Frontend}; ls ; ${buildFrontEnd_Staging}  """, label: 'build frontend with Dockerfile')
            sh(script: """ ${pushToRegistryFrontend_Staging} """, label: 'push new fe image to registry')
            sh(script: """ ${removeOldImage_Staging} """, label: 'remove old images')
        }
    }
    if (params.project == 'backend') {
         stage('checkout staging branch') {
            checkout([$class: 'GitSCM', branches: [[name: params.hash ]],
                  userRemoteConfigs: [[credentialsId: 'jenkins-gitlab-user-account', url: gitLink_BackEnd]]])
         }
        stage('build for staging') {
            sh(script: """ ${loginScript} """, label: 'login to registry')
            sh(script: ""' whoami '"", label: 'check user')
            sh(script: """ cd ${pathTo_Backend}; ls ; ${buildBackEnd_Staging} """, label: 'build backend with Dockerfile')
            sh(script: """ ${pushToRegistryBackend_Staging} """, label: 'push new be image to registry')
            sh(script: """ ${removeOldImage_Staging} """, label: 'remove old images')
        }
    }

}

// ROLLBACK
def rollbackProcess() {
      if (params.project == 'frontend') {
        stage('rollback') {
        sh(script: """ sudo su ${appUser} -c "cd ${folderDeploy}; docker image rm ${DOCKER_IMAGE_FRONTEND}:staging" """, label: 'delete the current image')
        sh(script: """ sudo su ${appUser} -c "cd ${folderBackup_FrontEnd}; docker load < ${params.rollback_version} " """, label: 'rollback process')
        }
      }
      if (params.project == 'backend') {
        stage('rollback') {
        sh(script: """ sudo su ${appUser} -c "cd ${folderDeploy}; docker image rm ${DOCKER_IMAGE_FRONTEND}:staging" """, label: 'delete the current image')
        sh(script: """ sudo su ${appUser} -c "cd ${folderBackup_BackEnd}; docker load < ${params.rollback_version} " """, label: 'rollback process')
        }
      }
}

// CHOICES
node(params.server) {
    currentBuild.displayName = params.action
    if (params.action == 'start') {
        startProcess()
    }
    if (params.action == 'stop') {
        stopProcess()
    }
    if (params.action == 'upcode') {
        // Clone source code - > build -> deploy
        currentBuild.description = 'server ' + params.server + ' with hash ' + params.hash
        // backupProcess()
        stopProcess()
        upcodeProcess()
        startProcess()
    }
    if (params.action == 'rollback') {
        stopProcess()
        rollbackProcess()
        startAfterRollBackProcess()
    }
}
