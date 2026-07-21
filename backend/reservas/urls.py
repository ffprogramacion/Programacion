from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AulaViewSet, MaterialViewSet, ReservaViewSet

# El router genera automaticamente URLs como /api/reservas/, /api/reservas/1/
router = DefaultRouter()
router.register(r'aulas', AulaViewSet)
router.register(r'materiales', MaterialViewSet)
router.register(r'reservas', ReservaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]