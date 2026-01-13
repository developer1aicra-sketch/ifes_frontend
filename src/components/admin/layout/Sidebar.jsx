import { NavLink } from 'react-router-dom';
import { Layout, Users, BookOpen, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', icon: <Layout size={20} />, label: 'Overview' },
    { id: 'team', icon: <Users size={20} />, label: 'Team' },
    { id: 'courses', icon: <BookOpen size={20} />, label: 'Courses' },
    { id: 'forums', icon: <MessageSquare size={20} />, label: 'Forums' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 p-4">
      <div className="flex items-center space-x-2 p-4 mb-8">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={`/admin/${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 mt-8">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
