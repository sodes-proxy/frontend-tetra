import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from "./components/Home";
import CreateEvent from './components/agenda/CreateEvent';
import DeleteEvent from './components/agenda/DeleteEvent';
import FutureEvents from './components/agenda/FutureEvents';
import EditEvent from './components/agenda/EditEvent';
import BackToHomeButton from './components/BackToHomeButton';
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
      </Routes>
    </div>
    </Router>
  );
}

export default App;
