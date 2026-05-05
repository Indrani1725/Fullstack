import React, { useEffect } from 'react';

/**
 * Toast – temporary notification banner
 * @param {Array}    toasts   - [{id, type, message}]
 * @param {function} onRemove - callback(id) to dismiss a toast
 */
function Toast({ toasts, onRemove }) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onRemove(toasts[0].id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts, onRemove]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✅' : '❌'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default Toast;
