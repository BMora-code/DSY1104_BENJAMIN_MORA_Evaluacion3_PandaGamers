import React, { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import dataStore from "../data/dataStore";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Cargar productos desde el dataStore
    setProductos(dataStore.getProducts());
  }, []);

  // Filtrar productos basado en búsqueda y categoría
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || producto.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [...new Set(productos.map(p => p.category))];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Productos</h2>

      {/* Barra de búsqueda y filtros */}
      <div className="row mb-4">
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

      {/* Grid de productos */}
      <div className="row">
        {filteredProductos.map(producto => (
          <div key={producto.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <ProductoCard producto={producto} />
          </div>
        ))}
      </div>

      {filteredProductos.length === 0 && (
        <div className="text-center mt-4">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default Productos;
