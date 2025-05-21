import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import EmpresasTable from "./components/EmpresasTable";
import FormulariosEmpresaTable from "./components/FormulariosEmpresaTable";
import FormularioWizard from "./components/FormularioWizard";
import Resultados from "./components/Resultados";
import Login from "./components/Login";
import Register from "./components/Register";
import Espera from "./components/Espera";
import AdminHome from "./components/AdminHome";
import { UserProvider } from "./components/UserContext";

// Wrapper para FormulariosEmpresaTable
function FormulariosEmpresaTableWrapper() {
  const { id } = useParams();
  const [empresa, setEmpresa] = React.useState(null);

  React.useEffect(() => {
    fetch(`https://backendcalid-production.up.railway.app/empresas/${id}`)
      .then(res => res.json())
      .then(setEmpresa);
  }, [id]);

  if (!empresa) return <div>Cargando empresa...</div>;
  return <FormulariosEmpresaTable empresa={empresa} />;
}

// Wrapper para Resultados
function ResultadosWrapper() {
  const { id } = useParams();
  return <Resultados idFormulario={id} />;
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/espera" element={<Espera />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/empresas" element={<EmpresasTable />} />
          <Route path="/empresas/:id/formularios" element={<FormulariosEmpresaTableWrapper />} />
          <Route path="/formularios/nuevo" element={<FormularioWizard />} />
          <Route path="/formularios/:id/resultados" element={<ResultadosWrapper />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}