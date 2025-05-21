import React, { useEffect, useState, useMemo } from "react";
import { FiSearch, FiPlus, FiEye } from "react-icons/fi";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";

export default function EmpresasTable({ onVerFormularios, onCrearFormulario }) {
  const [empresas, setEmpresas] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://backendcalid-production.up.railway.app/empresas/")
      .then(res => res.json())
      .then(setEmpresas);
  }, []);

  // Filtrado y paginación
  const filtered = useMemo(() => {
    return empresas.filter(emp =>
      emp.nombre.toLowerCase().includes(query.toLowerCase()) ||
      emp.telefono.toLowerCase().includes(query.toLowerCase()) ||
      String(emp.id_empresa).includes(query)
    );
  }, [empresas, query]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header con búsqueda y acción */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-t-xl px-6 py-4 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Empresas
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 w-full sm:w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
            <button
              onClick={() => navigate('/formularios/nuevo')}
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <FiPlus className="mr-2" /> Crear formulario
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
              className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              style={{marginLeft:8}}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-md rounded-b-xl">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {["ID", "Nombre", "Teléfono", "Acciones"].map(col => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayed.map(emp => (
                <tr
                  key={emp.id_empresa}
                  className="bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {emp.id_empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {emp.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {emp.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/empresas/${emp.id_empresa}/formularios`)}
                      className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <FiEye className="mr-1" /> Ver
                    </button>
                  </td>
                </tr>
              ))}

              {displayed.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron empresas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm text-white hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm text-white hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
