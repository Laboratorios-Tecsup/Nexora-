from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import EmpresaRegistroSerializer, EmpresaSerializer
from .models import Empresa, Plan
from .serializers import EmpresaRegistroSerializer, EmpresaSerializer, PlanSerializer
from .serializers import EmpresaRegistroSerializer, EmpresaSerializer, PlanSerializer, CampanaSerializer, CampanaCrearSerializer
from .models import Empresa, Plan, Campana
from .ia_service import generar_imagen_publicitaria
import base64
from django.core.files.base import ContentFile

##--REGISTRO DE EMPRESA--

@api_view(['POST'])
def registro(request):
    serializer = EmpresaRegistroSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'mensaje': 'Empresa registrada correctamente'},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

##--LOGIN DE EMPRESA--

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    empresa = authenticate(username=username, password=password)
    if empresa:
        refresh = RefreshToken.for_user(empresa)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'empresa': EmpresaSerializer(empresa).data
        })
    return Response(
        {'error': 'Credenciales inválidas'},
        status=status.HTTP_401_UNAUTHORIZED
    )
##--PERFIL DE EMPRESA--

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil(request):
    serializer = EmpresaSerializer(request.user)
    return Response(serializer.data)

##--LISTAR EMPRESAS (SOLO PARA ADMIN)--

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_empresas(request):
    if request.user.rol != 'admin':
        return Response(
            {'error': 'No tienes permisos para esta acción'},
            status=status.HTTP_403_FORBIDDEN
        )
    
## SI ES ADMIN, LISTA TODAS LAS EMPRESAS 
    empresas = Empresa.objects.all()
    serializer = EmpresaSerializer(empresas, many=True)
    return Response(serializer.data)

##--LISTAR PLANES DISPONIBLES
@api_view(['GET'])
def listar_planes(request):
    planes = Plan.objects.all()
    serializer = PlanSerializer(planes, many=True)
    return Response(serializer.data)

##--ASIGNAR PLAN A EMPRESA
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def asignar_plan(request):
    nombre_plan = request.data.get('plan')
    try:
        plan = Plan.objects.get(nombre=nombre_plan)
        empresa = request.user
        empresa.plan = plan
        # Actualiza los créditos según el nuevo plan
        empresa.creditos_imagenes = plan.imagenes_mes
        empresa.creditos_videos = plan.videos_mes
        empresa.save()
        return Response({
            'mensaje': f'Plan actualizado a {plan.nombre} correctamente',
            'empresa': EmpresaSerializer(empresa).data
        })
    except Plan.DoesNotExist:
        return Response(
            {'error': 'Plan no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

##--DASHBOARD DE EMPRESA
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    empresa = request.user
    return Response({
        'empresa': empresa.nombre_empresa,
        'plan_actual': empresa.plan.nombre if empresa.plan else 'Sin plan',
        'creditos_imagenes_restantes': empresa.creditos_imagenes,
        'creditos_videos_restantes': empresa.creditos_videos,
        'creditos_imagenes_totales': empresa.plan.imagenes_mes if empresa.plan else 0,
        'creditos_videos_totales': empresa.plan.videos_mes if empresa.plan else 0,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_campana(request):
    # Verifica que tenga créditos disponibles
    empresa = request.user
    if empresa.creditos_imagenes <= 0:
        return Response(
            {'error': 'No tienes créditos de imágenes disponibles. Mejora tu plan.'},
            status=status.HTTP_402_PAYMENT_REQUIRED
        )

    serializer = CampanaCrearSerializer(data=request.data)
    if serializer.is_valid():
        campana = serializer.save(empresa=empresa)
        return Response({
            'mensaje': 'Fotos subidas correctamente',
            'campana_id': campana.id,
            'campana': CampanaSerializer(campana).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_campanas(request):
    campanas = Campana.objects.filter(empresa=request.user).order_by('-fecha_creacion')
    serializer = CampanaSerializer(campanas, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detalle_campana(request, pk):
    try:
        campana = Campana.objects.get(pk=pk, empresa=request.user)
        serializer = CampanaSerializer(campana)
        return Response(serializer.data)
    except Campana.DoesNotExist:
        return Response(
            {'error': 'Campaña no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generar_imagen(request, pk):
    try:
        # Obtiene la campaña
        campana = Campana.objects.get(pk=pk, empresa=request.user)

        # Verifica créditos disponibles
        empresa = request.user
        if empresa.creditos_imagenes <= 0:
            return Response(
                {'error': 'No tienes créditos de imágenes. Mejora tu plan.'},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        # Cambia estado a procesando
        campana.estado = 'procesando'
        campana.save()

        # Llama al servicio de IA
        imagen_bytes, mime_type = generar_imagen_publicitaria(
            foto_producto_path=campana.foto_producto.path,
            foto_modelo_path=campana.foto_modelo.path,
            nombre_negocio=campana.nombre_negocio,
            descripcion_producto=campana.descripcion_producto,
            publico_objetivo=campana.publico_objetivo,
            tono=campana.tono,
            red_social=campana.red_social
        )

        if imagen_bytes:
            # Guarda la imagen generada
            extension = 'jpg' if 'jpeg' in mime_type else 'png'
            nombre_archivo = f"campana_{campana.id}_generada.{extension}"
            campana.imagen_generada.save(
                nombre_archivo,
                ContentFile(imagen_bytes),
                save=False
            )

            # Descuenta un crédito
            empresa.creditos_imagenes -= 1
            empresa.save()

            # Actualiza estado a completado
            campana.estado = 'completado'
            campana.save()

            return Response({
                'mensaje': 'Imagen generada correctamente',
                'campana': CampanaSerializer(campana).data,
                'creditos_restantes': empresa.creditos_imagenes
            })
        else:
            campana.estado = 'error'
            campana.save()
            return Response(
                {'error': 'No se pudo generar la imagen'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Campana.DoesNotExist:
        return Response(
            {'error': 'Campaña no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        campana.estado = 'error'
        campana.save()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )