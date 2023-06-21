from rest_framework import permissions

from config_master import DEFAULT_ACCESS_TOKEN


class HasBeenAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            token = request.data.get('token')
            if not token:
                return False
            if token == DEFAULT_ACCESS_TOKEN:
                return True
