from django.db import models
from django.core.validators import MinValueValidator


class Product(models.Model):
    """Модель для хранения продуктов и их цен"""
    UNIT_CHOICES = [
        ('kg', 'Килограмм'),
        ('g', 'Грамм'),
        ('l', 'Литр'),
        ('ml', 'Миллилитр'),
        ('pcs', 'Штука'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Название продукта')
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, verbose_name='Единица измерения')
    quantity = models.DecimalField(
        max_digits=10, 
        decimal_places=3, 
        validators=[MinValueValidator(0.001)],
        verbose_name='Количество'
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        verbose_name='Цена'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.quantity} {self.get_unit_display()}) - {self.price}₽"
    
    @property
    def price_per_unit(self):
        """Цена за единицу измерения"""
        return self.price / self.quantity


class Recipe(models.Model):
    """Модель для хранения рецептов"""
    name = models.CharField(max_length=200, verbose_name='Название рецепта')
    description = models.TextField(blank=True, verbose_name='Описание')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Рецепт'
        verbose_name_plural = 'Рецепты'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    """Модель для ингредиентов в рецепте"""
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='Продукт')
    quantity = models.DecimalField(
        max_digits=10, 
        decimal_places=3, 
        validators=[MinValueValidator(0.001)],
        verbose_name='Количество'
    )
    
    class Meta:
        verbose_name = 'Ингредиент рецепта'
        verbose_name_plural = 'Ингредиенты рецепта'
        unique_together = ['recipe', 'product']
    
    def __str__(self):
        return f"{self.recipe.name} - {self.product.name} ({self.quantity} {self.product.get_unit_display()})"
    
    @property
    def cost(self):
        """Стоимость ингредиента в рецепте"""
        # Конвертируем количество в единицы продукта
        if self.product.unit == 'kg' and self.product.unit == 'g':
            # Если продукт в кг, а ингредиент в граммах
            quantity_in_product_units = self.quantity / 1000
        elif self.product.unit == 'g' and self.product.unit == 'kg':
            # Если продукт в граммах, а ингредиент в кг
            quantity_in_product_units = self.quantity * 1000
        elif self.product.unit == 'l' and self.product.unit == 'ml':
            # Если продукт в литрах, а ингредиент в мл
            quantity_in_product_units = self.quantity / 1000
        elif self.product.unit == 'ml' and self.product.unit == 'l':
            # Если продукт в мл, а ингредиент в литрах
            quantity_in_product_units = self.quantity * 1000
        else:
            # Одинаковые единицы измерения
            quantity_in_product_units = self.quantity
        
        return quantity_in_product_units * self.product.price_per_unit


class Settings(models.Model):
    """Модель для настроек системы"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название настройки')
    value = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name='Значение'
    )
    description = models.TextField(blank=True, verbose_name='Описание')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Настройка'
        verbose_name_plural = 'Настройки'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name}: {self.value}"
