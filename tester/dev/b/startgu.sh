#!/bin/bash

. ./install_backend.sh

gunicorn web.wsgi:application --bind 0.0.0.0:$SOBOSITE_BACKEND_HTTP_PORT_GUNICORN
