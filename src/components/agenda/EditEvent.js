import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './EditEvent.css';
import { getValueInNumber, extractNumericValue } from '../helpers/numbers';
import { openToast } from '../helpers/toast';
import { getList } from '../helpers/options';
import { handleChange, handleNumberText, handleSubmit } from '../helpers/handles';
import { EventForm } from './EventForm';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;

    const [showToast, setShowToast] = useState(false);
    const [eventTypeOptions, setEventTypeOptions] = useState([]);
    const [eventLocations, setEventLocations] = useState([]);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    const [formData, setFormData] = useState({
        payerName: event.name || '',
        id_event: event.id_event || '',
        eventType: event.type || '',
        eventDate: new Date(event.year, event.month - 1, event.day).toISOString().split('T')[0] || '',
        price: getValueInNumber(event.cost.toString(), true) || '$',
        location: event.location || '',
        attendees: event.num_of_people || '',
        advancePayment: getValueInNumber(event.upfront.toString(), true) || '$'
    });

     // get event types
    useEffect(() => {
        const errorMsg = 'Hubo un problema al obtener los tipos de eventos';
        getList('http://127.0.0.1:8000/getTiposEvento', {}, setEventTypeOptions, setFormData, 'types', 
        'eventType', errorMsg, onShow, onClose)
    }, []);

    // get locations
    useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los lugares';
        getList('http://127.0.0.1:8000/getLugares', {}, setEventLocations, setFormData, 'locations', 
        'location', errorMsg, onShow, onClose)
    }, []);

    return (
        <div className='edit-event-container'>
            <EventForm
            formData={formData} handleChange={handleChange} eventTypeOptions={eventTypeOptions} 
            eventLocations={eventLocations} handleNumberText={handleNumberText} setFormData={setFormData}
            handleSubmit={(e) => handleSubmit(e, 'http://localhost:8000/agenda/modifyEvento', {method: 'POST',
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
                upfront: Number.parseFloat(extractNumericValue((formData.advancePayment))),
                id_event:formData.id_event
            })}, formData, ['price', 'advancePayment'],
            () => setShowToast(false), () => setShowToast(true), () => {})} msgBtn={'Actualizar evento'}
            ></EventForm>
        </div>
    );
};

export default EditEvent;