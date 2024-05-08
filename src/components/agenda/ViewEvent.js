import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
//import './EditEvent.css';


const ViewEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const event = state.event;
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const eventDate =  event.day + ' de '  + meses[event.month - 1 ] + ' del ' + event.year;

    const [eventData, setEventData] = useState({});
    const [viewType, setViewType] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [payments, setPayments] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setViewType(value);
    };

    const getExpenses = () => {
        fetch('http://localhost:8000/finanzas/getGasto', {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({
                'expenses' : {'id_event' : id}
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.expenses && data.expenses.length > 0) {
                setExpenses(data.expenses);
            } else {
                setExpenses([]);
                // Handle empty response: Display a message or perform any other action
                console.log('No expenses found.');
            }
        })
        .catch(error => console.error('Error fetching events:', error));
    }

    const getPayments = () => {
        fetch('http://localhost:8000/finanzas/getAbono', {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({'id_event' : id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.payments && data.payments.length > 0) {
                setPayments(data.payments);
            } else {
                setPayments([]);
                // Handle empty response: Display a message or perform any other action
                console.log('No expenses found.');
            }
        })
        .catch(error => console.error('Error fetching events:', error));
    }

      useEffect(() => {
        if (viewType === 'expenses') getExpenses()
        else if (viewType === 'payments') getPayments()
    }, [viewType]);

    const handleNewPayment = () => {
        navigate(`/agregar-abono/${id}`, { state: { event } });
    };
    

    return (
        <div className="edit-event-container">
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
            <div>
            <table className="future-events-table">
               
            {viewType === 'payment' && (
                
                <React.Fragment>
                     <thead>
                     <tr>
                        <th>Pago de</th>
                        <th>Fecha</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                     </thead>
                     <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan="4">No hay abonos registrados para el evento.</td>
                        </tr>
                    ) : (
                        payments.map(payment => (
                            <tr key={payment.id_event}>
                                <td>{payment.payer}</td>
                                {/* Add other columns as needed */}
                            </tr>
                        ))
                    )}
                <tr className='tr-button'>
                    <td className="td-button">
                    <button className="payment" onClick={() => handleNewPayment()}>Agregar abono</button>
                    </td>
                   
                </tr>
                    
                </tbody>
                </React.Fragment>
                
            )}
                {viewType === 'expenses' && (<div>No hay gastos registrados para este evento</div>)}
                {expenses && (<></>)}
            </table>
            </div>
        </div>
    );
};

export default ViewEvent;