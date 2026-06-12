import React from "react";

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type || "success"}`} role="status">
      <div>
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>
      <button type="button" onClick={onClose} aria-label="Fermer le message">
        x
      </button>
    </div>
  );
};

export default Toast;
