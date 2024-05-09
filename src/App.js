import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from "./components/Home";
import CreateEvent from './components/agenda/CreateEvent';
import DeleteEvent from './components/agenda/DeleteEvent';
import FutureEvents from './components/agenda/FutureEvents';
import EditEvent from './components/agenda/EditEvent';
import BackToHomeButton from './components/BackToHomeButton';
import PastEvents from './components/agenda/PastEvents';
import AddPayment from './components/finanzas/AddPayment';
import ViewEvent from './components/agenda/ViewEvent';
import AddExpense from './components/finanzas/AddExpense';

const App = () => {
  return (
    <Router>
    <div className="App">
      <BackToHomeButton />
      <Routes>
        <Route path="/" element={<Home userRole={"admin"}/>} />
        <Route path="/crear-evento" element={<CreateEvent/>} />
        <Route path="/eliminar-evento" element={<DeleteEvent/>} />
        <Route path="/agenda-eventos" element={<FutureEvents/>} />
        <Route path="/editar-evento/:id" element={<EditEvent />} />
        <Route path="/historial-eventos" element={<PastEvents />} />
        <Route path='/agregar-abono/:id' element={<AddPayment />} />
        <Route path='/ver-evento/:id' element={<ViewEvent />} />
        <Route path='/agregar-gasto/:id' element={<AddExpense />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
