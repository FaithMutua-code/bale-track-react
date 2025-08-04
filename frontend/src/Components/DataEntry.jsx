import { useContext, useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAuth } from "../context/useAuth";
import { BaleContext } from "../context/BaleContext";

const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizes[size]}`}
    />
  );
};

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState("bales");
  const [savingsType, setSavingsType] = useState("");
  const [filters, setFilters] = useState({
    baleType: "",
    transactionType: "",
    dateRange: "",
  });

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
    deleteBale 
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
      }
      resetBaleForm();
      await fetchBales(); // Refresh the list
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };


  const handleEdit = (bale) => {
    setBaleForm({
      baleType: bale.baleType,
      transactionType: bale.transactionType,
      quantity: bale.quantity.toString(),
      pricePerUnit: bale.pricePerUnit.toString(),
      baleDescription: bale.description || "",
    });
    setEditId(bale._id);
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

      {/** Bales Tab */}
      <div
        id="bales"
        className={`tab-content ${activeTab === "bales" ? "active" : "hidden"}`}
      >
        <form onSubmit={handleBaleSubmit} className="space-y-3 md:space-y-4">
          <h2 className="text-xl font-bold mb-4">
            {editId ? "Update Bale" : "New Bale Entry"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/** Bale Type */}
            <div>
              <label
                htmlFor="bale-type"
                className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bale Type
              </label>
              <select
                id="bale-type"
                name="baleType"
                value={baleForm.baleType}
                onChange={handleBaleChange}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select type</option>
                <option value="cotton">Cotton</option>
                <option value="jute">Jute</option>
                <option value="wool">Wool</option>
              </select>
            </div>

            {/** Transaction Type */}
            <div>
              <label
                htmlFor="transaction-type"
                className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Transaction Type
              </label>
              <select
                id="transaction-type"
                name="transactionType"
                value={baleForm.transactionType}
                onChange={handleBaleChange}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select type</option>
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/** Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={baleForm.quantity}
                onChange={handleBaleChange}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                step="0.01"
                min="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price-per-unit"
                className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Price per Unit (Ksh)
              </label>
              <input
                type="number"
                id="price-per-unit"
                name="pricePerUnit"
                value={baleForm.pricePerUnit}
                onChange={handleBaleChange}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="bale-description"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Notes
            </label>
            <textarea
              id="bale-description"
              name="baleDescription"
              value={baleForm.baleDescription}
              onChange={handleBaleChange}
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              rows="3"
              placeholder="Additional information"
            ></textarea>
          </div>

          <div className="pt-1 md:pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 md:px-6 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading
                ? "Processing..."
                : editId
                ? "Update Bale"
                : "Record Transaction"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetBaleForm}
                className="w-full mt-2 px-4 py-2 md:px-6 md:py-2 bg-gray-300 text-gray-800 text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <hr className="my-6" />

        {/**This is flaw it should only render user specific bales this is  for my admin panel */}
        {/**
             *         <h3 className="text-lg font-semibold mb-2">All Bales</h3>
        {isLoading ? (
          <div className="text-center py-8">
            <Spinner size="lg" />
            <p>Loading bales...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading bales: {error.message}</p>
            <button
              onClick={() => queryClient.refetchQueries(["bales"])}
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
          <p className="text-center py-4">No bales found</p>
        )}
             */}

        {/* User-specific bales section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Your Bales</h3>
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
            <p className="text-center py-4">
              You haven't created any bales yet
            </p>
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
        <form className="space-y-3 md:space-y-4">
          <div>
            <label
              htmlFor="expense-category"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="expense-category"
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select category</option>
              <option value="transport">Transport</option>
              <option value="utilities">Utilities</option>
              <option value="salaries">Salaries</option>
              <option value="supplies">Supplies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="expense-description"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              id="expense-description"
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              placeholder="What was this expense for?"
              required
            />
          </div>

          <div>
            <label
              htmlFor="expense-amount"
              className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Amount (Ksh)
            </label>
            <input
              type="number"
              id="expense-amount"
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>

          <div className="pt-1 md:pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 md:px-6 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
            >
              Record Expense
            </button>
          </div>
        </form>
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
