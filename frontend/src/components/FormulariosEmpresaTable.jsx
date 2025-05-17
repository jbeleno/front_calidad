import React, { useEffect, useState } from "react";
import Resultados from "./Resultados";

export default function FormulariosEmpresaTable({ empresa, onVolver, onCrearFormulario }) {
  const [formularios, setFormularios] = useState([]);
  const [idFormularioResultados, setIdFormularioResultados] = useState(null);

  useEffect(() => {
    fetch("https://microform-production.up.railway.app/formularios/")
      .then(res => res.json())
      .then(data => {
        setFormularios(data.filter(f => f.id_empresa === empresa.id_empresa));
      });
  }, [empresa]);

  if (idFormularioResultados) {
    return (
      <Resultados
        idFormulario={idFormularioResultados}
        onVolver={() => setIdFormularioResultados(null)}
      />
    );
  }

  return (
    <div className="bg-white max-w-[700px] mx-auto my-12 p-8 rounded-lg shadow-md">
      <h2 className="mb-6 text-center text-2xl font-semibold">Formularios de {empresa.nombre}</h2>
      <div className="flex justify-between mb-4">
        <button 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors"
          onClick={onVolver}
        >
          Volver
        </button>
        <button 
          className="bg-blue-600 text-white border-none px-5 py-2 rounded text-base cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={onCrearFormulario}
        >
          Crear formulario
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2.5 text-left text-gray-900">ID</th>
            <th className="border border-gray-300 p-2.5 text-left text-gray-900">Nombre del software</th>
            <th className="border border-gray-300 p-2.5 text-left text-gray-900">Fecha</th>
            <th className="border border-gray-300 p-2.5 text-left text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {formularios.map(f => (
            <tr key={f.id_formulario}>
              <td className="border border-gray-300 p-2.5 text-left text-gray-900">{f.id_formulario}</td>
              <td className="border border-gray-300 p-2.5 text-left text-gray-900">{f.nombre_software}</td>
              <td className="border border-gray-300 p-2.5 text-left text-gray-900">{f.fecha}</td>
              <td className="border border-gray-300 p-2.5 text-left text-gray-900">
                <button 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors"
                  onClick={() => setIdFormularioResultados(f.id_formulario)}
                >
                  Ver resultados
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
