import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

document.title = "Security PDF Generator";

// Update favicon dynamically
const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
link.type = 'image/svg+xml';
link.rel = 'icon';
link.href = '/shield-icon.svg';
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);

reportWebVitals();
