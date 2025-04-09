#!/bin/sh
. ./set_front_settings.sh

echo "-- updatefrontend: TESTDIR: $TESTDIR_FRONTEND"

cp -R $SRC_DIR_FRONTEND/src/* $TESTDIR_FRONTEND/src
cp -R $SRC_DIR_FRONTEND/src/.* $TESTDIR_FRONTEND/src
cp -R $SRC_DIR_FRONTEND/src/*. $TESTDIR_FRONTEND/src

cp -R $SRC_DIR_FRONTEND/public/* $TESTDIR_FRONTEND/public
cp -R $SRC_DIR_FRONTEND/public/.* $TESTDIR_FRONTEND/public
cp -R $SRC_DIR_FRONTEND/public/*. $TESTDIR_FRONTEND/public