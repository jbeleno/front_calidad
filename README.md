# front_calidad — Frontend del sistema de gestión de calidad

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

UI para administrar **empresas, usuarios, formularios, parámetros y resultados de evaluaciones**. Consume tres microservicios independientes: [`back_calidad`](https://github.com/jbeleno/back_calidad) (users/companies), [`micro_form`](https://github.com/jbeleno/micro_form) (forms) y [`micro_ev`](https://github.com/jbeleno/micro_ev) (evaluations).

> Proyecto académico (USCO). Frontend SPA con stack Vite moderno + Tailwind 4.

---

## Stack

| Categoría | Tecnología |
|---|---|
| Build | Vite |
| UI | React 19 |
| Estilos | Tailwind CSS 4 (vía `@tailwindcss/vite`) |
| Routing | React Router DOM 7 |
| Animaciones | Framer Motion 12 |
| Iconos | @heroicons/react, react-icons |
| Efectos visuales | tsparticles + react-tsparticles |
| Hosting | Vercel |
| Lint | ESLint 9 (flat config) |

## Quick start

```bash
git clone https://github.com/jbeleno/front_calidad.git
cd front_calidad/frontend
npm install
npm run dev
# → http://localhost:5173
```

> Requiere los tres microservicios backend corriendo (ver [Backend](#backend)).

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Vite dev server con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint check |

---

## Estructura

```
front_calidad/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/        # Componentes por dominio
    │   │   ├── Login.jsx
    │   │   ├── CrudEmpresas.jsx
    │   │   ├── CrudUsuarios.jsx
    │   │   ├── CrudMetodologias.jsx
    │   │   ├── EmpresasTable.jsx
    │   │   ├── FormulariosEmpresaTable.jsx
    │   │   ├── PasoDatosGenerales.jsx       # Wizard step
    │   │   ├── PasoParametros.jsx           # Wizard step
    │   │   └── Resultados.jsx
    │   └── ...
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── vercel.json
    └── package.json
```

## Backend

El frontend consume tres microservicios:

| Servicio | Repositorio | Recursos |
|---|---|---|
| `backendcalid` | [back_calidad](https://github.com/jbeleno/back_calidad) | Empresas, usuarios, login |
| `microform` | [micro_form](https://github.com/jbeleno/micro_form) | Formularios, objetivos, participantes, metodologías |
| `microev` | [micro_ev](https://github.com/jbeleno/micro_ev) | Parámetros, preguntas, resultados |

---

## Despliegue

```bash
# Vercel auto-detecta Vite
vercel
```

Variables de entorno (cuando se centralicen las URLs — ver deuda técnica):

```env
VITE_API_USERS_COMPANIES=https://...railway.app
VITE_API_FORMS=https://...railway.app
VITE_API_EVALUATIONS=https://...railway.app
```

---

## Mejoras pendientes (deuda técnica reconocida)

- 🚨 **URLs de los microservicios hardcodeadas en 14+ componentes** — extraerlas a `src/config/api.js` y leer de `import.meta.env` con prefijo `VITE_`. Esto bloquea cambiar de entorno (dev/staging/prod) sin recompilar y mezcla concerns en cada componente.
- **Capa de servicios**: hoy los `fetch(...)` viven inline en componentes. Mover a `src/services/<dominio>.js` con funciones reutilizables (`getEmpresas`, `createUsuario`, etc.).
- **Estado global**: con varios CRUDs interconectados, considerar Zustand o `react-query` para caching y deduplicación de fetches.
- **TypeScript**: el proyecto es JSX puro; migrar para tipado de respuestas API y modelos de dominio.
- **Tests**: agregar Vitest + Testing Library al menos para los wizards (`PasoDatosGenerales`, `PasoParametros`, `Resultados`).
- **Manejo centralizado de errores y loading states** en las llamadas a API.
- **Auth real** con JWT en headers (hoy probablemente sin auth o muy básica).

---

## Licencia

Proyecto académico — Universidad Surcolombiana (USCO).
