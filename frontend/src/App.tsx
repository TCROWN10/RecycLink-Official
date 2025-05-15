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

// Lazy load components
const Register = lazy(() => import("./pages/Register"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Marketplace = lazy(() => import("./pages/Dashboard/Marketplace"));
const Home = lazy(() => import("./components/dashboard").then(module => ({ default: module.Home })));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const Recycle = lazy(() => import("./pages/Dashboard/Deposit"));
const CreateEvent = lazy(() => import("./pages/Dashboard/CreateEvent"));
const MyEvents = lazy(() => import("./pages/Dashboard/MyEvents"));
const SingleEvent = lazy(() => import("./pages/Dashboard/SingleEvent"));
const CreateAdmin = lazy(() => import("./pages/Dashboard/CreateAdmin"));
const Stats = lazy(() => import("./components/dashboard/home/Stats"));
const CreateCarbon = lazy(() => import("./pages/Dashboard/CreateCarbon"));
const SingleCarbon = lazy(() => import("./pages/Dashboard/SingleCarbon"));
const RecyclinkMarketplace = lazy(() => import("./pages/Dashboard/CarbonMarket"));
const CompanyRegister = lazy(() => import("./pages/Dashboard/CompanyRegister"));
const Disbursement = lazy(() => import("./pages/Dashboard/Disbursement"));
const MyCarbonEvents = lazy(() => import("./pages/Dashboard/MyCarbonEvents"));
const NFTs = lazy(() => import("./pages/Dashboard/NFTs"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: ('admin' | 'verifier' | 'company' | 'user')[] }) => {
  const { requireAuth, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!requireAuth(allowedRoles)) {
      return;
    }

    // Special handling for Tcrown's admin access
    const isTcrown = window.ethereum?.selectedAddress?.toLowerCase() === '0xA1eE1Abf8B538711c7Aa6E2B37eEf1A48021F2bB'.toLowerCase();
    if (allowedRoles?.includes('admin') && !isTcrown && userRole !== 'admin') {
      toast.error('Only authorized admins can access this page');
      navigate('/dashboard');
      return;
    }
  }, [allowedRoles, userRole]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export function App() {
  const { darkMode } = useWasteWiseContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize theme
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
            <Suspense fallback={<LoadingSpinner />}>
          <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
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
                  <Route
                    path="createEvent"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="myEvents" element={<MyEvents />} />
                  <Route path="event/:id" element={<SingleEvent />} />
                  <Route
                    path="createAdmin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="stats"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "verifier"]}>
                        <Stats />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="createCarbon"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateCarbon />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="carbon/:id" element={<SingleCarbon />} />
                  <Route path="carbonMarket" element={<RecyclinkMarketplace />} />
                  <Route
                    path="companyRegister"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <CompanyRegister />
                      </ProtectedRoute>
                    }
                  />
              <Route
                    path="disbursement"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Disbursement />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="myCarbonEvents" element={<MyCarbonEvents />} />
                  <Route path="nfts" element={<NFTs />} />
            </Route>
                <Route path="*" element={<ErrorPage />} />
          </Routes>
            </Suspense>
        </section>
        </div>
      </div>
    </NextUIProvider>
  );
}
