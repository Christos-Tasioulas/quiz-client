import React from 'react';
import './Modal.css'; // Assume you create a separate CSS file for modal styling

interface ModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button onClick={onConfirm} className="modal-button confirm-button">
                            Yes
                        </button>
                        <button onClick={onCancel} className="modal-button cancel-button">
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
