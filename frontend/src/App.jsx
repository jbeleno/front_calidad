import React, { useState } from "react";
import EmpresasTable from "./components/EmpresasTable";
import FormulariosEmpresaTable from "./components/FormulariosEmpresaTable";
import FormularioWizard from "./components/FormularioWizard";
import './App.css';

export default function App() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [mostrarWizard, setMostrarWizard] = useState(false);

  const handleVerFormularios = (empresa) => {
    setEmpresaSeleccionada(empresa);
  };

  const handleCrearFormulario = () => {
    setMostrarWizard(true);
  };

  const handleCerrarWizard = () => {
    setMostrarWizard(false);
  };

  if (mostrarWizard) {
    return <FormularioWizard onClose={handleCerrarWizard} />;
  }

  return !empresaSeleccionada ? (
    <EmpresasTable
      onVerFormularios={handleVerFormularios}
      onCrearFormulario={handleCrearFormulario}
    />
  ) : (
    <FormulariosEmpresaTable
      empresa={empresaSeleccionada}
      onVolver={() => setEmpresaSeleccionada(null)}
      onCrearFormulario={handleCrearFormulario}
    />
  );
}