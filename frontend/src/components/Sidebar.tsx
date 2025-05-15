import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { useWasteWiseContext } from "../context";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../constants";
import Logo from "./Logo";
import {
  FaWallet,
  FaRecycle,
  FaChartArea,
  FaCartArrowDown,
  FaCartPlus,
  FaUserShield,
  FaPeopleGroup,
  FaLayerGroup,
} from "react-icons/fa6";
import { LucideCandlestickChart } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState("");
  const { address } = useAccount();
  const { currentUser } = useWasteWiseContext();
  const [company, setCompany] = useState<any>();

  const { data, isSuccess } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getCompany",
    account: address,
  });

  useEffect(() => {
    if (isSuccess) {
      setCompany(data as any);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const path = location.pathname.split("/")[2] || "dashboard";
    setIsActive(path);
  }, [location]);

  const MenuItem = ({ to, icon: Icon, label, isVisible = true }: any) => {
    if (!isVisible) return null;
    
    const isActiveRoute = isActive === to.split("/").pop();
    
    return (
      <li>
        <Link
          to={to}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActiveRoute 
              ? "bg-primary text-primary-foreground font-medium" 
              : "hover:bg-primary/10"
          }`}
        >
          <Icon className={`w-5 h-5 ${isActiveRoute ? "text-primary-foreground" : "text-primary"}`} />
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="h-screen bg-background">
      <div className="flex flex-col h-full w-full bg-base-200/50 backdrop-blur-md">
        {/* Logo */}
        <div className="p-6">
          <Logo />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {/* Admin Menu Items */}
            {currentUser?.role === 1 && (
              <>
                <MenuItem
                  to="/dashboard"
                  icon={LucideCandlestickChart}
                  label="Dashboard"
                />
                <MenuItem
                  to="/dashboard/createEvent"
                  icon={FaCartPlus}
                  label="Create Event"
                />
                <MenuItem
                  to="/dashboard/createAdmin"
                  icon={FaUserShield}
                  label="Create Admin"
                />
                <MenuItem
                  to="/dashboard/createCarbon"
                  icon={FaRecycle}
                  label="Sell Credits"
                />
                <MenuItem
                  to="/dashboard/carbonmarket"
                  icon={FaCartArrowDown}
                  label="Carbon Market"
                />
              </>
            )}

            {/* User & Admin Menu Items */}
            {((currentUser?.role === 0 && currentUser?.name !== "") ||
              currentUser?.role === 1 ||
              currentUser?.role === 2) && (
              <MenuItem
                to="/dashboard/leaderboard"
                icon={FaPeopleGroup}
                label="Leaderboard"
              />
            )}

            {/* User & Admin Marketplace */}
            {((currentUser?.role === 0 && currentUser?.name !== "") ||
              currentUser?.role === 1) && (
              <MenuItem
                to="/dashboard/marketplace"
                icon={FaCartArrowDown}
                label="Marketplace"
              />
            )}

            {/* Regular User Menu Items */}
            {currentUser?.role === 0 && currentUser?.name !== "" && (
              <>
                <MenuItem
                  to="/dashboard/wallet"
                  icon={FaWallet}
                  label="Wallet"
                />
                <MenuItem
                  to="/dashboard/purchases"
                  icon={FaLayerGroup}
                  label="My Purchases"
                />
              </>
            )}

            {/* Verifier Menu Items */}
            {currentUser?.role === 2 && (
              <MenuItem
                to="/dashboard/recycle"
                icon={FaRecycle}
                label="Recycle"
              />
            )}

            {/* Company Menu Items */}
            {company?.role === 3 && (
              <>
                <MenuItem
                  to="/dashboard/carbonmarket"
                  icon={FaCartArrowDown}
                  label="RecycLink Market"
                />
                <MenuItem
                  to="/dashboard/carbonpurchases"
                  icon={FaLayerGroup}
                  label="My Purchases"
                />
              </>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 text-sm text-center border-t border-divider">
          <div className="flex justify-center items-center gap-2 opacity-60">
            <span>v1.0.0</span>
            <span className="w-px h-4 bg-current"></span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
