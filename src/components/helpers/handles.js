import fetchWithAuth from "../../services/fetchWithAuth";
import { getValueInNumber, extractNumericValue } from "./numbers";
import { openToast } from "./toast";

const handleChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNumberText = (e, setFormData, isDollarSign) => {
    setFormData(prevState => ({
        ...prevState,
        [e.target.name]: getValueInNumber(e.target.value, isDollarSign)
    }));
};

const handleFetchResponse  = async (response, onShow, onClose) => {
  if (response.ok) {
    const data = await response.json();
    openToast(true, data.message, 6000, onClose, onShow);
  } else {
    const data = await response.json();
    throw { status: response.status, message: response.statusText, data: data };
  }
};

const handleSubmitEvent = (e, url, formData, onClose, onShow, isEdit) => {
  e.preventDefault();
  const possibleValues = ['price', 'advancePayment'];
  for (const key in formData) {
    
    const trimmedValue = typeof formData[key] === 'string' ? formData[key].trim() : formData[key];
    if (!trimmedValue) {
      console.log(typeof key)
        openToast(false, 'Favor de llena todos los campos', 4000, onClose, onShow)
        //alert('Por favor llena todos los campos'); // You can replace this with your preferred way of displaying errors
        return;
    }
    else if (possibleValues.includes(key)){    
      var value = extractNumericValue(formData[key]);
      if (value === ''){
          openToast(false, 'Favor de llena todos los campos', 4000, onClose, onShow)
          return;
      }
  }
}
  fetchWithAuth(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: formData.payerName,
        type: formData.eventType,
        day: Number.parseInt(formData.eventDate.split('-')[2]),
        month: Number.parseInt(formData.eventDate.split('-')[1]),
        year: Number.parseInt(formData.eventDate.split('-')[0]),
        location: formData.location,
        num_of_people: Number.parseInt(formData.attendees),
        cost: Number.parseFloat(extractNumericValue((formData.price))),
        upfront: Number.parseFloat(extractNumericValue((formData.advancePayment))),
        ...(isEdit ? {'id_event':formData.id_event} : {})
    })
    }).then(response => handleFetchResponse(response, onShow, onClose)
      .catch(error => {
          openToast(false, error.data.message, 6000, onClose, onShow);
      })
)};

export { handleChange, handleNumberText, handleFetchResponse, handleSubmitEvent };