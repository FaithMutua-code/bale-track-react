import { useState } from 'react';
import Sidebar from './Components/Sidebar';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main className="flex-1 p-6 ml-64 md:ml-64">
        {/* Render content based on activePage */}
        {activePage === 'dashboard' && <h1 className="text-2xl font-bold">Dashboard</h1>}
        {activePage === 'data-entry' && <h1 className="text-2xl font-bold">Data Entry</h1>}
        {activePage === 'savings' && <h1 className="text-2xl font-bold">Savings</h1>}
        {activePage === 'reports' && <h1 className="text-2xl font-bold">Reports</h1>}
      </main>
    </div>
  );
}

export default App;
