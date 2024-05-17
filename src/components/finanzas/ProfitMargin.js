import React, { useEffect, useState} from "react";
import Searcher from "../agenda/Searcher";
import { getList } from "../helpers/options";
import { handleNumberText, isEmptyObject } from "../helpers/handles";
import { getValueInNumber, extractNumericValue } from "../helpers/numbers";
import './ProfitMargin.css';

const ProfitMargin = () => {
    const [formData, setFormData] = useState({});
    const [formattedData, setFormattedData] = useState({'state':'Pendiente', 'furniture':'$0'});
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');
    const [events, setEvents] = useState([]);
    const [marginProfit, setMarginProfit] = useState({'utility':0});


    const getCount = () => {
        getList('http://127.0.0.1:8000/finanzas/getGasto', {
        method: 'OPTIONS',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id_event': idEvent
        })}, setMarginProfit, setFormData, 'expenses', 'margin', `No se encontro los datos de payments y gastos del evento ${idEvent}`, onShow, onClose)
    }

    useEffect(() => {
        if (idEvent !== '') getCount();
    },[idEvent])

    const getSumPrice = (price, salonPrice) => {
        let suma = 0;
        if (salonPrice !== '$') suma += Number.parseFloat(extractNumericValue(salonPrice));
        if (price !== '$') suma += Number.parseFloat(extractNumericValue(price));
        return suma;
    }

    const getSumOfExpenses = () => {
        const keys = ['food', 'beverages', 'salaries', 'furniture', 'others'];
        let suma = 0;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] in formattedData && formattedData[keys[i]] !== '$') suma += Number.parseFloat(extractNumericValue(formattedData[keys[i]]))
        }
        return suma;
    }

    const getSumPayments = (key) => {
        let suma = 0;
        for (let i = 0; i < formData[key].length; i++) {
            if (formattedData[key+i.toString()] !== '$') suma += Number.parseFloat(extractNumericValue(formattedData[key+i.toString()]));    
        }
        return suma;
    }

    const getMargin = (price) => {
        return getSumPayments('payments') / Number.parseFloat(extractNumericValue(price)) * 100;
    }

    useEffect(() => {
        formattedData['salonPrice'] = '0'
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
                    setFormattedData(prevState => ({...prevState, [key]:getValueInNumber(formData[key].toString(), true, true)}))
                }
                
            }
        }
    }, [formData])

    useEffect (() => {
        if (formData.payments && 'payments'+(formData.payments.length-1).toString() in formattedData){
            setFormattedData(prevState => ({...prevState, ['margin']:getMargin(formattedData.price)}))
            setMarginProfit(prevState=>({...prevState, ['utility']: Number.parseFloat(extractNumericValue(formattedData['price'])) - getSumOfExpenses()}))
        }
    }, [formattedData])

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
                    <input type="text" name='food' disabled value={formattedData.food}/>
                </label>
                <label>
                    Bebidas
                    <input type="text" name='beverages' disabled value={formattedData.beverages}/>
                </label>
                <label>
                    Salarios
                    <input type="text" name='salaries' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.salaries}/>
                </label>
                <label>
                    Inmobiliario
                    <input type="text" name='furniture' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.furniture}/>
                </label>
                <label>
                    Otros
                    <input type="text" name='others' onChange={(e) => handleNumberText(e, setFormattedData, true,true)} value={formattedData.others}/>
                </label>
                <label>
                    Precio del Evento
                    <input type="text" name='price' disabled value={formattedData.price}/>
                </label>
                <label>
                    Precio del Salon
                    <input type="text" name='salonPrice' onChange={(e) => handleNumberText(e, setFormattedData, true, true)} value={formattedData.salonPrice}/>
                </label>
                {formData.payments && Array.isArray(formData.payments) && formData.payments.map((abono, index) => (
                    <label key={index}>
                        {index == 0 ? 'Anticipo': 'Pago ' + index.toString() }
                        <input type="text" name={'payments' + index.toString()} disabled value={formattedData['payments' + index.toString()]} />
                    </label>
                ))}
                {formData.payments && 'payments'+(formData.payments.length-1).toString() in formattedData && (
                    <React.Fragment>
                    <span>
                        Estado del Pago 
                        <p className={formattedData['margin'] >= 100.0 ? 'green-text' : 'red-text'}>{formattedData['margin'] >= 100.0 ? 'Completado' : 'Pendiente'}</p>
                    </span>
                    <span>
                        Coste del Evento ${getSumOfExpenses().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span>
                        Utilidad: ${marginProfit.utility ? (marginProfit.utility).toLocaleString(undefined, { maximumFractionDigits: 2 }): null}
                    </span>
                    <span>
                        Margen: {marginProfit.utility ? formattedData['margin'].toLocaleString(undefined, { maximumFractionDigits: 2 }):null}%
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


