import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './FutureEvents.css';
import { getList } from '../helpers/options';
import { openToast } from '../helpers/toast';
import { handleChange, handleDelete } from '../helpers/handles';
import { DeleteModal } from '../helpers/modal';

const FutureEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [eventLocations, setEventLocations] = useState([]);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date();
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 4 + i);

    const getEvents = (data) => {
        const errorMsg = 'No se encontraron eventos';
        getList('http://localhost:8000/agenda/getEvento', { method: 'OPTIONS',
        headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}, setEvents, null, 'events', null, 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }

    const [isChecked, setIsChecked] = useState(false);
      const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };

      const [formData, setFormData] = useState({
        location: '',
        year: date.getFullYear(),
        month: meses[date.getMonth()]
      });

      useEffect(() => {
        if (idEvent !== '') setModalIsOpen(true);
      }, [idEvent])

      useEffect(() => {
        if (isChecked) getEvents({'month':meses.indexOf(formData.month) + 1, 'year':Number.parseInt(formData.year), 'location':formData.location})
        else getEvents({'month':meses.indexOf(formData.month) + 1, 'year':Number.parseInt(formData.year)})
    }, [isChecked, formData]);

    useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los lugares';
        getList('http://127.0.0.1:8000/getLugares', {}, setEventLocations, setFormData, 'locations', 'location', 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }, []);

    const handleEvent = (event, url) => {
        navigate(`/${url}/${event.id_event}`, { state: { event } });
    };

    const handleDel = (id) => {
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
            {meses && (
                <select name="month" value={formData.month} onChange={(e) => handleChange(e, setFormData)}>
                {meses.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
            {years && (
                <select name="year" value={formData.year} onChange={(e) => handleChange(e, setFormData)}>
                {years.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
                Filtrar por: 
             <input type="checkbox" value="None" name="locCheck" onChange={handleCheckboxChange}/> Ubicación
             {isChecked && (
                <select name="location" value={formData.location} onChange={(e) => handleChange(e, setFormData)}>
                    {eventLocations.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            )}
            <table className="future-events-table">
                <thead>
                    <tr>{['Nombre', 'Fecha', 'Ubicación', 'Acciones'].map((header, index) => {
                        return <th key={index}>{header}</th>;
                    })}</tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr><td colSpan="4">No hay eventos disponibles.</td></tr>
                    ) : (
                        events.map(event => (
                            <tr key={event.id_event}>
                                {[event.name, `${event.day}/${event.month}/${event.year}`, event.location].map((value, index) => {
                                    return <td key={index}>{value}</td>;
                                })}
                                <td>
                                <button className="payment" onClick={() => handleEvent(event, 'ver-evento')}>Ver</button>
                                <button className="edit" onClick={() => handleEvent(event, 'editar-evento')}>Editar</button>              
                                <button className="delete" onClick={() => setIdEvent(event.id_event)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FutureEvents;