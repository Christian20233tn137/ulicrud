from django.contrib import admin
from .models import Producto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'precio', 'stock', 'fecha_registro']
    list_filter = ['categoria']
    search_fields = ['nombre', 'descripcion']
    ordering = ['-fecha_registro']
