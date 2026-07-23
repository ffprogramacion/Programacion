from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from academia.models import Comision

class Profile(models.Model):
    # Opciones de roles exactas a las que usás en tu React (App.jsx / Sidebar.jsx)
    ROLES_CHOICES = [
        ('student', 'Estudiante'),
        ('teacher', 'Docente'),
        ('admin', 'Administrador'),
    ]

    # Relación uno a uno con el usuario nativo de Django
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    
    # Tus campos personalizados para la universidad
    rol = models.CharField(max_length=15, choices=ROLES_CHOICES, default='student')
    legajo = models.CharField(max_length=20, blank=True, null=True, unique=True, verbose_name="Número de Legajo")
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono de Contacto")

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

    def __str__(self):
        return f"{self.user.username} - Rol: {self.get_rol_display()}"


# ================= SIGNAL TRICK (Automatización) =================
# Estos métodos hacen que cada vez que se cree un Usuario nativo, 
# se cree automáticamente su Perfil vinculado sin que tengas que hacerlo a mano.

@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def guardar_perfil_usuario(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()


class Aula(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Aula")
    ubicacion = models.CharField(max_length=150, help_text="Ej: Edificio 2, Planta Alta", verbose_name="Ubicación")
    capacidad = models.IntegerField(verbose_name="Capacidad de Alumnos")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción/Equipamiento Fijo")

    class Meta:
        verbose_name = "Aula"
        verbose_name_plural = "Aulas"

    def __str__(self):
        return f"{self.nombre} (Capacidad: {self.capacidad})"


class Material(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Recurso")
    codigo_inventario = models.CharField(max_length=50, unique=True, verbose_name="Código de Inventario")
    stock_total = models.IntegerField(default=1, verbose_name="Stock Total")
    disponible = models.BooleanField(default=True, verbose_name="¿Está Disponible?")

    class Meta:
        verbose_name = "Material/Recurso"
        verbose_name_plural = "Stock de Materiales"

    def __str__(self):
        return f"{self.nombre} [{self.codigo_inventario}]"


class Reserva(models.Model):
    # Opciones de Estado predefinidas
    ESTADOS_CHOICES = [
        ('Activa', 'Activa'),
        ('Cancelada', 'Cancelada'),
        ('Finalizada', 'Finalizada'),
    ]

    # Relación con el usuario nativo de Django. Si el usuario se borra, se protegen sus reservas (SET_NULL)
    solicitante = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reservas")
    
    # Relación con el Aula. Si se borra el aula, se frena el borrado en cascada para no perder el historial
    aula = models.ForeignKey(Aula, on_delete=models.PROTECT, related_name="reservas")
    
    # Relación Muchos a Muchos con Materiales (puede no requerir materiales, por eso blank=True)
    materiales = models.ManyToManyField(Material, blank=True, related_name="reservas")
    
    # Datos de fecha y hora de la reserva
    fecha_reserva = models.DateField(verbose_name="Fecha de la Reserva")
    hora_inicio = models.TimeField(verbose_name="Hora de Inicio")
    hora_fin = models.TimeField(verbose_name="Hora de Fin")
    
    estado = models.CharField(max_length=15, choices=ESTADOS_CHOICES, default='Activa')
    fecha_creacion = models.DateTimeField(auto_now_add=True) # Se graba automáticamente al crearse

    comision = models.ForeignKey(Comision, on_delete=models.SET_NULL, null=True, blank=True, related_name="reservas_aula")

    class Meta:
        verbose_name = "Reserva"
        verbose_name_plural = "Reservas"
        # Ordenamos las reservas para que las más nuevas aparezcan primero
        ordering = ['-fecha_reserva', '-hora_inicio']

    def __str__(self):
        solicitante_name = self.solicitante.get_full_name() if self.solicitante else "Usuario Eliminado"
        return f"Reserva #{self.id} - {self.aula.nombre} por {solicitante_name} ({self.fecha_reserva})"


