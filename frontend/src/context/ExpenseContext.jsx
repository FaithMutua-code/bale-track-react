import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./useAuth.js";
import axios from "axios";

export const ExpenseContext = createContext(null);

const ExpenseContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchExpenses = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);

  const createExpense = useCallback(
    async (expenseData) => {
      setIsLoading(true);
      try {
        const payload = {
          ...expenseData,
          expenseAmount: parseFloat(expenseData.expenseAmount),
        };
        const response = await axios.post(`${backendUrl}/expenses`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses((prev) => [...prev, response.data.data.expense]);

        return response.data.data.expense;
      } catch (error) {
        console.error("Error creating expense:", error);
        throw new Error(
          error.response?.data?.message || "Failed to create expense"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl]
  );

  const updateExpenses = useCallback(
    async (expenseId, expenseData) => {
      setIsLoading(true);
      try {
        const payload = {
          ...expenseData,
          expenseAmount: parseFloat(expenseData.expenseAmount),
        };

        const response = await axios.patch(
          `${backendUrl}/expenses/${expenseId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === expenseId ? response.data.data.expense : exp
          )
        );

        return response.data.data.expense;
      } catch (error) {
        console.error("Update failed:", error);
        throw new Error(
          error.response?.data?.message || "Failed to update expense"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl]
  );

  const deleteExpenses = useCallback(
    async (expenseId) => {
      setIsLoading(true);
      try {
        await axios.delete(`${backendUrl}/expenses/${expenseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update the state
        setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));
      } catch (error) {
        console.error("Error deleting expense:", error);
        throw new Error(
          error.response?.data?.message || "Failed to delete expense"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, backendUrl]
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const contextValue = useMemo(
    () => ({
      expenses,
      fetchExpenses,
      createExpense,
      deleteExpenses,
      updateExpenses,
      isLoading,
      error,
    }),
    [
      expenses,
      fetchExpenses,
      createExpense,
      deleteExpenses,
      updateExpenses,
      isLoading,
      error,
    ]
  );

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContextProvider;
