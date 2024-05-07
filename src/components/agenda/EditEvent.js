import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './EditEvent.css';


const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;

    const [eventTypeOptions, setEventTypeOptions] = useState([]);
    const [eventLocations, setEventLocations] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');

    const [formData, setFormData] = useState({
        name: event.name || '',
        clientReason: event.clientReason || '',
        id_event: event.id_event || '',
        type: event.type || '',
        eventDate: new Date(event.year, event.month - 1, event.day).toISOString().split('T')[0] || '',
        food: event.food || '',
        cost: event.cost || '',
        location: event.location || '',
        num_of_people: event.num_of_people || '',
        upfront: event.upfront || ''
    });

    useEffect(() => {
        fetch('http://127.0.0.1:8000/getLugares')
          .then(response => response.json())
          .then(data => {
            if (data && data.locations && Array.isArray(data.locations)) {
              // Extract the types array from the response data and set state
              setEventLocations(data.locations);
            } else {
              console.error('Invalid data format:', data);
            }
          })
          .catch(error => {
            console.error('Error fetching event locations:', error);
          });
      }, []);

      useEffect(() => {
        fetch('http://127.0.0.1:8000/getTiposEvento')
          .then(response => response.json())
          .then(data => {
            if (data && data.types && Array.isArray(data.types)) {
              // Extract the types array from the response data and set state
              setEventTypeOptions(data.types);
              
            } else {
              console.error('Invalid data format:', data);
            }
          })
          .catch(error => {
            console.error('Error fetching event types:', error);
          });
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allFormData = {...formData,
            day: Number.parseInt(formData.eventDate.split('-')[2]),
            month: Number.parseInt(formData.eventDate.split('-')[1]),
            year: Number.parseInt(formData.eventDate.split('-')[0]),}

        delete allFormData.eventDate; 
        delete allFormData.clientReason;
        delete allFormData.food;
        fetch(`http://localhost:8000/agenda/modifyEvento`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allFormData)
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message); // Set the response message
            //navigate('/future-events');
        })
        .catch(error => console.error('Error updating event:', error), response => response.json());
    };

    return (
        <div className="edit-event-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre (responsables de pago)
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                    Clientes (razón de evento)
                    <input type="text" name="clientReason" value={formData.clientReason} onChange={handleChange} />
                </label>
                <label>
                    Tipo de evento
                    <select name="type" value={formData.type} onChange={handleChange}>
                        {eventTypeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                        ))}
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
                    <select name="location" value={formData.location} onChange={handleChange}>
                        {eventLocations.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label>
                    No. Asistentes
                    <input type="number" name="num_of_people" value={formData.num_of_people} onChange={handleChange} />
                </label>
                <label>
                    Precio del evento
                    <input type="number" name="cost" value={formData.cost} onChange={handleChange} />
                </label>
                <label>
                    Anticipo del evento
                    <input type="number" name="upfront" value={formData.upfront} onChange={handleChange} />
                </label>
                <button type="submit" className="submit-button">Actualizar Evento</button>
            </form>
            {responseMessage && ( // Render popup if responseMessage is not empty
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>{responseMessage}</p>
                        <button onClick={() => setResponseMessage('')}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditEvent;