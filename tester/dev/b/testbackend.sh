#!/bin/bash
. ./install_backend.sh

python3 manage.py runserver 0.0.0.0:$SOBOSITE_BACKEND_HTTP_PORT

