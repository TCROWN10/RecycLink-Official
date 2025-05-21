import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { FaChartLine, FaRecycle, FaUsers, FaBuilding, FaShoppingCart, FaCog } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';

const CompanyDashboard = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Overview',
      icon: <FaChartLine className="text-[#983279]" />,
      path: '/dashboard/company',
    },
    {
      name: 'Recycling Orders',
      icon: <FaRecycle className="text-[#983279]" />,
      path: '/dashboard/company/orders',
    },
    {
      name: 'Team Management',
      icon: <FaUsers className="text-[#983279]" />,
      path: '/dashboard/company/team',
    },
    {
      name: 'Company Profile',
      icon: <FaBuilding className="text-[#983279]" />,
      path: '/dashboard/company/profile',
    },
    {
      name: 'Marketplace',
      icon: <FaShoppingCart className="text-[#983279]" />,
      path: '/dashboard/company/marketplace',
    },
    {
      name: 'Settings',
      icon: <FaCog className="text-[#983279]" />,
      path: '/dashboard/company/settings',
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#983279]/20 bg-background">
        <div className="p-4">
          <h2 className="text-xl font-bold text-foreground mb-6">Company Dashboard</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#983279]/10 text-[#983279]'
                    : 'hover:bg-[#983279]/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 