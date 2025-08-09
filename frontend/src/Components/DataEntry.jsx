import { useContext, useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAuth } from "../context/useAuth";
import { BaleContext } from "../context/BaleContext";
import BaleFormDropdown from "./BaleDropDown";
import { useRef } from "react";
import ExpenseForm from "./ExpenseForm";
import Spinner from "./Spinner";

{
  /**update the bale entry to reduce  on submission */
}



const DataEntry = () => {
  const [activeTab, setActiveTab] = useState("bales");
  const [savingsType, setSavingsType] = useState("");
  const [filters, setFilters] = useState({
    baleType: "",
    transactionType: "",
    dateRange: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const buttonRef = useRef();

  console.log("Filters", filters);

  const queryClient = useQueryClient();
  const { user } = useAuth();
  console.log("Current User", user);

  const {
    bales,
    isLoading,
    error,
    fetchBales,
    createBale,
    updateBale,
    deleteBale,
  } = useContext(BaleContext);

  const [baleForm, setBaleForm] = useState({
    baleType: "",
    transactionType: "",
    quantity: "",
    pricePerUnit: "",
    baleDescription: "",
  });

  const [editId, setEditId] = useState(null);

  // Single query for user's bales with filters

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBale,
    onSuccess: () => {
      toast.success("Bale created successfully!");
      queryClient.invalidateQueries({ queryKey: ["bales"] });
      resetBaleForm();
    },
    onError: (error) => toast.error(error.message || "Failed to create bale."),
  });

  const updateMutation = useMutation({
    mutationFn: updateBale,
    onSuccess: () => {
      toast.success("Bale updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bales"] });
      resetBaleForm();
    },
    onError: (error) => toast.error(error.message || "Failed to update bale."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBale,
    onSuccess: () => {
      toast.success("Bale deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bales"] });
    },
    onError: (error) => toast.error(error.message || "Failed to delete bale."),
  });

  useEffect(() => {
    const loadBales = async () => {
      try {
        await fetchBales();
      } catch (err) {
        toast.error(err.message || "Failed to load bales");
      }
    };

    loadBales();
  }, []);

  const handleBaleChange = (e) => {
    const { name, value } = e.target;
    setBaleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetBaleForm = () => {
    setBaleForm({
      baleType: "",
      transactionType: "",
      quantity: "",
      pricePerUnit: "",
      baleDescription: "",
    });
    setEditId(null);
  };

  const handleBaleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      baleType: baleForm.baleType,
      transactionType: baleForm.transactionType,
      quantity: parseFloat(baleForm.quantity),
      pricePerUnit: parseFloat(baleForm.pricePerUnit),
      description: baleForm.baleDescription,
    };

    try {
      if (editId) {
        await updateBale(editId, payload);
        toast.success("Bale updated successfully!");
      } else {
        await createBale(payload);
        toast.success("Bale created successfully!");
        setIsFormOpen(false);
      }
      resetBaleForm();
      await fetchBales(); // Refresh the list
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleEdit = (bale) => {
     //console.log("Editing bale:", bale); // Check this in console
  // ... rest of the function
    setBaleForm({
      baleType: bale.baleType,
      transactionType: bale.transactionType,
      quantity: bale.quantity.toString(),
      pricePerUnit: bale.pricePerUnit.toString(),
      baleDescription: bale.description || "",
    });
    setEditId(bale._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (baleId) => {
    if (confirm("Are you sure you want to delete this bale?")) {
      try {
        await deleteBale(baleId);
        toast.success("Bale deleted successfully!");
        await fetchBales(); // Refresh the list
      } catch (err) {
        toast.error(err.message || "Failed to delete bale");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      resetBaleForm();
    }
  };

  // Load bales on component Mound
  // Replace your current useEffect with this:
  // Remove fetchBales from dependencies

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 md:py-8 max-w-4xl">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-semibold text-dark dark:text-white mb-2">
          Daily Data Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Record your daily bale transactions, expenses, and savings
        </p>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-6">
        <button
          className={`tab-btn whitespace-nowrap ${
            activeTab === "bales" ? "active" : ""
          }`}
          onClick={() => setActiveTab("bales")}
        >
          <CubeIcon className="h-5 w-5 mr-2" />
          Bales
        </button>
        <button
          className={`tab-btn whitespace-nowrap ${
            activeTab === "expenses" ? "active" : ""
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Expenses
        </button>
        <button
          className={`tab-btn whitespace-nowrap ${
            activeTab === "savings" ? "active" : ""
          }`}
          onClick={() => setActiveTab("savings")}
        >
          <ArrowUpIcon className="h-5 w-5 mr-2" />
          Savings
        </button>
      </div>

      {/** Bales Tab   Simplified*/}
      <div
        id="bales"
        className={`${activeTab === "bales" ? "block" : "hidden"}`}
      >
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold dark:text-white">Your Bales</h2>
          <button
            ref={buttonRef}
            onClick={toggleForm}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            <PlusIcon className="h-5 w-5" />
            Add Bale
          </button>

          {/* Dropdown Form */}
          <BaleFormDropdown
            isOpen={isFormOpen}
            onClose={() => {
              resetBaleForm();
              setIsFormOpen(false);
            }}
            onSubmit={handleBaleSubmit}
            formState={baleForm}
            onFormChange={handleBaleChange}
            isSubmitting={createMutation.isLoading || updateMutation.isLoading}
            editId={editId} // This is crucial for edit mode
          />
        </div>

        {/* User-specific bales section */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p>Loading your bales...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading your bales: {isError.message}</p>
              <button
                onClick={() => queryClient.refetchQueries(["userBales"])}
                className="mt-2 px-4 py-2 bg-primary text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : bales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price/Unit
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {bales.map((bale) => (
                    <tr key={bale._id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                        {bale.baleType}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                        {bale.transactionType}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {bale.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Ksh {bale.pricePerUnit?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button
                          onClick={() => handleEdit(bale)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                          disabled={deleteMutation.isLoading}
                        >
                          <PencilIcon className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(bale._id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={deleteMutation.isLoading}
                        >
                          <TrashIcon className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                <CubeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No Bales Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                You haven't created any bales yet. Get started by clicking the
                button below.
              </p>
            </div>
          )}
        </div>
      </div>




      {/** Expenses Tab */}
      <div
        id="expenses"
        className={`tab-content ${
          activeTab === "expenses" ? "active" : "hidden"
        }`}
        

      >
        <ExpenseForm />
        
      </div>

      {/** Savings Tab */}
      <div
        id="savings"
        className={`tab-content ${
          activeTab === "savings" ? "active" : "hidden"
        }`}
      >
        <form className="space-y-3 md:space-y-4">
          <div>
            <label
              htmlFor="savings-type"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Savings Type
            </label>
            <select
              id="savings-type"
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              required
              value={savingsType}
              onChange={(e) => setSavingsType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="personal">Personal Savings</option>
              <option value="business">Business Savings</option>
              <option value="target">Target Savings</option>
            </select>
          </div>

          {savingsType === "target" && (
            <div>
              <label
                htmlFor="target-name"
                className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Target Name
              </label>
              <input
                type="text"
                id="target-name"
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                placeholder="e.g. New Truck"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label
                htmlFor="savings-amount"
                className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount (Ksh)
              </label>
              <input
                type="number"
                id="savings-amount"
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>
            {savingsType === "target" && (
              <div>
                <label
                  htmlFor="target-amount"
                  className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Target Amount (Ksh)
                </label>
                <input
                  type="number"
                  id="target-amount"
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
            )}
          </div>

          <div className="pt-1 md:pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 md:px-6 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
            >
              Record Savings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataEntry;
