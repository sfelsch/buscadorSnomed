import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/modalStyles.css'; // Asegúrate de tener un archivo CSS para los estilos del modal

const Modal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export default Modal;