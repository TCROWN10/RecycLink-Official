import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { useWasteWiseContext } from "../context";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../constants";
import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";
import {
  FaWallet,
  FaRecycle,
  FaChartArea,
  FaCartArrowDown,
  FaCartPlus,
  FaUserShield,
  FaPeopleGroup,
  FaLayerGroup,
  FaUser,
  FaChartLine,
} from "react-icons/fa6";
import { LucideCandlestickChart } from "lucide-react";
import { IconType } from "react-icons";

interface Company {
  name: string;
  email: string;
  phoneNo: string;
  country: string;
  gender: number;
  profileImage: string;
  role?: number;
}

interface MenuItemProps {
  to: string;
  icon: IconType | React.ComponentType;
  label: string;
  isActive: boolean;
  isVisible?: boolean;
}

// Memoized MenuItem component with proper typing
const MenuItem = React.memo(({ to, icon: Icon, label, isActive, isVisible = true }: MenuItemProps) => {
  if (!isVisible) return null;
  
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? "bg-primary text-primary-foreground font-medium" 
            : "hover:bg-primary/10"
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
        <span>{label}</span>
      </Link>
    </li>
  );
});

MenuItem.displayName = 'MenuItem';

interface MenuItem {
  to: string;
  icon: IconType | React.ComponentType;
  label: string;
  isVisible: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const { address } = useAccount();
  const { darkMode, currentUser } = useWasteWiseContext();
  const { userRole } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);

  // Fetch company data with proper typing
  const { data, isSuccess } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getCompany",
    args: [address],
    account: address,
  });

  // Memoize active path
  const activePath = useMemo(() => {
    return location.pathname.split("/")[2] || "dashboard";
  }, [location.pathname]);

  // Memoize user role
  const role = useMemo(() => {
    return userRole || (currentUser?.role === 1 ? 'admin' : 
                      currentUser?.role === 2 ? 'verifier' : 
                      currentUser?.role === 3 ? 'company' : 'user');
  }, [userRole, currentUser?.role]);

  // Update company data only when needed
  useEffect(() => {
    if (isSuccess && data) {
      setCompany(data as Company);
    }
  }, [isSuccess, data]);

  // Memoize menu items based on role
  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [
      // Profile Menu Item - Visible to all users
      {
        to: "/dashboard/profile",
        icon: FaUser,
        label: "Profile",
        isVisible: true
      }
    ];

    // Admin Menu Items
    if (role === 'admin') {
      items.push(
        {
          to: "/dashboard",
          icon: FaChartLine,
          label: "Dashboard",
          isVisible: true
        },
        {
          to: "/dashboard/createEvent",
          icon: FaCartPlus,
          label: "Create Event",
          isVisible: true
        },
        {
          to: "/dashboard/createAdmin",
          icon: FaUserShield,
          label: "Create Admin",
          isVisible: true
        },
        {
          to: "/dashboard/createCarbon",
          icon: FaRecycle,
          label: "Sell Credits",
          isVisible: true
        },
        {
          to: "/dashboard/carbonmarket",
          icon: FaCartArrowDown,
          label: "Carbon Market",
          isVisible: true
        }
      );
    }

    // User & Admin Menu Items
    if (role === 'user' || role === 'admin' || role === 'verifier') {
      items.push({
        to: "/dashboard/leaderboard",
        icon: FaPeopleGroup,
        label: "Leaderboard",
        isVisible: true
      });
    }

    // User & Admin Marketplace
    if (role === 'user' || role === 'admin') {
      items.push({
        to: "/dashboard/marketplace",
        icon: FaCartArrowDown,
        label: "Marketplace",
        isVisible: true
      });
    }

    // Regular User Menu Items
    if (role === 'user') {
      items.push(
        {
          to: "/dashboard/wallet",
          icon: FaWallet,
          label: "Wallet",
          isVisible: true
        },
        {
          to: "/dashboard/purchases",
          icon: FaLayerGroup,
          label: "My Purchases",
          isVisible: true
        }
      );
    }

    // Verifier Menu Items
    if (role === 'verifier') {
      items.push({
        to: "/dashboard/recycle",
        icon: FaRecycle,
        label: "Recycle",
        isVisible: true
      });
    }

    // Company Menu Items
    if (company?.role === 3) {
      items.push(
        {
          to: "/dashboard/carbonmarket",
          icon: FaCartArrowDown,
          label: "RecycLink Market",
          isVisible: true
        },
        {
          to: "/dashboard/carbonpurchases",
          icon: FaLayerGroup,
          label: "My Purchases",
          isVisible: true
        }
      );
    }

    return items;
  }, [role, company?.role]);

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
            {menuItems.map((item) => (
              <MenuItem
                key={item.to}
                {...item}
                isActive={activePath === item.to.split("/").pop()}
              />
            ))}
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

export default React.memo(Sidebar); 