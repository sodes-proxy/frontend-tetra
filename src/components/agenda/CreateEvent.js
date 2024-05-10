import React, { useState, useEffect } from 'react';
import './CreateEvent.css';
import 'react-toastify/dist/ReactToastify.css';
import { openToast } from '../helpers/toast';
import { getOptions } from '../helpers/options';
import { handleChange, handleNumberText, handleSubmitEvent } from '../helpers/handles';
import { EventForm } from './EventForm';

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

  const [showToast, setShowToast] = useState(false);
  const [eventTypeOptions, setEventTypeOptions] = useState([]);
  const [eventLocations, setEventLocations] = useState([]);
  const possibleValues = ['price', 'advancePayment'];

  // get event types
  useEffect(() => {
    const errorMsg = 'Hubo un problema al obtener los tipos de eventos';
    getOptions('http://127.0.0.1:8000/getTiposEvento', setEventTypeOptions, setFormData, 'types', 'eventType', 
    () => openToast(false, errorMsg, 2000, () => setShowToast(false), () => setShowToast(true) ))
  }, []);

  // get locations
  useEffect(() => {
    const errorMsg = 'Hubo un problema al querer obtener los lugares';
    getOptions('http://127.0.0.1:8000/getLugares', setEventLocations, setFormData, 'locations', 'location', 
    () => openToast(false, errorMsg, 2000, () => setShowToast(false), () => setShowToast(true) ))
  }, []);

  return (
    <div className='edit-event-container'>
    <EventForm
    formData={formData} handleChange={handleChange} eventTypeOptions={eventTypeOptions} 
    eventLocations={eventLocations} handleNumberText={handleNumberText} setFormData={setFormData}
    handleSubmit={(e) => handleSubmitEvent(e, 'http://localhost:8000/agenda/addEvento', formData, 
    () => setShowToast(false), () => setShowToast(true),false)} msgBtn={'Registrar evento'}
    ></EventForm>
</div>
  );
};

export default CreateEvent;