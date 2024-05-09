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
        <Route path="/" element={<Home userRole={"admin"}/>} />
        <Route path="/crear-evento" element={<RequireAuth><CreateEvent/></RequireAuth>} />
        <Route path="/eliminar-evento" element={<RequireAuth><DeleteEvent/></RequireAuth>} />
        <Route path="/agenda-eventos" element={<RequireAuth><FutureEvents/></RequireAuth>} />
        <Route path="/editar-evento/:id" element={<RequireAuth><EditEvent /></RequireAuth>} />
        <Route path="/historial-eventos" element={<RequireAuth><PastEvents /></RequireAuth>} />
        <Route path='/agregar-abono/:id' element={<RequireAuth><AddPayment /></RequireAuth>} />
        <Route path='/ver-evento/:id' element={<RequireAuth><ViewEvent /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;

