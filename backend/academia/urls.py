from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarreraViewSet, MateriaViewSet, ComisionViewSet

router = DefaultRouter()
router.register(r'carreras', CarreraViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'comisiones', ComisionViewSet, basename='comision')

urlpatterns = [
    path('', include(router.urls)),
]