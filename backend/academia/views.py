from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Carrera, Materia, Comision
from .serializers import CarreraSerializer, MateriaSerializer, ComisionSerializer

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer
    permission_classes = [permissions.IsAuthenticated] # 🔒 Protegido

class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer
    permission_classes = [permissions.IsAuthenticated] # 🔒 Protegido

class ComisionViewSet(viewsets.ModelViewSet):
    serializer_class = ComisionSerializer
    permission_classes = [permissions.IsAuthenticated] # 🔒 Protegido

    def get_queryset(self):
        """
        Control de acceso a los datos según el rol del usuario logueado.
        """
        user = self.request.user
        if not user.is_authenticated:
            return Comision.objects.none()

        # Administradores y Estudiantes pueden ver todo el catálogo
        # (Los estudiantes necesitan ver todo para poder buscar a qué materia inscribirse)
        if hasattr(user, 'profile'):
            if user.profile.rol in ['admin', 'student']:
                return Comision.objects.all()
            
            # Los docentes solo ven las comisiones donde ellos son los profesores asignados
            elif user.profile.rol == 'teacher':
                return Comision.objects.filter(profesor=user)
        
        return Comision.objects.none()

    def perform_create(self, serializer):
        """
        Si un profesor crea una comisión desde React, automáticamente 
        se le asigna como el profesor titular por seguridad.
        """
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.rol == 'teacher':
            serializer.save(profesor=user)
        else:
            serializer.save()

    # NUEVO ENDPOINT: /api/academia/comisiones/inscribirse/
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def inscribirse(self, request):
        user = request.user
        
        # Validamos que solo los estudiantes puedan inscribirse
        if not hasattr(user, 'profile') or user.profile.rol != 'student':
            return Response({"detail": "Solo los estudiantes pueden inscribirse a materias."}, status=status.HTTP_403_FORBIDDEN)

        # Recibimos los datos del frontend (desde Clases.jsx)
        nombre_materia = request.data.get('nombre', '').strip().lower()
        # Nota: Tu modelo actual no tiene un campo 'clave', 
        # así que la inscripción la buscaremos solo por el nombre exacto de la materia o comisión.
        
        if not nombre_materia:
            return Response({"detail": "Debe proporcionar el nombre de la asignatura."}, status=status.HTTP_400_BAD_REQUEST)

        # Buscamos la comisión (ignorando mayúsculas/minúsculas)
        comision = Comision.objects.filter(materia__nombre__iexact=nombre_materia).first()
        
        # Si no la encuentra por nombre de materia, probamos por nombre de comisión
        if not comision:
             comision = Comision.objects.filter(nombre__iexact=nombre_materia).first()

        if not comision:
            return Response({"detail": "No se encontró ninguna asignatura con ese nombre."}, status=status.HTTP_404_NOT_FOUND)

        # Verificamos si ya está inscrito
        if comision.alumnos.filter(id=user.id).exists():
            return Response({"detail": "Ya te encuentras matriculado en esta asignatura."}, status=status.HTTP_400_BAD_REQUEST)

        # Inscribimos al alumno (ManyToMany)
        comision.alumnos.add(user)

        return Response({
            "detail": "Inscripción exitosa", 
            "clase_id": comision.id,
            "nombre": f"{comision.materia.nombre} ({comision.nombre})"
        }, status=status.HTTP_200_OK)