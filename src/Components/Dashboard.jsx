import { useEffect, useRef} from 'react'
import StatCard from './StatCard'
import SavingsGoal from './SavingsGoal'

import Chart from 'chart.js/auto'

const Dashboard = () => {
  // Declare refs here
  const balesChartRef = useRef(null)
  const expensesChartRef = useRef(null)

  useEffect(() => {
    const balesCanvas = balesChartRef.current
    const expensesCanvas = expensesChartRef.current

    if (balesCanvas && expensesCanvas) {
      const balesCtx = balesCanvas.getContext('2d')
      const expensesCtx = expensesCanvas.getContext('2d')

      if (balesCanvas.chart) balesCanvas.chart.destroy()
      if (expensesCanvas.chart) expensesCanvas.chart.destroy()

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
                display: true,
                drawBorder: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      })

      expensesCanvas.chart = new Chart(expensesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Transport', 'Utilities', 'Salaries', 'Other'],
          datasets: [
            {
              data: [25, 20, 30, 25],
              backgroundColor: ['#5D5FEF', '#4FD1C5', '#ED8936', '#A0AEC0'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
          },
          cutout: '70%',
        },
      })
    }

    return () => {
      if (balesCanvas?.chart) balesCanvas.chart.destroy()
      if (expensesCanvas?.chart) expensesCanvas.chart.destroy()
    }
  }, [])

  return (
    <>
    <header className="flex items-center justify-between mb-6 md:mb-8">
      <div >
        <h1 className="text-xl md:text-2xl font-bold text-dark">Bale Trading Dashboard</h1>
        <p className="text-gray-500 text-xs md:text-sm">Track your bale transactions and profitability</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right mr-4 hidden sm:block">Welcome Back</div>
        <div className="text-gray-500 text-xs md:text-sm">Bale Trader</div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold">
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
          iconBg="blue-100"
          iconColor="primary"
        />
         <StatCard 
          title="Warehouse Stock"
          value="142 bales"
          trend="↓ 5% from last week"
          trendColor="danger"
          icon="🧶"
          iconBg="teal-100"
          iconColor="secondary"
        />
        
        <StatCard 
          title="Monthly Expenses"
          value="Ksh 178,500"
          trend="↑ 8% from last month"
          trendColor="success"
          icon="💸"
          iconBg="orange-100"
          iconColor="warning"
        />
        
        <StatCard 
          title="Total Savings"
          value="Ksh 1,245,300"
          trend="↑ 23% towards goals"
          trendColor="success"
          icon="🏦"
          iconBg="red-100"
          iconColor="danger"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between item-center mb-4">
           <h2 className="font-bold text-sm md:text-base">Bales Bought vs Sold (Last 7 Days)</h2>
          </div>
           <div className="h-48 md:h-64">
           <canvas ref={balesChartRef} style={{ width: '400px', height: '300px' }} />
<canvas ref={expensesChartRef} style={{ width: '400px', height: '300px' }} />



          </div>
        </div>
{/*saving goals*/}
<div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-bold text-sm md:text-base">Saving Goals</h2>
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
    </>
  )
}

export default Dashboard