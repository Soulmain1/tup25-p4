'use client';

import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    direccion: '',
    numeroTarjeta: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orden = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      items: cart,
      total: totalFinal,
      cliente: form,
    };

    const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));

 
    clearCart();

    setLoading(false);
    router.push('/success');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Carrito vacío</h1>
          <p className="text-gray-600 mb-6">No hay productos para comprar</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Volver a comprar
          </Link>
        </div>
      </div>
    );
  }


  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);


  const iva = cart.reduce((acc, item) => {
    const ivaItem = item.categoria === 'Electrónica' ? 0.10 : 0.21;
    return acc + item.price * item.quantity * ivaItem;
  }, 0);

  const envio = 50;
  const totalFinal = subtotal + iva + envio;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Información de entrega</h2>

              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
              />

              <h2 className="text-xl font-bold mb-4 mt-6">Información de pago</h2>

              <input
                type="text"
                name="numeroTarjeta"
                placeholder="Número de tarjeta"
                value={form.numeroTarjeta}
                onChange={handleChange}
                required
                maxLength={19}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {loading ? 'Procesando...' : 'Confirmar compra'}
              </button>
            </form>
          </div>

          {/* Resumen del carrito */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumen del carrito</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => {
                  const imageUrl = item.image
                    ? `http://127.0.0.1:8000/${item.image}`
                    : '/placeholder.png';

                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold">{item.name}</p>
                        <p>Cantidad: {item.quantity}</p>
                        <p className="text-xs text-gray-500">IVA: {item.categoria === 'Electrónica' ? '10%' : '21%'}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA:</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>${envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>${totalFinal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
