#!/bin/sh +e
# script is necessary to catch all signals as PID 1 in a container

set -x
pid_backendserver=0

# SIGTERM-handler
term_handler() {

  # we undeploy first because this process might cease to exist while we wait for stoped server
  echo "undeploy ..."
  /app/bootstrapper/undeploy-config-ui.sh

  echo "terminating ..."
  if [ $pid_backendserver -ne 0 ]; then
    kill -SIGTERM "$pid_backendserver"
  fi
  wait "$pid_backendserver"
   exit 143; # 128 + 15 -- SIGTERM
}

# setup handlers
# on callback, kill the last background process, which is `tail -f /dev/null` and execute the specified handler
#      SIGINT SIGKILL SIGTERM SIGQUIT SIGTSTP SIGSTOP SIGHUP 2 9 15 3 20 19 1 
trap 'kill ${!}; term_handler' 2 9 15 3 20 19 1 

# run bootstrapper 
echo "run bootstrapper"
/app/bootstrapper/deploy-config-ui.sh

# run applications as services in the background now
echo "starting server ..."
node ./server.js &

#get process ID of most recently executed background
pid_backendserver="$!"
echo pid_backendserver: $pid_backendserver

# wait forever not to exit the container
while true
do
  tail -f /dev/null & wait ${!}
done

exit 0
