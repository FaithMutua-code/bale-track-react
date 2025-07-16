import axios from 'axios';
import { createContext } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const contextValue = {
    // You can define shared state, functions, or axios config here
    // e.g. user, cart, axios instance, etc.
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
