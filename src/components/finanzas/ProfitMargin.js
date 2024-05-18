import React, { useEffect, useState, } from "react";
import { useNavigate } from 'react-router-dom';
import Searcher from "../agenda/Searcher";
import { getList } from "../helpers/options";
import { handleNumberText, handleSubmit, isEmptyObject } from "../helpers/handles";
import { getValueInNumber, extractNumericValue } from "../helpers/numbers";
import './ProfitMargin.css';
import { TrentoModal } from "../helpers/modal";
import { openToast } from "../helpers/toast";


const ProfitMargin = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({});
    const [formattedData, setFormattedData] = useState({'furniture':'$0', 'state':'pendiente', 'salonPrice':'$0'});
    const [showToast, setShowToast] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };
    const [idEvent, setIdEvent] = useState('');
    const [events, setEvents] = useState([]);
    const [marginProfit, setMarginProfit] = useState({'utility':0, 'marginProfit':-1, 'cost':0});


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

    const getMargin = () => {
        return getUtility() /  getSumOfExpenses() * 100;
    }

    const getUtility = () => {
        return getSumPrice(formattedData.price, formattedData.salonPrice) - getSumOfExpenses();
    }

    useEffect(() => {
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
            setMarginProfit(prevState=>({...prevState, 
                ['utility']: getUtility(),
                ['marginProfit']: getSumOfExpenses() === 0 ? -1 : getMargin(),
                ['cost']:getSumOfExpenses()
            }))
        }
    }, [formattedData])

    const handleSetMarginProfit = (e) => {
        if (marginProfit.marginProfit === -1 ){
            openToast(false, 'El margen no puede ser calculado, favor de ingresar gastos', 4000, () => {}, setShowToast)
        }
        else {
            handleSubmit(e, 'http://127.0.0.1:8000/finanzas/guardarEstadosResultados', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...formData,
                    'id_event': idEvent,
                    'salaries': Number.parseFloat(extractNumericValue(formattedData.salaries)),
                    'others': Number.parseFloat(extractNumericValue(formattedData.others)),
                    'furniture': Number.parseFloat(extractNumericValue(formattedData.others)),
                    'salonPrice': Number.parseFloat(extractNumericValue(formattedData.salonPrice)),
                    'utility': marginProfit.utility,
                    'margin': marginProfit.marginProfit,
                    'cost': marginProfit.cost
                })}, formattedData, ['salaries','furniture','others','salonPrice'], onClose, onShow, () => navigate('/margen-resultados'))
        }
       
    }

    const buttons = [{'className':'payment', 'action':(e) => {setIdEvent(e.id_event)}, 'display':'Seleccionar', 'state':['pendiente']}];
    
    const checkPayments = (e) => {
        e.preventDefault();
        if (getSumPayments('payments') < getSumPrice(formattedData.price, formattedData.salonPrice)){
            setModalIsOpen(true)
        }
        else {
            handleSetMarginProfit(e)
        }
    }
    
    return (
        <div className={idEvent === '' ? 'future-events-container' : 'edit-event-container'}>
            <TrentoModal isOpen={modalIsOpen} onOk={() => {handleSetMarginProfit(undefined); setModalIsOpen(false)}} onCancel={()=>setModalIsOpen(false)} 
                title={'Deseas concluir evento?'} question={'Los abonos son menores al precio del evento'} buttonOk={'Concluir'}
                butttonCancel={'Cancelar'}
            />
            {idEvent === '' ? (
                <Searcher onClose={onClose} onShow={onShow} buttons={buttons} events={events} setEvents={setEvents} state={['pendiente']}/>
            ):
            <React.Fragment>
                <p>Margen de resultados</p>
                <form onSubmit={(e) => checkPayments(e)}>
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
                        <p className={getSumPayments('payments') >= getSumPrice(formattedData.price, formattedData.salonPrice) ? 'green-text' : 'red-text'}>{getSumPayments('payments') >= getSumPrice(formattedData.price, formattedData.salonPrice) ? 'Completado' : 'Pendiente'}</p>
                    </span>
                    <span>
                        Coste del Evento ${marginProfit.utility ? marginProfit.cost.toLocaleString(undefined, { maximumFractionDigits: 2 }):null}
                    </span>
                    <span>
                        Utilidad: ${marginProfit.utility ? (marginProfit.utility).toLocaleString(undefined, { maximumFractionDigits: 2 }): null}
                    </span>
                    <span>
                        Margen: {marginProfit.utility ? marginProfit.marginProfit.toLocaleString(undefined, { maximumFractionDigits: 2 }):null}%
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


