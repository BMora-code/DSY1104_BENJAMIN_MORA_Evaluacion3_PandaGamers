import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductoCard from "../components/ProductoCard";
import dataStore from "../data/dataStore";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const location = useLocation();

  useEffect(() => {
    const updateProductos = () => {
      console.log('Actualizando productos en Productos.js...');
      const allProducts = dataStore.getProducts();
      const ofertas = dataStore.getOfertas();
      console.log('Productos totales:', allProducts.length);
      console.log('Ofertas activas:', ofertas.length);

      // Filtrar productos que NO tienen ofertas activas
      const productosSinOferta = allProducts.filter(producto => {
        const tieneOferta = ofertas.some(oferta => parseInt(oferta.productId) === producto.id);
        if (tieneOferta) {
          console.log(`Producto ${producto.id} (${producto.name}) tiene oferta, excluyéndolo`);
        }
        return !tieneOferta;
      });

      console.log('Productos sin oferta:', productosSinOferta.length);
      setProductos(productosSinOferta);
    };

    // Verificar si hay parámetros de URL para filtrar por categoría
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('cat');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    // Cargar productos inicialmente
    updateProductos();

    // Escuchar cambios en las ofertas para actualizar la lista de productos
    const handleOfertasUpdate = () => {
      console.log('Evento ofertasUpdated recibido en Productos.js');
      updateProductos();
    };

    window.addEventListener('ofertasUpdated', handleOfertasUpdate);

    return () => {
      window.removeEventListener('ofertasUpdated', handleOfertasUpdate);
    };
  }, [location.search]);

  // Filtrar productos basado en búsqueda y categoría
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || producto.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [...new Set(productos.map(p => p.category))];

  // Agrupar productos por categoría (y ordenar por nombre dentro de cada categoría)
  const productosPorCategoria = categories.reduce((acc, category) => {
    acc[category] = productos
      .filter(producto => producto.category === category)
      .slice() // copia para no mutar el original
      .sort((a, b) => (a.name || a.nombre).localeCompare(b.name || b.nombre, 'es'));
    return acc;
  }, {});

  // Lista filtrada ordenada (cuando se usa el filtro de categoría)
  const sortedFilteredProductos = filteredProductos.slice().sort((a, b) =>
    (a.name || a.nombre).localeCompare(b.name || b.nombre, 'es')
  );

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Productos</h2>

      {/* Barra de búsqueda y filtros */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mostrar productos por secciones si no hay filtro de categoría */}
      {selectedCategory === "" ? (
        categories.map(category => {
          const productosFiltrados = productosPorCategoria[category].filter(producto =>
            producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.description.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (productosFiltrados.length === 0) return null;

          return (
            <div key={category} className="mb-3">
              <h3 className="mb-2">{category}</h3>
              <div className="row gx-3 gy-3">
                {productosFiltrados.map(producto => (
                  <div key={producto.id} className="col-lg-3 col-md-4 col-sm-6 mb-3 text-start" style={{ paddingLeft: '8px' }}>
                    <ProductoCard producto={producto} />
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        /* Grid de productos filtrados por categoría (ordenado) */
        <div className="row gx-3 gy-3">
          {sortedFilteredProductos.map(producto => (
            <div key={producto.id} className="col-lg-3 col-md-4 col-sm-6 mb-3 text-start" style={{ paddingLeft: '8px' }}>
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>
      )}

      {filteredProductos.length === 0 && (
        <div className="text-center mt-4">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default Productos;
