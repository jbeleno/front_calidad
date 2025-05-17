import React, { useEffect, useState, useMemo } from "react";
import { FiSearch, FiPlus, FiArrowLeft, FiEye } from "react-icons/fi";
import Resultados from "./Resultados";

export default function FormulariosEmpresaTable({
  empresa,
  onVolver,
  onCrearFormulario
}) {
  const [formularios, setFormularios] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [idFormularioResultados, setIdFormularioResultados] = useState(null);
  const itemsPerPage = 5;

  // 1. Carga de datos
  useEffect(() => {
    fetch("https://microform-production.up.railway.app/formularios/")
      .then((res) => res.json())
      .then((data) => {
        setFormularios(
          data.filter((f) => f.id_empresa === empresa.id_empresa)
        );
        setCurrentPage(1);
      });
  }, [empresa]);

  // 2. Filtrado
  const filtered = useMemo(
    () =>
      formularios.filter(
        (f) =>
          String(f.id_formulario).includes(query) ||
          f.nombre_software.toLowerCase().includes(query.toLowerCase()) ||
          f.fecha.includes(query)
      ),
    [formularios, query]
  );

  // 3. Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 4. Si estamos viendo Resultados, mostrar componente aparte
  if (idFormularioResultados) {
    return (
      <Resultados
        idFormulario={idFormularioResultados}
        onVolver={() => setIdFormularioResultados(null)}
      />
    );
  }

  // 5. UI principal
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={onVolver}
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <FiArrowLeft className="mr-1" /> Volver
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 my-3 sm:my-0">
            Formularios de {empresa.nombre}
          </h2>
          <button
            onClick={onCrearFormulario}
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <FiPlus className="mr-1" /> Crear
          </button>
        </div>

        {/* Búsqueda */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="relative max-w-sm mx-auto">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {["ID", "Software", "Fecha", "Acciones"].map((col) => (
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
              {displayed.map((f) => (
                <tr
                  key={f.id_formulario}
                  className="bg-white hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {f.id_formulario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {f.nombre_software}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {f.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setIdFormularioResultados(f.id_formulario)}
                      className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <FiEye className="mr-1" /> Ver
                    </button>
                  </td>
                </tr>
              ))}

              {displayed.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No hay formularios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3 px-6 py-4 bg-white border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
