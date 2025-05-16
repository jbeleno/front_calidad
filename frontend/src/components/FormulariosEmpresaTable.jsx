import React, { useEffect, useState } from "react";
import "./FormulariosEmpresaTable.css";
import Resultados from "./Resultados";

export default function FormulariosEmpresaTable({ empresa, onVolver, onCrearFormulario }) {
  const [formularios, setFormularios] = useState([]);
  const [idFormularioResultados, setIdFormularioResultados] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/formularios/")
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
    <div className="formularios-empresa-table-container">
      <h2>Formularios de {empresa.nombre}</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={onVolver}>Volver</button>
        <button className="btn-principal" onClick={onCrearFormulario}>Crear formulario</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del software</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {formularios.map(f => (
            <tr key={f.id_formulario}>
              <td>{f.id_formulario}</td>
              <td>{f.nombre_software}</td>
              <td>{f.fecha}</td>
              <td>
                <button onClick={() => setIdFormularioResultados(f.id_formulario)}>
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
