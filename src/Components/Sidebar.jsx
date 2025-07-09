import { useEffect } from 'react'
import { ChartBarIcon, DocumentTextIcon, CurrencyDollarIcon, ChartPieIcon } from '@heroicons/react/outline'

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 768 && !e.target.closest('.sidebar') && !e.target.closest('button[aria-label="mobile menu"]')) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [setSidebarOpen])

  const navItems = [
    { id: 'dashboard', icon: <ChartBarIcon className="h-5 w-5 mr-3" />, label: 'Dashboard' },
    { id: 'data-entry', icon: <DocumentTextIcon className="h-5 w-5 mr-3" />, label: 'Data Entry' },
    { id: 'savings', icon: <CurrencyDollarIcon className="h-5 w-5 mr-3" />, label: 'Savings' },
    { id: 'reports', icon: <ChartPieIcon className="h-5 w-5 mr-3" />, label: 'Reports' }
  ]

  return (
    <aside className={`sidebar w-64 bg-white shadow-md fixed h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40`}>
      <div className="p-6">
        <div className="flex items-center text-primary font-bold text-xl">
          <span className="mr-2">🧶</span>
          <span>BaleTrack</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="px-6 py-3">
              <button
                onClick={() => {
                  setActivePage(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex items-center w-full text-left rounded-lg px-4 py-2 ${
                  activePage === item.id 
                    ? 'bg-primary-light text-primary' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar