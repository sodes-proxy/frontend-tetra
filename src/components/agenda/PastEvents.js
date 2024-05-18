import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleDelete } from '../helpers/handles';
import './FutureEvents.css';
import Searcher from './Searcher';
import { TrentoModal } from '../helpers/modal';

const FutureEvents = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');
    const [events, setEvents] = useState([]);

    const buttons = [{'className':'payment', 'action':() => {}, 'display':'Revertir', 'state':['completado']},
        {'className':'edit', 'action':() => {}, 'display':'Descargar', 'state':['cancelado', 'completado']},
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
            <TrentoModal isOpen={modalIsOpen} onOk={() => {setModalIsOpen(false)}} onCancel={()=>setModalIsOpen(false)} 
                title={'Deseas revertir el margen de resultados'} question={'Estas a punto de cancelar el margen de resultados'} buttonOk={'Concluir'}
                butttonCancel={'Cancelar'}
            />
            <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} state={['completado', 'cancelado']}/>
        </div>
    );
};

export default FutureEvents;