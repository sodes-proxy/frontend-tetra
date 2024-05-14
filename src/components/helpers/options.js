
import fetchWithAuth from "../../services/fetchWithAuth";
import { openToast } from "./toast";

const getList = (url, options,  setData, setFormData, key, internalKey, errorMsg, onShow, onClose) => {
    fetchWithAuth(url, options)
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
                if (setFormData !== null){
                  setFormData(prevState => ({
                    ...prevState,
                    [internalKey]: data[key][0]
                  }));
                }
              } else {
                console.error('Invalid data format:', data);
                openToast(false, errorMsg, 2000, onClose, onShow)
              }
          })
          .catch(error => {
            console.error(error, key)
            setData([])
            openToast(false, errorMsg, 2000, onClose, onShow)
          });
}

export { getList };