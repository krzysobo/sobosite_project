#!/bin/bash
. ./install_backend.sh

python3 manage.py makemigrations
python3 manage.py migrate





