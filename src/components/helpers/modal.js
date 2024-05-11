import Modal from 'react-modal';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
};

const DeleteModal = ({ isOpen, onRequestClose, onDelete }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <h2>Confirmar eliminacion</h2>
            <p>Estas seguro de querer eliminar?</p>
            <button onClick={onDelete}>Eliminar</button>
            <button onClick={onRequestClose}>Cancelar</button>
        </Modal>
    );
};

export { DeleteModal };