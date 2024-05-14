import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { extractNumericValue } from '../helpers/numbers';
import { handleSubmit, handleChange, handleNumberText } from '../helpers/handles';

const AddExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const [showToast, setShowToast] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };



    const [formData, setFormData] = useState({
        buyer: '',
        amount: '$',
        concept: '',
        category: 'Alimentos',
        quantity: '',
        expense_type: 'Inventario',
        date: '',
        ...(event ? {id_event: event.id_event, expense_type: 'Inventario',}: 
        {id_event:'GENERAL', expense_type: id} )
    });

    const handleAdd = (e) => {
        const day =  Number.parseInt(formData.date.split('-')[2]);
        const month = Number.parseInt(formData.date.split('-')[1]);
        const year = Number.parseInt(formData.date.split('-')[0]);
        handleSubmit(e, 'http://localhost:8000/finanzas/addGasto', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
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
        }, formData, ['quantity', 'amount'], onClose, onShow, () => {})
    };

    return (
        <div className="edit-event-container">
        <form onSubmit={handleAdd}>
            {formData.id_event === 'GENERAL' ? (
                <label>
                    Estas agregando un {formData.expense_type}
                </label>
            ) : (
                <React.Fragment>
                     <label>Estas agregando un gasto al evento {formData.id_event}</label>
                    <label>Nombre: {event.name}</label>
                    <label>La fecha del evento es {event.day + ' de '  + meses[event.month - 1 ] + ' del ' + event.year}</label>
                </React.Fragment>
            )}
            
            <label>Fecha de compra<input type="date" name="date" value={formData.date} onChange={(e) => handleChange(e, setFormData)} /></label>
            <label>
            Categoria
                <select name="category" value={formData.category} onChange={(e) => handleChange(e, setFormData)}>
                    <option key={1} value={'Alimentos'}>Alimentos</option>
                    <option key={2} value={'Bebidas'}>Bebidas</option>
                </select>
            </label>
            <label>Comprador<input type="text" name="buyer" value={formData.buyer} onChange={(e) => handleChange(e, setFormData)} /></label>
            <label>Concepto<input type="text" name="concept" value={formData.concept} onChange={(e) => handleChange(e, setFormData)} /></label>
            <label>
                Cantidad
                <input type="text" name="quantity" value={formData.quantity} onChange={(e) => handleNumberText(e, setFormData, false)} />
            </label>
            <label>
                Monto ($)
                <input type="text" name="amount" value={formData.amount} onChange={(e) => handleNumberText(e, setFormData, true)} />
            </label> 
            <button type="submit" className="submit-button">Agregar Gasto</button>
        </form>
    </div>
    );
};

export default AddExpense;