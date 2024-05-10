import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './ViewEvent.css';
import Modal from 'react-modal';
import fetchWithAuth from '../../services/fetchWithAuth';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
};

const DeleteModal = ({ isOpen, onRequestClose, onDelete }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <h2>Confirmar eliminacion</h2>
            <p>Estas seguro de querer eliminar?</p>
            <button onClick={onDelete}>Eliminar</button>
            <button onClick={onRequestClose}>Cancelar</button>
        </Modal>
    );
};

const ViewEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const eventDate =  event.day + ' de '  + meses[event.month - 1 ] + ' del ' + event.year;

    const [eventData, setEventData] = useState({});
    const [idTicket, setIdTicket] = useState('');
    const [viewType, setViewType] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setViewType(value);
    };

    const handleDeletePayment = () => {
        setModalIsOpen(false);
        fetchWithAuth('http://localhost:8000/finanzas/delAbono', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'id_ticket' : idTicket})
        }).then(response => response.json())
        .then(data => {
            setResponseMessage(data.message); // Set the response message
            getPayments()
        })
        .catch(error => console.error('Error fetching events:', error));
    };

    const getExpenses = () => {
        fetchWithAuth('http://localhost:8000/finanzas/getGasto', {
            method: 'OPTIONS',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'expenses' : {'id_event' : id}})
        }).then(response => response.json())
        .then(data => {
            if (data.expenses && data.expenses.length > 0) {
                setExpenses(data.expenses);
            } else {
                setExpenses([]);
                console.log('No expenses found.');
            }
        })
        .catch(error => console.error('Error fetching events:', error));
    }

    const getPayments = () => {
        fetchWithAuth('http://localhost:8000/finanzas/getAbono', {
            method: 'OPTIONS',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'id_event' : id})
        }).then(response => response.json())
        .then(data => {
            if (data.payments && data.payments.length > 0) {
                setPayments(data.payments);
            } else {
                setPayments([]);
                console.log('No payments found.');
            }
        })
        .catch(error => console.error('Error fetching events:', error));
    }

    useEffect(() => {
        if (viewType === 'expenses') getExpenses()
        else if (viewType === 'payment') getPayments()
    }, [viewType]);

    useEffect(() => {if (idTicket !== '')setModalIsOpen(true); },[idTicket]);

    const handleNewPayment = () => {navigate(`/agregar-abono/${id}`, { state: { event } });};
    const handleNewExpense = () => {navigate(`/agregar-gasto/${id}`, { state: { event } });};

    const cancelDelete =  () => {
        setIdTicket('');
        setModalIsOpen(false);
    }

    return (
        <div>
            <DeleteModal isOpen={modalIsOpen} onRequestClose={cancelDelete} onDelete={handleDeletePayment} />
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

export default ViewEvent;