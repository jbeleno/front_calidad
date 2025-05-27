import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";

export default function Resultados({ idFormulario, onVolver }) {
  const [parametros, setParametros] = useState([]);
  const [preguntasPorParametro, setPreguntasPorParametro] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resParam = await fetch(
        `https://microev-production.up.railway.app/parametros/?id_formulario=${idFormulario}`
      );
      const params = await resParam.json();
      setParametros(params);

      const preguntasObj = {};
      for (const param of params) {
        const resPreg = await fetch(
          `https://microev-production.up.railway.app/preguntas/parametro/${param.id_parametro}`
        );
        preguntasObj[param.id_parametro] = await resPreg.json();
      }
      setPreguntasPorParametro(preguntasObj);
      setLoading(false);
    }
    if (idFormulario) fetchData();
  }, [idFormulario]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Cargando resultados…</span>
      </div>
    );
  }

  // Cálculos de totales
  const totals = parametros.reduce(
    (acc, param) => {
      const lista = preguntasPorParametro[param.id_parametro] || [];
      const sumObt = lista.reduce((s, p) => s + (p.valor_obtenido || 0), 0);
      const sumMax = lista.reduce((s, p) => s + (p.valor_maximo || 0), 0);
      const pct = sumMax > 0 ? (sumObt / sumMax) * 100 : 0;
      acc.sumaObtenido += sumObt;
      acc.sumaMaximo += sumMax;
      acc.sumaPctParam += parseFloat(param.porcentaje_maximo || 0);
      acc.global += (pct * (param.porcentaje_maximo || 0)) / 100;
      return acc;
    },
    { sumaObtenido: 0, sumaMaximo: 0, sumaPctParam: 0, global: 0 }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-5xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <h2 className="text-3xl font-bold text-gray-900">
            Resultados del Formulario
          </h2>
          <button
            onClick={() => navigate('/empresas')}
            className="inline-flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-lg transition"
          >
            <FiArrowLeft />
            <span>Volver</span>
          </button>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto px-8 py-6">
          <table className="w-full table-auto border-collapse resultados-table">
            <thead className="bg-gray-100 uppercase text-gray-600 text-sm">
              <tr>
                {[
                  "Parámetro",
                  "Suma obtenido",
                  "Suma máximo",
                  "% obtenido",
                  "% máximo",
                  "% global",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-center font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {parametros.map((param) => {
                const lista = preguntasPorParametro[param.id_parametro] || [];
                const sumObt = lista.reduce(
                  (s, p) => s + (p.valor_obtenido || 0),
                  0
                );
                const sumMax = lista.reduce(
                  (s, p) => s + (p.valor_maximo || 0),
                  0
                );
                const pct = sumMax > 0 ? (sumObt / sumMax) * 100 : 0;
                const globalPct =
                  ((pct * param.porcentaje_maximo) / 100) || 0;

                return (
                  <tr
                    key={param.id_parametro}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3 text-center">
                      {param.nombre}
                    </td>
                    <td className="px-4 py-3 text-center">{sumObt}</td>
                    <td className="px-4 py-3 text-center">{sumMax}</td>
                    <td className="px-4 py-3 text-center">
                      {pct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {param.porcentaje_maximo}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {globalPct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100 text-gray-900 font-semibold">
              <tr>
                <td className="px-4 py-3 text-center">Total</td>
                <td className="px-4 py-3 text-center">
                  {totals.sumaObtenido}
                </td>
                <td className="px-4 py-3 text-center">
                  {totals.sumaMaximo}
                </td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-center">
                  {totals.sumaPctParam.toFixed(0)}%
                </td>
                <td className="px-4 py-3 text-center">
                  {totals.global.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* LEYENDA */}
        <div className="px-8 pb-8 text-center space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            RESULTADO DEL EJERCICIO
          </p>
          <p className="text-red-600 font-medium">0 A 30% DEFICIENTE</p>
          <p className="text-purple-600 font-medium">
            31 A 50% INSUFICIENTE
          </p>
          <p className="text-yellow-600 font-medium">
            51 A 70% ACEPTABLE
          </p>
          <p className="text-teal-600 font-medium">
            71 A 89% SOBRESALIENTE
          </p>
          <p className="text-green-600 font-medium">
            MÁS DE 90% EXCELENTE
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultadosWrapper() {
  const { id } = useParams();
  return <Resultados idFormulario={id} />;
}
