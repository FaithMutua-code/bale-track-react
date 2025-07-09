import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { DocumentDownloadIcon, FilterIcon } from '@heroicons/react/outline';

const Reports = () => {
  const profitChartRef = useRef(null);
  const [timePeriod, setTimePeriod] = useState('monthly');

  useEffect(() => {
    let profitChartInstance = null;

    if (profitChartRef.current) {
      const ctx = profitChartRef.current.getContext('2d');
      
      profitChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: timePeriod === 'monthly' 
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            : ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Revenue',
              data: timePeriod === 'monthly'
                ? [450000, 520000, 480000, 600000, 650000, 700000]
                : [1450000, 1750000, 1600000, 1900000],
              backgroundColor: '#4FD1C5',
            },
            {
              label: 'Profit',
              data: timePeriod === 'monthly'
                ? [120000, 150000, 130000, 180000, 200000, 220000]
                : [450000, 550000, 500000, 600000],
              backgroundColor: '#5D5FEF',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Ksh ' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': Ksh ' + context.parsed.y.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (profitChartInstance) {
        profitChartInstance.destroy();
      }
    };
  }, [timePeriod]);

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark">Business Reports</h1>
        <div className="flex space-x-2">
          <button className="flex items-center text-gray-600 text-sm border rounded-lg px-3 py-1">
            <FilterIcon className="w-4 h-4 mr-1" />
            Filters
          </button>
          <button className="flex items-center text-primary text-sm">
            <DocumentDownloadIcon className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex space-x-2 mb-6">
        <button 
          className={`px-3 py-1 rounded-lg text-sm ${timePeriod === 'monthly' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          onClick={() => setTimePeriod('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`px-3 py-1 rounded-lg text-sm ${timePeriod === 'quarterly' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          onClick={() => setTimePeriod('quarterly')}
        >
          Quarterly
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-secondary">Ksh 3,450,800</p>
          <p className="text-xs text-success mt-1">↑ 18% from last period</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-danger">Ksh 1,785,300</p>
          <p className="text-xs text-danger mt-1">↑ 12% from last period</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Net Profit</p>
          <p className="text-2xl font-bold text-primary">Ksh 1,665,500</p>
          <p className="text-xs text-success mt-1">↑ 22% from last period</p>
        </div>
      </div>

      {/* Profitability Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-dark mb-4">Profitability Trend</h2>
        <div className="h-64">
          <canvas ref={profitChartRef}></canvas>
        </div>
      </div>

      {/* Bale Transactions Report */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-dark">Bale Transactions</h2>
          <select 
            className="border rounded-lg px-3 py-1 text-sm"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="monthly">Last 30 Days</option>
            <option value="quarterly">This Quarter</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Bale Type</th>
                <th className="pb-3 font-medium">Transactions</th>
                <th className="pb-3 font-medium">Total Volume</th>
                <th className="pb-3 font-medium">Total Value</th>
                <th className="pb-3 font-medium">Avg. Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">Cotton</td>
                <td className="py-3">24</td>
                <td className="py-3">142 bales</td>
                <td className="py-3 font-bold">Ksh 1,245,300</td>
                <td className="py-3">Ksh 8,770/bale</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Jute</td>
                <td className="py-3">18</td>
                <td className="py-3">87 bales</td>
                <td className="py-3 font-bold">Ksh 876,500</td>
                <td className="py-3">Ksh 10,075/bale</td>
              </tr>
              <tr>
                <td className="py-3">Wool</td>
                <td className="py-3">12</td>
                <td className="py-3">65 bales</td>
                <td className="py-3 font-bold">Ksh 715,000</td>
                <td className="py-3">Ksh 11,000/bale</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;