#!/bin/bash
. ./install_backend.sh

python3 manage.py loaddata datax.json




