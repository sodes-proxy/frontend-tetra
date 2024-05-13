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

const handleFetchResponse  = async (response, onShow, onClose, actionOnSuccess) => {
  if (response.ok) {
    const data = await response.json();
    openToast(true, data.message, 6000, onClose, onShow);
    actionOnSuccess()
  } else {
    const data = await response.json();
    throw { status: response.status, message: response.statusText, data: data };
  }
};

const handleSubmit = (e, url, options, formData, possibleValues, onClose, onShow, actionOnSuccess) => {
  e.preventDefault();
  for (const key in formData) {
    
    const trimmedValue = typeof formData[key] === 'string' ? formData[key].trim() : formData[key];
    if (!trimmedValue) {
      console.log(typeof key)
      console.log(key)
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
  fetchWithAuth(url, options).then(response => handleFetchResponse(response, onShow, onClose, actionOnSuccess)
      .catch(error => {
          openToast(false, error.data.message, 6000, onClose, onShow);
      })
)};

const handleDelete = (url, options, setData, onShow, onClose) => {
  fetchWithAuth(url, options)
    .then(response => handleFetchResponse(response, onShow, onClose, setData)
    .catch(error => {
        openToast(false, error.data.message, 6000, onClose, onShow);
      })
  )
}

export { handleChange, handleNumberText, handleFetchResponse, handleSubmit, handleDelete };

