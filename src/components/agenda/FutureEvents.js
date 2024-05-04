import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './FutureEvents.css';

const FutureEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/agenda/verAgenda', {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({'day':4, 'month': 5, 'year': 2024, isFuture: true})
        })
        .then(response => response.json())
        .then(data => {
            setEvents(data.events);
        })
        .catch(error => console.error('Error fetching events:', error));
    }, []);

    const handleEdit = (event) => {
        navigate(`/editar-evento/${event.id_event}`, { state: { event } });
    };
    
    const handleDelete = (id) => {
        console.log('Eliminar evento:', id);
        // Implementación de la solicitud DELETE para eliminar un evento
        fetch('http://localhost:8000/agenda/delEvento', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_event: id }) // Asegúrate de enviar el ID del evento a eliminar
        })
        .then(response => response.json())
        .then(data => {
            console.log('Evento eliminado:', data);
            // Aquí podrías actualizar el estado para reflejar que el evento fue eliminado
            setEvents(events.filter(event => event.id_event !== id));
        })
        .catch(error => console.error('Error eliminando evento:', error));
    };

    return (
        <div className="future-events-container">
            <table className="future-events-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id_event}>
                            <td>{event.name}</td>
                            <td>{`${event.day}/${event.month}/${event.year}`}</td>
                            <td>{event.location}</td>
                            <td>
                                <button className="edit" onClick={() => handleEdit(event)}>Editar</ button>              
                                <button className="delete" onClick={() => handleDelete(event.id_event)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FutureEvents;