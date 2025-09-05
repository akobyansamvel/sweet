from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, Recipe, RecipeIngredient, Settings
from .serializers import (
    ProductSerializer, 
    RecipeSerializer, 
    RecipeCreateUpdateSerializer,
    RecipeIngredientSerializer,
    SettingsSerializer
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RecipeCreateUpdateSerializer
        return RecipeSerializer
    
    def get_queryset(self):
        queryset = Recipe.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset
    
    @action(detail=True, methods=['post'])
    def calculate_cost(self, request, pk=None):
        """Расчет стоимости рецепта с учетом настроек"""
        recipe = self.get_object()
        
        # Получаем настройки
        markup_setting = Settings.objects.filter(name='markup').first()
        markup = markup_setting.value if markup_setting else 0
        
        # Рассчитываем базовую стоимость
        base_cost = sum(ingredient.cost for ingredient in recipe.ingredients.all())
        
        # Применяем наценку
        total_cost = base_cost * (1 + markup / 100)
        
        return Response({
            'recipe_id': recipe.id,
            'recipe_name': recipe.name,
            'base_cost': round(base_cost, 2),
            'markup_percent': markup,
            'markup_amount': round(total_cost - base_cost, 2),
            'total_cost': round(total_cost, 2)
        })


class RecipeIngredientViewSet(viewsets.ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer
    
    def get_queryset(self):
        queryset = RecipeIngredient.objects.all()
        recipe_id = self.request.query_params.get('recipe', None)
        if recipe_id:
            queryset = queryset.filter(recipe_id=recipe_id)
        return queryset


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    
    def get_queryset(self):
        queryset = Settings.objects.all()
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset
