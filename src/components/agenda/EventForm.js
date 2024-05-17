import React from 'react';

const EventForm = ({ formData, handleChange, eventTypeOptions, eventLocations, handleNumberText, handleSubmit, msgBtn, setFormData }) => {
    return (
        <form onSubmit={handleSubmit}>
        <label>
          Nombre (responsables de pago)
          <input type="text" name="payerName" value={formData.payerName} onChange={(e) => handleChange(e, setFormData)} />
        </label>
        <label>
          Clientes (razón de evento)
          <input type="text" name="clientReason" value={formData.clientReason} onChange={(e) => handleChange(e, setFormData)} />``
        </label>
        <label>
          Tipo de evento
          <select name="eventType" value={formData.eventType} onChange={(e) => handleChange(e, setFormData)}>
            {eventTypeOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Fecha del evento
          <input type="date" name="eventDate" value={formData.eventDate} onChange={(e) => handleChange(e, setFormData)} />
        </label>
        <label>
          Comida para el evento
          <input type="text" name="food" value={formData.food} onChange={(e) => handleChange(e, setFormData)} />
        </label>
        <label>
          Lugar asignado para el evento
          <select name="location" value={formData.location} onChange={(e) => handleChange(e, setFormData)}>
            {eventLocations.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          No. Asistentes
          <input type="number" min={1} name="attendees" value={formData.attendees} onChange={(e) => handleNumberText(e, setFormData, false, false)} placeholder='Número de asistentes'/>
        </label>
        <label>
          Precio del evento
          <input type="text" name="price" value={formData.price} onChange={(e) => handleNumberText(e, setFormData, true, false)} placeholder='Precio $'/>
        </label>
        <label>
          Anticipo del evento
          <input type="text" name="advancePayment" value={formData.advancePayment} onChange={(e) => handleNumberText(e, setFormData, true, true)} placeholder='Anticipo $' />
        </label>
        <button type="submit" className="submit-button">{msgBtn}</button>
      </form>
    );
  };

export { EventForm };
