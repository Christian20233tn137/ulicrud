# UliCRUD — CRUD con Django REST Framework + React

Aplicación de gestión de productos con backend Django/DRF y frontend React.

---

## Requisitos previos

- Python 3.10+
- Node.js 18+
- MySQL 8.0+ corriendo en `localhost:3306`

---

## 1. Configurar la base de datos MySQL

Abre tu cliente MySQL y ejecuta:

```sql
CREATE DATABASE ulicrud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 2. Ejecutar el Backend (Django)

```bash
# Activar entorno virtual
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Aplicar migraciones
python manage.py migrate

# (Opcional) Crear superusuario para el admin
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

El backend queda en: http://localhost:8000

### Endpoints de la API

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/productos/` | Listar productos |
| POST | `/api/productos/` | Crear producto |
| GET | `/api/productos/{id}/` | Detalle de producto |
| PUT | `/api/productos/{id}/` | Actualizar producto |
| DELETE | `/api/productos/{id}/` | Eliminar producto |
| GET | `/api/productos/categorias/` | Listar categorías |

**Filtros disponibles:**
- `/api/productos/?search=laptop` — buscar por nombre/descripción
- `/api/productos/?categoria=electronica` — filtrar por categoría

---

## 3. Ejecutar el Frontend (React)

```bash
cd frontend
npm install   # solo la primera vez
npm run dev
```

El frontend queda en: http://localhost:5173

---

## Estructura del proyecto

```
ulicrud/
├── .venv/                  # Entorno virtual Python
├── ulicrud/                # Configuración Django
│   ├── settings.py
│   └── urls.py
├── productos/              # App Django
│   ├── models.py           # Modelo Producto
│   ├── serializers.py      # Serializers DRF
│   ├── views.py            # ViewSet
│   ├── urls.py             # Rutas API
│   └── admin.py
├── frontend/               # App React
│   └── src/
│       ├── components/     # Componentes UI
│       ├── hooks/          # useProductos
│       ├── services/       # Llamadas a la API
│       └── App.jsx
├── requirements.txt
└── manage.py
```

## Modelo Producto — Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | CharField | Nombre del producto |
| `descripcion` | TextField | Descripción detallada |
| `precio` | DecimalField | Precio en pesos |
| `stock` | PositiveIntegerField | Unidades disponibles |
| `categoria` | CharField | Categoría (choices) |
| `fecha_registro` | DateTimeField | Alta automática |
| `fecha_actualizacion` | DateTimeField | Última modificación |
