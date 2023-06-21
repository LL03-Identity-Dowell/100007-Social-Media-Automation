from rest_framework.response import Response
from .serializers import SentenceSerializer
from rest_framework import status
from rest_framework.views import APIView
from website.models import Sentences

# views to post and get initial sentence
class SentenceApiView(APIView):
    def get(self,request,formart=None):
        sentences =Sentences.objects.all()
        serializer = SentenceSerializer(sentences,many=True)
        return Response(serializer.data)
    
    def post (self,request):
        serializer = SentenceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)