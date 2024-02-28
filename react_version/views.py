from rest_framework.views import APIView

from react_version.permissions import HasBeenAuthenticated


class AuthenticatedBaseView(APIView):
    permission_classes = (HasBeenAuthenticated,)
