from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Producto, CATEGORIAS
from .serializers import ProductoSerializer, CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_queryset(self):
        qs = Producto.objects.all()
        search = self.request.query_params.get('search', '')
        categoria = self.request.query_params.get('categoria', '')

        if search:
            qs = qs.filter(
                Q(nombre__icontains=search) | Q(descripcion__icontains=search)
            )
        if categoria:
            qs = qs.filter(categoria=categoria)

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'mensaje': 'Producto creado exitosamente.', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {'mensaje': 'Producto actualizado exitosamente.', 'data': serializer.data}
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        nombre = instance.nombre
        self.perform_destroy(instance)
        return Response(
            {'mensaje': f'Producto "{nombre}" eliminado exitosamente.'},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['get'], url_path='categorias')
    def categorias(self, request):
        data = [{'value': v, 'label': l} for v, l in CATEGORIAS]
        return Response(data)
