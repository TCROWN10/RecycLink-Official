import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWasteWiseContext } from "../context";
import NotificationCard from "./NotificationCard";
import { useRef } from "react";
import { useDisconnect } from "wagmi";
import { logout } from "../assets";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Skeleton } from "@nextui-org/react";
import ProfileDropdown from "./ProfileDropdown";
import { shortenAddress } from "../utils";

const DashboardNav = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disconnect, isSuccess } = useDisconnect();
  const { currentUser, isRegistered, notifCount, notifications } =
    useWasteWiseContext();
  const mobileNotificationsModal = useRef<HTMLDialogElement>(null);

  const handleDisconnect = () => {
    disconnect();
    if (location.pathname !== "/") {
      setTimeout(() => {
        navigate("/");
      }, 400);
    }
  };

  return (
    <div className="sticky top-0 z-[90] w-full bg-background/60 backdrop-blur-lg backdrop-saturate-150 px-4 py-4 lg:px-8 border-b border-divider">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <div className="flex-none lg:hidden">
          <label
            htmlFor="dashboard-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost hover:bg-primary/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        {/* Page title */}
        <div className="flex-1 text-xl lg:text-2xl font-semibold capitalize">
          {title || 'Dashboard'}
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          
          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <button
              type="button"
              className="btn btn-ghost btn-circle hover:bg-primary/10 disabled:bg-transparent disabled:hover:bg-transparent disabled:cursor-not-allowed"
              disabled={notifCount < 1}
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifCount > 0 && (
                  <span className="badge badge-sm badge-error indicator-item">
                    {notifCount}
                  </span>
                )}
              </div>
            </button>
            
            {/* Notifications dropdown */}
            <div className="dropdown-content z-[91] mt-4 w-80 bg-background rounded-lg shadow-lg border border-divider">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-4">Notifications</h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {notifications.map((notification: any) => (
                    <NotificationCard key={notification.id} {...notification} />
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-gray-500">No notifications</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile */}
          {title !== "profile" && (
            <>
              {isRegistered ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 h-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                      <img
                        src={currentUser?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.userAddr}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </label>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                    <li className="menu-title">
                      <span className="text-sm font-semibold">
                        {currentUser?.name || shortenAddress(currentUser?.userAddr)}
                      </span>
                    </li>
                    <li>
                      <Link to="/dashboard/profile" className="justify-between">
                        Profile
                        <span className="badge badge-primary badge-sm">New</span>
                      </Link>
                    </li>
                    <li><Link to="/dashboard/wallet">Wallet</Link></li>
                    <li><Link to="/dashboard/settings">Settings</Link></li>
                    <li>
                      <button onClick={handleDisconnect} className="text-error">
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="max-w-40 w-full flex items-center gap-3">
                  <div>
                    <Skeleton className="flex rounded-full w-12 h-12" />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
