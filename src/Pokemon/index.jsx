import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';     // IMPORTA App desde el mismo nivel (src/)
import './style.css';        // IMPORTA style.css desde el mismo nivel (src/)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

