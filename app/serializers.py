from rest_framework import serializers

class DowellFunctionSerializer(serializers.Serializer): 
    name = serializers.CharField(max_length=128, allow_null= False, allow_blank= False)
    data_type = serializers.CharField(max_length=128, allow_null= False, allow_blank= False)
    company_id = serializers.CharField(max_length=128, allow_null= False, allow_blank= False)