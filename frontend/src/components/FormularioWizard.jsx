import React, { useState } from "react";
import PasoDatosGenerales from "./PasoDatosGenerales";
import PasoParametros from "./PasoParametros";
import PasoPreguntas from "./PasoPreguntas";
import Resultados from "./Resultados";
import "./FormularioWizard.css";

export default function FormularioWizard({ onClose }) {
  const [step, setStep] = useState(1);
  const [datosGenerales, setDatosGenerales] = useState({});
  const [parametros, setParametros] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [idFormulario, setIdFormulario] = useState(null);
  const [parametrosCreados, setParametrosCreados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const handleSubmit = () => {
    const datos = {
      ...datosGenerales,
      parametros,
      preguntas,
    };
    alert("¡Formulario enviado! (ver consola)");
    console.log("Datos a enviar:", datos);
    setMostrarResultados(true);
  };

  const handleParametrosNext = async () => {
    // Validar duplicados por nombre (ignorando mayúsculas/minúsculas y espacios)
    const nombres = new Set();
    for (const p of parametros) {
      const nombreKey = p.nombre.trim().toLowerCase();
      if (nombres.has(nombreKey)) {
        alert("No puedes agregar parámetros con el mismo nombre.");
        return;
      }
      nombres.add(nombreKey);
    }

    // Validar duplicados por id_parametro_predeterminado (si está definido)
    const ids = new Set();
    for (const p of parametros) {
      if (p.id_parametro_predeterminado) {
        if (ids.has(p.id_parametro_predeterminado)) {
          alert("No puedes agregar parámetros con el mismo parámetro predeterminado.");
          return;
        }
        ids.add(p.id_parametro_predeterminado);
      }
    }

    const suma = parametros.reduce((acc, p) => acc + (parseFloat(p.porcentaje_maximo) || 0), 0);
    if (suma > 100) {
      alert("La suma de los porcentajes no puede ser mayor a 100%.");
      return;
    }
    for (const p of parametros) {
      if (!p.id_parametro_predeterminado && (!p.nombre || !p.descripcion)) {
        alert("Si no seleccionas un parámetro predeterminado, debes llenar nombre y descripción.");
        return;
      }
      if (!p.porcentaje_maximo) {
        alert("Todos los parámetros deben tener porcentaje máximo.");
        return;
      }
    }
    const nuevosParametros = [];
    for (const p of parametros) {
      try {
        const res = await fetch("https://microev-production.up.railway.app/parametros/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_formulario: idFormulario,
            id_parametro_predeterminado: p.id_parametro_predeterminado || null,
            nombre: p.nombre,
            descripcion: p.descripcion,
            porcentaje_maximo: parseFloat(p.porcentaje_maximo)
          })
        });
        if (!res.ok) throw new Error("Error creando parámetro");
        const paramCreado = await res.json();
        nuevosParametros.push(paramCreado);
      } catch (err) {
        alert("No se pudo crear un parámetro: " + err.message);
        return;
      }
    }
    setParametrosCreados(nuevosParametros);
    setStep(3);
  };

  return (
    <div className="wizard-container">
      {onClose && (
        <button onClick={onClose} style={{ float: "right", marginBottom: 16 }}>
          Volver al inicio
        </button>
      )}
      {mostrarResultados ? (
        <Resultados idFormulario={idFormulario} onVolver={() => setMostrarResultados(false)} />
      ) : (
        <>
          {step === 1 && (
            <PasoDatosGenerales
              datos={datosGenerales}
              onChange={setDatosGenerales}
              onNext={id => {
                setIdFormulario(id);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <PasoParametros
              parametros={parametros}
              onChange={setParametros}
              onNext={handleParametrosNext}
              onBack={() => setStep(1)}
              idFormulario={idFormulario}
            />
          )}
          {step === 3 && (
            <PasoPreguntas
              preguntas={preguntas}
              onChange={setPreguntas}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              idFormulario={idFormulario}
              parametros={parametrosCreados}
            />
          )}
        </>
      )}
    </div>
  );
}