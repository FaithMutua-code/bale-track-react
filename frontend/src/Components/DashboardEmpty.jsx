import { useTheme } from "../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {AuthContext} from '../context/AuthContext.jsx'

const EmptyDashboard = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const placeholderChartRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated && placeholderChartRef.current) {
      const ctx = placeholderChartRef.current.getContext("2d");
      const isDarkMode = theme === "dark";
      const textColor = isDarkMode ? "#F3F4F6" : "#2D3748";
      const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Data", "Not", "Available"],
          datasets: [{
            label: "Sign in to view data",
            data: [0, 0, 0],
            backgroundColor: isDarkMode ? "#374151" : "#E5E7EB",
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { display: false },
            x: { display: false }
          }
        }
      });
    }
  }, [theme, isAuthenticated]);

  return (
    <div className="min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8 mt-8 mx-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">
            Bale Trading Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
            Sign in to track your bale transactions and profitability
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 h-8 md:px-5 md:h-10 text-sm bg-primary text-white rounded-full font-semibold hover:ring-2 ring-indigo-400 transition"
          >
            Sign In
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 mx-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-32 flex flex-col justify-center items-center">
            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-100 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 mx-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="h-48 md:h-64 flex flex-col items-center justify-center">
            <canvas ref={placeholderChartRef} />
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Sign in to view your transaction data
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mx-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="h-48 md:h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No transaction history available
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="h-48 md:h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to view expense breakdown
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;