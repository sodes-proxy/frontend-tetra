import { toast } from "react-toastify";
import { handleResponseWithNumbers} from './handles'

const openToast = (isGood, message, autoClose, actionOnClose, setToast) => {
    //setShowToast(true); // Activar la visualización del toast
    const formattedResponse = handleResponseWithNumbers(message);
    setToast()
    if(isGood){
      toast.success(formattedResponse, {
        position: "top-center",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => actionOnClose()
    });
    }
    else{
      toast.error(formattedResponse, {
        position: "top-center",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => actionOnClose()
    });
    }
}

export { openToast };