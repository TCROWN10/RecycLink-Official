import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Layout } from "./pages/Dashboard/Layout";
import Landing from "./pages/Landing";
import { Toaster, toast } from "sonner";
import { useWasteWiseContext } from "./context";
import { NextUIProvider } from "@nextui-org/react";
import { useAuth } from "./hooks/useAuth";
import CompanyDashboard from './pages/Dashboard/CompanyDashboard';
import CompanyOverview from './pages/Dashboard/CompanyOverview';
import CompanyRegister from './pages/CompanyRegister';
import LoadingSpinner from './components/LoadingSpinner';

// Preload critical components
const Home = lazy(() => import("./components/dashboard").then(module => ({ default: module.Home })));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));

// Lazy load other components
const Register = lazy(() => import("./pages/Register"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Marketplace = lazy(() => import("./pages/Dashboard/Marketplace"));
const Recycle = lazy(() => import("./pages/Dashboard/Deposit"));
const CreateEvent = lazy(() => import("./pages/Dashboard/CreateEvent"));
const MyEvents = lazy(() => import("./pages/Dashboard/MyEvents"));
const SingleEvent = lazy(() => import("./pages/Dashboard/SingleEvent"));
const CreateAdmin = lazy(() => import("./pages/Dashboard/CreateAdmin"));
const Stats = lazy(() => import("./components/dashboard/home/Stats"));
const CreateCarbon = lazy(() => import("./pages/Dashboard/CreateCarbon"));
const SingleCarbon = lazy(() => import("./pages/Dashboard/SingleCarbon"));
const RecyclinkMarketplace = lazy(() => import("./pages/Dashboard/CarbonMarket"));
const Disbursement = lazy(() => import("./pages/Dashboard/Disbursement"));
const MyCarbonEvents = lazy(() => import("./pages/Dashboard/MyCarbonEvents"));
const NFTs = lazy(() => import("./pages/Dashboard/NFTs"));
const Leaderboard = lazy(() => import("./pages/Dashboard/Leaderboard"));
const Profit = lazy(() => import("./pages/Dashboard/Profit"));
const MyPurchases = lazy(() => import("./pages/Dashboard/MyPurchases"));
const TeamSettings = lazy(() => import("./pages/Dashboard/TeamSettings"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));

// Optimized loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="md" />
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: ('admin' | 'verifier' | 'company' | 'user')[] }) => {
  const { requireAuth, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!requireAuth(allowedRoles)) {
      return;
    }

    const isTcrown = window.ethereum?.selectedAddress?.toLowerCase() === '0xA1eE1Abf8B538711c7Aa6E2B37eEf1A48021F2bB'.toLowerCase();
    if (allowedRoles?.includes('admin') && !isTcrown && userRole !== 'admin') {
      toast.error('Only authorized admins can access this page');
      navigate('/dashboard');
      return;
    }
  }, [allowedRoles, userRole]);

  if (isLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

const App = () => {
  const { darkMode } = useWasteWiseContext();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode.value);
  }, [darkMode.value]);

  return (
    <NextUIProvider navigate={navigate}>
      <div className={darkMode.value ? "dark" : "light"}>
        <div className="min-h-screen bg-background text-foreground">
          <section className="relative w-full h-screen overflow-x-hidden overflow-y-auto">
            <div className="block relative">
              <Toaster
                theme={darkMode.value ? "dark" : "light"}
                position="top-right"
                toastOptions={{
                  style: {
                    top: "60px",
                  },
                }}
                richColors={true}
                gap={6}
                closeButton={true}
              />
            </div>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/company/register" element={<CompanyRegister />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="recycle" element={<Recycle />} />
                  <Route path="create-event" element={<CreateEvent />} />
                  <Route path="my-events" element={<MyEvents />} />
                  <Route path="event/:id" element={<SingleEvent />} />
                  <Route path="create-admin" element={<CreateAdmin />} />
                  <Route path="stats" element={<Stats />} />
                  <Route path="create-carbon" element={<CreateCarbon />} />
                  <Route path="credit/:id" element={<SingleCarbon />} />
                  <Route path="carbon-market" element={<RecyclinkMarketplace />} />
                  <Route path="disbursement" element={<Disbursement />} />
                  <Route path="my-carbon-events" element={<MyCarbonEvents />} />
                  <Route path="nfts" element={<NFTs />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="profit" element={<Profit />} />
                  <Route path="my-purchases" element={<MyPurchases />} />
                  <Route path="team-settings" element={<TeamSettings />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="company" element={<CompanyDashboard />} />
                  <Route path="company/overview" element={<CompanyOverview />} />
                </Route>
              </Routes>
            </Suspense>
          </section>
        </div>
      </div>
    </NextUIProvider>
  );
};

export { App };
