import React, { useEffect, useState } from "react";

export default function PasoParametros({ parametros, onChange, onNext, onBack, idFormulario }) {
  const [parametrosPredeterminados, setParametrosPredeterminados] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8002/parametros_predeterminados/") // Ajusta el puerto si es necesario
      .then(res => res.json())
      .then(data => setParametrosPredeterminados(data));
  }, []);

  const handleAddParametro = () => {
    // Si el usuario seleccionó un parámetro predeterminado ya existente, no lo agregues
    const idsExistentes = parametros.map(p => Number(p.id_parametro_predeterminado));
    const idNuevo = ""; // o el valor seleccionado si lo tienes
    if (idNuevo && idsExistentes.includes(idNuevo)) {
      setError("Ese parámetro predeterminado ya fue agregado.");
      return;
    }
    onChange([
      ...parametros,
      {
        id_parametro_predeterminado: "",
        nombre: "",
        descripcion: "",
        porcentaje_maximo: "",
        porcentaje_obtenido: ""
      }
    ]);
  };

  const handleSelect = (i, e) => {
    const id = e.target.value;
    const seleccionado = parametrosPredeterminados.find(p => p.id_parametro_predeterminado === parseInt(id));
    const nuevos = parametros.slice();
    nuevos[i] = {
      ...nuevos[i],
      id_parametro_predeterminado: id ? parseInt(id) : null,
      nombre: seleccionado ? seleccionado.nombre : "",
      descripcion: seleccionado ? seleccionado.descripcion : "",
    };
    onChange(nuevos);
  };

  const handleInput = (i, e) => {
    const nuevos = parametros.slice();
    nuevos[i][e.target.name] = e.target.value;
    onChange(nuevos);
  };

  // Validación de suma de porcentajes y guardado en backend
  const handleNext = async () => {
    if (guardando) return;
    setGuardando(true);
    console.log("Guardando parámetros...");
    const suma = parametros.reduce((acc, p) => acc + (parseFloat(p.porcentaje_maximo) || 0), 0);
    if (suma > 100) {
      setError("La suma de los porcentajes no puede ser mayor a 100%.");
      setGuardando(false);
      return;
    }
    if (suma < 100) {
      setError("La suma de los porcentajes debe ser exactamente 100%.");
      setGuardando(false);
      return;
    }
    // Validar que si no hay predeterminado, nombre y descripción sean obligatorios
    for (const p of parametros) {
      if (!p.id_parametro_predeterminado && (!p.nombre || !p.descripcion)) {
        setError("Si no seleccionas un parámetro predeterminado, debes llenar nombre y descripción.");
        setGuardando(false);
        return;
      }
      if (!p.porcentaje_maximo) {
        setError("Todos los parámetros deben tener porcentaje máximo.");
        setGuardando(false);
        return;
      }
    }
    setError("");
    // Guardar en backend
    const parametrosUnicos = parametros.filter(
      (p, idx, arr) =>
        arr.findIndex(x =>
          Number(x.id_parametro_predeterminado) === Number(p.id_parametro_predeterminado) &&
          x.nombre === p.nombre
        ) === idx
    );

    // Validar que no haya parámetros repetidos por id_parametro_predeterminado y nombre
    const combinaciones = new Set();
    for (const p of parametrosUnicos) {
      const clave = `${p.id_parametro_predeterminado || ""}-${p.nombre.trim().toLowerCase()}`;
      if (combinaciones.has(clave)) {
        setError("No puedes agregar parámetros repetidos (misma combinación de predeterminado y nombre).");
        setGuardando(false);
        return;
      }
      combinaciones.add(clave);
    }

    console.log("Parámetros que se enviarán al backend:", parametrosUnicos);
    onNext();
    setGuardando(false);
  };

  return (
    <div className="wizard-step">
      <h2>Parámetros y Porcentaje</h2>
      {parametros.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
          <div style={{flex: 2}}>
            <select
              value={p.id_parametro_predeterminado || ""}
              onChange={e => handleSelect(i, e)}
            >
              <option value="">Selecciona un parámetro</option>
              {parametrosPredeterminados.map(pp => (
                <option key={pp.id_parametro_predeterminado} value={pp.id_parametro_predeterminado}>
                  {pp.nombre}
                </option>
              ))}
            </select>
            {/* Mostrar descripción solo si hay parámetro seleccionado */}
            {p.id_parametro_predeterminado && p.descripcion && (
              <div style={{fontSize: '0.95em', color: '#555', marginTop: 4, marginBottom: 4}}>
                {p.descripcion}
              </div>
            )}
          </div>
          <input
            name="porcentaje_maximo"
            placeholder="Porcentaje máximo"
            value={p.porcentaje_maximo || ""}
            onChange={e => handleInput(i, e)}
            type="number"
            style={{ width: 100 }}
          />
          {/* Botón eliminar */}
          <button
            type="button"
            style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4, padding: "0 12px", cursor: "pointer" }}
            onClick={() => {
              const nuevos = parametros.slice();
              nuevos.splice(i, 1);
              onChange(nuevos);
            }}
          >
            Eliminar
          </button>
        </div>
      ))}
      <button onClick={handleAddParametro} style={{ marginBottom: 16 }}>Agregar parámetro</button>
      <div className="wizard-buttons">
        <button onClick={onBack}>Atrás</button>
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <button onClick={handleNext} disabled={guardando}>Siguiente</button>
      </div>
    </div>
  );
}