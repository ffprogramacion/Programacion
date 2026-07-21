from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Aula, Material, Reserva, Profile

# 1. Serializador del Perfil 
class ProfileSerializer(serializers.ModelSerializer):
    rol_display = serializers.CharField(source='get_rol_display', read_only=True)

    class Meta:
        model = Profile
        fields = ['rol', 'rol_display', 'legajo', 'telefono']

# 2. Serializador de Usuarios 
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    nombre_completo = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nombre_completo', 'profile']


# 3. Serializador de Aulas
class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = '__all__'  # Trae todos los campos de la tabla automaticamente


# 4. Serializador de Materiales
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


# 5. Serializador de Reservas 
class ReservaSerializer(serializers.ModelSerializer):
    solicitante_detalle = UserSerializer(source='solicitante', read_only=True)
    aula_detalle = AulaSerializer(source='aula', read_only=True)
    materiales_detalle = MaterialSerializer(source='materiales', many=True, read_only=True)

    class Meta:
        model = Reserva
        fields = [
            'id', 'solicitante', 'solicitante_detalle', 
            'aula', 'aula_detalle', 
            'materiales', 'materiales_detalle', 
            'fecha_reserva', 'hora_inicio', 'hora_fin', 'estado'
        ]