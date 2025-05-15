import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav";
import Sidebar from "../../components/Sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useWasteWiseContext } from "../../context";

export const Layout = () => {
  const search = useLocation().pathname.split("/")[2];
  const { darkMode } = useWasteWiseContext();
  
  return (
    <div className={`min-h-screen bg-background ${darkMode.value ? 'dark' : 'light'}`}>
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Main content */}
        <div className="drawer-content flex flex-col">
          <DashboardNav title={search} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
        
        {/* Sidebar */}
        <div className="drawer-side z-[100]">
          <label 
            htmlFor="dashboard-drawer" 
            aria-label="close sidebar" 
            className="drawer-overlay bg-black/50"
          />
          <aside className="w-80 min-h-full bg-base-200 border-r border-divider">
            <Sidebar />
          </aside>
        </div>
      </div>
      
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        theme={darkMode.value ? 'dark' : 'light'}
      />
    </div>
  );
};

export default Layout;
