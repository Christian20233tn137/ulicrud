const BASE = 'http://127.0.0.1:8000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data ?? { detail: `Error ${res.status}` };
  return data;
}

export const api = {
  listar(params = {}) {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    const qs = new URLSearchParams(clean).toString();
    return request(`/productos/${qs ? `?${qs}` : ''}`);
  },
  crear: (data) =>
    request('/productos/', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id, data) =>
    request(`/productos/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  eliminar: (id) =>
    request(`/productos/${id}/`, { method: 'DELETE' }),
  categorias: () => request('/productos/categorias/'),
};
