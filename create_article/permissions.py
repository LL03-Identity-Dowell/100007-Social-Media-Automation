from rest_framework import permissions


class HasBeenAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        session_id = request.headers.get(
            'Authorization', '').replace('Bearer ', '')
        print(session_id)
        request.session["session_id"] = session_id
        if 'session_id' in request.session:
            return True
        return False
