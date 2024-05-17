import React, { useEffect, useState} from "react";
import Searcher from "../agenda/Searcher";
import { getList } from "../helpers/options";
import { handleNumberText, isEmptyObject } from "../helpers/handles";
import { getValueInNumber, extractNumericValue } from "../helpers/numbers";


const ProfitMargin = () => {
    const [formData, setFormData] = useState({});
    const [formattedData, setFormattedData] = useState({});
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
        })}, setMarginProfit, setFormData, 'expenses', 'margin', `No se encontro los datos de abonos y gastos del evento ${idEvent}`, onShow, onClose)
    }

    useEffect(() => {
        if (idEvent !== ''){
            getCount();
        }
    },[idEvent])

    const getSumPrice = (price, salonPrice) => {
        let suma = 0;
        console.log()
        if (salonPrice !== '$'){
            suma += Number.parseFloat(extractNumericValue(salonPrice));
        }
        if (price !== '$'){
            
            suma += Number.parseFloat(extractNumericValue(price));
        }
        return suma;
    }

    const getSumAbonos = (key) => {
        let suma = 0;
        for (let i = 0; i < formData[key].length; i++) {
            if (formattedData[key+i.toString()] !== '$'){
                suma += Number.parseFloat(extractNumericValue(formattedData[key+i.toString()]));
            }
            
        }
        return suma;
    }

    const getMargin = (price, salonPrice) => {
        return getSumAbonos('abonos') / getSumPrice(price, salonPrice) * 100;
    }

    useEffect(() => {
        formattedData['precio_salon'] = '0'
        if (!isEmptyObject(formData)){
            for (const key in formData) {
                //console.log(getValueInNumber(formData[key], true))
                if (Array.isArray(formData[key])){
                    for (let i = 0; i < formData[key].length; i++) {
                        setFormattedData(prevState => 
                            ({...prevState, [key+i.toString()]:getValueInNumber(formData[key][i].toString(), true, true)}))
                    }
                }
                else{

                }
                setFormattedData(prevState => ({...prevState, [key]:getValueInNumber(formData[key].toString(), true, true)}))
            }
        }
    }, [formData])

    const buttons = [{'className':'payment', 'action':(e) => {setIdEvent(e.id_event)}, 'display':'Seleccionar'}];
    return (
        <div className={idEvent === '' ? 'future-events-container' : 'edit-event-container'}>
            {idEvent === '' ? (
                <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} />
            ):
            <React.Fragment>
                <p>Margen de resultados</p>
                <form onSubmit={(e)=>{e.preventDefault();}}>
                <label>
                    Alimentos
                    <input type="text" name='Alimentos' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.Alimentos}/>
                </label>
                <label>
                    Bebidas
                    <input type="text" name='Bebidas' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.Bebidas}/>
                </label>
                <label>
                    Salarios
                    <input type="text" name='Salarios' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.Salarios}/>
                </label>

                <label>
                    Otros
                    <input type="text" name='Otros' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.Otros}/>
                </label>
                <label>
                    Precio del Evento
                    <input type="text" name='precio' onChange={(e) => handleNumberText(e, setFormattedData, true, true)} value={formattedData.precio}/>
                </label>
                <label>
                    Precio del Salon
                    <input type="text" name='precio_salon' onChange={(e) => handleNumberText(e, setFormattedData, true, true)} value={formattedData.precio_salon}/>
                </label>
                {formData.abonos && Array.isArray(formData.abonos) && formData.abonos.map((abono, index) => (
                    <label key={index}>
                        {index == 0 ? 'Anticipo': 'Pago ' + index.toString() }
                        <input type="text" name={'abonos' + index.toString()} value={formattedData['abonos' + index.toString()]} onChange={(e)=>{handleNumberText(e, setFormattedData, true, true)}} />
                    </label>
                ))}
                
                {formData.abonos && 'abonos'+(formData.abonos.length-1).toString() in formattedData && (
                    <React.Fragment>
                    <span>
                        Estado del Pago {getMargin(formattedData.precio, formattedData.precio_salon) >= 100.0? 'Completado' :'Pendiente'}
                    </span>
                    <span>
                        Costo del Evento ${getSumPrice(formattedData.precio, formattedData.precio_salon).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span>
                        Saldo ${getSumAbonos('abonos').toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span>
                        Margen: {getMargin(formattedData.precio, formattedData.precio_salon).toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                    </span>
                    </React.Fragment>
                )}
                
                <button type="submit" className="submit-button">Concluir evento</button>
                </form>
                

            </React.Fragment>}
        </div>
        
    );
}

export default ProfitMargin;


