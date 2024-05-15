import React, { useState} from "react";
import Searcher from "../agenda/Searcher";

const ProfitMargin = () => {
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');
    const [events, setEvents] = useState([]);

    const buttons = [{'className':'payment', 'action':(e) => {setIdEvent(e.id_event)}, 'display':'Seleccionar'}];
    return (
        <div className='future-events-container'>
            {idEvent === '' ? (
                <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} />
            ):
            <React.Fragment>
                <p>Margen de resultados</p>
            </React.Fragment>}
        </div>
        
    );
}

export default ProfitMargin;


