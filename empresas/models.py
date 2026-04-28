from django.db import models
from django.db import models

class Plan(models.Model):
    PLANES =[
        ('free', 'Free'),
        ('starter','Starter'),
        ('pro','Pro'),
        ('enterprise','Enterprise'),
    ]
    nombre = models.CharField(max_length=20, choices=PLANES, unique=True)
    precio = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    imagenes_mes = models.IntegerField(default=5)
    videos_mes = models.IntegerField(default=2)
    descripcion = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.nombre
    
class Empresa(AbstractUser):
    ROL=[
        ('admin', 'Admin'),
        ('empresa', 'Empresa'),
    ]
    rol = models.CharField(max_length=20, choices=ROL, default='empresa')
    nombre_empresa = models.CharField(max_length=200, blank=True)
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    telefono = models.CharField(max_length=20, blank= True ) 
    sector = models.CharField(max_length=100, blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    creditos_imagenes = models.IntegerField(default=5)
    creditos_videos = models.IntegerField(default=2)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.nombre_empresa}"
