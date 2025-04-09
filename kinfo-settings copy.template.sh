#!/bin/sh
export SOBOSITE_POSTGRES_DB=
export SOBOSITE_POSTGRES_USER=
export SOBOSITE_POSTGRES_PASSWORD=
export SOBOSITE_POSTGRES_HOST=localhost
export SOBOSITE_POSTGRES_PORT=5432
export SOBOSITE_BACKEND_DOMAIN=localhost
export SOBOSITE_NODE_ENV=development
export SOBOSITE_BACKEND_HTTP_PORT=3000
export SOBOSITE_BACKEND_HTTP_PORT_GUNICORN=3000


export VUE_APP_BACKEND_BASE_URL=http://localhost:3000/api/v1/
export VUE_APP_BACKEND_PROXY_URL=http://localhost:3000/api/v1/
export VUE_APP_I18N_LOCALE=pl
export VUE_APP_I18N_FALLBACK_LOCALE=en
export VUE_DEV_SERVER_PORT=3030
export VUE_DEV_SERVER_HOST=0.0.0.0


# --- tester settings ---
export TESTDIR_FRONTEND=/usr/local/var/info/_devtest/sobosite/test_frontend
export TESTDIR_FRONTEND_UP=`cd $TESTDIR_FRONTEND/..; pwd`
export VENVDIR=
# --- /tester settings ---


# --- not needed for now, but maybe later...
# export TESTDIR_BACKEND=  #in fact it's unused
# export PYTHONPATH=$PYTHONPATH:/media/krzy/DATADISK_NE/docs/Projects/szambelan/_sobo_modules
# export SOBOSITE_SERVER_KEYS_PATH=/usr/local/var/info/_devtest/sobosite/test_data/keys
# --- /not needed for now, but maybe later...