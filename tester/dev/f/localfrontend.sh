#!/bin/sh
pwd
. ./set_front_settings.sh

echo "-- localfrontend: SRC_DIR_FRONTEND: $SRC_DIR_FRONTEND"
. $NVM_DIR/nvm.sh; nvm use 18
cd $SRC_DIR_FRONTEND
# npm run serve
ng serve --open


