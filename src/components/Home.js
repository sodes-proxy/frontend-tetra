import React from 'react';
import Button from './Button';
import './Home.css';

const Home = ({ userRole }) => {
  return (
    <div className="home-container">
      <h1>Trento Catering</h1>
      <h3>Administración de Eventos</h3>
      <div className='button-container'>
      <Button text="Crear Evento" path="/crear-evento" visible={userRole === 'admin' || userRole === 'recepcionista'} />
      <Button text="Registrar Abono" path="/registrar-abono" visible={userRole === 'admin'} />
      <Button text="Agenda Evento" path="/agenda-eventos" visible={userRole === 'admin'} />
      <Button text="Finanzas" path="/finanzas" visible={userRole === 'admin'} />
      <Button text="Eliminar Evento" path="/eliminar-evento" visible={userRole === 'admin'} />
      <Button text="Reportar Compra" path="/reportar-compra" visible={userRole === 'admin'} />
      <Button text="Historial Eventos" path="/historial-eventos" visible={userRole === 'admin'} />
      <Button text="Administrar Usuarios" path="/administrar-usuarios" visible={userRole === 'admin'} />
      </div>
    </div>
  );
};

export default Home;

