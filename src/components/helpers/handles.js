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

const handleNumberText = (e, setFormData, isDollarSign, canBeZero) => {
  setFormData(prevState => ({
      ...prevState,
      [e.target.name]: getValueInNumber(e.target.value, isDollarSign, canBeZero)
  }));
};

const handleFetchResponse  = async (response, onShow, onClose, actionOnSuccess) => {
  if (response.ok) {
    const data = await response.json();
    openToast(true, data.message, 6000, onClose, onShow);
    actionOnSuccess()
  } else {
    const data = await response.json();
    throw { status: response.status, data: data };
  }
};

const handleSubmit = (e, url, options, formData, possibleValues, onClose, onShow, actionOnSuccess) => {
  if (e ){
    e.preventDefault();
  }
  for (const key in formData) {
    
    const trimmedValue = typeof formData[key] === 'string' ? formData[key].trim() : formData[key];
    if (!trimmedValue) {
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

const handleResponseWithNumbers = (string) => {
  const formattedString = string.replace(/\b\d+(\.\d+)?\b/g, function(match) {
    return parseFloat(match).toLocaleString(undefined, { maximumFractionDigits: 2 });
});
return formattedString;
}

const handleFileResponse = async (url, options, filename) => {
  try {
    const response = await fetchWithAuth(url, options)

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a URL for the Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;

      // Append the anchor to the body
      document.body.appendChild(link);

      // Programmatically click the anchor to trigger the download
      link.click();

      // Remove the anchor from the body
      document.body.removeChild(link);

      // Revoke the Blob URL to free up resources
      window.URL.revokeObjectURL(blobUrl);

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('There was an error downloading the file:', error);
    }
  };

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export { handleChange, handleNumberText, handleFetchResponse, handleSubmit, handleDelete, handleResponseWithNumbers, isEmptyObject, handleFileResponse };

