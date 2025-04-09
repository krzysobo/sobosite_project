#!/bin/sh
. ../../../kinfo-settings.sh
export TESTDIR_FRONTEND=/usr/local/var/info/_devtest/sobosite/test_frontend
export TESTDIR_FRONTEND_UP=`cd $TESTDIR_FRONTEND/..; pwd`
export SRC_DIR_FRONTEND=`cd ../../../frontend;pwd`
echo "-- set_front_settings: TESTDIR_FRONTEND: $TESTDIR_FRONTEND"
echo "-- set_front_settings: TESTDIR_FRONTEND_UP: $TESTDIR_FRONTEND_UP"
echo "-- set_front_settings: SRC_DIR_FRONTEND: $SRC_DIR_FRONTEND"
echo "-- set_front_settings: NVM_DIR: $NVM_DIR"


