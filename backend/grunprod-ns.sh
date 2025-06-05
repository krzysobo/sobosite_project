#!/bin/bash
cd /var/www/sobosite/sobosite_project/backend

KINFO_SETTINGS_PATH=/var/www/sobosite/sobosite_project/kinfo-settings-contabo.sh
# ====== settings (DB AND VueJS) ======

echo "loading KINFO_SETTINGS at $KINFO_SETTINGS_PATH ..."
source $KINFO_SETTINGS_PATH

# echo "PYTHON PATH: $PYTHONPATH"
echo "POSTGRES_DB: $SOBOSITE_POSTGRES_DB"
echo "HTTP PORT (external): $SOBOSITE_BACKEND_HTTP_PORT"
echo "HTTP PORT (gunicorn): $SOBOSITE_BACKEND_HTTP_PORT_GUNICORN"

# ====== /settings (DB AND VueJS) ======

echo "blah bla blah sobosite"

NAME="sobosite_application"                                       # Name of the application
USER=krzy                                               # the user to run as
GROUP=krzy                                              # the group to run as
NUM_WORKERS=9                                               # how many worker processes should Gunicorn spawn

echo "Starting $NAME" # Activate the virtual environment

cd $DJANGODIR

echo "Activating environment with PATH: $VIRTUAL_ENV_PATH - calling $VIRTUAL_ENV_PATH/bin/activate"
source $VIRTUAL_ENV_PATH/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH                    # Create the run directory if it does nopt exist

# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
echo "$VIRTUAL_ENV_PATH/bin/gunicorn ${DJANGO_WSGI_MODULE}:application --name $NAME --workers $NUM_WORKERS --user=$USER --group=$GROUP --bind 0.0.0.0:$SOBOSITE_BACKEND_HTTP_PORT_GUNICORN --log-level=debug --log-file=$LOG_FILE --timeout 360"
exec $VIRTUAL_ENV_PATH/bin/gunicorn ${DJANGO_WSGI_MODULE}:application --name $NAME --workers $NUM_WORKERS --user=$USER --group=$GROUP --bind 0.0.0.0:$SOBOSITE_BACKEND_HTTP_PORT_GUNICORN --log-level=debug --log-file=$LOG_FILE --timeout 360
