import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, setToasts }) {
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { type, title, message, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="toast-success-icon" style={{ color: 'var(--status-offer-text)' }} />;
      case 'error':
        return <XCircle size={18} className="toast-error-icon" style={{ color: 'var(--status-rejected-text)' }} />;
      case 'info':
      default:
        return <Info size={18} className="toast-info-icon" style={{ color: 'var(--status-applied-text)' }} />;
    }
  };

  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'info':
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast ${getToastClass()}`} role="alert">
      {getIcon()}
      <div className="toast-content">
        {title && <span className="toast-title">{title}</span>}
        <span className="toast-message">{message}</span>
      </div>
      <button onClick={onClose} className="toast-close" aria-label="Close Notification">
        <X size={14} />
      </button>
    </div>
  );
}
