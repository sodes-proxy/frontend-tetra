import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './FutureEvents.css';
import { handleDelete } from '../helpers/handles';
import { DeleteModal } from '../helpers/modal';
import Searcher from './Searcher';

const FutureEvents = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');
    const [events, setEvents] = useState([]);

    const buttons = [{'className':'payment', 'action':(e) => handleEvent(e, 'ver-evento'), 'display':'Ver'},
        {'className':'edit', 'action':(e) => handleEvent(e, 'editar-evento'), 'display':'Editar'},
        {'className':'delete', 'action':(e) => {setIdEvent(e.id_event)}, 'display':'Eliminar'}
    ]; 

      useEffect(() => {
        if (idEvent !== '' && idEvent != undefined) {setModalIsOpen(true); console.log(idEvent)}
      }, [idEvent])

    const handleEvent = (event, url) => {
        navigate(`/${url}/${event.id_event}`, { state: { event } });
    };

    const handleDel = () => {
        console.log(idEvent)
        setModalIsOpen(false)
        handleDelete('http://localhost:8000/agenda/delEvento', {
            method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ id_event: idEvent })
        }, () => setEvents(events.filter(event => event.id_event !== idEvent)), onShow, onClose) 
        setIdEvent('')
    };

    const cancelDelete =  () => {
        setModalIsOpen(false);
        setIdEvent('')
    }

    return (
        <div className="future-events-container">
            <DeleteModal isOpen={modalIsOpen} onRequestClose={cancelDelete} onDelete={handleDel}/>
            <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} state={['pendiente']}/>
        </div>
    );
};

export default FutureEvents;