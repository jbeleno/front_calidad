import React, { useEffect, useState } from "react";

const API = "https://microev-production.up.railway.app/preguntas_predeterminadas/";
const PARAMS_API = "https://microev-production.up.railway.app/parametros_predeterminados/";

export default function CrudPreguntasPred() {
  const [preguntas, setPreguntas] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [form, setForm] = useState({ id_parametro_predeterminado: "", nombre: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPreguntas = async () => {
    const res = await fetch(API);
    setPreguntas(await res.json());
  };
  const fetchParametros = async () => {
    const res = await fetch(PARAMS_API);
    setParametros(await res.json());
  };

  useEffect(() => { fetchPreguntas(); fetchParametros(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? API + editId : API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id_parametro_predeterminado: Number(form.id_parametro_predeterminado) })
      });
      if (!res.ok) throw new Error("Error al guardar pregunta predeterminada");
      setForm({ id_parametro_predeterminado: "", nombre: "", descripcion: "" });
      setEditId(null);
      fetchPreguntas();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = p => {
    setForm({ id_parametro_predeterminado: p.id_parametro_predeterminado, nombre: p.nombre, descripcion: p.descripcion });
    setEditId(p.id_pregunta_predeterminada);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar pregunta predeterminada?")) return;
    await fetch(API + id, { method: "DELETE" });
    fetchPreguntas();
  };

  return (
    <div className="wizard-container" style={{margin:0, padding:0}}>
      <div className="shadow-md rounded-xl bg-white" style={{overflowX:'auto', marginBottom:24}}>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>ID Parámetro Predeterminado</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map(p => (
              <tr key={p.id_pregunta_predeterminada}>
                <td>{p.id_pregunta_predeterminada}</td>
                <td>{p.id_parametro_predeterminado}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="btn" style={{marginRight:8, background:'#fff', color:'#1976d2', border:'1.5px solid #1976d2'}}>Editar</button>
                  <button onClick={() => handleDelete(p.id_pregunta_predeterminada)} className="btn-eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
            {preguntas.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center'}}>No hay preguntas predeterminadas</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="wizard-step" style={{maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', gap:8}}>
        <h4>{editId ? "Editar pregunta predeterminada" : "Crear pregunta predeterminada"}</h4>
        <label>ID Parámetro Predeterminado</label>
        <select name="id_parametro_predeterminado" value={form.id_parametro_predeterminado} onChange={handleChange} required className="input">
          <option value="">Seleccione un parámetro</option>
          {parametros.map(param => (
            <option key={param.id_parametro_predeterminado} value={param.id_parametro_predeterminado}>
              {param.nombre}
            </option>
          ))}
        </select>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <label>Descripción</label>
        <input name="descripcion" value={form.descripcion} onChange={handleChange} className="input" />
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading} className="btn">{loading ? "Guardando..." : (editId ? "Guardar cambios" : "Crear pregunta predeterminada")}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ id_parametro_predeterminado: "", nombre: "", descripcion: "" });}} className="btn" style={{background:'#e5e7eb', color:'#222', marginTop:8}}>Cancelar</button>}
      </form>
    </div>
  );
}
