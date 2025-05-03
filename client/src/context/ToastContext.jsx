import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(undefined);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', delay = 3000) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type, delay }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toasts Container */}
      <div className="fixed top-5 right-1/2 translate-x-1/2 flex flex-col gap-2 z-50">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} remove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, message, type, delay, remove }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      remove(id);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, delay, remove]);

  return (
    <div
      className={`
        px-4 py-2 rounded shadow-md text-white text-sm
        ${type === 'success' ? 'bg-green-500' : ''}
        ${type === 'error' ? 'bg-red-500' : ''}
        ${type === 'info' ? 'bg-blue-500' : ''}
        ${type === 'warning' ? 'bg-yellow-500 text-black' : ''}
        dark:bg-opacity-80
      `}
    >
      {message}
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
