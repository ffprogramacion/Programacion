from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

from .models import Aula, Material, Reserva, Profile
from .serializers import (
    AulaSerializer, 
    MaterialSerializer, 
    ReservaSerializer, 
    UserSerializer, 
    RegistroSerializer
)


class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticated]


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated]


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios logueados pueden gestionar reservas

    def get_queryset(self):
        user = self.request.user
        
        # Validación segura para evitar fallos si no hay sesión activa
        if not user.is_authenticated:
            return Reserva.objects.none()

        # Verificamos si existe el perfil y si el rol es 'admin' o el correspondiente 
        if hasattr(user, 'profile') and user.profile.rol == 'admin': 
            return Reserva.objects.all()
            
        return Reserva.objects.filter(solicitante=user)


# Vista dedicada EXCLUSIVAMENTE a crear usuarios nuevos (Pública)
class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]


# Vista opcional: Devuelve los datos del usuario logueado actualmente
class UserPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)