import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './EditEvent.css';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;

    const [formData, setFormData] = useState({
        payerName: event.name || '',
        clientReason: event.clientReason || '',
        eventType: event.eventType || '',
        eventDate: event.eventDate || '',
        food: event.food || '',
        location: event.location || '',
        attendees: event.attendees || '',
        price: event.price || '',
        advancePayment: event.advancePayment || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/agenda/modifyEvento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(() => {
            navigate('/future-events');
        })
        .catch(error => console.error('Error updating event:', error));
    };

    return (
        <div className="edit-event-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre (responsables de pago)
                    <input type="text" name="payerName" value={formData.payerName} onChange={handleChange} />
                </label>
                <label>
                    Clientes (razón de evento)
                    <input type="text" name="clientReason" value={formData.clientReason} onChange={handleChange} />
                </label>
                <label>
                    Tipo de evento
                    <select name="eventType" value={formData.eventType} onChange={handleChange}>
                        <option value="conference">Conferencia</option>
                        <option value="seminar">Seminario</option>
                        <option value="workshop">Taller</option>
                    </select>
                </label>
                <label>
                    Fecha del evento
                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} />
                </label>
                <label>
                    Comida para el evento
                    <input type="text" name="food" value={formData.food} onChange={handleChange} />
                </label>
                <label>
                    Lugar asignado para el evento
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />
                </label>
                <label>
                    No. Asistentes
                    <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} />
                </label>
                <label>
                    Precio del evento
                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                </label>
                <label>
                    Anticipo del evento
                    <input type="number" name="advancePayment" value={formData.advancePayment} onChange={handleChange} />
                </label>
                <button type="submit" className="submit-button">Actualizar Evento</button>
            </form>
        </div>
    );
};

export default EditEvent;