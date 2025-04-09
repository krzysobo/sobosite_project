#!/bin/sh
. ./set_backend_settings.sh

echo "-- install_backend: VENVDIR: $VENVDIR"
# echo "-- install_backend: TESTDIR: $TESTDIR_BACKEND"
echo "-- install_backend: SRC_DIR_BACKEND: $SRC_DIR_BACKEND"

python3 -V
echo "---- install_backend:: GOING ON WITH INSTALLATION..."
. $VENVDIR/bin/activate
echo $VENVDIR
ls -al $VENVDIR

cd $SRC_DIR_BACKEND
python3 -V
python3 -m pip install -r requirements.txt
