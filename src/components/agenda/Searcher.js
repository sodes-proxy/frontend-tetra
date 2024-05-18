import React, { useEffect, useState } from "react";
import { handleChange } from "../helpers/handles";
import { getList } from "../helpers/options";
import { openToast } from "../helpers/toast";

const Searcher = ({onShow, onClose, buttons, events, setEvents, state}) => {
    const date = new Date ();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 4 + i);
    const [formData, setFormData] = useState({
        location: '',
        year: date.getFullYear(),
        month: meses[date.getMonth()],
        state: state
      });
    const [eventLocations, setEventLocations] = useState([]);
    
    
    const [isChecked, setIsChecked] = useState(false);
      const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };

    useEffect(() => {
        if (isChecked) getEvents({'month':meses.indexOf(formData.month) + 1, 'year':Number.parseInt(formData.year), 'location':formData.location, 'state':formData.state})
        else getEvents({'month':meses.indexOf(formData.month) + 1, 'year':Number.parseInt(formData.year), 'state':formData.state})
    }, [isChecked, formData]);

    useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los lugares';
        getList('http://127.0.0.1:8000/getLugares', {}, setEventLocations, setFormData, 'locations', 'location', 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }, []);

    const getEvents = (data) => {
        const errorMsg = 'No se encontraron eventos';
        getList('http://localhost:8000/agenda/getEvento', { method: 'OPTIONS',
        headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}, setEvents, null, 'events', null, 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }

    return (
        <React.Fragment>
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
                Filtrar por: 
             <input type="checkbox" value="None" name="locCheck" onChange={handleCheckboxChange}/> Ubicación
             {isChecked && (
                <select name="location" value={formData.location} onChange={(e) => handleChange(e, setFormData)}>
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
                                {buttons.map(button => (
                                    <button className={button.className} onClick={() => button.action(event)}>{button.display}</button>
                                ))}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default Searcher;