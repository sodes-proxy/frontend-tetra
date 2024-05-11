import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
//import './EditEvent.css';
import { extractNumericValue } from '../helpers/numbers';

import { handleSubmit, handleChange, handleNumberText } from '../helpers/handles';


const AddPayment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const eventDate =  event.day + ' de '  + meses[event.month - 1 ] + ' del ' + event.year;
    const [showToast, setShowToast] = useState(false);

    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    const [formData, setFormData] = useState({
        id_event: event.id_event || '',
        payer: event.payer || '',
        quantity: event.quantity || '$'
    });

    const handleAdd = (e) => {
        handleSubmit(e, 'http://localhost:8000/finanzas/addAbono',  {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'quantity': Number.parseFloat(extractNumericValue((formData.quantity))),
                'payer': formData.payer,
                'id_event': formData.id_event
            })
        }, formData, ['quantity'], onClose, onShow, () => {})
    };

    return (
        <div className="edit-event-container">
        <form onSubmit={handleAdd}>
            <label>Estas agregando un abono al evento {formData.id_event}</label>
            <label>Nombre: {event.name}</label>
            <label>La fecha del evento es {eventDate}</label>
            <label>
                Recibi dinero de
                <input type="text" name="payer" value={formData.payer} onChange={(e) => handleChange(e, setFormData)} />
            </label>
            <label>
                La cantidad de
                <input type="text" name="quantity" value={formData.quantity} onChange={(e) => handleNumberText(e, setFormData, true)} />
            </label>
            <button type="submit" className="submit-button">Agregar Abono</button>
        </form>
    </div>
    );
};

export default AddPayment;