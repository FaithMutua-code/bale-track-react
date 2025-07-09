import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { DocumentDownloadIcon } from '@heroicons/react/outline';

const Savings = () => {
  const savingsChartRef = useRef(null);

  useEffect(() => {
    let savingsChartInstance = null;

    if (savingsChartRef.current) {
      const ctx = savingsChartRef.current.getContext('2d');
      
      savingsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Savings',
            data: [50000, 80000, 60000, 120000, 150000, 200000],
            borderColor: '#5D5FEF',
            backgroundColor: '#E0E1FF',
            tension: 0.3,
            fill: true
          }]
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
                  return 'Ksh ' + context.parsed.y.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (savingsChartInstance) {
        savingsChartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark">Savings Overview</h1>
        <button className="flex items-center text-primary text-sm">
          <DocumentDownloadIcon className="w-4 h-4 mr-1" />
          Export Report
        </button>
      </div>

      {/* Savings Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Total Saved</p>
          <p className="text-2xl font-bold text-primary">Ksh 1,245,300</p>
          <p className="text-xs text-success mt-1">↑ 23% from last year</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-2xl font-bold text-success">Ksh 78,400</p>
          <p className="text-xs text-danger mt-1">↓ 5% from last month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500 text-sm">Savings Rate</p>
          <p className="text-2xl font-bold text-secondary">18%</p>
          <p className="text-xs text-gray-500 mt-1">of total revenue</p>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-dark">Active Goals</h2>
          <button className="text-primary text-sm font-medium">+ New Goal</button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-4 last:border-0">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">New Delivery Truck</h3>
              <span className="text-primary font-bold">65%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Ksh 650,000 saved</span>
              <span>Ksh 1,000,000 target</span>
            </div>
          </div>
          
          <div className="border-b pb-4 last:border-0">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Business Expansion</h3>
              <span className="text-primary font-bold">42%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '42%' }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Ksh 420,000 saved</span>
              <span>Ksh 1,000,000 target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-dark mb-4">Savings Trend</h2>
        <div className="h-64">
          <canvas ref={savingsChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default Savings;