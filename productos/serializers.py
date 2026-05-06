from rest_framework import serializers
from .models import Producto, CATEGORIAS


class ProductoSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio',
            'stock', 'categoria', 'categoria_display',
            'fecha_registro', 'fecha_actualizacion',
        ]
        read_only_fields = ['id', 'fecha_registro', 'fecha_actualizacion']

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError('El precio no puede ser negativo.')
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('El stock no puede ser negativo.')
        return value

    def validate_nombre(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('El nombre debe tener al menos 2 caracteres.')
        return value.strip()


class CategoriaSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
