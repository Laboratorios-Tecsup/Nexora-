from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import EmpresaRegistroSerializer, EmpresaSerializer
from .models import Empresa, Plan

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