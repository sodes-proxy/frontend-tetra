import React from 'react';
import Button from './Button';
import './Home.css';

const buttonsData = [
  { text: "Crear Evento", path: "/crear-evento", roles: ['admin', 'secretary'] },
  { text: "Registrar Abono", path: "/registrar-abono", roles: ['admin', 'finance'] },
  { text: "Agenda Evento", path: "/agenda-eventos", roles: ['all'] },
  { text: "Finanzas", path: "/finanzas", roles: ['admin', 'finance'] },
  { text: "Eliminar Evento", path: "/eliminar-evento", roles: ['admin', 'secretary'] },
  { text: "Reportar Compra", path: "/reportar-compra", roles: ['admin', 'finance'] },
  { text: "Historial Eventos", path: "/historial-eventos", roles: ['all'] },
  { text: "Administrar Usuarios", path: "/administrar-usuarios", roles: ['admin'] },
  { text: "Administrar Opciones", path: "/administrar-opciones", roles: ['admin'] },
  // Add more buttons as needed
];

const Home = () => {
  const role = localStorage.getItem('role');
  return (
    <div className="home-container">
      <h1>Trento Catering</h1>
      <h3>Administración de Eventos</h3>
      <div className='button-container'>
        {buttonsData.map((button, index) => (
            button.roles.includes(role) || button.roles.includes('all') ? (
              <Button key={index} text={button.text} path={button.path} visible={true} />
            ) : null
          ))}
      </div>
    </div>
  );
};

export default Home;

