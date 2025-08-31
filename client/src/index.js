import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppStateProvider } from './hooks/useAppState';
import { ThemeProvider } from './hooks/useTheme';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);