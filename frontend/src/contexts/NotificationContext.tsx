import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Convenience methods
  showSuccess: (title: string, message?: string, options?: Partial<Notification>) => string;
  showError: (title: string, message?: string, options?: Partial<Notification>) => string;
  showWarning: (title: string, message?: string, options?: Partial<Notification>) => string;
  showInfo: (title: string, message?: string, options?: Partial<Notification>) => string;
}

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Initial state
const initialState: NotificationState = {
  notifications: [],
};

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// NotificationProvider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    state.notifications.forEach(notification => {
      if (!notification.persistent && notification.duration !== 0) {
        const duration = notification.duration || 5000; // Default 5 seconds
        
        if (!timers[notification.id]) {
          timers[notification.id] = setTimeout(() => {
            dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
            delete timers[notification.id];
          }, duration);
        }
      }
    });

    // Cleanup timers
    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [state.notifications]);

  // Add notification function
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): string => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
      duration: notification.duration ?? 5000,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    return id;
  };

  // Remove notification function
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  // Clear all notifications function
  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  // Convenience methods
  const showSuccess = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  };

  const showError = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Longer duration for errors
      ...options,
    });
  };

  const showWarning = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options,
    });
  };

  const showInfo = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  };

  const value: NotificationContextType = {
    ...state,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Notification Container Component
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// Individual Notification Item Component
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const getNotificationStyles = (type: NotificationType) => {
    const baseStyles = "p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-mint-green/90 border-mint-green text-green-800 border-green-200`;
      case 'error':
        return `${baseStyles} bg-red-100/90 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-sunshine-yellow/90 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-butterfly-blue/90 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-white/90 border-gray-200 text-gray-800`;
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '🌸';
      case 'error':
        return '🥀';
      case 'warning':
        return '🌻';
      case 'info':
        return '🦋';
      default:
        return '🌺';
    }
  };

  return (
    <div className={getNotificationStyles(notification.type)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-xl" role="img" aria-label={notification.type}>
            {getIcon(notification.type)}
          </span>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            {notification.message && (
              <p className="text-xs mt-1 opacity-90">{notification.message}</p>
            )}
            {notification.action && (
              <button
                className="text-xs underline mt-2 hover:no-underline transition-all duration-200"
                onClick={notification.action.onClick}
              >
                {notification.action.label}
              </button>
            )}
          </div>
        </div>
        
        {!notification.persistent && (
          <button
            className="ml-3 text-sm opacity-60 hover:opacity-100 transition-opacity duration-200"
            onClick={() => onRemove(notification.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// Custom hook to use notification context
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 