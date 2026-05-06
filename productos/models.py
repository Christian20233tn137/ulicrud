from django.db import models
from django.core.validators import MinValueValidator


CATEGORIAS = [
    ('electronica', 'Electrónica'),
    ('ropa', 'Ropa'),
    ('alimentos', 'Alimentos'),
    ('hogar', 'Hogar'),
    ('deportes', 'Deportes'),
    ('otros', 'Otros'),
]


class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')
    precio = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    stock = models.PositiveIntegerField(default=0)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default='otros')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'productos'
        ordering = ['-fecha_registro']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return f'{self.nombre} (${self.precio})'
