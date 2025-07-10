import { useEffect, useRef } from 'react';
import StatCard from './StatCard';
import SavingsGoal from './SavingsGoal';
import TransactionTable from './TransactionTable';
import Chart from 'chart.js/auto';
import { useTheme } from '../context/ThemeProvider';

const Dashboard = () => {
  const balesChartRef = useRef(null);
  const expensesChartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const balesCanvas = balesChartRef.current;
    const expensesCanvas = expensesChartRef.current;

    if (balesCanvas && expensesCanvas) {
      const balesCtx = balesCanvas.getContext('2d');
      const expensesCtx = expensesCanvas.getContext('2d');

      // Get theme-aware colors
      const isDarkMode = theme === 'dark';
      const textColor = isDarkMode ? '#F3F4F6' : '#2D3748';
      const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      const tooltipBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
      const tooltipTextColor = isDarkMode ? '#F3F4F6' : '#2D3748';

      if (balesCanvas.chart) balesCanvas.chart.destroy();
      if (expensesCanvas.chart) expensesCanvas.chart.destroy();

      // Bales Chart
      balesCanvas.chart = new Chart(balesCtx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Bales Bought',
              data: [45, 32, 28, 51, 42, 19, 35],
              backgroundColor: '#5D5FEF',
              borderColor: '#5D5FEF',
              borderWidth: 1,
            },
            {
              label: 'Bales Sold',
              data: [38, 29, 25, 47, 39, 15, 30],
              backgroundColor: '#4FD1C5',
              borderColor: '#4FD1C5',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              ticks: {
                color: textColor,
              }
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: textColor,
              }
            },
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
              }
            },
            tooltip: {
              backgroundColor: tooltipBgColor,
              titleColor: tooltipTextColor,
              bodyColor: tooltipTextColor,
              borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
              borderWidth: 1,
            }
          },
        },
      });

      // Expenses Chart
      expensesCanvas.chart = new Chart(expensesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Transport', 'Utilities', 'Salaries', 'Other'],
          datasets: [
            {
              data: [25, 20, 30, 25],
              backgroundColor: ['#5D5FEF', '#4FD1C5', '#ED8936', '#A0AEC0'],
              borderWidth: isDarkMode ? 1 : 0,
              borderColor: isDarkMode ? '#1F2937' : 'transparent',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: textColor,
              }
            },
            tooltip: {
              backgroundColor: tooltipBgColor,
              titleColor: tooltipTextColor,
              bodyColor: tooltipTextColor,
              borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
              borderWidth: 1,
            }
          },
          cutout: '70%',
        },
      });
    }

    return () => {
      if (balesCanvas?.chart) balesCanvas.chart.destroy();
      if (expensesCanvas?.chart) expensesCanvas.chart.destroy();
    };
  }, [theme]); // Recreate charts when theme changes

  return (
    <>
      <header className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">Bale Trading Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Track your bale transactions and profitability</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right mr-4 hidden sm:block dark:text-gray-300">Welcome Back</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Bale Trader</div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-light dark:bg-gray-700 flex items-center justify-center text-primary dark:text-white font-semibold">
            BT
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard 
          title="Today's Profit"
          value="Ksh 245,800"
          trend="↑ 12% from yesterday"
          trendColor="success"
          icon="💰"
          iconBg="blue-100 dark:bg-blue-900"
          iconColor="primary dark:text-blue-300"
        />
        <StatCard 
          title="Warehouse Stock"
          value="142 bales"
          trend="↓ 5% from last week"
          trendColor="danger"
          icon="🧶"
          iconBg="teal-100 dark:bg-teal-900"
          iconColor="secondary dark:text-teal-300"
        />
        <StatCard 
          title="Monthly Expenses"
          value="Ksh 178,500"
          trend="↑ 8% from last month"
          trendColor="success"
          icon="💸"
          iconBg="orange-100 dark:bg-orange-900"
          iconColor="warning dark:text-orange-300"
        />
        <StatCard 
          title="Total Savings"
          value="Ksh 1,245,300"
          trend="↑ 23% towards goals"
          trendColor="success"
          icon="🏦"
          iconBg="red-100 dark:bg-red-900"
          iconColor="danger dark:text-red-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">Bales Bought vs Sold (Last 7 Days)</h2>
          </div>
          <div className="h-48 md:h-64">
            <canvas ref={balesChartRef} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">Saving Goals</h2>
          </div>
          <div className="space-y-4">
            <SavingsGoal 
              title="New Delivery Truck"
              current={650000}
              target={1000000}
            />
            <SavingsGoal 
              title="Business Expansion"
              current={420000}
              target={1000000}
            />
            <SavingsGoal 
              title="Emergency Fund"
              current={390000}
              target={500000}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">Recent Transactions</h2>
          </div>
          <TransactionTable />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm md:text-base text-dark dark:text-white">Expense Breakdown</h2>
          </div>
          <div className="h-48 md:h-64">
            <canvas ref={expensesChartRef} />
          </div>
        </div>
      </div> 
    </>
  );
};

export default Dashboard;