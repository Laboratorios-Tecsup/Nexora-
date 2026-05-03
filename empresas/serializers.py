from rest_framework import serializers
from .models import Empresa, Plan
from .models import Empresa, Plan, Campana
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
class CampanaSerializer(serializers.ModelSerializer):
    empresa = EmpresaSerializer(read_only=True)

    class Meta:
        model = Campana
        fields = [
            'id', 'empresa', 'nombre_negocio', 'descripcion_producto',
            'publico_objetivo', 'tono', 'red_social', 'foto_producto',
            'foto_modelo', 'imagen_generada', 'estado', 'fecha_creacion'
        ]
        read_only_fields = ['estado', 'imagen_generada', 'fecha_creacion']

class CampanaCrearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campana
        fields = [
            'nombre_negocio', 'descripcion_producto', 'publico_objetivo',
            'tono', 'red_social', 'foto_producto', 'foto_modelo'
        ]

    def validate_foto_producto(self, value):
        # Valida que sea imagen JPG o PNG máx 10MB
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("La foto no puede superar 10MB")
        if not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Solo se aceptan JPG o PNG")
        return value

    def validate_foto_modelo(self, value):
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("La foto no puede superar 10MB")
        if not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Solo se aceptan JPG o PNG")
        return value