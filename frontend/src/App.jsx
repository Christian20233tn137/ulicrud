import { useState, useEffect, useCallback } from 'react';
import { api } from './api/productos';
import ProductoForm from './components/ProductoForm';
import ConfirmModal from './components/ConfirmModal';

const BADGE = {
  electronica: 'bg-blue-100 text-blue-700',
  ropa:        'bg-purple-100 text-purple-700',
  alimentos:   'bg-green-100 text-green-700',
  hogar:       'bg-amber-100 text-amber-700',
  deportes:    'bg-orange-100 text-orange-700',
  otros:       'bg-gray-100 text-gray-600',
};

const PAGE_SIZE = 10;

export default function App() {
  const [productos, setProductos]   = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch]         = useState('');
  const [categoria, setCategoria]   = useState('');
  const [pagina, setPagina]         = useState(1);
  const [modal, setModal]           = useState(null);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    api.categorias().then(setCategorias).catch(() => {});
  }, []);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listar({ search, categoria, page: pagina });
      setProductos(data.results);
      setTotal(data.count);
    } catch {
      notificar('Error al cargar los productos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, categoria, pagina]);

  useEffect(() => { cargar(); }, [cargar]);

  function notificar(msg, type = 'success') {
    const id = Date.now();
    setToast({ id, msg, type });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3500);
  }

  async function handleGuardar(formData) {
    const esEdicion = !!modal?.producto;
    const id = modal?.producto?.id;
    setSaving(true);
    try {
      if (esEdicion) {
        await api.actualizar(id, formData);
      } else {
        await api.crear(formData);
      }
      notificar(esEdicion ? 'Producto actualizado exitosamente.' : 'Producto creado exitosamente.');
      setModal(null);
      cargar();
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar() {
    setSaving(true);
    try {
      await api.eliminar(modal.producto.id);
      notificar(`"${modal.producto.nombre}" eliminado exitosamente.`);
      setModal(null);
      cargar();
    } catch {
      notificar('Error al eliminar el producto.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleBuscar(val) {
    setSearch(val);
    setPagina(1);
  }

  function handleCategoria(val) {
    setCategoria(val);
    setPagina(1);
  }

  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-slate-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg">UliCRUD</span>
              <span className="text-slate-400 text-sm ml-2 hidden sm:inline">Gestión de Productos</span>
            </div>
          </div>
          <span className="text-slate-400 text-sm">
            {total} producto{total !== 1 ? 's' : ''}
          </span>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => handleBuscar(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
          <select
            value={categoria}
            onChange={(e) => handleCategoria(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <button
            onClick={() => setModal({ type: 'form', producto: null })}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-52 text-gray-400 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-sm">Cargando productos...</span>
            </div>
          ) : productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-gray-400 gap-3">
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Sin productos</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {search || categoria ? 'Prueba con otros filtros.' : 'Crea el primer producto.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-medium text-gray-500 w-12">#</th>
                    <th className="px-5 py-3.5 text-left font-medium text-gray-500">Nombre</th>
                    <th className="px-5 py-3.5 text-left font-medium text-gray-500">Categoría</th>
                    <th className="px-5 py-3.5 text-right font-medium text-gray-500">Precio</th>
                    <th className="px-5 py-3.5 text-right font-medium text-gray-500">Stock</th>
                    <th className="px-5 py-3.5 text-center font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">{p.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">{p.nombre}</p>
                        {p.descripcion && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{p.descripcion}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE[p.categoria] ?? BADGE.otros}`}>
                          {p.categoria_display}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-gray-700">
                        ${Number(p.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-medium tabular-nums ${
                          p.stock === 0 ? 'text-red-500' : p.stock < 6 ? 'text-amber-500' : 'text-gray-700'
                        }`}>
                          {p.stock}
                        </span>
                        {p.stock === 0 && (
                          <span className="ml-1.5 text-xs text-red-400">agotado</span>
                        )}
                        {p.stock > 0 && p.stock < 6 && (
                          <span className="ml-1.5 text-xs text-amber-400">bajo</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setModal({ type: 'form', producto: p })}
                            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setModal({ type: 'delete', producto: p })}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>
              Página <span className="font-medium text-gray-700">{pagina}</span> de{' '}
              <span className="font-medium text-gray-700">{totalPaginas}</span>
              {' '}— {total} productos
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .filter((n) => Math.abs(n - pagina) <= 2)
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setPagina(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      n === pagina
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina === totalPaginas}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal formulario */}
      {modal?.type === 'form' && (
        <ProductoForm
          producto={modal.producto}
          categorias={categorias}
          onGuardar={handleGuardar}
          onCancelar={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* Modal confirmación eliminar */}
      {modal?.type === 'delete' && (
        <ConfirmModal
          producto={modal.producto}
          onConfirmar={handleEliminar}
          onCancelar={() => setModal(null)}
          loading={saving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-medium text-white transition-all duration-300 ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
          }`}
        >
          {toast.type === 'error' ? (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
