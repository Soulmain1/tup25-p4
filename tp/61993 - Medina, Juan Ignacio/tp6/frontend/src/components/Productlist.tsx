'use client';

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: number;
  imagen: string;
  categoria: string;
}

export function ProductList() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todas");


  useEffect(() => {
    fetch("http://127.0.0.1:8000/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(
          data.map((p: any) => ({
            id: p.id,
            nombre: p.titulo,
            precio: p.precio,
            descripcion: p.descripcion,
            disponible: p.existencia,
            imagen: `http://127.0.0.1:8000/${p.imagen}`,
            categoria: p.categoria,
          }))
        );
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);


  const categorias = ["Todas", ...Array.from(new Set(productos.map(p => p.categoria)))];


  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div>
      {/* Botones de filtro */}
      <div className="flex gap-2 mb-6">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-4 py-2 rounded ${
              categoriaSeleccionada === cat ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosFiltrados.map((product) => (
          <ProductCard key={product.id} producto={product} />
        ))}
      </div>
    </div>
  );
}
