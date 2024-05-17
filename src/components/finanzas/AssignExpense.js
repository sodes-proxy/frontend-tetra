import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { handleChange, handleNumberText, handleSubmit, isEmptyObject } from "../helpers/handles";
import { getList } from '../helpers/options';
import { openToast } from '../helpers/toast';
import { extractNumericValue } from "../helpers/numbers";

const AssignExpense = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const expense = state.expense;

    const date = new Date();
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 4 + i);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    
    const [eventLocations, setEventLocations] = useState([]);
    const [selected, setSelected] = useState({});
    const [events, setEvents] = useState([]);
    const [formQuery, setFormQuery] = useState({
        location: '',
        year: date.getFullYear(),
        month: meses[date.getMonth()]
      });

    const [formData, setFormData] = useState({
        id_event: '',
        id_expense: expense.id_expense,
        portion: 0
    });

      const [showToast, setShowToast] = useState(false);
      const onShow =  () => { setShowToast(true) };
      const onClose =  () => { setShowToast(false) };
      const [idEvent, setIdEvent] = useState('');

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const getEvents = (data) => {
        const errorMsg = 'No se encontraron eventos';
        getList('http://localhost:8000/agenda/getEvento', { method: 'OPTIONS',
        headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}, setEvents, null, 'events', null, 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }
      
    useEffect(() => {
        if (isChecked) getEvents({'month':meses.indexOf(formQuery.month) + 1, 'year':Number.parseInt(formQuery.year), 'location':formQuery.location})
        else getEvents({'month':meses.indexOf(formQuery.month) + 1, 'year':Number.parseInt(formQuery.year)})
    }, [isChecked, formQuery]);

    useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los lugares';
        getList('http://127.0.0.1:8000/getLugares', {}, setEventLocations, setFormQuery, 'locations', 'location', 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }, []);

    
   
    const handleAssign = (e) => {
        handleSubmit(e, 'http://127.0.0.1:8000/finanzas/modifyGasto', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'portion': Number.parseFloat(extractNumericValue((formData.portion))),
                'id_expense': formData.id_expense,
                'id_event': formData.id_event
            })
        }, formData, ['portion'], onClose, onShow, () => {navigate('/finanzas')})
    }

    const isExpensePresent = (event, id_expense) => {
        for (const expense of event.expenses) {
            if (expense.id_expense === id_expense) {
                return expense.portion; // Found the expense
            }
        }
        return 0; // Expense not found
    };
    
    return(

    <div className={isEmptyObject(selected) ? "future-events-container": 'edit-event-container'}>
        {isEmptyObject(selected) ? (
            <React.Fragment>
                    {meses && (
                <select name="month" value={formQuery.month} onChange={(e) => handleChange(e, setFormQuery)}>
                {meses.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
            {years && (
                <select name="year" value={formQuery.year} onChange={(e) => handleChange(e, setFormQuery)}>
                {years.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
                Filtrar por: 
            <input type="checkbox" value="None" name="locCheck" onChange={handleCheckboxChange}/> Ubicación
            {isChecked && (
                <select name="location" value={formQuery.location} onChange={(e) => handleChange(e, setFormQuery)}>
                    {eventLocations.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            )}
            <table className="future-events-table">
                <thead>
                    <tr>{['Nombre', 'Fecha', 'Ubicación', 'Acciones'].map((header, index) => {
                        return <th key={index}>{header}</th>;
                    })}</tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr><td colSpan="4">No hay eventos disponibles.</td></tr>
                    ) : (
                        events.map(event => (
                            <tr key={event.id_event}>
                                {[event.name, `${event.day}/${event.month}/${event.year}`, event.location].map((value, index) => {
                                    return <td key={index}>{value}</td>;
                                })}
                                <td>
                                <button className="payment" onClick={() => {setFormData(prevState => ({...prevState,
                                ['id_event']: event.id_event})); setSelected(event)}}>Seleccionar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            </React.Fragment>
        ):
            <React.Fragment>
                <p>El evento seleccionado es: {selected.id_event}</p>
                <p>La fecha es {selected.day}/{selected.month}/{selected.year}</p>
                <p>Cantidad disponible: {expense.available.toLocaleString()}</p>
                <p>Cantidad asignada: {isExpensePresent(selected, expense.id_expense).toLocaleString()}</p>
                <form onSubmit={handleAssign}>
                    <label>
                        Cantidad a asignar
                        <input type="text" name="portion" value={formData.portion} onChange={(e) => handleNumberText(e, setFormData, false, true)}/>
                    </label>
                    <button type="submit" className="submit-button">Asignar Gasto</button>
                </form>
            </React.Fragment>
        }

        </div>
    )
}

export default AssignExpense;