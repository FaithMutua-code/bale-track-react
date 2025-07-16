import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider';
import {BrowserRouter} from "react-router-dom"
import StoreContextProvider from './context/StoreContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StoreContextProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StoreContextProvider>
  </BrowserRouter>
  
);