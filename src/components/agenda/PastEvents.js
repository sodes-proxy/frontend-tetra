import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './FutureEvents.css';

const FutureEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        const date = new Date();
        fetch('http://localhost:8000/agenda/verAgenda', {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({'day': date.getDay(), 'month': date.getMonth()+1, 
            'year': date.getFullYear(), isFuture: false})
        })
        .then(response => response.json())
        .then(data => {
            if (data.events && data.events.length > 0) {
                setEvents(data.events);
            } else {
                setEvents([]);
                // Handle empty response: Display a message or perform any other action
                console.log('No events found.');
            }
        })
        .catch(error => console.error('Error fetching events:', error));
    }, []);




    return (
        <div className="future-events-container">
            <table className="future-events-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Ubicación</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan="4">No hay eventos disponibles.</td>
                        </tr>
                    ) : (
                        events.map(event => (
                            <tr key={event.id_event}>
                                <td>{event.name}</td>
                                <td>{`${event.day}/${event.month}/${event.year}`}</td>
                                <td>{event.location}</td>
                                <td>{event.type}</td>
                            </tr>
                        ))
                    )}

                </tbody>
            </table>
        </div>
    );
};

export default FutureEvents;