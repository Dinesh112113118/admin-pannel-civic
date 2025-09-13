import React from 'react';
import { LayoutDashboard, Wrench, Droplets, Trash, Truck, Zap, Settings, HelpCircle, LogOut, Send, CheckCircle2, Trash2 } from './icons';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  selectedDepartment: string | null;
  onDepartmentSelect: (department: string | null) => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedDepartment, onDepartmentSelect, activeView, onViewChange }) => {
  const { logout } = useAuth();

  const mainNavItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      view: 'dashboard',
    },
    { 
      icon: Wrench, 
      label: 'All Issues', 
      view: 'all',
    },
    { 
      icon: Send, 
      label: 'Dispatches', 
      view: 'dispatches',
    },
    { 
      icon: CheckCircle2, 
      label: 'Completed', 
      view: 'completed',
    },
    { 
      icon: Trash2, 
      label: 'Trash', 
      view: 'trash',
    },
  ];
  
  const secondaryNavItems = [
    {
      icon: Settings,
      label: 'Settings',
      view: 'settings',
    },
    {
      icon: HelpCircle,
      label: 'Help',
      view: 'help',
    }
  ];

  const departmentLabels = [
    { icon: Zap, label: 'Electrical', color: 'text-yellow-500', value: 'Electrical' },
    { icon: Trash, label: 'Sanitation', color: 'text-green-500', value: 'Sanitation' },
    { icon: Droplets, label: 'Sewer & Water', color: 'text-blue-500', value: 'Sewer & Water' },
    { icon: Truck, label: 'Road & Transport', color: 'text-gray-500', value: 'Road & Transport' },
  ];

  const handleDepartmentClick = (department: string) => {
    if (selectedDepartment === department) {
      onDepartmentSelect(null); // Deselect if already selected
    } else {
      onDepartmentSelect(department);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-container text-on-surface-variant p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-primary p-2 rounded-lg">
            <LayoutDashboard className="text-on-primary" />
          </div>
          <h1 className="font-bold text-lg text-on-surface">Admin Panel</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <span className="px-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant/60">Main</span>
          {mainNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onViewChange(item.view)}
              className={`flex items-center justify-between py-2 px-4 rounded-full text-sm font-medium transition-colors w-full text-left ${
                activeView === item.view
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="my-6 border-t border-outline/20"></div>

        <nav className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant/60">Departments</span>
            {selectedDepartment && (
              <button
                onClick={() => onDepartmentSelect(null)}
                className="text-xs text-primary hover:text-primary/80 font-medium"
                title="Clear filter"
              >
                Clear
              </button>
            )}
          </div>
          {departmentLabels.map((label) => {
            const isSelected = selectedDepartment === label.value;
            return (
              <button
                key={label.label}
                onClick={() => handleDepartmentClick(label.value)}
                className={`flex items-center gap-4 py-2 px-4 rounded-full text-sm font-medium transition-colors w-full text-left border-2 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary/20 text-primary' 
                    : 'border-transparent hover:bg-black/5'
                }`}
              >
                <label.icon className={`w-5 h-5 ${isSelected ? 'text-primary' : label.color}`} />
                <span className="flex-1">{label.label}</span>
                {isSelected && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-outline/20 pt-4">
        {secondaryNavItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.view)}
            className={`flex items-center gap-4 py-2 px-4 rounded-full text-sm font-medium transition-colors w-full text-left ${
              activeView === item.view
                ? 'bg-secondary-container text-on-secondary-container'
                : 'hover:bg-black/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
        <button 
          onClick={logout}
          className="flex items-center gap-4 py-2 px-4 rounded-full text-sm font-medium text-error hover:bg-error-container transition-colors w-full text-left mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
