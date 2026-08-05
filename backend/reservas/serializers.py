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
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'nombre_completo', 'profile']

# 3. Serializador de Registro (Escritura - User + Profile simultáneo)
class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    profile = ProfileSerializer(required=False)  # Permite recibir los datos del perfil opcionalmente

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'profile']

    def create(self, validated_data):
        # 1. Extraemos los datos del perfil si vienen en el JSON
        profile_data = validated_data.pop('profile', {})
        
        # 2. Creamos el usuario encriptando la contraseña automáticamente
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # 3. Si usás Signals en Django, el Profile ya se creó solo. 
        #    Actualizamos o creamos sus campos (rol, legajo, telefono):
        profile, created = Profile.objects.get_or_create(user=user)
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return user


# 4. Serializador de Aulas
class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = '__all__'  # Trae todos los campos de la tabla automaticamente


# 5. Serializador de Materiales
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


# 6. Serializador de Reservas 
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
            'fecha_reserva', 'hora_inicio', 'hora_fin', 'estado', 'comision'
        ]