import React, { useEffect, useState } from "react";
import "./EmpresasTable.css";

export default function EmpresasTable({ onVerFormularios, onCrearFormulario }) {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/empresas/")
      .then(res => res.json())
      .then(setEmpresas);
  }, []);

  return (
    <div className="empresas-table-container">
      <h2>Empresas</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-principal" onClick={onCrearFormulario}>Crear formulario</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map(emp => (
            <tr key={emp.id_empresa}>
              <td>{emp.id_empresa}</td>
              <td>{emp.nombre}</td>
              <td>{emp.telefono}</td>
              <td>
                <button onClick={() => onVerFormularios(emp)}>
                  Formularios
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
