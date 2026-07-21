from django.shortcuts import render
from rest_framework import viewsets
from .models import Carrera, Materia, Comision
from .serializers import CarreraSerializer, MateriaSerializer, ComisionSerializer

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer

class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer

class ComisionViewSet(viewsets.ModelViewSet):
    queryset = Comision.objects.all()
    serializer_class = ComisionSerializer
