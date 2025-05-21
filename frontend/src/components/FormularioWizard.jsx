import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";

import PasoDatosGenerales from "./PasoDatosGenerales";
import PasoParametros        from "./PasoParametros";
import PasoPreguntas         from "./PasoPreguntas";
import Resultados            from "./Resultados";

export default function FormularioWizard({ onClose }) {
  const [step, setStep]                     = useState(1);
  const [datosGenerales, setDatosGenerales] = useState({});
  const [parametros, setParametros]         = useState([]);
  const [preguntas, setPreguntas]           = useState([]);
  const [idFormulario, setIdFormulario]     = useState(null);
  const [parametrosCreados, setParametrosCreados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [metodologias, setMetodologias] = useState([]);
  const [idMetodologia, setIdMetodologia] = useState("");

  useEffect(() => {
    fetch("https://microform-production.up.railway.app/metodologias/")
      .then(res => res.json())
      .then(setMetodologias);
  }, []);

  // Al terminar de guardar las preguntas en PasoPreguntas,
  // simplemente mostramos la vista de Resultados
  const handlePreguntasSubmit = () => {
    setMostrarResultados(true);
  };

  // El "siguiente" de Parámetros ya hace el POST y devuelve
  // los parámetros creados para pasárselos a PasoPreguntas:
  const handleParametrosNext = async () => {
    // —VALIDACIONES IGUALES A TU VERSIÓN—
    const nombres = new Set();
    for (const p of parametros) {
      const key = p.nombre.trim().toLowerCase();
      if (nombres.has(key)) {
        alert("No puedes usar dos parámetros con el mismo nombre.");
        return;
      }
      nombres.add(key);
    }
    const ids = new Set();
    for (const p of parametros) {
      if (p.id_parametro_predeterminado) {
        if (ids.has(p.id_parametro_predeterminado)) {
          alert("No puedes usar dos veces el mismo parámetro predeterminado.");
          return;
        }
        ids.add(p.id_parametro_predeterminado);
      }
    }
    const suma = parametros.reduce(
      (acc, p) => acc + (parseFloat(p.porcentaje_maximo) || 0),
      0
    );
    if (suma > 100) {
      alert("La suma de los porcentajes no puede exceder 100%.");
      return;
    }
    if (suma < 100) {
      alert("La suma de los porcentajes debe ser 100%.");
      return;
    }
    for (const p of parametros) {
      if (
        !p.id_parametro_predeterminado &&
        (!p.nombre || !p.descripcion)
      ) {
        alert("Si no escoges un predeterminado, debes llenar nombre y descripción.");
        return;
      }
      if (!p.porcentaje_maximo) {
        alert("Cada parámetro requiere porcentaje máximo.");
        return;
      }
    }

    // —POST EN SERIE IGUAL A TU VERSIÓN ORIGINAL—
    const nuevos = [];
    for (const p of parametros) {
      try {
        const res = await fetch(
          "https://microev-production.up.railway.app/parametros/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_formulario: idFormulario,
              id_parametro_predeterminado: p.id_parametro_predeterminado || null,
              nombre: p.nombre,
              descripcion: p.descripcion,
              porcentaje_maximo: parseFloat(p.porcentaje_maximo),
            }),
          }
        );
        if (!res.ok) throw new Error("Error creando parámetro");
        const created = await res.json();
        nuevos.push(created);
      } catch (err) {
        alert("Error al crear parámetro: " + err.message);
        return;
      }
    }

    setParametrosCreados(nuevos);
    setStep(3);
  };


  return (
    mostrarResultados ? (
      <Resultados
        idFormulario={idFormulario}
        onVolver={() => setMostrarResultados(false)}
      />
    ) : (
      <div className="bg-white w-full max-w-5xl mx-auto my-10 p-8 rounded-xl shadow-lg text-gray-900">
        {onClose && (
          <button
            onClick={onClose}
            className="float-right mb-4 bg-black hover:bg-gray-800 text-white border border-gray-900 px-5 py-3 rounded-lg transition inline-flex items-center shadow font-semibold"
          >
            <FiArrowLeft className="mr-2" />
            Volver al inicio
          </button>
        )}
        {/* Wizard steps */}
        {step === 1 && (
          <>
            {/* Desplegable de metodología */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Metodología</label>
              <select
                value={idMetodologia}
                onChange={e => setIdMetodologia(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Seleccione una metodología</option>
                {metodologias.map(m => (
                  <option key={m.id_metodologia} value={m.id_metodologia}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <PasoDatosGenerales
              datos={datosGenerales}
              onChange={setDatosGenerales}
              onNext={id => {
                setIdFormulario(id);
                setStep(2);
              }}
              idMetodologia={idMetodologia}
            />
          </>
        )}
        {step === 2 && (
          <PasoParametros
            parametros={parametros}
            onChange={setParametros}
            onNext={handleParametrosNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <PasoPreguntas
            preguntas={preguntas}
            onChange={setPreguntas}
            onBack={() => setStep(2)}
            onSubmit={handlePreguntasSubmit}
            idFormulario={idFormulario}
            parametros={parametrosCreados}
          />
        )}
      </div>
    )
  );
}
