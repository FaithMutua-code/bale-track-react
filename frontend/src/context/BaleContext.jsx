// BaleContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import axios from "axios";

export const BaleContext = createContext(null);

const BaleContextProvider = ({ children }) => {
  const [bales, setBales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchBales = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/bales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBales(response.data.data.bales);
    } catch (error) {
      console.error("Error fetching bales:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);
  const createBale = useCallback(
    async (baleData) => {
      try {
        const payload = {
          ...baleData,
          quantity: parseFloat(baleData.quantity),
          pricePerUnit: parseFloat(baleData.pricePerUnit),
        };
        const response = await axios.post(`${backendUrl}/bales`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchBales(); // Refresh the list
        return response.data;
      } catch (error) {
        console.error("Error creating bale:", error);
        throw error;
      }
    },
    [token, backendUrl, fetchBales]
  );

  const updateBale = useCallback(
    async (baleId, baleData) => {
      try {

        //optimistically update the local state first
        setBales(prevBales => prevBales.map(bale =>
          bale._id === baleId ? { ...bale, ...baleData} : bale
        ))


        const payload = {
          ...baleData,
          quantity: parseFloat(baleData.quantity),
          pricePerUnit: parseFloat(baleData.pricePerUnit),
        };

        console.log("Sending PATCH to:", `${backendUrl}/${baleId}`);

        await axios.patch(`${backendUrl}/bales/${baleId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        await fetchBales();
        
      } catch (error) {
        console.error("Update failed:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error;

        
      }
    },
    [token, backendUrl, fetchBales]
  );

  const deleteBale = useCallback(
    async (baleId) => {
      try {
        const response = await axios.delete(`${backendUrl}/bales/${baleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchBales(); // Refresh the list
        return response.data;
      } catch (error) {
        console.error("Error deleting bale:", error);
        throw error;
      }
    },
    [token, backendUrl, fetchBales]
  );

  // Fetch bales when token changes or component mounts
  useEffect(() => {
    fetchBales();
  }, [fetchBales]);

  const contextValue = useMemo(
    () => ({
      bales,
      fetchBales,
      isLoading,
      error,
      createBale,
      updateBale,
      deleteBale,
    }),
    [bales, token, backendUrl, fetchBales, createBale, updateBale, deleteBale]
  );

  return (
    <BaleContext.Provider value={contextValue}>{children}</BaleContext.Provider>
  );
};

export default BaleContextProvider;
