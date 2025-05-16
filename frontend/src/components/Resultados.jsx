import React, { useEffect, useState } from "react";

export default function Resultados({ idFormulario, onVolver }) {
  const [parametros, setParametros] = useState([]);
  const [preguntasPorParametro, setPreguntasPorParametro] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // 1. Obtener parámetros del formulario
      const resParam = await fetch(`https://microev-production.up.railway.app/parametros/?id_formulario=${idFormulario}`);
      const params = await resParam.json();
      setParametros(params);
      // 2. Obtener preguntas para cada parámetro
      const preguntasObj = {};
      for (const param of params) {
        const resPreg = await fetch(`https://microev-production.up.railway.app/preguntas/parametro/${param.id_parametro}`);
        preguntasObj[param.id_parametro] = await resPreg.json();
      }
      setPreguntasPorParametro(preguntasObj);
      setLoading(false);
    }
    if (idFormulario) fetchData();
  }, [idFormulario]);

  if (loading) return <div>Cargando resultados...</div>;

  return (
    <div className="wizard-step">
      <h2>Resultados del Formulario</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Parámetro</th>
            <th style={{ textAlign: 'center' }}>Suma valor_obtenido</th>
            <th style={{ textAlign: 'center' }}>Suma valor_maximo</th>
            <th style={{ textAlign: 'center' }}>% obtenido</th>
            <th style={{ textAlign: 'center' }}>% máximo</th>
            <th style={{ textAlign: 'center' }}>% global</th>
          </tr>
        </thead>
        <tbody>
          {parametros.map(param => {
            const preguntas = preguntasPorParametro[param.id_parametro] || [];
            const sumaObtenido = preguntas.reduce((acc, p) => acc + (p.valor_obtenido || 0), 0);
            const sumaMaximo = preguntas.reduce((acc, p) => acc + (p.valor_maximo || 0), 0);
            const porcentaje = sumaMaximo > 0 ? ((sumaObtenido / sumaMaximo) * 100).toFixed(2) : "0.00";
            return (
              <tr key={param.id_parametro}>
                <td style={{ textAlign: 'center' }}>{param.nombre}</td>
                <td style={{ textAlign: 'center' }}>{sumaObtenido}</td>
                <td style={{ textAlign: 'center' }}>{sumaMaximo}</td>
                <td style={{ textAlign: 'center' }}>{porcentaje}%</td>
                <td style={{ textAlign: 'center' }}>{param.porcentaje_maximo}%</td>
                <td style={{ textAlign: 'center' }}>{((parseFloat(porcentaje) * parseFloat(param.porcentaje_maximo)) / 100).toFixed(2)}%</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{parametros.reduce((acc, param) => {
              const preguntas = preguntasPorParametro[param.id_parametro] || [];
              return acc + preguntas.reduce((a, p) => a + (p.valor_obtenido || 0), 0);
            }, 0)}</td>
            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{parametros.reduce((acc, param) => {
              const preguntas = preguntasPorParametro[param.id_parametro] || [];
              return acc + preguntas.reduce((a, p) => a + (p.valor_maximo || 0), 0);
            }, 0)}</td>
            <td></td>
            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{parametros.reduce((acc, param) => acc + parseFloat(param.porcentaje_maximo || 0), 0)}%</td>
            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{parametros.reduce((acc, param) => {
              const preguntas = preguntasPorParametro[param.id_parametro] || [];
              const sumaObtenido = preguntas.reduce((a, p) => a + (p.valor_obtenido || 0), 0);
              const sumaMaximo = preguntas.reduce((a, p) => a + (p.valor_maximo || 0), 0);
              const porcentaje = sumaMaximo > 0 ? ((sumaObtenido / sumaMaximo) * 100) : 0;
              return acc + ((porcentaje * parseFloat(param.porcentaje_maximo || 0)) / 100);
            }, 0).toFixed(2)}%</td>
          </tr>
        </tfoot>
      </table>
      <div style={{
        padding: '16px',
        marginTop: '24px',
        marginBottom: '24px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}>
        RESULTADO DEL EJERCICIO<br />
        <span style={{ color: 'red', fontWeight: 'bold' }}>0 A 30% DEFICIENTE</span><br />
        <span style={{ color: 'purple', fontWeight: 'bold' }}>31 A 50% INSUFICIENTE</span><br />
        <span style={{ color: 'olive', fontWeight: 'bold' }}>51 A 70% ACEPTABLE</span><br />
        <span style={{ color: 'teal', fontWeight: 'bold' }}>71 A 89% SOBRESALIENTE</span><br />
        <span style={{ color: 'darkcyan', fontWeight: 'bold' }}>MAS DE 90% EXCELENTE</span>
      </div>
      <div className="wizard-buttons" style={{ marginTop: 24 }}>
        {onVolver && <button onClick={onVolver}>Volver</button>}
      </div>
    </div>
  );
} 