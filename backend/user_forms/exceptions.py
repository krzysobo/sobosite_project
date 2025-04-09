from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, status


class Conflict409Exception(exceptions.APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = _('A server error occurred -- conflict.')
    default_code = 'error'
