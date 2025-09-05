from django.contrib import admin
from .models import Product, Recipe, RecipeIngredient, Settings


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'quantity', 'unit', 'price', 'price_per_unit', 'created_at']
    list_filter = ['unit', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['name', 'ingredients_count', 'total_cost', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    
    def ingredients_count(self, obj):
        return obj.ingredients.count()
    ingredients_count.short_description = 'Количество ингредиентов'
    
    def total_cost(self, obj):
        total = sum(ingredient.cost for ingredient in obj.ingredients.all())
        return f"{total:.2f}₽"
    total_cost.short_description = 'Общая стоимость'


@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    list_display = ['recipe', 'product', 'quantity', 'cost']
    list_filter = ['recipe', 'product__unit']
    search_fields = ['recipe__name', 'product__name']


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ['name', 'value', 'description', 'updated_at']
    search_fields = ['name', 'description']
    ordering = ['name']
