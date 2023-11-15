from rest_framework.views import APIView

from create_article.permissions import HasBeenAuthenticated


class AuthenticatedBaseView(APIView):
    permission_classes = (HasBeenAuthenticated,)
