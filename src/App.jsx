import React, { useState } from 'react';
import MapaViajes from './components/MapaViajes';
import { 
  Globe, 
  Map as MapIcon, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Navigation2, 
  Flag 
} from 'lucide-react';

function App() {
  // PERSISTENCIA: Cargamos del localStorage o iniciamos con Argentina y Alemania por defecto
  const [paisesVisitados, setPaisesVisitados] = useState(() => {
    const datosGuardados = localStorage.getItem('globalstamp-viajes');
    return datosGuardados ? JSON.parse(datosGuardados) : ['ARG', 'DEU']; //
  });

  // Función para actualizar la lista y guardar en memoria
  const manejarCambioPaises = (nuevaLista) => {
    setPaisesVisitados(nuevaLista);
    localStorage.setItem('globalstamp-viajes', JSON.stringify(nuevaLista));
  };

  // Estadísticas calculadas dinámicamente
  const stats = [
    { 
      label: 'Países Visitados', 
      value: paisesVisitados.length.toString(), 
      icon: <Globe size={20} />, 
      color: '#3b82f6' 
    },
    { 
      label: 'Ciudades', 
      value: '5', 
      icon: <MapIcon size={20} />, 
      color: '#10b981' 
    },
    { 
      label: 'Exploración', 
      value: `${((paisesVisitados.length / 195) * 100).toFixed(1)}%`, 
      icon: <BarChart3 size={20} />, 
      color: '#f59e0b' 
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Navigation2 size={28} color="#3b82f6" fill="#3b82f6" /> 
            GlobalStamp
          </h1>
        </div>

        <nav style={{ flex: 1, padding: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={navItemStyleActive}><MapIcon size={20} /> Mapa Interactivo</li>
            <li style={navItemStyle}><BarChart3 size={20} /> Estadísticas</li>
            <li style={navItemStyle}><BookOpen size={20} /> Mi Pasaporte</li>
          </ul>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
          <div style={navItemStyle}><Settings size={20} /> Configuración</div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '10px', paddingLeft: '10px' }}>
            User: jpinosuarez 🇦🇷🇩🇪
          </p>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <header style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#475569', fontWeight: '500' }}>Explorador de Viajes</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={buttonStyle} onClick={() => alert('Próximamente: Buscador de países')}>Añadir Viaje</button>
          </div>
        </header>

        {/* TARJETAS DE DATOS */}
        <section style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {stats.map((stat, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ backgroundColor: `${stat.color}15`, padding: '10px', borderRadius: '10px', color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CONTENEDOR DEL MAPA */}
        <section style={{ flex: 1, margin: '0 25px 25px 25px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <MapaViajes paises={paisesVisitados} setPaises={manejarCambioPaises} />
        </section>

      </main>
    </div>
  );
}

const navItemStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', transition: '0.2s', marginBottom: '4px' };
const navItemStyleActive = { ...navItemStyle, backgroundColor: '#3b82f6', color: 'white' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0' };
const buttonStyle = { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

export default App;