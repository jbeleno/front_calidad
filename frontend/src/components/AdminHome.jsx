import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser, FiBriefcase, FiFileText, FiCheckSquare, FiSettings, FiChevronRight, FiMenu } from "react-icons/fi";
import CrudUsuarios from "./CrudUsuarios";
import CrudEmpresas from "./CrudEmpresas";
import CrudMetodologias from "./CrudMetodologias";
import CrudFormularios from "./CrudFormularios";
import CrudParametrosPred from "./CrudParametrosPred";
import CrudPreguntasPred from "./CrudPreguntasPred";
import { useUser } from "./UserContext";
import { Navigate, useNavigate } from "react-router-dom";

// Button Components with inline styles
const MenuButton = ({ onClick, icon, label, isActive = false, style = {} }) => (
  <motion.button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: '12px',
      textAlign: 'left',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: isActive ? '#EFF6FF' : 'transparent',
      color: isActive ? '#2563EB' : '#4B5563',
      fontWeight: isActive ? '600' : '500',
      ...style
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{
        display: 'inline-flex',
        padding: '6px',
        marginRight: '12px',
        borderRadius: '8px',
        backgroundColor: isActive ? '#DBEAFE' : '#F3F4F6',
        color: isActive ? '#2563EB' : '#6B7280'
      }}>
        {icon}
      </span>
      <span>{label}</span>
    </div>
    <FiChevronRight style={{
      transition: 'transform 0.2s',
      opacity: isActive ? 1 : 0.5,
      transform: isActive ? 'rotate(90deg)' : 'none'
    }} />
  </motion.button>
);

const PrimaryButton = ({ onClick, children, icon, style = {} }) => (
  <motion.button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
      color: 'white',
      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
      transition: 'all 0.2s',
      ...style
    }}
    whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)' }}
    whileTap={{ scale: 0.98 }}
  >
    {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    {children}
  </motion.button>
);

const DangerButton = ({ onClick, children, icon, style = {} }) => (
  <motion.button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
      color: 'white',
      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
      transition: 'all 0.2s',
      ...style
    }}
    whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35)' }}
    whileTap={{ scale: 0.98 }}
  >
    {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    {children}
  </motion.button>
);

const TABS = [
  { 
    label: "Usuarios", 
    icon: <FiUser className="w-5 h-5" />,
    comp: <CrudUsuarios /> 
  },
  { 
    label: "Empresas", 
    icon: <FiBriefcase className="w-5 h-5" />,
    comp: <CrudEmpresas /> 
  },
  { 
    label: "Metodologías", 
    icon: <FiFileText className="w-5 h-5" />,
    comp: <CrudMetodologias /> 
  },
  { 
    label: "Formularios", 
    icon: <FiCheckSquare className="w-5 h-5" />,
    comp: <CrudFormularios /> 
  },
  { 
    label: "Parámetros", 
    icon: <FiSettings className="w-5 h-5" />,
    comp: <CrudParametrosPred /> 
  },
  { 
    label: "Preguntas", 
    icon: <FiFileText className="w-5 h-5" />,
    comp: <CrudPreguntasPred /> 
  },
];

export default function AdminHome() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || user.rol !== "superadmin") {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F9FAFB, #EFF6FF)',
      display: 'flex',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              zIndex: 40,
              width: '300px',
              height: '100%',
              backgroundColor: 'white',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              '@media (min-width: 1024px)': {
                position: 'relative'
              }
            }}
          >
            <div style={{ padding: '32px 28px 24px 28px' }}>
              <motion.h2 
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                  marginBottom: '36px',
                  letterSpacing: '-1px',
                  lineHeight: 1.1,
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Panel de Control
              </motion.h2>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {TABS.map((t, i) => (
                  <MenuButton
                    key={t.label}
                    onClick={() => {
                      setTab(i);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    label={t.label}
                    icon={t.icon}
                    isActive={tab === i}
                    style={{
                      fontSize: '1.08rem',
                      padding: '14px 18px',
                      minWidth: 0,
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                ))}
              </nav>
            </div>

            <div style={{ marginTop: 'auto', padding: '24px' }}>
              <DangerButton
                onClick={handleLogout}
                icon={<FiLogOut style={{ width: '20px', height: '20px' }} />}
                style={{ width: '100%' }}
              >
                Cerrar sesión
              </DangerButton>
              
              <div style={{ 
                marginTop: '24px', 
                textAlign: 'center', 
                fontSize: '0.875rem',
                color: '#6B7280'
              }}>
                <p>Bienvenido,</p>
                <p style={{ 
                  fontWeight: '500', 
                  color: '#2563EB',
                  marginTop: '4px'
                }}>
                  {user.nombre || 'Administrador'}
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
            '@media (min-width: 1024px)': {
              display: 'none'
            }
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main 
        style={{
          flex: 1,
          transition: 'all 0.3s ease',
          padding: '32px 0',
          width: '100%',
          boxSizing: 'border-box',
          background: '#f4f6fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ...(isSidebarOpen && !isMobile ? { marginLeft: '300px' } : {})
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px rgba(25, 118, 210, 0.08)',
          padding: '40px 32px',
          marginTop: 32,
          marginBottom: 32,
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 8,
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1976d2',
              margin: 0,
              lineHeight: 1.2,
            }}>{TABS[tab].label}</h1>
            <div style={{
              width: 60,
              height: 3,
              background: 'linear-gradient(90deg, #1976d2, #6366F1)',
              borderRadius: 3,
              margin: '8px 0 0 0',
            }}></div>
          </div>
          <div style={{
            flex: 1,
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
            {TABS[tab].comp}
          </div>
        </div>
        
        <footer style={{
          marginTop: '40px',
          padding: '20px 0',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: '#6B7280',
          borderTop: '1px solid #e5e7eb',
          marginLeft: '-20px',
          marginRight: '-20px',
          paddingLeft: '20px',
          paddingRight: '20px',
          '@media (min-width: 768px)': {
            marginLeft: '-28px',
            marginRight: '-28px',
            paddingLeft: '28px',
            paddingRight: '28px'
          }
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Sistema de Gestión de Calidad</p>
        </footer>
      </main>
    </div>
  );
}
