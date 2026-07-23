from django.contrib import admin
from .models import Profile, Aula, Material, Reserva

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'rol', 'legajo', 'telefono')
    list_filter = ('rol',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email', 'legajo')
    ordering = ('user__username',)

@admin.register(Aula)
class AulaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'ubicacion', 'capacidad')
    search_fields = ('nombre', 'ubicacion')
    ordering = ('nombre',)

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('id', 'codigo_inventario', 'nombre', 'stock_total', 'disponible')
    list_filter = ('disponible',)
    search_fields = ('nombre', 'codigo_inventario')
    list_editable = ('disponible',)  # Permite cambiar la disponibilidad directamente desde la lista
    ordering = ('nombre',)

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('id', 'aula', 'solicitante', 'fecha_reserva', 'horario_reserva', 'estado', 'comision')
    list_filter = ('estado', 'fecha_reserva', 'aula')
    search_fields = ('aula__nombre', 'solicitante__username', 'solicitante__first_name', 'solicitante__last_name')
    date_hierarchy = 'fecha_reserva'  # Navegador intuitivo por fechas (Año/Mes/Día)
    filter_horizontal = ('materiales',)  # Selector doble súper práctico para asignar materiales a la reserva
    ordering = ('-fecha_reserva', '-hora_inicio')

    # Método para formatear el rango de horas en una sola columna
    @admin.display(description='Horario')
    def horario_reserva(self, obj):
        return f"{obj.hora_inicio.strftime('%H:%M')} - {obj.hora_fin.strftime('%H:%M')}"