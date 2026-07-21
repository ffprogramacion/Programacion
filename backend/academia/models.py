from django.db import models
from django.contrib.auth.models import User

class Carrera(models.Model):
    nombre = models.CharField(max_length=150, unique=True, verbose_name="Nombre de la Carrera")
    codigo = models.CharField(max_length=10, unique=True, help_text="Ej: LSI, MI", verbose_name="Código/Sigla")

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"


class Materia(models.Model):
    # Opciones para ordenar académicamente
    ANOS_CHOICES = [(1, '1er Año'), (2, '2do Año'), (3, '3er Año'), (4, '4to Año'), (5, '5to Año')]
    CUATRIMESTRES_CHOICES = [(1, '1er Cuatrimestre'), (2, '2do Cuatrimestre'), (3, 'Anual')]

    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE, related_name="materias")
    nombre = models.CharField(max_length=150, verbose_name="Nombre de la Materia")
    ano = models.IntegerField(choices=ANOS_CHOICES, verbose_name="Año de Cursada")
    cuatrimestre = models.IntegerField(choices=CUATRIMESTRES_CHOICES, verbose_name="Cuatrimestre")

    class Meta:
        unique_together = ('carrera', 'nombre') # Evita duplicar la misma materia en la misma carrera

    def __str__(self):
        return f"{self.nombre} - {self.carrera.codigo} ({self.get_ano_display()})"


class Comision(models.Model):
    """
    Une una Materia, un Profesor (User), un grupo de Alumnos (Users) 
    y define el horario fijo de cursada en la semana.
    """
    DIAS_CHOICES = [
        ('Lunes', 'Lunes'), ('Martes', 'Martes'), ('Miércoles', 'Miércoles'),
        ('Jueves', 'Jueves'), ('Viernes', 'Viernes'), ('Sábado', 'Sábado')
    ]

    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="comisiones")
    nombre = models.CharField(max_length=10, help_text="Ej: Comisión A, Única", verbose_name="Nombre Comisión")
    
    # Vinculamos al Docente (reutilizando el usuario de Django)
    profesor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, limit_choices_to={'profile__rol': 'teacher'}, related_name="comisiones_dictadas")
    
    # Vinculamos a los Alumnos inscritos (Muchos a Muchos)
    alumnos = models.ManyToManyField(User, blank=True, limit_choices_to={'profile__rol': 'student'}, related_name="comisiones_inscritas")

    # Horario FIJO semanal de la cursada
    dia_semana = models.CharField(max_length=10, choices=DIAS_CHOICES, verbose_name="Día de Cursada")
    hora_inicio = models.TimeField(verbose_name="Hora Inicio Cursada")
    hora_fin = models.TimeField(verbose_name="Hora Fin Cursada")

    class Meta:
        verbose_name = "Comisión"
        verbose_name_plural = "Comisiones"

    def __str__(self):
        return f"{self.materia.nombre} ({self.nombre}) - {self.dia_semana}"

