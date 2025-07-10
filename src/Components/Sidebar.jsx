import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  ChartPieIcon 
} from '@heroicons/react/outline';

const Sidebar = ({ sidebarOpen, activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: <ChartBarIcon className="h-5 w-5 mr-3" />, label: 'Dashboard' },
    { id: 'data-entry', icon: <DocumentTextIcon className="h-5 w-5 mr-3" />, label: 'Data Entry' },
    { id: 'savings', icon: <CurrencyDollarIcon className="h-5 w-5 mr-3" />, label: 'Savings' },
    { id: 'reports', icon: <ChartPieIcon className="h-5 w-5 mr-3" />, label: 'Reports' }
  ];

  return (
    <aside className={`sidebar w-64 bg-white dark:bg-gray-800 shadow-md fixed h-full transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 z-40`}>
      <div className="p-6">
        <div className="flex items-center text-primary dark:text-primary-light font-bold text-xl">
          <span className="mr-2">🧶</span>
          <span>BaleTrack</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="px-6 py-3">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full text-left rounded-lg px-4 py-2 ${
                  activePage === item.id 
                    ? 'bg-primary-light dark:bg-gray-700 text-primary dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
  );
};

export default Sidebar;