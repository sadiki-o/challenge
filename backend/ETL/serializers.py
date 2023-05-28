from rest_framework import serializers
from .models import Transformations
from rest_framework import serializers
from .models import CsvFiles

class TransformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transformations
        fields = '__all__'


class CsvFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CsvFiles
        fields = '__all__'
