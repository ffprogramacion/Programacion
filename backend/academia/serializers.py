from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Carrera, Materia, Comision

class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrera
        fields = '__all__'

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = '__all__'

class ComisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comision
        fields = '__all__'