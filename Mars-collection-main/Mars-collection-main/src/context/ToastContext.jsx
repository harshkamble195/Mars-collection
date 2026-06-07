import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-md w-full sm:w-96">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start justify-between p-4 bg-white dark:bg-luxury-charcoal border-l-4 shadow-xl border-gray-200 dark:border-luxury-border animate-slide-up transition-all duration-300 rounded-sm ${
              toast.type === 'success' ? 'border-l-gold' : 
              toast.type === 'error' ? 'border-l-red-500' : 
              toast.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-400'
            }`}
          >
            <div className="flex gap-3 text-sm font-medium">
              {toast.type === 'success' && <CheckCircle size={18} className="text-gold mt-0.5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />}
              {toast.type === 'info' && <Info size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />}
              <span className="text-luxury-charcoal dark:text-gray-200">{toast.message}</span>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-luxury-charcoal dark:hover:text-white transition-colors duration-150 flex-shrink-0 ml-4"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
