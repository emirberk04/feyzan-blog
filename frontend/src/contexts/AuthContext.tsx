import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'author' | 'subscriber';
  profilePicture?: string;
  bio?: string;
  favoriteFlowers?: string[];
  favoriteInsects?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    website?: string;
  };
  preferences?: {
    newsletter: boolean;
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: User }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  bio?: string;
  favoriteFlowers?: string[];
  favoriteInsects?: string[];
}

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (state.token && !state.user) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await axios.get('/auth/me');
          
          if (response.data.success) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.data.user,
                token: state.token,
              },
            });
          } else {
            dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to load user' });
          }
        } catch (error: any) {
          dispatch({
            type: 'AUTH_FAILURE',
            payload: error.response?.data?.message || 'Failed to load user',
          });
        }
      }
    };

    loadUser();
  }, [state.token, state.user]);

  // Login function
  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await axios.post('/auth/login', {
        identifier,
        password,
      });

      if (response.data.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.data.user,
            token: response.data.data.token,
          },
        });
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Login failed',
      });
      return false;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await axios.post('/auth/register', userData);

      if (response.data.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.data.user,
            token: response.data.data.token,
          },
        });
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Registration failed',
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await axios.put('/auth/profile', userData);

      if (response.data.success) {
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: response.data.data.user,
        });
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Profile update failed',
      });
      return false;
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Password change failed',
      });
      return false;
    }
  };

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 