import React, { useEffect, useState } from "react";

const API = "https://backendcalid-production.up.railway.app/empresas/";

export default function CrudEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmpresas = async () => {
    const res = await fetch(API);
    setEmpresas(await res.json());
  };

  useEffect(() => { fetchEmpresas(); }, []);

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
      if (!res.ok) throw new Error("Error al guardar empresa");
      setForm({ nombre: "", telefono: "" });
      setEditId(null);
      fetchEmpresas();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = empresa => {
    setForm({ nombre: empresa.nombre, telefono: empresa.telefono });
    setEditId(empresa.id_empresa);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar empresa?")) return;
    await fetch(API + id, { method: "DELETE" });
    fetchEmpresas();
  };

  return (
    <div className="wizard-container" style={{margin:0, padding:0}}>
      <div className="shadow-md rounded-xl bg-white" style={{overflowX:'auto', marginBottom:24}}>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map(e => (
              <tr key={e.id_empresa}>
                <td>{e.id_empresa}</td>
                <td>{e.nombre}</td>
                <td>{e.telefono}</td>
                <td>
                  <button onClick={() => handleEdit(e)} className="btn" style={{marginRight:8, background:'#fff', color:'#1976d2', border:'1.5px solid #1976d2'}}>Editar</button>
                  <button onClick={() => handleDelete(e.id_empresa)} className="btn-eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
            {empresas.length === 0 && (
              <tr><td colSpan={4} style={{textAlign:'center'}}>No hay empresas</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="wizard-step" style={{maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', gap:8}}>
        <h4>{editId ? "Editar empresa" : "Crear empresa"}</h4>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <label>Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} className="input" />
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading} className="btn">{loading ? "Guardando..." : (editId ? "Guardar cambios" : "Crear empresa")}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ nombre: "", telefono: "" });}} className="btn" style={{background:'#e5e7eb', color:'#222', marginTop:8}}>Cancelar</button>}
      </form>
    </div>
  );
}
