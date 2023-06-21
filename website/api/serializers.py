from rest_framework import serializers
from website.models import Sentences

# getting the initial words for the sentences
class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentences
        fields ='__all__'