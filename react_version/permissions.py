from rest_framework import permissions


class HasBeenAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        session_id_from_query = request.query_params.get('session_id', None)
        session_id_from_header = request.headers.get(
            'Authorization', '').replace('Bearer ', '')
        session_id = session_id_from_query or session_id_from_header
        if not request.session.get('session_id'):
            request.session["session_id"] = session_id
        if request.session.get('session_id'):
            return True
        return False
