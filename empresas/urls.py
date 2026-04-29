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
