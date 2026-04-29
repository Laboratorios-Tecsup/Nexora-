from rest_framework import serializers
from .models import Empresa, Plan

# Serializer para mostrar info del plan
class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'nombre', 'precio', 'imagenes_mes', 'videos_mes', 'descripcion']

# Serializer para REGISTRAR una nueva empresa
class EmpresaRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Empresa
        fields = ['username', 'email', 'password', 'nombre_empresa', 'sector', 'telefono']

    def create(self, validated_data):
        # Asigna automáticamente el plan Free al registrarse
        plan_free = Plan.objects.filter(nombre='free').first()
        empresa = Empresa.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nombre_empresa=validated_data.get('nombre_empresa', ''),
            sector=validated_data.get('sector', ''),
            telefono=validated_data.get('telefono', ''),
            rol='empresa',
            plan=plan_free,
            creditos_imagenes=5,
            creditos_videos=2,
        )
        return empresa

# Serializer para MOSTRAR datos de una empresa
class EmpresaSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)

    class Meta:
        model = Empresa
        fields = ['id', 'username', 'email', 'nombre_empresa', 'sector',
                  'telefono', 'rol', 'plan', 'creditos_imagenes',
                  'creditos_videos', 'fecha_registro']