import React, { useEffect, useState } from "react";

export default function PasoPreguntas({ preguntas, onChange, onBack, onSubmit, idFormulario, parametros }) {
  const [preguntasPredeterminadas, setPreguntasPredeterminadas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Traer todas las preguntas predeterminadas
    fetch("https://microev-production.up.railway.app/preguntas_predeterminadas/")
      .then(res => res.json())
      .then(data => setPreguntasPredeterminadas(data));
  }, []);

  // Estado local: preguntas por parámetro
  const [preguntasPorParametro, setPreguntasPorParametro] = useState(() => {
    // Inicializar con los parámetros recibidos
    const obj = {};
    (parametros || []).forEach((param, idx) => {
      obj[param.id_parametro || idx] = [];
    });
    return obj;
  });

  // Estado local: observaciones por pregunta (clave: id temporal de pregunta en frontend)
  const [observacionesPorPregunta, setObservacionesPorPregunta] = useState({});

  // Agregar pregunta predeterminada
  const handleAddPredeterminada = (idParametro, preguntaPred) => {
    setPreguntasPorParametro(prev => {
      const yaExiste = prev[idParametro].some(p => p.id_pregunta_predeterminada === preguntaPred.id_pregunta_predeterminada);
      if (yaExiste) return prev; // No duplicar
      return {
        ...prev,
        [idParametro]: [
          ...prev[idParametro],
          {
            id_pregunta_predeterminada: preguntaPred.id_pregunta_predeterminada,
            nombre: preguntaPred.nombre,
            descripcion: preguntaPred.descripcion,
            valor: ""
          }
        ]
      };
    });
  };

  // Agregar pregunta manual
  const handleAddManual = (idParametro) => {
    setPreguntasPorParametro(prev => ({
      ...prev,
      [idParametro]: [
        ...prev[idParametro],
        { id_pregunta_predeterminada: null, nombre: "", descripcion: "", valor: "" }
      ]
    }));
  };

  // Editar pregunta
  const handleInput = (idParametro, idx, field, value) => {
    setPreguntasPorParametro(prev => {
      const nuevas = prev[idParametro].slice();
      nuevas[idx][field] = value;
      return { ...prev, [idParametro]: nuevas };
    });
  };

  // Eliminar pregunta
  const handleDelete = (idParametro, idx) => {
    setPreguntasPorParametro(prev => {
      const nuevas = prev[idParametro].slice();
      nuevas.splice(idx, 1);
      return { ...prev, [idParametro]: nuevas };
    });
    setObservacionesPorPregunta(prev => {
      const nuevo = { ...prev };
      delete nuevo[`${idParametro}_${idx}`];
      return nuevo;
    });
  };

  // Manejar observaciones
  const handleAddObservacion = (idParametro, idx) => {
    setObservacionesPorPregunta(prev => {
      const key = `${idParametro}_${idx}`;
      return {
        ...prev,
        [key]: [...(prev[key] || []), ""]
      };
    });
  };

  const handleObservacionChange = (idParametro, idx, obsIdx, value) => {
    setObservacionesPorPregunta(prev => {
      const key = `${idParametro}_${idx}`;
      const nuevas = [...(prev[key] || [])];
      nuevas[obsIdx] = value;
      return { ...prev, [key]: nuevas };
    });
  };

  const handleDeleteObservacion = (idParametro, idx, obsIdx) => {
    setObservacionesPorPregunta(prev => {
      const key = `${idParametro}_${idx}`;
      const nuevas = [...(prev[key] || [])];
      nuevas.splice(obsIdx, 1);
      return { ...prev, [key]: nuevas };
    });
  };

  // Guardar en backend
  const handleFinalizar = async () => {
    // Validar que todas las preguntas tengan nombre, descripción y valor
    for (const idParametro in preguntasPorParametro) {
      for (const p of preguntasPorParametro[idParametro]) {
        if (!p.nombre || !p.descripcion || !p.valor) {
          setError("Todas las preguntas deben tener pregunta, descripción y valor.");
          return;
        }
      }
    }
    setError("");
    // Guardar en backend
    for (const idParametro in preguntasPorParametro) {
      for (let idx = 0; idx < preguntasPorParametro[idParametro].length; idx++) {
        const p = preguntasPorParametro[idParametro][idx];
        try {
          const res = await fetch("https://microev-production.up.railway.app/preguntas/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_parametro: idParametro,
              id_pregunta_predeterminada: p.id_pregunta_predeterminada || null,
              nombre: p.nombre,
              descripcion: p.descripcion,
              valor_obtenido: parseFloat(p.valor),
              valor_maximo: parseFloat(3)
            })
          });
          if (!res.ok) throw new Error("Error creando pregunta");
          const preguntaCreada = await res.json();
          // Guardar observaciones asociadas a esta pregunta
          const key = `${idParametro}_${idx}`;
          const observaciones = observacionesPorPregunta[key] || [];
          for (const texto_observacion of observaciones) {
            if (texto_observacion && texto_observacion.trim() !== "") {
              await fetch("https://microev-production.up.railway.app/observaciones/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_pregunta: preguntaCreada.id_pregunta,
                  texto_observacion
                })
              });
            }
          }
        } catch (err) {
          setError("No se pudo crear una pregunta u observación: " + err.message);
          return;
        }
      }
    }
    onSubmit();
  };

  return (
    <div className="wizard-step">
      <h2>Preguntas por Parámetro</h2>
      <div style={{
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <span style={{ fontWeight: 'normal', marginRight: '32px' }}>
          CRITERIO DEL VALOR DE LA EVALUACION
        </span>
        <span style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>
          0 No cumple de 0% a un 30%{"\n"}
          1 Cumple de 31% a 50%{"\n"}
          2 Cumple de 51% a 89%{"\n"}
          3 Cumple con o más del 90%
        </span>
      </div>
      {(parametros || []).map((param, idx) => (
        <div key={param.id_parametro || idx} style={{marginBottom: 32, border: '1px solid #ccc', borderRadius: 8, padding: 16}}>
          <h3>Parámetro: {param.nombre}</h3>
          {/* Preguntas predeterminadas disponibles para este parámetro */}
          {param.id_parametro_predeterminado && (
            <div style={{marginBottom: 8}}>
              <strong>Agregar pregunta predeterminada:</strong>
              <select
                onChange={e => {
                  const pregunta = preguntasPredeterminadas.find(
                    q => q.id_pregunta_predeterminada === parseInt(e.target.value)
                  );
                  if (pregunta) handleAddPredeterminada(param.id_parametro || idx, pregunta);
                }}
                defaultValue=""
              >
                <option value="">Selecciona una pregunta</option>
                {preguntasPredeterminadas
                  .filter(q => q.id_parametro_predeterminado === parseInt(param.id_parametro_predeterminado))
                  .map(q => (
                    <option key={q.id_pregunta_predeterminada} value={q.id_pregunta_predeterminada}>
                      {q.nombre}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {/* Tabla de preguntas */}
          <table style={{width: '100%', marginBottom: 8}}>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Descripción</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(preguntasPorParametro[param.id_parametro || idx] || []).map((p, i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td>
                      <input
                        value={p.nombre}
                        onChange={e => handleInput(param.id_parametro || idx, i, "nombre", e.target.value)}
                        placeholder="Pregunta"
                      />
                    </td>
                    <td>
                      <input
                        value={p.descripcion}
                        onChange={e => handleInput(param.id_parametro || idx, i, "descripcion", e.target.value)}
                        placeholder="Descripción"
                      />
                    </td>
                    <td>
                      <input
                        value={p.valor}
                        onChange={e => {
                          const v = e.target.value;
                          if (v === '' || (Number(v) >= 0 && Number(v) <= 3 && Number.isInteger(Number(v)))) {
                            handleInput(param.id_parametro || idx, i, "valor", v);
                          }
                        }}
                        placeholder="Valor"
                        type="number"
                        min={0}
                        max={3}
                        step={1}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => handleDelete(param.id_parametro || idx, i)}>Eliminar</button>
                    </td>
                  </tr>
                  {/* Observaciones para esta pregunta */}
                  <tr>
                    <td colSpan={4}>
                      <div style={{ marginLeft: 16 }}>
                        <strong>Observaciones:</strong>
                        {(observacionesPorPregunta[`${param.id_parametro || idx}_${i}`] || []).map((obs, obsIdx) => (
                          <div key={obsIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <input
                              type="text"
                              value={obs}
                              onChange={e => handleObservacionChange(param.id_parametro || idx, i, obsIdx, e.target.value)}
                              placeholder="Observación"
                              style={{ flex: 1, marginRight: 8 }}
                            />
                            <button type="button" onClick={() => handleDeleteObservacion(param.id_parametro || idx, i, obsIdx)}>
                              Eliminar
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleAddObservacion(param.id_parametro || idx, i)}>
                          Agregar observación
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={() => handleAddManual(param.id_parametro || idx)}>Agregar pregunta manual</button>
        </div>
      ))}
      <div className="wizard-buttons">
        <button onClick={onBack}>Atrás</button>
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <button onClick={handleFinalizar}>Finalizar</button>
      </div>
    </div>
  );
}