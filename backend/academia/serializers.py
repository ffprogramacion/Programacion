from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Carrera, Materia, Comision

class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrera
        fields = '__all__'

class MateriaSerializer(serializers.ModelSerializer):
    # Traemos datos de lectura útiles para no ver solo el número de ID de la carrera
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)
    carrera_codigo = serializers.CharField(source='carrera.codigo', read_only=True)
    ano_display = serializers.CharField(source='get_ano_display', read_only=True)
    cuatrimestre_display = serializers.CharField(source='get_cuatrimestre_display', read_only=True)

    class Meta:
        model = Materia
        fields = '__all__'

class ComisionSerializer(serializers.ModelSerializer):
    # Adaptadores mágicos para que React (Clases.jsx) reciba todo listo
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    
    # Campos personalizados generados al vuelo (SerializerMethodField)
    nombre = serializers.SerializerMethodField()
    profesor_nombre = serializers.SerializerMethodField()
    horario = serializers.SerializerMethodField()
    alumnosCount = serializers.SerializerMethodField()

    class Meta:
        model = Comision
        fields = [
            'id', 'materia', 'materia_nombre', 
            'nombre', # Ojo: Sobreescribimos 'nombre' para que mande Materia + Comisión
            'profesor', 'profesor_nombre', 
            'alumnos', 'alumnosCount',
            'dia_semana', 'hora_inicio', 'hora_fin', 'horario'
        ]

    # --- MÉTODOS PARA GENERAR LOS CAMPOS CUSTOM ---

    def get_nombre(self, obj):
        # Transforma el JSON para que React reciba: "Sistemas Embebidos (Comisión A)"
        return f"{obj.materia.nombre} ({obj.nombre})"

    def get_profesor_nombre(self, obj):
        # Extrae el nombre real del profesor para la tarjeta visual
        if obj.profesor:
            return obj.profesor.get_full_name() or obj.profesor.username
        return "A designar"

    def get_horario(self, obj):
        # Transforma a string: "Jueves de 08:00 a 12:00"
        inicio = obj.hora_inicio.strftime('%H:%M') if obj.hora_inicio else ''
        fin = obj.hora_fin.strftime('%H:%M') if obj.hora_fin else ''
        return f"{obj.dia_semana} de {inicio} a {fin}"

    def get_alumnosCount(self, obj):
        # Cuenta automáticamente cuántos usuarios están en el ManyToMany
        return obj.alumnos.count()