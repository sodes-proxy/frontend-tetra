import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
//import './EditEvent.css';
import { getValueInNumber, extractNumericValue } from '../helpers/numbers';


const AddPayment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const keysInSpanish = {'quantity':'Cantidad'};
    const eventDate =  event.day + ' de '  + meses[event.month - 1 ] + ' del ' + event.year;
    const [responseMessage, setResponseMessage] = useState('');

    const [formData, setFormData] = useState({
        id_event: event.id_event || '',
        payer: event.payer || '',
        quantity: event.quantity || '$'
    });

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
        // Check if any of the form fields are empty
        if (!formData.payer.trim() || !formData.quantity.toString().trim()) {
            alert('Por favor llena los campos'); // You can replace this with your preferred way of displaying errors
            return;
        }          
        var value = extractNumericValue(formData['quantity']);
        if (value === ''){
            alert('Favor de llenar el campo ' + keysInSpanish['quantity']);
            return;
        }

        fetch(`http://localhost:8000/finanzas/addAbono`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'quantity': Number.parseFloat(formData.quantity),
                'payer': formData.payer,
                'id_event': formData.id_event
            })
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
            <label>Estas agregando un abono al evento {formData.id_event}</label>
            <label>Nombre: {event.name}</label>
            <label>La fecha del evento es {eventDate}</label>
            <label>
                Recibi dinero de
                <input type="text" name="payer" value={formData.payer} onChange={handleChange} />
            </label>
            <label>
                La cantidad de
                <input type="text" name="quantity" value={formData.quantity} onChange={handleNumberText} />
            </label>


            <button type="submit" className="submit-button">Agregar Abono</button>
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

export default AddPayment;