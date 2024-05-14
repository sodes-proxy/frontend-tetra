import React, { useState, useEffect } from "react";
import { getList } from "../helpers/options";
import { DeleteModal } from '../helpers/modal';
import { handleDelete, handleSubmit } from "../helpers/handles";



const AdminOptions = () => {
    const [option, setOption] = useState('');
    const [eventTypeOptions, setEventTypeOptions] = useState([]);
    const [eventLocations, setEventLocations] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [valToDelete, setValToDelete] = useState('');
    const [valToAdd, setValToAdd] = useState('');

    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    const valuesInSpanish = {'type':'tipo', 'location':'lugar'}

    useEffect(() => {
        if (valToDelete !== ''){
            setModalIsOpen(true);
        }
        else{
            setModalIsOpen(false);
        }
    }, [valToDelete])

    const cancelDelete = () => {
        setValToDelete('');
    } 

    const handleDel = () => {
        if (option === 'type'){
            handleDelete('http://127.0.0.1:8000/delTipoEvento', { method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type: valToDelete})}, 
            () => {setEventTypeOptions(eventTypeOptions.filter(eventType => eventType !== valToDelete))}, onShow, onClose)
        }
        else {
            handleDelete('http://127.0.0.1:8000/delLugar', { method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({location: valToDelete})}, 
        () => {setEventLocations(eventLocations.filter(location => location !== valToDelete))}, onShow, onClose)
        }
        setValToDelete('');
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setOption(value);
    };

    const handleNew = (e) => {
        if (option === 'location'){
            handleSubmit(e, 'http://127.0.0.1:8000/addLugar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({location: valToAdd})
            }, {option: valToAdd}, [], 
            onClose, onShow, () => {setValToAdd(''); setEventLocations(prevEventLocations => [...prevEventLocations, valToAdd])})
        }
        else if (option === 'type'){
            handleSubmit(e, 'http://127.0.0.1:8000/addTipoEvento', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type: valToAdd})
            }, {option: valToAdd}, [], 
            onClose, onShow, () => {setValToAdd(''); setEventTypeOptions(prevEventTypeOptions => [...prevEventTypeOptions, valToAdd])})
        }
        
    }    

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
            <DeleteModal isOpen={modalIsOpen} onRequestClose={cancelDelete} onDelete={handleDel}/>
            <fieldset onChange={(e) => {setValToAdd(''); handleChange(e)}}>
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
                            <td><button onClick={()=> {setValToDelete(location)}} className="delete">Eliminar</button></td>
                        </tr>
                    ) 
                ))}
                {option === 'type' &&
                    eventTypeOptions.map((type, index) => (
                        <tr key={index}>
                            <td>{type}</td>
                            <td><button onClick={()=>{setValToDelete(type)}} className="delete">Eliminar</button></td>
                        </tr>
                    ))}
                {option !== '' && (
                    <tr>
                        <td><input value={valToAdd} onChange={(e) => setValToAdd(e.target.value)} placeholder={`Nuevo ${valuesInSpanish[option]} de evento`} style={{width:'80%'}} type="text"/></td>
                        <td><button onClick={(e) => handleNew(e)} className="payment">Agregar</button></td>
                    </tr>
                )}
                 </tbody>
            </table>
        </div>
    );
}

export { AdminOptions };