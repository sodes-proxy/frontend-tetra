import React, { useState, useEffect } from 'react';
import './CreateEvent.css';
import fetchWithAuth from '../../services/fetchWithAuth';
import { getValueInNumber, extractNumericValue } from '../helpers/numbers';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    payerName: '',
    eventType: '',
    eventDate: '',
    location: '',
    attendees: '',
    price: '$',
    advancePayment: '$'
  });

  const [eventTypeOptions, setEventTypeOptions] = useState([]);
  const [eventLocations, setEventLocations] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  const keysInSpanish = {'price':'Precio del evento', 'upfront':'Anticipo del evento'}
  const possibleValues = ['price', 'advancePayment'];

  // get event types
  useEffect(() => {
    fetchWithAuth('http://127.0.0.1:8000/getTiposEvento', {'headers': {}})
      .then(response => response.json())
      .then(data => {
        if (data && data.types && Array.isArray(data.types)) {
          // Extract the types array from the response data and set state
          setEventTypeOptions(data.types);
          setFormData(prevState => ({
            ...prevState,
            ['eventType']: data.types[0]
          }));
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching event types:', error);
      });
  }, []);

  // get locations
  useEffect(() => {
    fetchWithAuth('http://127.0.0.1:8000/getLugares', {
      'headers': {'Authorization': 'Bearer ' + localStorage.getItem('token')}
    }).then(response => response.json())
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNumberText = (event) => {
    setFormData(prevState => ({
        ...prevState,
        [event.target.name]: getValueInNumber(event.target.value, true)
    }));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key].trim()) {
          alert('Por favor llena todos los campos'); // You can replace this with your preferred way of displaying errors
          return;
      }
      if (possibleValues.includes(key)){    
        var value = extractNumericValue(formData[key]);
        if (value === ''){
            alert('Favor de llenar el campo ' + keysInSpanish[key]);
            return;
        }
    }
  }
    console.log('Form Data Submitted:', formData);
    // Asegrate de que el coste siempre tenga dos decimales y sea un nmero
    fetchWithAuth('http://localhost:8000/agenda/addEvento', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          name: formData.payerName,
          type: formData.eventType,
          day: Number.parseInt(formData.eventDate.split('-')[2]),
          month: Number.parseInt(formData.eventDate.split('-')[1]),
          year: Number.parseInt(formData.eventDate.split('-')[0]),
          location: formData.location,
          num_of_people: Number.parseInt(formData.attendees),
          cost: Number.parseFloat(extractNumericValue((formData.price))),
          upfront: Number.parseFloat(extractNumericValue((formData.advancePayment)))
      })
      }).then(response => response.json())
      .then(data => {
          setResponseMessage(data.message); // Set the response message
          //navigate('/future-events');
      })
      .catch(error => console.error('Error updating event:', error), response => response.json());
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
          <input type="number" min={1} name="attendees" value={formData.attendees} onChange={handleChange} placeholder='Número de asistentes'/>
        </label>
        <label>
          Precio del evento
          <input type="text" name="price" value={formData.price} onChange={handleNumberText} placeholder='Precio $'/>
        </label>
        <label>
          Anticipo del evento
          <input type="text" name="advancePayment" value={formData.advancePayment} onChange={handleNumberText} placeholder='Anticipo $' />
        </label>
        <button type="submit" className="submit-button">Registrar Evento</button>
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

export default CreateEvent;