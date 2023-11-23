from rest_framework import permissions


class HasBeenAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):

        if 'session_id' in request.session and 'username' in request.session:
            return True

        return False
