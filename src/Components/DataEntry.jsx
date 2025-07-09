import {useState} from 'react'
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, CubeIcon } from '@heroicons/react/outline'


const DataEntry = () => {
  const [activeTab, setActiveTab] = useState('bales')
  const [savingsType, setSavingsType] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`${activeTab} recorded successfully!`)
    e.target.reset()
    if (activeTab === 'savings') {
      setSavingsType('')
    }
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-4 md:py-8 max-w-4xl">
      {/* Data Entry Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-semibold text-dark mb-2">Daily Data Entry</h1>
        <p className="text-gray-600 text-sm md:text-base">Record your daily bale transactions, expenses, and savings</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-4 md:mb-6">
        <button 
          className={`tab-btn whitespace-nowrap ${activeTab === 'bales' ? 'active' : ''}`}
          onClick={() => setActiveTab('bales')}
        >
          <CubeIcon className="h-5 w-5 mr-2" />
          Bales
        </button>
        <button 
          className={`tab-btn whitespace-nowrap ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Expenses
        </button>
        <button 
          className={`tab-btn whitespace-nowrap ${activeTab === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          <ArrowUpIcon className="h-5 w-5 mr-2" />
          Savings
        </button>
      </div>

      {/* Bales Form */}
      <div id="bales" className={`tab-content ${activeTab === 'bales' ? 'active' : 'hidden'}`}>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label htmlFor="bale-type" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Bale Type</label>
              <select 
                id="bale-type" 
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                required
              >
                <option value="">Select type</option>
                <option value="cotton">Cotton</option>
                <option value="jute">Jute</option>
                <option value="wool">Wool</option>
              </select>
            </div>
            <div>
              <label htmlFor="transaction-type" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select 
                id="transaction-type" 
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                required
              >
                <option value="">Select type</option>
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label htmlFor="quantity" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                type="number" 
                id="quantity" 
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                placeholder="0" 
                required
              />
            </div>
            <div>
              <label htmlFor="price-per-unit" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Price per Unit (Ksh)</label>
              <input 
                type="number" 
                id="price-per-unit" 
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                placeholder="0.00" 
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="bale-notes" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              id="bale-notes" 
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
              rows="3" 
              placeholder="Additional information"
            ></textarea>
          </div>

          <div className="pt-1 md:pt-2">
            <button 
              type="submit" 
              className="w-full px-4 py-2 md:px-6 md:py-2 bg-primary text-white text-xs md:text-sm font-medium rounded-lg hover:bg-opacity-90 transition duration-200"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </div>

      {/* Expenses Form */}
      <div id="expenses" className={`tab-content ${activeTab === 'expenses' ? 'active' : 'hidden'}`}>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label htmlFor="expense-category" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              id="expense-category" 
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
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
            <label htmlFor="expense-description" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              type="text" 
              id="expense-description" 
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
              placeholder="What was this expense for?" 
              required
            />
          </div>

          <div>
            <label htmlFor="expense-amount" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Amount (Ksh)</label>
            <input 
              type="number" 
              id="expense-amount" 
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
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

      {/* Savings Form */}
      <div id="savings" className={`tab-content ${activeTab === 'savings' ? 'active' : 'hidden'}`}>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label htmlFor="savings-type" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Savings Type</label>
            <select 
              id="savings-type" 
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
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

          {savingsType === 'target' && (
            <div>
              <label htmlFor="target-name" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Target Name</label>
              <input 
                type="text" 
                id="target-name" 
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                placeholder="e.g. New Truck" 
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label htmlFor="savings-amount" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Amount (Ksh)</label>
              <input 
                type="number" 
                id="savings-amount" 
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                placeholder="0.00" 
                required
              />
            </div>
            {savingsType === 'target' && (
              <div>
                <label htmlFor="target-amount" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Target Amount (Ksh)</label>
                <input 
                  type="number" 
                  id="target-amount" 
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
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
  )
}

export default DataEntry