import { useState, useEffect } from 'react';

const VACIO = { nombre: '', descripcion: '', precio: '', stock: '0', categoria: 'otros' };

export default function ProductoForm({ producto, categorias, onGuardar, onCancelar, saving }) {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setForm(
      producto
        ? {
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio,
            stock: String(producto.stock),
            categoria: producto.categoria,
          }
        : VACIO
    );
    setErrores({});
  }, [producto]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await onGuardar({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        stock: Number(form.stock),
        categoria: form.categoria,
      });
    } catch (err) {
      setErrores(err || {});
    }
  }

  function errorMsg(field) {
    const e = errores[field];
    if (!e) return null;
    const txt = Array.isArray(e) ? e.join(' ') : e;
    return <p className="mt-1 text-xs text-red-500">{txt}</p>;
  }

  const inputBase =
    'w-full rounded-xl border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow';
  const inputClass = (field) =>
    `${inputBase} ${errores[field] ? 'border-red-400' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onCancelar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Ej. Laptop Lenovo IdeaPad"
              required
              className={inputClass('nombre')}
            />
            {errorMsg('nombre')}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              rows={3}
              placeholder="Descripción opcional del producto..."
              className={`${inputBase} border-gray-300 resize-none`}
            />
            {errorMsg('descripcion')}
          </div>

          {/* Precio + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precio}
                  onChange={(e) => set('precio', e.target.value)}
                  placeholder="0.00"
                  required
                  className={`${inputClass('precio')} pl-7`}
                />
              </div>
              {errorMsg('precio')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                required
                className={inputClass('stock')}
              />
              {errorMsg('stock')}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-400">*</span>
            </label>
            <select
              value={form.categoria}
              onChange={(e) => set('categoria', e.target.value)}
              className={`${inputClass('categoria')} bg-white`}
            >
              {categorias.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errorMsg('categoria')}
          </div>

          {/* Error general */}
          {errores.detail && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errores.detail}</p>
          )}

          {/* Footer dentro del form para que el submit funcione */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors"
            >
              {saving ? 'Guardando...' : producto ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
