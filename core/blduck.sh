#!/bin/sh
#===============================================================================
#
#          FILE: blduck.sh
# 
#         USAGE: ./blduck.sh -h for details
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Samar Acharya (samar.acharya@brightergy.com), 
#  ORGANIZATION: 
#       CREATED: 11/18/2014 13:45
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error

#vars
DOCKER_REG_HOST="docker.brightergy.com:443"
DOCKER_REG_USR="bldev"
DOCKER_REG_PWD="d0ck3rrD"
DOCKER_REG_EMAIL="dev@brightergy.com"
DEVIMG="${DOCKER_REG_HOST}/bldev/devbase:latest"
IMGTAG="bllocaldev"
HOST_PORT=80
EXP_PORT=80
HOST_DIR="/Users"
BTD_EXE="boot2docker"
SSH_USR="root"
SSH_PWD="root"
ENV_FILE=""

reglogin() {
    docker login --email="${DOCKER_REG_EMAIL}" --username="${DOCKER_REG_USR}" --password="${DOCKER_REG_PWD}" ${DOCKER_REG_HOST}
}

pull() {
    echo "Pulling base image"
    docker pull ${DEVIMG}
    echo "Completed pulling base image"
}

build() {
    docker build -t $IMGTAG .
}

cleanbuild() {
    pull
    docker build --no-cache -t $IMGTAG .
}

run() {
    stop_running_containers
    remove_exited_containers
    if [ -f "$ENV_FILE" ]; then
        docker run --env-file $ENV_FILE -v $HOST_DIR:/var/app -p $HOST_PORT:$EXP_PORT -t $IMGTAG
    else
        docker run -v $HOST_DIR:/var/app -p $HOST_PORT:$EXP_PORT -t $IMGTAG
    fi
}

resume() {
    stop_running_containers
    docker ps -a | grep -v "CONTAINER" | head -n1 | cut -d" " -f1 | xargs --no-run-if-empty docker restart
}

readenv() {
    docker ps -a | grep "ago.*Up" | cut -d" " -f1  | xargs --no-run-if-empty docker inspect -f "{{ .Config.Env }}"
}

stop_running_containers() {
    docker ps -a | grep "ago.*Up" | cut -d" " -f1 | xargs --no-run-if-empty docker stop
}

remove_exited_containers() {
    docker ps -a | grep Exited | cut -d" " -f1 | xargs --no-run-if-empty docker rm
}

remove_untagged_images() {
    docker rmi $(docker images | grep "^<none>" | awk '{print($3)}')
}

forward() {
    $BTD_EXE ssh -L $HOST_PORT:localhost:$HOST_PORT
}

ssh_to_btd() {
    $BTD_EXE ssh
}

ssh_to_container() {
    IP=$(docker ps -a | grep "Up" | cut -d" " -f1 | xargs --no-run-if-empty docker inspect -f "{{.NetworkSettings.IPAddress}}")
    echo "Your password is: root"
    ssh -q -oUserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no $SSH_USR@$IP
}

taillog() {
    IP=$(docker ps -a | grep "Up" | cut -d" " -f1 | xargs --no-run-if-empty docker inspect -f "{{.NetworkSettings.IPAddress}}")
    echo "Your password is: root"
    ssh -q -oUserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no $SSH_USR@$IP "tail -f -n100 /var/log/nodejs*"
}

usage() {
    echo -e >&2 "
Usage: $0 <option>
Description: build (b), cleanbuild (cb), run(r) rmc, rmi, ssh must be run inside boot2docker
             up (or f or forward) must be run from host system
Options:
build , b - \t\tBuild an image from repo
cleanbuild , cb - \tPull latest base image from registry and build an image
e , env - \t\tList environment variables used by container
l , login - \t\tLogin to brighterlink's docker registry
r , run [ENV_FILE] - \tRun a built container
rs , resume - \t\tResume last ran container
rb [ENV_FILE] - \tBuild an image and run it
rcb [ENV_FILE] - \tClean build an image and run it
rmc - \t\t\tRemove all exited containers
rmi - \t\t\tRemove all untagged images
ssh - \t\t\tSSH to boot2docker VM
sshc - \t\t\tSSH to running container
t , tail -\t\tView nodejs log
up, f, forward - \tstart ssh tunnel to route traffic to running docker container
"
}

if [ $# -ne 1 ] && [ $# -ne 2 ]; then
    usage; exit;
fi

if [ $# -eq 2 ]; then
    ENV_FILE=$2
fi
case "$1" in
    build | b) build ;;
    cleanbuild | cb) cleanbuild ;;
    e | env) readenv ;;
    l | login) reglogin ;;
    r | run) run ;;
    rs | resume) resume ;;
    rb) build; run ;;
    rcb) cleanbuild; run ;;
    rmc) remove_exited_containers ;;
    rmi) remove_untagged_images ;;
    ssh) ssh_to_btd ;;
    sshc) ssh_to_container ;;
    t | tail) taillog ;;
    up | f | forward) forward ;;
    *) usage ;;
esac
