#!/bin/sh
. ./clearfrontend.sh
echo "-- makedevfrontend: TESTDIR_FRONTEND: $TESTDIR_FRONTEND"
echo "-- makedevfrontend: SRC_DIR_FRONTEND: $SRC_DIR_FRONTEND"
echo "-- makedevfrontend: TESTDIR_FRONTEND_UP: $TESTDIR_FRONTEND_UP"

cd $SRC_DIR_FRONTEND

mkdir -p $TESTDIR_FRONTEND
cp -R . $TESTDIR_FRONTEND

cd $TESTDIR_FRONTEND

npm update
npm install
. $NVM_DIR/nvm.sh; nvm use 18
# npm run serve
ng serve --open


