import React from 'react';
import { Home, Users, BookOpen, Calendar, Video } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, role }) {
  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'courses', label: 'Manage Courses', icon: BookOpen },
    { id: 'sessions', label: 'All Sessions', icon: Calendar },
  ];

  const trainerMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sessions', label: 'My Sessions', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
  ];

  const learnerMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Browse Courses', icon: BookOpen },
    { id: 'enrolled', label: 'My Courses', icon: Video },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const menu =
    role === 'admin' ? adminMenu : role === 'trainer' ? trainerMenu : learnerMenu;

  return (
    <aside className="bg-black w-64 min-h-screen border-r border-gray-800 p-6 font-montserrat">
      
      {/* Menu */}
      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                activeTab === item.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm tracking-wide">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
