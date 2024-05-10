import { toast } from "react-toastify";
const openToast = (isGood, message, autoClose, actionOnClose, setToast) => {
    //setShowToast(true); // Activar la visualización del toast
    setToast()
    if(isGood){
      toast.success(message, {
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
      toast.error(message, {
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