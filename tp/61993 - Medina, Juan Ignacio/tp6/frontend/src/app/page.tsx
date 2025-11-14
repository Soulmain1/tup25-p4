'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  stock: number;
  descripcion?: string;
  categoria: string;
  tipo_iva: string;
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [query, setQuery] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categorias = useMemo(() => ['Todos', ...Array.from(new Set(productos.map(p => p.categoria)))], [productos]);

  // Filtrar por búsqueda y categoría
  const filteredProductos = useMemo(() => {
    return productos.filter(p => {
      const matchesQuery =
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (p.descripcion || '').toLowerCase().includes(query.toLowerCase());
      const matchesCategoria = categoriaSeleccionada === 'Todos' || p.categoria === categoriaSeleccionada;
      return matchesQuery && matchesCategoria;
    });
  }, [productos, query, categoriaSeleccionada]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/productos/');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error('Error fetching productos:', err);
        setError('No se pudieron cargar los productos. Verifica que el backend esté en http://127.0.0.1:8000');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
      

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <SearchBar query={query} onChange={setQuery} />
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No se encontraron productos para tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductos.map((p) => (
              <ProductCard
                key={p.id}
                producto={{
                  id: p.id,
                  nombre: p.nombre,
                  precio: p.precio,
                  imagen: p.imagen,
                  disponible: p.stock,
                  descripcion: p.descripcion,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
