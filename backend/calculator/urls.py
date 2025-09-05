from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, RecipeViewSet, RecipeIngredientViewSet, SettingsViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'recipe-ingredients', RecipeIngredientViewSet)
router.register(r'settings', SettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
