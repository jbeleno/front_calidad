import React, { useEffect, useState } from "react";

const API = "https://microform-production.up.railway.app/metodologias/";

export default function CrudMetodologias() {
  const [metodologias, setMetodologias] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMetodologias = async () => {
    const res = await fetch(API);
    setMetodologias(await res.json());
  };

  useEffect(() => { fetchMetodologias(); }, []);

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
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al guardar metodología");
      setForm({ nombre: "", descripcion: "" });
      setEditId(null);
      fetchMetodologias();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = metodologia => {
    setForm({ nombre: metodologia.nombre, descripcion: metodologia.descripcion });
    setEditId(metodologia.id_metodologia);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar metodología?")) return;
    await fetch(API + id, { method: "DELETE" });
    fetchMetodologias();
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {metodologias.map(m => (
              <tr key={m.id_metodologia}>
                <td>{m.id_metodologia}</td>
                <td>{m.nombre}</td>
                <td>{m.descripcion}</td>
                <td>
                  <button onClick={() => handleEdit(m)} className="btn" style={{marginRight:8, background:'#fff', color:'#1976d2', border:'1.5px solid #1976d2'}}>Editar</button>
                  <button onClick={() => handleDelete(m.id_metodologia)} className="btn-eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
            {metodologias.length === 0 && (
              <tr><td colSpan={4} style={{textAlign:'center'}}>No hay metodologías</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="wizard-step" style={{maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', gap:8}}>
        <h4>{editId ? "Editar metodología" : "Crear metodología"}</h4>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <label>Descripción</label>
        <input name="descripcion" value={form.descripcion} onChange={handleChange} className="input" />
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading} className="btn">{loading ? "Guardando..." : (editId ? "Guardar cambios" : "Crear metodología")}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ nombre: "", descripcion: "" });}} className="btn" style={{background:'#e5e7eb', color:'#222', marginTop:8}}>Cancelar</button>}
      </form>
    </div>
  );
}
