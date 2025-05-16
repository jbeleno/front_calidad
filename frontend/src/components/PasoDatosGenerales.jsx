import React, { useEffect, useState } from "react";

export default function PasoDatosGenerales({ datos, onChange, onNext }) {
  const [empresas, setEmpresas] = useState([]);

  // NUEVO: Estado local para objetivos y participantes
  const objetivos = datos.objetivos || [];
  const participantes = datos.participantes || [];

  // NUEVO: Estado para errores
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/empresas/") // Ajusta el puerto si es necesario
      .then(res => res.json())
      .then(data => setEmpresas(data));
  }, []);

  const handleInput = (e) => {
    onChange({ ...datos, [e.target.name]: e.target.value });
  };

  const handleEmpresaChange = (e) => {
    if (e.target.value === "otra") {
      onChange({ ...datos, empresa: "", empresa_id: null, empresa_nueva: true, telefono: "" });
    } else {
      const empresaSeleccionada = empresas.find(emp => emp.id_empresa === parseInt(e.target.value));
      onChange({
        ...datos,
        empresa: empresaSeleccionada ? empresaSeleccionada.nombre : "",
        empresa_id: empresaSeleccionada ? empresaSeleccionada.id_empresa : null,
        empresa_nueva: false,
        telefono: empresaSeleccionada ? empresaSeleccionada.telefono : ""
      });
    }
  };

  // Validación antes de avanzar
  const handleNext = async () => {
    // Validar campos básicos
    if (!datos.fecha || !datos.ciudad || !datos.nombre_software || (!datos.empresa_nueva && !datos.empresa_id) || !datos.telefono) {
      setError("Todos los campos de datos generales son obligatorios.");
      return;
    }
    if (datos.empresa_nueva && !datos.empresa) {
      setError("El nombre de la nueva empresa es obligatorio.");
      return;
    }
    // Validar participantes
    if (participantes.length < 1) {
      setError("Debe haber al menos un participante.");
      return;
    }
    for (const p of participantes) {
      if (!p.nombre || !p.cargo || !p.firma) {
        setError("Todos los campos de cada participante son obligatorios.");
        return;
      }
    }
    // Validar objetivos
    if (objetivos.length < 1) {
      setError("Debe haber al menos un objetivo.");
      return;
    }
    const generales = objetivos.filter(o => o.tipo === "general");
    const especificos = objetivos.filter(o => o.tipo === "especifico");
    if (generales.length < 1) {
      setError("Debe haber al menos un objetivo general.");
      return;
    }
    if (especificos.length < 1) {
      setError("Debe haber al menos un objetivo específico.");
      return;
    }
    for (const o of objetivos) {
      if (!o.descripcion || !o.tipo) {
        setError("Todos los campos de cada objetivo son obligatorios.");
        return;
      }
    }
    setError("");

    // 1. Crear el formulario
    let id_empresa = datos.empresa_id;
    // Si es empresa nueva, crearla primero
    if (datos.empresa_nueva) {
      try {
        const res = await fetch("http://127.0.0.1:8000/empresas/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: datos.empresa, telefono: datos.telefono })
        });
        if (!res.ok) throw new Error("Error creando la empresa");
        const empresaCreada = await res.json();
        id_empresa = empresaCreada.id_empresa;
      } catch (err) {
        setError("No se pudo crear la empresa: " + err.message);
        return;
      }
    }
    if (!id_empresa) {
      setError("Debes seleccionar una empresa válida.");
      return;
    }
    let formularioPayload = {
      id_empresa: id_empresa,
      fecha: datos.fecha,
      ciudad: datos.ciudad,
      nombre_software: datos.nombre_software
    };
    let formulario;
    try {
      const res = await fetch("http://127.0.0.1:8001/formularios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formularioPayload)
      });
      if (!res.ok) throw new Error("Error creando el formulario");
      formulario = await res.json();
    } catch (err) {
      setError("No se pudo crear el formulario: " + err.message);
      return;
    }
    const id_formulario = formulario.id_formulario;

    // 2. Crear objetivos (en serie)
    for (const obj of objetivos) {
      try {
        const res = await fetch("http://127.0.0.1:8001/objetivos/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_formulario,
            descripcion: obj.descripcion,
            tipo: obj.tipo
          })
        });
        if (!res.ok) throw new Error("Error creando objetivo");
      } catch (err) {
        setError("No se pudo crear un objetivo: " + err.message);
        return;
      }
    }

    // 3. Crear participantes (en serie)
    for (const p of participantes) {
      try {
        const res = await fetch("http://127.0.0.1:8001/participantes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_formulario,
            nombre: p.nombre,
            cargo: p.cargo,
            firma: p.firma
          })
        });
        if (!res.ok) throw new Error("Error creando participante");
      } catch (err) {
        setError("No se pudo crear un participante: " + err.message);
        return;
      }
    }

    // 4. Pasar el id_formulario a la siguiente vista
    setError("");
    onNext(id_formulario);
  };

  return (
    <div className="wizard-step">
      <h2>Datos Generales</h2>
      <label>
        Fecha:
        <input
    type="date"
    name="fecha"
    value={datos.fecha || ""}
    onChange={handleInput}
    required
  />
      </label>
      <label>
        Ciudad:
        <input name="ciudad" value={datos.ciudad || ""} onChange={handleInput} />
      </label>
      <label>
        Empresa:
        <select value={datos.empresa_id || ""} onChange={handleEmpresaChange}>
          <option value="">Selecciona una empresa</option>
          {empresas.map(emp => (
            <option key={emp.id_empresa} value={emp.id_empresa}>{emp.nombre}</option>
          ))}
          <option value="otra">Otra (especificar)</option>
        </select>
        {datos.empresa_nueva && (
          <input
            name="empresa"
            placeholder="Nombre de la nueva empresa"
            value={datos.empresa || ""}
            onChange={handleInput}
            style={{ marginTop: 8 }}
          />
        )}
      </label>
      <label>
  Teléfono:
  <input
    name="telefono"
    value={datos.telefono || ""}
    onChange={handleInput}
    required
    disabled={!datos.empresa_nueva && datos.empresa_id}
  />
</label>
      <label>
        Nombre del software:
        <input name="nombre_software" value={datos.nombre_software || ""} onChange={handleInput} />
      </label>

      {/* NUEVO: Objetivos */}
      <div style={{marginTop: 24, marginBottom: 24}}>
        <h3>Objetivos</h3>
        {objetivos.map((obj, idx) => (
          <div key={idx} style={{display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center'}}>
            <input
              type="text"
              placeholder="Descripción"
              value={obj.descripcion || ''}
              onChange={e => {
                const nuevos = objetivos.slice();
                nuevos[idx].descripcion = e.target.value;
                onChange({ ...datos, objetivos: nuevos });
              }}
              style={{flex: 2}}
            />
            <select
              value={obj.tipo || ''}
              onChange={e => {
                const nuevos = objetivos.slice();
                nuevos[idx].tipo = e.target.value;
                onChange({ ...datos, objetivos: nuevos });
              }}
              style={{flex: 1}}
            >
              <option value="">Tipo</option>
              <option value="general">General</option>
              <option value="especifico">Específico</option>
            </select>
            <button type="button" onClick={() => {
              const nuevos = objetivos.slice();
              nuevos.splice(idx, 1);
              onChange({ ...datos, objetivos: nuevos });
            }}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={() => {
          onChange({ ...datos, objetivos: [...objetivos, { descripcion: '', tipo: '' }] });
        }}>Agregar objetivo</button>
      </div>

      {/* NUEVO: Participantes */}
      <div style={{marginTop: 24, marginBottom: 24}}>
        <h3>Participantes</h3>
        {participantes.map((p, idx) => (
          <div key={idx} style={{display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center'}}>
            <input
              type="text"
              placeholder="Nombre"
              value={p.nombre || ''}
              onChange={e => {
                const nuevos = participantes.slice();
                nuevos[idx].nombre = e.target.value;
                onChange({ ...datos, participantes: nuevos });
              }}
              style={{flex: 2}}
            />
            <input
              type="text"
              placeholder="Cargo"
              value={p.cargo || ''}
              onChange={e => {
                const nuevos = participantes.slice();
                nuevos[idx].cargo = e.target.value;
                onChange({ ...datos, participantes: nuevos });
              }}
              style={{flex: 2}}
            />
            <input
              type="text"
              placeholder="Firma"
              value={p.firma || ''}
              onChange={e => {
                const nuevos = participantes.slice();
                nuevos[idx].firma = e.target.value;
                onChange({ ...datos, participantes: nuevos });
              }}
              style={{flex: 2}}
            />
            <button type="button" onClick={() => {
              const nuevos = participantes.slice();
              nuevos.splice(idx, 1);
              onChange({ ...datos, participantes: nuevos });
            }}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={() => {
          onChange({ ...datos, participantes: [...participantes, { nombre: '', cargo: '', firma: '' }] });
        }}>Agregar participante</button>
      </div>

      <div className="wizard-buttons" style={{ justifyContent: "flex-end" }}>
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <button onClick={handleNext}>Siguiente</button>
      </div>
    </div>
  );
}