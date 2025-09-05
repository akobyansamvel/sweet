from rest_framework import serializers
from .models import Product, Recipe, RecipeIngredient, Settings


class ProductSerializer(serializers.ModelSerializer):
    price_per_unit = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'unit', 'quantity', 'price', 'price_per_unit', 'created_at', 'updated_at']


class RecipeIngredientSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)
    cost = serializers.ReadOnlyField()
    
    class Meta:
        model = RecipeIngredient
        fields = ['id', 'product', 'product_name', 'product_unit', 'quantity', 'cost']


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    total_cost = serializers.SerializerMethodField()
    ingredients_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ['id', 'name', 'description', 'ingredients', 'total_cost', 'ingredients_count', 'created_at', 'updated_at']
    
    def get_total_cost(self, obj):
        total = sum(ingredient.cost for ingredient in obj.ingredients.all())
        return round(total, 2)
    
    def get_ingredients_count(self, obj):
        return obj.ingredients.count()


class RecipeCreateUpdateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True)
    
    class Meta:
        model = Recipe
        fields = ['name', 'description', 'ingredients']
    
    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        recipe = Recipe.objects.create(**validated_data)
        
        for ingredient_data in ingredients_data:
            RecipeIngredient.objects.create(recipe=recipe, **ingredient_data)
        
        return recipe
    
    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        
        # Обновляем основные поля рецепта
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        
        # Удаляем старые ингредиенты
        instance.ingredients.all().delete()
        
        # Создаем новые ингредиенты
        for ingredient_data in ingredients_data:
            RecipeIngredient.objects.create(recipe=instance, **ingredient_data)
        
        return instance


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'name', 'value', 'description', 'created_at', 'updated_at']
