import React, { useState, useEffect } from 'react';
import { handleChange } from '../helpers/handles';
import { getList } from '../helpers/options';
import { useNavigate, useParams, useLocation } from 'react-router-dom'


const ViewFinanzas = () => {
    const date = new Date();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 4 + i);
    const [formData, setFormData] = useState({
        expense_type: '',
        year: date.getFullYear(),
        month: meses[date.getMonth()]
      });

    const [idExpense, setIdExpense] = useState('');


    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleNewExpense = (expense_type) => {navigate(`/agregar-gasto/${expense_type}`, { state: { } });};

    

    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    const textToShow = {'Inventario':'el', 'Gastos Administrativos': 'los'}

    const getExpenses = () => {
        const errorMsg = `No se encontraron ${textToShow[formData.expense_type]} ${formData.expense_type}`;

            getList('http://localhost:8000/finanzas/getGasto', {
            method: 'OPTIONS',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'filters' : {...formData, 'month': meses.indexOf(formData.month) + 1}})
        }, setExpenses, null, 'expenses', 
        null, errorMsg, onShow, () => onClose) 
    }

    useEffect(() => {
        if (formData.expense_type !== '') getExpenses()
    }, [formData])

    return (
        <div className='future-events-container'>
            <fieldset onChange={(e) => handleChange(e, setFormData)}>
            <legend>Seleccion que quiere ver</legend>
            <div>
                <input type="radio" id="expenses" name="expense_type" value="Inventario" />
                <label htmlFor="expenses">Inventario</label>
            </div>
            <div>
                <input type="radio" id="payment" name="expense_type" value="Gastos Administrativos" />
                <label htmlFor="payment">Gastos Administrativos</label>
            </div>

            </fieldset>
            {meses && (
                <select name="month" value={formData.month} onChange={(e) => handleChange(e, setFormData)}>
                {meses.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
            {years && (
                <select name="year" value={formData.year} onChange={(e) => handleChange(e, setFormData)}>
                {years.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            )}
            {formData.expense_type !== '' ? (
                <table className="future-events-table">
                <thead>
                 <tr>
                    <th>Ticket ID</th>
                    <th>Fecha</th>
                    <th>Categoria</th>
                    <th>Concepto</th>
                    <th>Comprador</th>
                    <th>Cantidad</th>
                    <th>Costo</th>
                    <th>Acciones</th>
                </tr>
                 </thead>
                 <tbody>
                 {expenses.length === 0 ? (
    <tr><td colSpan="4">No hay {formData.expense_type}</td></tr>
            ) : (
                expenses
                    .filter(expense => expense.expense_type === formData.expense_type)
                    .map(expense => (
                        <tr key={expense.id_expense}>
                            <td>{expense.id_expense}</td>          
                            <td>{expense.day}/{expense.month}/{expense.year}</td>
                            <td>{expense.category}</td>
                            <td>{expense.concept}</td>
                            <td>{expense.buyer}</td>
                            <td>{expense.available.toLocaleString()}</td>
                            <td>${expense.amount.toLocaleString()}</td>
                            <td>
                                <button className="delete" onClick={() => setIdExpense(expense.id_expense)}>Eliminar</button>
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
        </table>
            ): null}
            
            
        </div>
        
    );
};

export default ViewFinanzas;