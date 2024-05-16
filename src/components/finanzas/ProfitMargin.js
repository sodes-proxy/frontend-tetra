import React, { useEffect, useState} from "react";
import Searcher from "../agenda/Searcher";
import { getList } from "../helpers/options";


const ProfitMargin = () => {
    const [formData, setFormData] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');
    const [events, setEvents] = useState([]);
    const [marginProfit, setMarginProfit] = useState({});

    //onst 

    const getCount = () => {
        getList('http://127.0.0.1:8000/finanzas/getGasto', {
            method: 'OPTIONS',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'id_event': idEvent
            })}, setMarginProfit, null, 'expenses', null, `No se encontro los datos de abonos y gastos del evento ${idEvent}`, onShow, onClose)
    }

    useEffect(() => {
        if (idEvent !== ''){
            getCount();
        }
    },[idEvent])

    const buttons = [{'className':'payment', 'action':(e) => {setIdEvent(e.id_event)}, 'display':'Seleccionar'}];
    return (
        <div className='future-events-container'>
            {idEvent === '' ? (
                <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} />
            ):
            <React.Fragment>
                <p>Margen de resultados {idEvent}</p>
                <p>Alimentos: ${marginProfit.Alimentos.toLocaleString()}</p>
            </React.Fragment>}
        </div>
        
    );
}

export default ProfitMargin;


