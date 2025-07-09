import { useState } from 'react'
import Sidebar from './Components/Sidebar'
import Dashboard from './Components/Dashboard'
import DataEntry from './Components/DataEntry'
import Savings from './Components/Savings'
import Reports from './Components/Reports'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'data-entry':
        return <DataEntry />
      case 'savings':
        return <Savings />
      case 'reports':
        return <Reports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="bg-gray-50 flex min-h-screen font-inter">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      

      <main className={`flex-1 ml-0 md:ml-64 p-4 md:p-8 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App