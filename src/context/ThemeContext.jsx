import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Define theme options
export const THEMES = {
  BLUE: 'blue',
  GREEN: 'green',
  DARK: 'dark'
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.BLUE);
  
  // Apply theme to document when theme changes
  useEffect(() => {
    // Remove previous theme classes
    document.documentElement.classList.remove(
      THEMES.BLUE,
      THEMES.GREEN,
      THEMES.DARK
    );
    
    // Add current theme class
    document.documentElement.classList.add(theme);
    
    // Store theme preference in localStorage
    localStorage.setItem('bookwise-theme', theme);
  }, [theme]);
  
  // Get a random theme
  const getRandomTheme = () => {
    const themeValues = Object.values(THEMES);
    const randomIndex = Math.floor(Math.random() * themeValues.length);
    return themeValues[randomIndex];
  };

  // Initialize with a random theme on mount
  useEffect(() => {
    // Get a random theme on each refresh/entry
    const randomTheme = getRandomTheme();
    setTheme(randomTheme);
    
    // Store in localStorage for consistency during the session
    localStorage.setItem('bookwise-theme', randomTheme);
  }, []);
  
  // Cycle to next theme
  const cycleTheme = () => {
    setTheme(currentTheme => {
      switch (currentTheme) {
        case THEMES.BLUE:
          return THEMES.GREEN;
        case THEMES.GREEN:
          return THEMES.DARK;
        case THEMES.DARK:
          return THEMES.BLUE;
        default:
          return THEMES.BLUE;
      }
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;