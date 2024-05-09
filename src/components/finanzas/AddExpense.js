import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
//import './EditEvent.css';


const AddExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const eventDate =  event.day + ' de '  + meses[event.month - 1 ] + ' del ' + event.year;
    const [responseMessage, setResponseMessage] = useState('');

    const [formData, setFormData] = useState({
        id_event: event.id_event || '',
        buyer: '',
        amount: '$',
        concept: '',
        category: 'Alimentos',
        quantity: '',
        expense_type: 'Inventario',
        date: '',
    });

    const formatValue = (inputValue) => {
        // Remove non-numeric characters except decimal point
        const numericValue = inputValue.replace(/[^0-9.]/g, '');
        // Remove leading zeros from the integer part
        const parts = numericValue.split('.');
        parts[0] = parts[0].replace(/^0+/, '');
        // Format the integer part with commas as thousand separators
        const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // Combine the integer and decimal parts with a dollar sign
        return (parts.length === 1 ? formattedInteger : formattedInteger + '.' + parts[1]);
    };

    const handleNumberText = (event) => {
        // Get the input value from the event
        const inputValue = event.target.value;
        // Format the input value
        var formattedValue = formatValue(inputValue);
        console.log(event.target.name)
        const numericValue = extractNumericValue(inputValue);
        var prefix = '';
        // Update the state with the formatted value
        if (event.target.name === 'amount'){
            prefix = '$';
        }
        if (parseFloat(numericValue) <= 0){
            formattedValue = '';
        }
        setFormData(prevState => ({
            ...prevState,
            [event.target.name]: prefix + formattedValue
        }));
    };

    const extractNumericValue = (formattedValue) => {
        return formattedValue.replace(/[^0-9.]/g, '');
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const day =  Number.parseInt(formData.date.split('-')[2]);
        const month = Number.parseInt(formData.date.split('-')[1]);
        const year =Number.parseInt(formData.date.split('-')[0]);
        // Check if any of the form fields are empty
        for (const key in formData) {
            if (!formData[key].trim()) {
                console.log(key)
                alert('Por favor llena todos los campos'); // You can replace this with your preferred way of displaying errors
                return;
            }
        }
        fetch(`http://localhost:8000/finanzas/addGasto`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_event: formData.id_event,
                buyer: formData.buyer,
                concept: formData.concept,
                expense_type: formData.expense_type,
                category: formData.category,
                day: day,
                month: month,
                year: year,
                quantity: Number.parseFloat(extractNumericValue(formData.quantity)),
                amount: Number.parseFloat(extractNumericValue(formData.amount))
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
            <label>Estas agregando un gasto al evento {formData.id_event}</label>
            <label>Nombre: {event.name}</label>
            <label>La fecha del evento es {eventDate}</label>
            <label>Fecha de compra<input type="date" name="date" value={formData.date} onChange={handleChange} /></label>
            <label>
            Categoria
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option key={1} value={'Alimentos'}>Alimentos</option>
                    <option key={2} value={'Comida'}>Comida</option>
                </select>
            </label>
            <label>Comprador<input type="text" name="buyer" value={formData.buyer} onChange={handleChange} /></label>
            <label>Concepto<input type="text" name="concept" value={formData.concept} onChange={handleChange} /></label>
            <label>
                Cantidad
                <input type="text" name="quantity" value={formData.quantity} onChange={handleNumberText} />
            </label>
            <label>
                Monto ($)
                <input type="text" name="amount" value={formData.amount} onChange={handleNumberText} />
            </label>
            
            
            <button type="submit" className="submit-button">Agregar Gasto</button>
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

export default AddExpense;