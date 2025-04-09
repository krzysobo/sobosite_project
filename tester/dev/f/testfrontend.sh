#!/bin/sh
pwd
. ./set_front_settings.sh

echo "-- testfrontend: TESTDIR_FRONTEND: $TESTDIR_FRONTEND"
. $NVM_DIR/nvm.sh; nvm use 18
cd $TESTDIR_FRONTEND
# npm run serve
ng serve --open


