from django.urls import path
from . import views

urlpatterns = [

    ##---REGISTRO DE EMPRESAS
    path('registro/', views.registro),

    ##---LOGIN DE EMPRESAS
    path('login/', views.login),

    ##--LISTAR PLANES DISPONIBLES
    path('planes/', views.listar_planes),

    ##---PERFIL DE EMPRESA
    path('perfil/', views.perfil),

    ##---LISTAR EMPRESAS (SOLO PARA ADMIN)
    path('listar/', views.listar_empresas),

    ##--LISTAR PLANES DISPONIBLES
    path('planes/asignar/', views.asignar_plan),

    ##--ASIGNAR PLAN A EMPRESA
    path('dashboard/', views.dashboard),
]
urlpatterns = [

    ##--- ENDPOINTS PÚBLICOS (no requieren token)
    path('registro/', views.registro),
    path('login/', views.login),
    path('planes/', views.listar_planes),

    ##--- ENDPOINTS PROTEGIDOS (requieren token JWT)
    path('perfil/', views.perfil),
    path('listar/', views.listar_empresas),
    path('planes/asignar/', views.asignar_plan),
    path('dashboard/', views.dashboard),

    ##--- ENDPOINTS DE CAMPAÑAS
    path('campanas/crear/', views.crear_campana),
    path('campanas/listar/', views.listar_campanas),
    path('campanas/<int:pk>/', views.detalle_campana),
]