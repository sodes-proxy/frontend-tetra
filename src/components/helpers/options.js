
import fetchWithAuth from "../../services/fetchWithAuth";
const getOptions = (url, setData, setFormData, key, internalKey, showAlert) => {
    fetchWithAuth(url, {'headers': {}})
          .then(async response => {
            if (response.ok) {
              return response.json();
          } else {
              const data = await response.json();
              throw { status: response.status, message: response.statusText, data: data };
          }
          })
            .then(data => {
              if (data && data[key] && Array.isArray(data[key])) {
                // Extract the types array from the response data and set state
                setData(data[key]);
                setFormData(prevState => ({
                  ...prevState,
                  [internalKey]: data[key][0]
                }));
              } else {
                console.error('Invalid data format:', data);
                showAlert()
                //openToast(false, errorMsg, 2000, () => setShowToast(false), () => setShowToast(true) )
              }
          })
          .catch(error => {
            showAlert()
            //openToast(false, errorMsg, 2000, () => setShowToast(false), () => setShowToast(true) )
          });
}

export { getOptions };