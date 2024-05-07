import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './FutureEvents.css';


const FutureEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [eventLocations, setEventLocations] = useState([]);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date();

      const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 4 + i);

      const getEvents = (data) => {
        fetch('http://localhost:8000/agenda/getEvento', {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(data)
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
}

    const [isChecked, setIsChecked] = useState(false);
      // Function to handle checkbox change
      const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };

      const [formData, setFormData] = useState({
        location: '',
        year: date.getFullYear(),
        month: meses[date.getMonth()]
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(formData)
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      useEffect(() => {
        console.log(meses.indexOf([formData.month]))
        if (isChecked) {
            getEvents({'month':meses.indexOf(formData.month) + 1, 'year':Number.parseInt(formData.year), 'location':formData.location})
        }
        else {
            getEvents({'month':meses.indexOf(formData.month) + 1, 'year':Number.parseInt(formData.year)})
        }
    }, [isChecked, formData]);

     // get locations
    useEffect(() => {
        fetch('http://127.0.0.1:8000/getLugares')
        .then(response => response.json())
        .then(data => {
            if (data && data.locations && Array.isArray(data.locations)) {
            // Extract the types array from the response data and set state
            setEventLocations(data.locations);
            setFormData(prevState => ({
                ...prevState,
                ['location']: data.locations[0]
            }));
            } else {
            console.error('Invalid data format:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching event locations:', error);
        });
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
            {meses && (
                <select name="month" value={formData.month} onChange={handleChange}>
                {meses.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
            {years && (
                <select name="year" value={formData.year} onChange={handleChange}>
                {years.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
                Filtrar por: 
             <input type="checkbox" value="None" name="locCheck" onChange={handleCheckboxChange}/> Ubicación
             {isChecked && (
                <select name="location" value={formData.location} onChange={handleChange}>
                    {eventLocations.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            )}
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
                                <td>
                                    <button className="edit" onClick={() => handleEdit(event)}>Editar</button>              
                                    <button className="delete" onClick={() => handleDelete(event.id_event)}>Eliminar</button>
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