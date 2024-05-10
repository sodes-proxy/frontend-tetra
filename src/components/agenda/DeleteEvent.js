import React, { useState } from 'react';
import './DeleteEvent.css'; // Reuse the same CSS file for consistent styling

const DeleteEvent = () => {
  const [eventId, setEventId] = useState('');

  const handleChange = (e) => {
    setEventId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8000/agenda/delEvento', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ id_event: eventId })
        });
        if (response.ok) {
            console.log('Event deleted successfully');
            // Handle successful deletion here, e.g., update state or UI
        } else {
            throw new Error('Failed to delete event');
        }
    } catch (error) {
        console.error('Error deleting event', error);
    }
  };

  return (
    <div className="delete-event-container"> {/* Use the same container class for styling */}
      <form onSubmit={handleSubmit}>
        <label>
          ID del Evento:
          <input type="text" value={eventId} onChange={handleChange} className="input-field" placeholder='Introduce el evento a eliminar' />
        </label>
        <button type="submit" className="submit-button">Eliminar Evento</button>
      </form>
    </div>
  );
};

export default DeleteEvent;