import React from 'react';
import './Toast.css';

const Toast = ({ message, show, onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <span className="toast-icon">✓</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
