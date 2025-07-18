import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
type Theme = 'light' | 'dark' | 'auto';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  reducedMotion: boolean;
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_FONT_SIZE'; payload: 'small' | 'medium' | 'large' }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'UPDATE_SYSTEM_PREFERENCE'; payload: boolean };

interface ThemeContextType extends ThemeState {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleAnimations: () => void;
  setReducedMotion: (reduced: boolean) => void;
}

// Get system preference
const getSystemPreference = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Get reduced motion preference
const getReducedMotionPreference = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Get saved preferences
const getSavedTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('floral-blog-theme');
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved as Theme;
    }
  }
  return 'auto';
};

const getSavedFontSize = (): 'small' | 'medium' | 'large' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('floral-blog-font-size');
    if (saved && ['small', 'medium', 'large'].includes(saved)) {
      return saved as 'small' | 'medium' | 'large';
    }
  }
  return 'medium';
};

const getSavedAnimations = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('floral-blog-animations');
    return saved !== 'false';
  }
  return true;
};

// Initial state
const initialState: ThemeState = {
  theme: getSavedTheme(),
  isDark: getSavedTheme() === 'dark' || (getSavedTheme() === 'auto' && getSystemPreference()),
  fontSize: getSavedFontSize(),
  animations: getSavedAnimations() && !getReducedMotionPreference(),
  reducedMotion: getReducedMotionPreference(),
};

// Reducer
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        isDark: action.payload === 'dark' || (action.payload === 'auto' && getSystemPreference()),
      };
    case 'SET_FONT_SIZE':
      return {
        ...state,
        fontSize: action.payload,
      };
    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        animations: !state.animations,
      };
    case 'SET_REDUCED_MOTION':
      return {
        ...state,
        reducedMotion: action.payload,
        animations: action.payload ? false : state.animations,
      };
    case 'UPDATE_SYSTEM_PREFERENCE':
      return {
        ...state,
        isDark: state.theme === 'auto' ? action.payload : state.isDark,
      };
    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme classes
    if (state.isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Font size classes
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${state.fontSize}`);

    // Animation classes
    if (!state.animations || state.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Color scheme meta tag
    const colorScheme = state.isDark ? 'dark' : 'light';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', state.isDark ? '#1a1a1a' : '#ffffff');
    }

    // Save preferences
    localStorage.setItem('floral-blog-theme', state.theme);
    localStorage.setItem('floral-blog-font-size', state.fontSize);
    localStorage.setItem('floral-blog-animations', state.animations.toString());
  }, [state.isDark, state.fontSize, state.animations, state.reducedMotion, state.theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({ type: 'UPDATE_SYSTEM_PREFERENCE', payload: e.matches });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for reduced motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_REDUCED_MOTION', payload: e.matches });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set theme function
  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Set font size function
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  };

  // Toggle animations function
  const toggleAnimations = () => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
  };

  // Set reduced motion function
  const setReducedMotion = (reduced: boolean) => {
    dispatch({ type: 'SET_REDUCED_MOTION', payload: reduced });
  };

  const value: ThemeContextType = {
    ...state,
    setTheme,
    toggleTheme,
    setFontSize,
    toggleAnimations,
    setReducedMotion,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 