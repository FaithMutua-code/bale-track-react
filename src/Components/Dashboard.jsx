import React from 'react'
import StatCard from './StatCard'

const Dashboard = () => {
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
    </>
  )
}

export default Dashboard