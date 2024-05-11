import React, { useState, useEffect } from 'react';
import './CreateEvent.css';
import 'react-toastify/dist/ReactToastify.css';
import { openToast } from '../helpers/toast';
import { getList } from '../helpers/options';
import { handleChange, handleNumberText, handleSubmit } from '../helpers/handles';
import { EventForm } from './EventForm';
import { extractNumericValue } from '../helpers/numbers';

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

  const onShow =  () => { setShowToast(true) };
  const onClose =  () => { setShowToast(false) };

  // get event types
  useEffect(() => {
    const errorMsg = 'Hubo un problema al obtener los tipos de eventos';
    getList('http://127.0.0.1:8000/getTiposEvento', {}, setEventTypeOptions, setFormData, 'types', 
    'eventType', errorMsg, onShow, onClose)
  }, []);

  // get locations
  useEffect(() => {
    const errorMsg = 'Hubo un problema al querer obtener los lugares';
    getList('http://127.0.0.1:8000/getLugares', {}, setEventLocations, setFormData, 'locations', 'location', 
    errorMsg, onShow, onClose)
  }, []);

  return (
    <div className='edit-event-container'>
    <EventForm
    formData={formData} handleChange={handleChange} eventTypeOptions={eventTypeOptions} 
    eventLocations={eventLocations} handleNumberText={handleNumberText} setFormData={setFormData}
    handleSubmit={(e) => handleSubmit(e, 'http://localhost:8000/agenda/addEvento', {method: 'POST',
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
    })}, formData, ['price', 'advancePayment'],
    () => setShowToast(false), () => setShowToast(true), () => {})} msgBtn={'Registrar evento'}
    ></EventForm>
</div>
  );
};

export default CreateEvent;