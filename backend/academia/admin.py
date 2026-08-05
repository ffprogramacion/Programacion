from django.contrib import admin
from .models import Carrera, Materia, Comision

@admin.register(Carrera)
class CarreraAdmin(admin.ModelAdmin):
    list_display = ('id', 'codigo', 'nombre')
    search_fields = ('nombre', 'codigo')
    ordering = ('codigo',)

@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'carrera', 'ano', 'cuatrimestre')
    list_filter = ('carrera', 'ano', 'cuatrimestre')
    search_fields = ('nombre', 'carrera__nombre', 'carrera__codigo')
    ordering = ('carrera', 'ano', 'nombre')

@admin.register(Comision)
class ComisionAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'materia', 'get_carrera', 'profesor', 'dia_semana', 'horario_cursada')
    list_filter = ('dia_semana', 'materia__carrera', 'materia')
    search_fields = ('nombre', 'materia__nombre', 'profesor__username', 'profesor__first_name', 'profesor__last_name')
    filter_horizontal = ('alumnos',)  # Selector doble súper cómodo para inscribir alumnos
    ordering = ('materia', 'nombre')

    # Método para mostrar la carrera a la que pertenece la materia en la lista
    @admin.display(description='Carrera')
    def get_carrera(self, obj):
        return obj.materia.carrera.codigo

    # Método para formatear el rango de horas en una sola columna
    @admin.display(description='Horario')
    def horario_cursada(self, obj):
        return f"{obj.hora_inicio.strftime('%H:%M')} - {obj.hora_fin.strftime('%H:%M')}"
