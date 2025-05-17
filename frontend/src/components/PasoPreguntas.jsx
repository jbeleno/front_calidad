import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiTrash2, FiPlus } from "react-icons/fi";

export default function PasoPreguntas({
  onBack,
  onSubmit,
  parametros,
}) {
  const [preguntasPredeterminadas, setPreguntasPredeterminadas] = useState([]);
  const [preguntasPorParametro, setPreguntasPorParametro] = useState(() => {
    const obj = {};
    (parametros || []).forEach((param) => {
      obj[param.id_parametro] = [];
    });
    return obj;
  });
  const [observacionesPorPregunta, setObservacionesPorPregunta] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://microev-production.up.railway.app/preguntas_predeterminadas/")
      .then((r) => r.json())
      .then(setPreguntasPredeterminadas)
      .catch(console.error);
  }, []);

  const handleAddPredeterminada = (idParam, preguntaPred) => {
    setPreguntasPorParametro((prev) => {
      if (
        prev[idParam].some(
          (p) => p.id_pregunta_predeterminada === preguntaPred.id_pregunta_predeterminada
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        [idParam]: [
          ...prev[idParam],
          {
            id_pregunta_predeterminada: preguntaPred.id_pregunta_predeterminada,
            nombre: preguntaPred.nombre,
            descripcion: preguntaPred.descripcion,
            valor: "",
          },
        ],
      };
    });
  };

  const handleAddManual = (idParam) => {
    setPreguntasPorParametro((prev) => ({
      ...prev,
      [idParam]: [
        ...prev[idParam],
        { id_pregunta_predeterminada: null, nombre: "", descripcion: "", valor: "" },
      ],
    }));
  };

  const handleInput = (idParam, idx, field, value) =>
    setPreguntasPorParametro((prev) => {
      const copy = [...prev[idParam]];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, [idParam]: copy };
    });

  const handleDelete = (idParam, idx) =>
    setPreguntasPorParametro((prev) => {
      const copy = [...prev[idParam]];
      copy.splice(idx, 1);
      return { ...prev, [idParam]: copy };
    });

  const handleAddObservacion = (idParam, idx) => {
    const key = `${idParam}_${idx}`;
    setObservacionesPorPregunta((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ""],
    }));
  };

  const handleObservacionChange = (idParam, idx, obsIdx, value) => {
    const key = `${idParam}_${idx}`;
    setObservacionesPorPregunta((prev) => {
      const copy = [...(prev[key] || [])];
      copy[obsIdx] = value;
      return { ...prev, [key]: copy };
    });
  };

  const handleDeleteObservacion = (idParam, idx, obsIdx) => {
    const key = `${idParam}_${idx}`;
    setObservacionesPorPregunta((prev) => {
      const copy = [...(prev[key] || [])];
      copy.splice(obsIdx, 1);
      return { ...prev, [key]: copy };
    });
  };

  const handleFinalizar = () => {
    // validaciones intactas...
    for (const idParam in preguntasPorParametro) {
      for (const p of preguntasPorParametro[idParam]) {
        if (!p.nombre || !p.descripcion || !p.valor) {
          setError("Todas las preguntas deben tener texto, descripción y valor.");
          return;
        }
      }
    }
    setError("");
    onSubmit(preguntasPorParametro, observacionesPorPregunta);
  };

  return (
    <>
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Preguntas por Parámetro</h2>
      </div>

      {/* CRITERIOS */}
      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 bg-white">
        <div>
          <p className="text-gray-700 font-semibold mb-2">CRITERIO DEL VALOR DE LA EVALUACIÓN</p>
          <ul className="text-gray-700 text-base space-y-1 list-disc list-inside">
            <li><span className="font-bold">0</span> No cumple de 0% a un 30%</li>
            <li><span className="font-bold">1</span> Cumple de 31% a 50%</li>
            <li><span className="font-bold">2</span> Cumple de 51% a 89%</li>
            <li><span className="font-bold">3</span> Cumple con o más del 90%</li>
          </ul>
        </div>
      </div>

      {/* BODY */}
      <div className="py-8 space-y-8">
        {parametros.map((param) => {
          const idParam = param.id_parametro;
          const idPred = param.id_parametro_predeterminado;
          const lista = preguntasPorParametro[idParam] || [];

          return (
            <div key={idParam} className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md p-6 space-y-6 transition hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Parámetro: <span className="ml-1 font-semibold">{param.nombre}</span>
              </h3>

              {/* Selección predeterminada */}
              {idPred && (
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700 mb-1">
                    Agregar pregunta predeterminada:
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        const sel = preguntasPredeterminadas.find(
                          (q) => q.id_pregunta_predeterminada === +e.target.value
                        );
                        if (sel) handleAddPredeterminada(idParam, sel);
                      }}
                      defaultValue=""
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                    >
                      <option value="">Selecciona una pregunta…</option>
                      {preguntasPredeterminadas
                        .filter((q) => q.id_parametro_predeterminado === idPred)
                        .map((q) => (
                          <option key={q.id_pregunta_predeterminada} value={q.id_pregunta_predeterminada}>
                            {q.nombre}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Tabla de preguntas */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full table-auto border-collapse text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      {[
                        "Pregunta",
                        "Descripción",
                        "Valor",
                        "",
                      ].map((h) => (
                        <th key={h} className="border-b border-gray-200 px-4 py-3 text-left text-gray-700 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((p, idx) => {
                      const key = `${idParam}_${idx}`;
                      return (
                        <React.Fragment key={key}>
                          <tr className="even:bg-gray-50">
                            <td className="px-4 py-3 align-top">
                              <input
                                value={p.nombre}
                                onChange={(e) => handleInput(idParam, idx, "nombre", e.target.value)}
                                placeholder="Pregunta"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                              />
                            </td>
                            <td className="px-4 py-3 align-top">
                              <input
                                value={p.descripcion}
                                onChange={(e) => handleInput(idParam, idx, "descripcion", e.target.value)}
                                placeholder="Descripción"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                              />
                            </td>
                            <td className="px-4 py-3 align-top w-24">
                              <input
                                value={p.valor}
                                onChange={(e) => handleInput(idParam, idx, "valor", e.target.value)}
                                type="number"
                                min={0}
                                max={3}
                                placeholder="0–3"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                              />
                            </td>
                            <td className="px-4 py-3 align-top w-32">
                              <button
                                onClick={() => handleDelete(idParam, idx)}
                                className="inline-flex items-center btn-eliminar"
                              >
                                <FiTrash2 className="mr-1" />
                                Eliminar
                              </button>
                            </td>
                          </tr>

                          {/* Observaciones */}
                          <tr>
                            <td colSpan={4} className="px-4 pb-4 pt-0">
                              <div className="space-y-2">
                                {(observacionesPorPregunta[key] || []).map((obs, obsIdx) => (
                                  <div key={obsIdx} className="flex gap-2 items-center">
                                    <input
                                      value={obs}
                                      onChange={(e) =>
                                        handleObservacionChange(idParam, idx, obsIdx, e.target.value)
                                      }
                                      placeholder="Observación"
                                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                                    />
                                    <button
                                      onClick={() =>
                                        handleDeleteObservacion(idParam, idx, obsIdx)
                                      }
                                      className="inline-flex items-center btn-eliminar"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleAddObservacion(idParam, idx)}
                                  className="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-800 px-5 py-2 rounded-lg transition font-semibold"
                                >
                                  <FiPlus className="mr-1" />
                                  Agregar observación
                                </button>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleAddManual(idParam)}
                  className="inline-flex items-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold text-lg shadow transition"
                >
                  <FiPlus className="mr-2 text-xl" />
                  Agregar pregunta manual
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="px-8 py-6 border-t border-gray-200 bg-gradient-to-r from-white to-blue-50 flex flex-col md:flex-row items-center justify-end gap-4 mt-8">
        {error && (
          <div className="flex-1 flex justify-center">
            <p className="bg-red-50 border border-red-300 text-red-700 px-6 py-3 rounded-lg text-center font-semibold shadow animate-shake">
              {error}
            </p>
          </div>
        )}
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition shadow"
        >
          Atrás
        </button>
        <button
          onClick={handleFinalizar}
          className="px-8 py-3 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold text-lg transition shadow ml-auto"
        >
          Finalizar
        </button>
      </div>
    </>
  );
}
