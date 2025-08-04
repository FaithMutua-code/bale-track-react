import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthContextProvider } from './context/AuthContext';
import BaleContextProvider from './context/BaleContext';
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthContextProvider>
        <BaleContextProvider>
           <App />
        </BaleContextProvider>
        
         {/* Only this should render BaleTrack */}
      </AuthContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);