import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from "./components/Home";
import CreateEvent from './components/agenda/CreateEvent';
import DeleteEvent from './components/agenda/DeleteEvent';
import FutureEvents from './components/agenda/FutureEvents';
import EditEvent from './components/agenda/EditEvent';
import BackToHomeButton from './components/BackToHomeButton';
import PastEvents from './components/agenda/PastEvents';
import AddPayment from './components/finanzas/AddPayment';
import ViewEvent from './components/agenda/ViewEvent';
import Login from './components/auth/Login';
import RequireAuth from './components/auth/RequireAuth';
import AddExpense from './components/finanzas/AddExpense';
import Admin from './components/admin/Admin';
import { AdminOptions }  from './components/admin/AdminOptions';
import ViewFinanzas from './components/finanzas/ViewFinanzas';
import AssignExpense from './components/finanzas/AssignExpense';
import ProfitMargin from './components/finanzas/ProfitMargin';
import React from 'react';

const App = () => {
  return (
    <Router>
      <div className="App">
        <RouterContent />
      </div>
    </Router>
  );
};

const RouterContent = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <BackToHomeButton />}
      <Routes>
        <Route path="/" element={<RequireAuth><Home/></RequireAuth>} />
        <Route path="/crear-evento" element={<RequireAuth><CreateEvent/></RequireAuth>}/>
        <Route path="/eliminar-evento" element={<RequireAuth><DeleteEvent/></RequireAuth>} />
        <Route path="/agenda-eventos" element={<RequireAuth><FutureEvents/></RequireAuth>} />
        <Route path="/editar-evento/:id" element={<RequireAuth><EditEvent /></RequireAuth>} />
        <Route path="/historial-eventos" element={<RequireAuth><PastEvents /></RequireAuth>} />
        <Route path='/agregar-abono/:id' element={<RequireAuth><AddPayment /></RequireAuth>} />
        <Route path='/ver-evento/:id' element={<RequireAuth><ViewEvent /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path='/agregar-gasto/:id' element={<RequireAuth><AddExpense /></RequireAuth>} />
        <Route path='/administrar-usuarios' element={<RequireAuth> <Admin/> </RequireAuth>} />
        <Route path='/administrar-opciones' element={<RequireAuth> <AdminOptions/> </RequireAuth>} />
        <Route path='/finanzas' element={<RequireAuth> <ViewFinanzas/> </RequireAuth>} />
        <Route path='/asignar-gasto' element={<RequireAuth> <AssignExpense/> </RequireAuth>} />
        <Route path='/margen-resultados' element={<RequireAuth> <ProfitMargin/> </RequireAuth>} />
      </Routes>
    </>
  );
};

export default App;

