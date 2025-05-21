import Login from "./Login";
import Register from "./Register";
import Espera from "./Espera";
import AdminHome from "./AdminHome";
import EmpresasTable from "./EmpresasTable";

export const routes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/espera", element: <Espera /> },
  { path: "/admin", element: <AdminHome /> },
  { path: "/empresas", element: <EmpresasTable /> },
];
