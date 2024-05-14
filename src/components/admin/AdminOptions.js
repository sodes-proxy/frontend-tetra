import React, { useState, useEffect } from "react";
import { getList } from "../helpers/options";


const AdminOptions = () => {
    const [option, setOption] = useState('');
    const [eventTypeOptions, setEventTypeOptions] = useState([]);
    const [eventLocations, setEventLocations] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        const { value } = e.target;
        setOption(value);
    };

    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    useEffect(() => {
        const errorMsg = 'Hubo un problema al obtener los tipos de eventos';
        getList('http://127.0.0.1:8000/getTiposEvento', {}, setEventTypeOptions, null, 'types', 
        null, errorMsg, onShow, onClose)
      }, []);
    
      // get locations
      useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los lugares';
        getList('http://127.0.0.1:8000/getLugares', {}, setEventLocations, null, 'locations', null, 
        errorMsg, onShow, onClose)
      }, []);

    return (
        <div className="future-events-container">
            <fieldset onChange={handleChange}>
            <legend>Seleccion que quieres modificar</legend>
            <div>
                <input type="radio" id="expenses" name="viewType" value="type" />
                <label htmlFor="expenses">Tipos de Eventos</label>
            </div>
            <div>
                <input type="radio" id="payment" name="viewType" value="location" />
                <label htmlFor="payment">Lugares de Eventos</label>
            </div>
            </fieldset>
            
            <table className="future-events-table">
            <thead>
                    <tr>{['Valor', 'Acciones'].map((header, index) => {
                        return <th key={index}>{header}</th>;
                    })}</tr>
                </thead>
                <tbody>
                {option === 'location' && (
                    eventLocations.map((location, index) => (
                        <tr key={index}>
                            <td>{location}</td>
                            <td><button className="delete">Eliminar</button></td>
                        </tr>
                    ) 
                ))}
                {option === 'type' &&
                    eventTypeOptions.map((type, index) => (
                        <tr key={index}>
                            <td>{type}</td>
                            <td><button className="delete">Eliminar</button></td>
                        </tr>
                    ))}
                {option !== '' && (
                    <tr>
                        <td><button className="payment">Agregar</button></td>
                    </tr>
                )}
                 </tbody>
            </table>
        </div>
    );
}

export { AdminOptions };