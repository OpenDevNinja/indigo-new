// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeProvider';
import { 
  Menu, X, Home, Map, Layers, Users, Monitor, 
  BarChart2, UserCircle, Settings, LogOut, ChevronDown, Sun, Moon, 
  Bell, Search
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState('');

  const menuItems = [
    { name: 'Tableau de Bord', path: '/dashboard', icon: <Home size={20} /> },
    { 
      name: 'Géographie', 
      icon: <Map size={20} />,
      subMenu: [
        { name: 'Pays', path: '/dashboard/pays' },
        { name: 'Commune', path: '/dashboard/communes' },
        { name: 'Ville', path: '/dashboard/cities' }
      ]
    },
    {
      name: 'Panneaux',
      icon: <Layers size={20} />,
      subMenu: [
        { name: 'Groupe Panneaux', path: '/dashboard/panel-groups' },
        { name: 'Type Panneaux', path: '/dashboard/panel-types' },
        { name: 'Panneaux', path: '/dashboard/panels' }
      ]
    },
    { name: 'Clients', path: '/dashboard/clients', icon: <Users size={20} /> },
    { name: 'Campagnes', path: '/dashboard/campaigns', icon: <BarChart2 size={20} /> },
    { name: 'Users', path: '/dashboard/users', icon: <UserCircle size={20} /> },
    { name: 'Paramètre', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  const toggleSubMenu = (menuName) => {
    setOpenMenu(prev => prev === menuName ? '' : menuName);
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-500 text-white p-1.5 rounded">
              <Monitor size={20} />
            </div>
            <span className="font-display font-bold text-lg text-gray-800 dark:text-white">Indigo Admin</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow py-4">
          <nav className="px-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.subMenu ? (
                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${openMenu === item.name ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'}`}
                      onClick={() => toggleSubMenu(item.name)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-gray-500 dark:text-gray-400">{item.icon}</span>
                        {item.name}
                      </div>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${openMenu === item.name ? 'rotate-180' : ''}`} />
                    </button>

                    {openMenu === item.name && (
                      <div className="pl-10 space-y-1">
                        {item.subMenu.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.path}
                            onClick={handleMenuItemClick}
                            className={({ isActive }) => 
                              `block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                isActive 
                                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
                                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/30'
                              }`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={handleMenuItemClick}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive || (item.path === '/dashboard' && pathname === '/dashboard')
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                      }`
                    }
                  >
                    <span className="mr-3 text-gray-500 dark:text-gray-400">{item.icon}</span>
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
            <LogOut size={20} className="mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                <Menu size={24} />
              </button>
              
              <div className={`ml-4 ${isSearchOpen ? 'hidden sm:flex' : 'flex'} items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1.5`}>
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="ml-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-600 dark:text-gray-200 w-32 sm:w-64"
                />
              </div>
              
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="ml-2 sm:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Search size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                  AD
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline-block">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;