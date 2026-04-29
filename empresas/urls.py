from django.urls import path
from . import views

urlpatterns = [

    ##---REGISTRO DE EMPRESAS
    path('registro/', views.registro),

    ##---LOGIN DE EMPRESAS
    path('login/', views.login),

    ##---PERFIL DE EMPRESA
    path('perfil/', views.perfil),

    ##---LISTAR EMPRESAS (SOLO PARA ADMIN)
    path('listar/', views.listar_empresas),
]
