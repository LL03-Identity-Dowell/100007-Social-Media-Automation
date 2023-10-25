def session_id(request):
    return {'session_id': request.session.get("session_id", None)}
