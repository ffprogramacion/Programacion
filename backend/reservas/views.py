from django.shortcuts import render
from rest_framework import viewsets
from .models import Aula, Material, Reserva
from .serializers import AulaSerializer, MaterialSerializer, ReservaSerializer

class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

    def get_queryset(self):
         user = self.request.user
         if user.profile.rol == 'admin':
             return Reserva.objects.all()
         return Reserva.objects.filter(solicitante=user)
