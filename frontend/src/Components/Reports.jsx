import { useContext, useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { DocumentDownloadIcon, FilterIcon } from "@heroicons/react/outline";
import { BaleContext } from "../context/BaleContext";
import { ExpenseContext } from "../context/ExpenseContext";

const Reports = () => {
  const profitChartRef = useRef(null);
  const [timePeriod, setTimePeriod] = useState("monthly");

  // Get data from contexts
  const {
    balesStats,
    localBalesStats,
    isStatsLoading: isBalesLoading,
  } = useContext(BaleContext);

  const {
    expenseStats,
    localExpenseStats,
    isStatsLoading: isExpensesLoading,
    fetchExpenseStats,
  } = useContext(ExpenseContext);

  // Use local stats as fallback if server stats are not available
  const currentBalesStats = balesStats || localBalesStats;
  const currentExpenseStats = expenseStats || localExpenseStats;

  // Calculate comprehensive financial metrics
  const financialMetrics = {
    // Bales metrics
    totalBalesSales: currentBalesStats?.totalSales || 0,
    totalBalesPurchases: currentBalesStats?.totalPurchases || 0,
    balesRevenue: currentBalesStats?.totalRevenue || 0, // sales - purchases

    // Pure expenses (from expense context)
    pureExpenses: currentExpenseStats?.totalExpenses || 0,

    // Combined calculations
    get totalCosts() {
      return this.totalBalesPurchases + this.pureExpenses;
    },

    get netExpenses() {
      return this.totalBalesSales - this.totalCosts;
    },

    get actualProfit() {
      return this.netExpenses;
    },

    get profitMargin() {
      return this.totalBalesSales > 0
        ? (this.actualProfit / this.totalBalesSales) * 100
        : 0;
    },

    get expenseRatio() {
      return this.totalBalesSales > 0
        ? (this.totalCosts / this.totalBalesSales) * 100
        : 0;
    },
  };

  // Calculate period-based comparison
  const getPeriodComparisonText = (current, previous = 0) => {
    if (previous === 0) return "No previous data";
    const change = ((current - previous) / Math.abs(previous)) * 100;
    const isPositive = change >= 0;
    return `${isPositive ? "↑" : "↓"} ${Math.abs(change).toFixed(
      1
    )}% from last period`;
  };

  // Update expense stats when time period changes
  useEffect(() => {
    if (fetchExpenseStats) {
      const periodMap = {
        monthly: "thisMonth",
        quarterly: "thisYear",
      };
      fetchExpenseStats(periodMap[timePeriod] || "all");
    }
  }, [timePeriod, fetchExpenseStats]);

  // Chart setup
  useEffect(() => {
    let profitChartInstance = null;

    if (profitChartRef.current && !isBalesLoading && !isExpensesLoading) {
      const ctx = profitChartRef.current.getContext("2d");

      const textColor =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--text-color"
        ) || "#2D3748";
      const gridColor =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--grid-color"
        ) || "rgba(0, 0, 0, 0.1)";

      // Generate realistic data based on current metrics
      const generateChartData = () => {
        const baseRevenue = financialMetrics.totalBalesSales;
        const baseExpenses = financialMetrics.totalCosts;
        const baseProfit = financialMetrics.actualProfit;

        if (timePeriod === "monthly") {
          return {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            revenue: [
              baseRevenue * 0.7,
              baseRevenue * 0.8,
              baseRevenue * 0.75,
              baseRevenue * 0.9,
              baseRevenue * 0.95,
              baseRevenue,
            ],
            expenses: [
              baseExpenses * 0.6,
              baseExpenses * 0.7,
              baseExpenses * 0.8,
              baseExpenses * 0.85,
              baseExpenses * 0.9,
              baseExpenses,
            ],
            profit: [
              baseProfit * 0.8,
              baseProfit * 0.85,
              baseProfit * 0.7,
              baseProfit * 0.95,
              baseProfit * 1.05,
              baseProfit,
            ],
          };
        } else {
          return {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            revenue: [
              baseRevenue * 0.7,
              baseRevenue * 0.85,
              baseRevenue * 0.9,
              baseRevenue,
            ],
            expenses: [
              baseExpenses * 0.6,
              baseExpenses * 0.8,
              baseExpenses * 0.9,
              baseExpenses,
            ],
            profit: [
              baseProfit * 0.75,
              baseProfit * 0.9,
              baseProfit * 0.95,
              baseProfit,
            ],
          };
        }
      };

      const chartData = generateChartData();

      profitChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Revenue (Sales)",
              data: chartData.revenue,
              backgroundColor: "#4FD1C5",
            },
            {
              label: "Total Costs",
              data: chartData.expenses,
              backgroundColor: "#F56565",
            },
            {
              label: "Net Profit",
              data: chartData.profit,
              backgroundColor: "#5D5FEF",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return "Ksh " + value.toLocaleString();
                },
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
            },
            x: {
              ticks: {
                color: textColor,
              },
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                boxWidth: 12,
                font: {
                  size: 11
                }
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": Ksh " +
                    context.parsed.y.toLocaleString()
                  );
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (profitChartInstance) {
        profitChartInstance.destroy();
      }
    };
  }, [timePeriod, isBalesLoading, isExpensesLoading, financialMetrics]);

  // Loading state
  if (isBalesLoading || isExpensesLoading) {
    return (
      <div className="max-w-full px-4 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Loading financial data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full px-4 py-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Business Reports
        </h1>
        
        <div className="flex flex-col gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex items-center justify-center flex-1 text-gray-700 dark:text-gray-300 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FilterIcon className="w-4 h-4 mr-1" />
              Filters
            </button>
            <button className="flex items-center justify-center flex-1 text-blue-600 dark:text-blue-400 text-sm border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30">
              <DocumentDownloadIcon className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>

          {/* Time Period Selector */}
          <div className="flex gap-2">
            <button
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                timePeriod === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setTimePeriod("monthly")}
            >
              Monthly
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                timePeriod === "quarterly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setTimePeriod("quarterly")}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
            Total Sales Revenue
          </p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            Ksh {financialMetrics.totalBalesSales.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {getPeriodComparisonText(financialMetrics.totalBalesSales)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
            Total Costs
          </p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Ksh {financialMetrics.totalCosts.toLocaleString()}
          </p>
          <div className="text-xs mt-2 space-y-1">
            <div className="text-amber-600 dark:text-amber-400">
              Purchases: Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
            </div>
            <div className="text-red-600 dark:text-red-400">
              Expenses: Ksh {financialMetrics.pureExpenses.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
            Net Profit/Loss
          </p>
          <p
            className={`text-xl font-bold ${
              financialMetrics.actualProfit >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            Ksh {financialMetrics.actualProfit.toLocaleString()}
          </p>
          <p
            className={`text-xs mt-1 ${
              financialMetrics.actualProfit >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {financialMetrics.actualProfit >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(financialMetrics.profitMargin).toFixed(1)}% margin
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
            Expense Ratio
          </p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {financialMetrics.expenseRatio.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Cost per Ksh earned
          </p>
        </div>
      </div>

      {/* Detailed Breakdown Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Financial Breakdown
          </h2>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {timePeriod === "monthly" ? "Monthly" : "Quarterly"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Revenue Card */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                Revenue Sources
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                +{financialMetrics.profitMargin.toFixed(1)}% margin
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Bales Sales
                </span>
                <span className="font-medium text-green-600 dark:text-green-400 text-sm">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-900/30">
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  Total Revenue
                </span>
                <span className="font-bold text-green-700 dark:text-green-300 text-sm">
                  Ksh {financialMetrics.totalBalesSales.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Costs Card */}
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                Cost Breakdown
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {financialMetrics.expenseRatio.toFixed(1)}% ratio
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Bales Purchases
                </span>
                <span className="font-medium text-amber-600 dark:text-amber-400 text-sm">
                  Ksh {financialMetrics.totalBalesPurchases.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Operating Expenses
                </span>
                <span className="font-medium text-red-600 dark:text-red-400 text-sm">
                  Ksh {financialMetrics.pureExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-red-200 dark:border-red-900/30">
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  Total Costs
                </span>
                <span className="font-bold text-red-700 dark:text-red-300 text-sm">
                  Ksh {financialMetrics.totalCosts.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Result Card */}
        <div
          className={`mt-4 p-4 rounded-lg border ${
            financialMetrics.actualProfit >= 0
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50"
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div className="flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Net {financialMetrics.actualProfit >= 0 ? "Profit" : "Loss"}
              </span>
            </div>
            <div className="flex items-center">
              <span
                className={`font-bold text-lg ${
                  financialMetrics.actualProfit >= 0
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {financialMetrics.actualProfit >= 0 ? "+" : "-"}Ksh{" "}
                {Math.abs(financialMetrics.actualProfit).toLocaleString()}
              </span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  financialMetrics.actualProfit >= 0
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {financialMetrics.actualProfit >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(financialMetrics.profitMargin).toFixed(1)}%
              </span>
            </div>
          </div>
          {financialMetrics.actualProfit >= 0 ? (
            <p className="mt-2 text-xs text-green-700 dark:text-green-300">
              Your business is profitable this period. Keep up the good work!
            </p>
          ) : (
            <p className="mt-2 text-xs text-red-700 dark:text-red-300">
              Consider reviewing expenses to improve profitability.
            </p>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Profitability Trend
        </h2>
        <div className="h-64">
          <canvas ref={profitChartRef}></canvas>
        </div>
      </div>

      {/* Transactions Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Bale Transactions Summary
          </h2>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="monthly">Last 30 Days</option>
            <option value="quarterly">This Quarter</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 font-medium text-xs">Metric</th>
                  <th className="pb-2 font-medium text-xs">Value</th>
                  <th className="pb-2 font-medium text-xs">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 text-gray-900 dark:text-white font-medium text-sm">
                    Bales Trading
                  </td>
                  <td className="py-3 text-green-600 dark:text-green-400 text-sm">
                    Ksh {financialMetrics.balesRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 text-xs text-gray-500 dark:text-gray-400">
                    {currentBalesStats?.purchaseCount || 0} purchases, {currentBalesStats?.saleCount || 0} sales
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 dark:text-white font-medium text-sm">
                    Overall Business
                  </td>
                  <td className="py-3 text-green-600 dark:text-green-400 text-sm">
                    Ksh {financialMetrics.actualProfit.toLocaleString()}
                  </td>
                  <td className="py-3 text-xs text-gray-500 dark:text-gray-400">
                    {financialMetrics.profitMargin.toFixed(1)}% margin
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;