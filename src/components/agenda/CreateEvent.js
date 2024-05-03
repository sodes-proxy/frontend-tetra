import React, { useState } from 'react';
import './CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    payerName: '',
    clientReason: '',
    eventType: 'conference',
    eventDate: '',
    food: '',
    location: '',
    attendees: '',
    price: '',
    advancePayment: ''
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
    console.log('Form Data Submitted:', formData);
    // Asegrate de que el coste siempre tenga dos decimales y sea un nmero
    fetch('http://localhost:8000/agenda/addEvento', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: formData.payerName,
          type: formData.eventType,
          day: Number.parseInt(formData.eventDate.split('-')[2]),
          month: Number.parseInt(formData.eventDate.split('-')[1]),
          year: Number.parseInt(formData.eventDate.split('-')[0]),
          location: formData.location,
          num_of_people: Number.parseInt(formData.attendees),
          cost: Number.parseFloat(formData.price) + 0.0001, // Asegrate de enviar un nmero aquí
          upfront: Number.parseFloat(formData.advancePayment) + 0.0001 // También asegrate de que el anticipo sea un nmero
      })
    });
  };

  return (
    <div className="create-event-container">
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
          <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} placeholder='Número de asistentes'/>
        </label>
        <label>
          Precio del evento
          <input type="number" step="any" name="price" value={formData.price} onChange={handleChange} placeholder='Precio $'/>
        </label>
        <label>
          Anticipo del evento
          <input type="number" step="any" name="advancePayment" value={formData.advancePayment} onChange={handleChange} placeholder='Anticipo $' />
        </label>
        <button type="submit" className="submit-button">Registrar Evento</button>
      </form>
    </div>
  );
};

export default CreateEvent;