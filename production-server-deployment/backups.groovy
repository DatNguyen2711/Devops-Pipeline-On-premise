    import jenkins.model.*
    import hudson.FilePath

    backup_Path_FE = "/home/pharmacy-web/project/pharmacy-website/backups/front-end"
    backup_Path_BE = "/home/pharmacy-web/project/pharmacy-website/backups/back-end"

    def server = Jenkins.getInstance().getNode(server)
    def nameFile = []

    if (project == "front_end"){
        def remoteDir_FE = new FilePath(server.getChannel(), "${backup_Path_FE}")
        def files = remoteDir_FE.list()
        nameFile = files.collect { it.name }

    }
    if (project == "back_end"){
        def remoteDir_BE = new FilePath(server.getChannel(), "${backup_Path_BE}")
        def files = remoteDir_BE.list()
        nameFile = files.collect { it.name }

    }

    if (action == "rollback") {
        return nameFile
    }

