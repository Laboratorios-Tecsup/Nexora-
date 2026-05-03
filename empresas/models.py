from django.db import models
from django.contrib.auth.models import AbstractUser

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
    telefono = models.CharField(max_length=20, blank=True)
    sector = models.CharField(max_length=100, blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    creditos_imagenes = models.IntegerField(default=5)
    creditos_videos = models.IntegerField(default=2)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='empresa_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='empresa_set',
        blank=True
    )

    def __str__(self):
        return f"{self.username} - {self.nombre_empresa}"
    
class Campana(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('procesando', 'Procesando'),
        ('completado', 'Completado'),
        ('error', 'Error'),
    ]
    
    RED_SOCIAL_CHOICES = [
        ('tiktok', 'TikTok'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
    ]

    TONO_CHOICES = [
        ('profesional', 'Profesional'),
        ('divertido', 'Divertido'),
        ('urgente', 'Urgente'),
        ('emocional', 'Emocional'),
        ('motivacional', 'Motivacional'),
    ]

    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='campanas')
    nombre_negocio = models.CharField(max_length=200)
    descripcion_producto = models.TextField()
    publico_objetivo = models.CharField(max_length=200)
    tono = models.CharField(max_length=20, choices=TONO_CHOICES, default='profesional')
    red_social = models.CharField(max_length=20, choices=RED_SOCIAL_CHOICES, default='instagram')
    foto_producto = models.ImageField(upload_to='campanas/productos/')
    foto_modelo = models.ImageField(upload_to='campanas/modelos/')
    imagen_generada = models.ImageField(upload_to='campanas/generadas/', null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre_negocio} - {self.empresa.username}"