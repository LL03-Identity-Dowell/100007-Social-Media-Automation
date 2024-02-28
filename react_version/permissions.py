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


class EditPostPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':

            # Check if session_id is passed in the URL query parameters
            session_id_from_query = request.query_params.get(
                'session_id', None)
            # Check if session_id is passed in the Authorization header
            session_id_from_header = request.headers.get(
                'Authorization', '').replace('Bearer ', '')
            # Prefer the session_id from the URL query parameters if available
            session_id = session_id_from_query or session_id_from_header
            request.session["session_id"] = session_id
            if 'session_id' in request.session:
                return True
            else:
                return False

        elif request.method == 'POST':
            origin = request.headers.get('Origin')
            if origin == 'https://ll04-finance-dowell.github.io':
                return True
            else:
                return False

        else:
            return True
