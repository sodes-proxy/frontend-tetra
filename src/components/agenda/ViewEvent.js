import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './ViewEvent.css';
import fetchWithAuth from '../../services/fetchWithAuth';
import { DeleteModal } from '../helpers/modal';
import { handleDelete } from '../helpers/handles';
import { getList } from '../helpers/options';

const ViewEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const [eventData, setEventData] = useState({});
    const [idTicket, setIdTicket] = useState('');
    const [idExpense, setIdExpense] = useState('');
    const [viewType, setViewType] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setViewType(value);
    };

    const handleDel = () => {
        setModalIsOpen(false)
        if (idTicket !== ''){
            handleDelete('http://localhost:8000/finanzas/delAbono', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'id_ticket' : idTicket})
        }, () => setPayments(payments.filter(payment => payment.id_ticket !== idTicket)), onShow, onClose)
        }
        else{
            handleDelete('http://localhost:8000/finanzas/modifyGasto', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'id_expense' : idExpense, 'id_event': id, 'portion' : 0.0})
        }, () => setPayments(payments.filter(payment => payment.id_ticket !== idTicket)), onShow, onClose)
        }
        
    };

    const getExpenses = () => {
        const errorMsg = 'Hubo un problema al obtener los gastos del evento';
        getList('http://localhost:8000/finanzas/getGasto', {
            method: 'OPTIONS',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'expenses' : {'id_event' : id}})
        }, setExpenses, null, 'expenses', 
        null, errorMsg, onShow, onClose)
    }

    const getPayments = () => {
        const errorMsg = 'Hubo un problema al obtener los abonos del evento';
        getList('http://localhost:8000/finanzas/getAbono', {
            method: 'OPTIONS',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'id_event' : id})
        }, setPayments, null, 'payments', 
        null, errorMsg, onShow, onClose)
    }

    useEffect(() => {
        if (viewType === 'expenses') getExpenses()
        else if (viewType === 'payment') getPayments()
    }, [viewType]);

    useEffect(() => {if (idExpense !== '')setModalIsOpen(true); },[idExpense]);
    useEffect(() => {if (idTicket !== '')setModalIsOpen(true); },[idTicket]);

    const handleNewPayment = () => {navigate(`/agregar-abono/${id}`, { state: { event } });};
    const handleNewExpense = () => {navigate(`/agregar-gasto/${id}`, { state: { event } });};

    const cancelDelete =  (set) => {
        if (idTicket !== ''){
            setIdTicket('')
        }
        else {
            setIdTicket('')
        }
        setModalIsOpen(false);
    }

    

    return (
        <div>
            <DeleteModal isOpen={modalIsOpen} onRequestClose={cancelDelete} onDelete={handleDel} />
            <div className="view-event-container">
            <fieldset onChange={handleChange}>
            <legend>Seleccion que quiere ver</legend>
            <div>
                <input type="radio" id="expenses" name="viewType" value="expenses" />
                <label htmlFor="expenses">Gastos</label>
            </div>
            <div>
                <input type="radio" id="payment" name="viewType" value="payment" />
                <label htmlFor="payment">Abonos</label>
            </div>
            <div>
                <input type="radio" id="event" name="viewType" value="event" />
                <label htmlFor="event">Datos</label>
            </div>
            </fieldset>
            <div className='table-wrapper'>
            <table className="future-events-table">
            {viewType === 'payment' && (
                <React.Fragment>
                     <thead>
                     <tr>
                        <th>Ticket ID</th>
                        <th>Pago de</th>
                        <th>Fecha</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                     </thead>
                     <tbody>
                    {payments.length === 0 ? (
                        <tr><td colSpan="4">No hay abonos registrados para el evento.</td></tr>
                    ) : (
                        payments.map(payment => (
                            <tr key={payment.id_ticket}>
                                <td>{payment.id_ticket}</td>
                                <td>{payment.payer}</td>
                                <td>{payment.day}/{payment.month}/{payment.year}</td>
                                <td>${payment.quantity.toLocaleString()}</td>
                                <td><button onClick={() => setIdTicket(payment.id_ticket)} className='delete'>Eliminar</button></td>
                            </tr>
                        ))
                    )}
                <tr >
                    <td >
                    <button className="payment" onClick={() => handleNewPayment()}>Agregar abono</button>
                    </td>   
                </tr>       
                </tbody>
                </React.Fragment>
            )}
                {viewType === 'expenses' && (<React.Fragment>
                     <thead>
                     <tr>
                        <th>Ticket ID</th>
                        <th>Fecha</th>
                        <th>Categoria</th>
                        <th>Concepto</th>
                        <th>Comprador</th>
                        <th>Cantidad</th>
                        <th>Costo</th>
                        <th>Accione</th>
                    </tr>
                     </thead>
                     <tbody>
                    {expenses.length === 0 ? (
                        <tr><td colSpan="4">No hay abonos registrados para el evento.</td></tr>
                    ) : (
                        expenses.map(expenses => (
                            <tr key={expenses.id_expense}>
                                <td>{expenses.id_expense}</td>          
                                <td>{expenses.day}/{expenses.month}/{expenses.year}</td>
                                <td>{expenses.category}</td>
                                <td>{expenses.concept}</td>
                                <td>{expenses.buyer}</td>
                                <td>{expenses.portion.toLocaleString()}</td>
                                <td>${expenses.amount.toLocaleString()}</td>
                                <td >
                                <button className="delete" onClick={() => setIdExpense(expenses.id_expense)}>Eliminar</button>
                                </td> 
                            </tr>
                        ))
                    )}
                <tr >
                    <td >
                    <button className="payment" onClick={() => handleNewExpense()}>Agregar gasto</button>
                    </td>   
                </tr>       
                </tbody>
                </React.Fragment>)}
            </table>
            </div>
        </div>
        </div>
        
    );
};

export default ViewEvent;