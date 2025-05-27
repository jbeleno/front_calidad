import React, { useEffect, useState } from "react";

const API = "https://microev-production.up.railway.app/parametros_predeterminados/";
const METODOLOGIAS_API = "https://microform-production.up.railway.app/metodologias/";

export default function CrudParametrosPred() {
  const [parametros, setParametros] = useState([]);
  const [metodologias, setMetodologias] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", id_metodologia: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchParametros = async () => {
    const res = await fetch(API);
    setParametros(await res.json());
  };
  const fetchMetodologias = async () => {
    const res = await fetch(METODOLOGIAS_API);
    setMetodologias(await res.json());
  };

  useEffect(() => { fetchParametros(); fetchMetodologias(); }, []);

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
        body: JSON.stringify({ ...form, id_metodologia: Number(form.id_metodologia) })
      });
      if (!res.ok) throw new Error("Error al guardar parámetro predeterminado");
      setForm({ nombre: "", descripcion: "", id_metodologia: "" });
      setEditId(null);
      fetchParametros();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = p => {
    setForm({ nombre: p.nombre, descripcion: p.descripcion, id_metodologia: p.id_metodologia });
    setEditId(p.id_parametro_predeterminado);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar parámetro predeterminado?")) return;
    await fetch(API + id, { method: "DELETE" });
    fetchParametros();
  };

  return (
    <div className="wizard-container" style={{margin:0, padding:0}}>
      <div className="shadow-md rounded-xl bg-white" style={{overflowX:'auto', marginBottom:24}}>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>ID Metodología</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parametros.map(p => (
              <tr key={p.id_parametro_predeterminado}>
                <td>{p.id_parametro_predeterminado}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>{p.id_metodologia}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="btn" style={{marginRight:8, background:'#fff', color:'#1976d2', border:'1.5px solid #1976d2'}}>Editar</button>
                  <button onClick={() => handleDelete(p.id_parametro_predeterminado)} className="btn-eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
            {parametros.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center'}}>No hay parámetros predeterminados</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="wizard-step" style={{maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', gap:8}}>
        <h4>{editId ? "Editar parámetro predeterminado" : "Crear parámetro predeterminado"}</h4>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <label>Descripción</label>
        <input name="descripcion" value={form.descripcion} onChange={handleChange} className="input" />
        <label>ID Metodología</label>
        <select name="id_metodologia" value={form.id_metodologia} onChange={handleChange} required className="input">
          <option value="">Seleccione una metodología</option>
          {metodologias.map(met => (
            <option key={met.id_metodologia} value={met.id_metodologia}>{met.nombre}</option>
          ))}
        </select>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading} className="btn">{loading ? "Guardando..." : (editId ? "Guardar cambios" : "Crear parámetro predeterminado")}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ nombre: "", descripcion: "", id_metodologia: "" });}} className="btn" style={{background:'#e5e7eb', color:'#222', marginTop:8}}>Cancelar</button>}
      </form>
    </div>
  );
}
