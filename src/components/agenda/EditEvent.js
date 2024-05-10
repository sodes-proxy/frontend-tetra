import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './EditEvent.css';
import fetchWithAuth from '../../services/fetchWithAuth';
import { getValueInNumber, extractNumericValue } from '../helpers/numbers';
import { openToast } from '../helpers/toast';
import { getOptions } from '../helpers/options';
import { handleChange, handleNumberText, handleFetchResponse, handleSubmitEvent } from '../helpers/handles';
import { EventForm } from './EventForm';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;

    const [showToast, setShowToast] = useState(false);
    const [eventTypeOptions, setEventTypeOptions] = useState([]);
    const [eventLocations, setEventLocations] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');

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
            handleSubmit={(e) => handleSubmitEvent(e, 'http://localhost:8000/agenda/modifyEvento', formData, 
            () => setShowToast(false), () => setShowToast(true),true)} msgBtn={'Actualizar evento'}
            ></EventForm>
        </div>
    );
};

export default EditEvent;