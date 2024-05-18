import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleDelete, handleFileResponse, handleSubmit } from '../helpers/handles';
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

    const buttons = [{'className':'payment', 'action':(e) => {setIdEvent(e.id_event)}, 'display':'Revertir', 'state':['completado']},
        {'className':'edit', 'action':(e) => {handleDownload(e)}, 'display':'Descargar', 'state':['completado']},
    ]; 

      useEffect(() => {
        if (idEvent !== '' && idEvent != undefined) {setModalIsOpen(true); console.log(idEvent)}
      }, [idEvent])

    const handleDownload = (event) => {
        handleFileResponse('http://127.0.0.1:8000/finanzas/getMargenResultados', {
            method: 'OPTIONS', headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ id_event: event.id_event })
        }, 'margen.xlsx')
    };

    const handleRevert = (e) => {
        handleDelete('http://localhost:8000/finanzas/revertirMargenResultados', {
            method: 'DELETE', headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ id_event: idEvent })
        }, () => setEvents(events.filter(event => event.id_event !== idEvent)), onShow, onClose)
        setModalIsOpen(false)
    }

    const cancelDelete =  () => {
        setModalIsOpen(false);
        setIdEvent('')
    }

    return (
        <div className="future-events-container">
            <TrentoModal isOpen={modalIsOpen} onOk={handleRevert} onCancel={cancelDelete} 
                title={'Deseas revertir el margen de resultados'} question={'Estas a punto de cancelar el margen de resultados'} buttonOk={'Concluir'}
                butttonCancel={'Cancelar'}
            />
            <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} state={['completado', 'cancelado']}/>
        </div>
    );
};

export default FutureEvents;