import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext({
  theme: 'System default',
  setTheme: () => {},
  colors: lightTheme,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('System default');
  const [colors, setColors] = useState(lightTheme);

  // Load theme from storage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('theme');
      if (stored === 'Light' || stored === 'Dark' || stored === 'System default') {
        setThemeState(stored);
      }
    })();
  }, []);

  // Update colors and persist theme
  useEffect(() => {
    let selectedTheme = lightTheme;
    if (theme === 'Dark') selectedTheme = darkTheme;
    else if (theme === 'System default') {
      selectedTheme = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;
    }
    setColors(selectedTheme);
    AsyncStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => setThemeState(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};