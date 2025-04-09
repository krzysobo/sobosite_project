from rest_framework import permissions
from django.contrib.auth.models import AnonymousUser
import user_forms.models

class PermIsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == user_forms.models.User.UserRoleE.ADMIN and request.user.is_staff


class PermIsAuth(permissions.BasePermission):
    def has_permission(self, request, view):
        # print("\n REQUEST USER ", request.user, request.user.__str__)
        if isinstance(request.user, user_forms.models.User):
            return request.user.role in [user_forms.models.User.UserRoleE.USER, user_forms.models.User.UserRoleE.ADMIN]
        return False