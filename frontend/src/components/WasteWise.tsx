import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
// import Button from "./Button";
import { ToastElem, capitalize, roleMap, shortenAddress } from "../utils";
import { toast } from "sonner";
import { useEffect, useRef, useState, useCallback, memo, Suspense } from "react";
import { BaseError } from "viem";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../assets";
import React from "react";
import { useWasteWiseContext } from "../context";
import { Button } from "@nextui-org/button";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { LucideBuilding2, LucidePower, LucideUserPlus2 } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Memoized ProfileDropdown component
const MemoizedProfileDropdown = memo(ProfileDropdown);

// Memoized Loading Skeleton
const LoadingSkeleton = memo(() => (
  <div className="max-w-40 w-full flex items-center gap-3">
    <div>
      <Skeleton className="flex rounded-full w-12 h-12" />
    </div>
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-3 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-lg" />
    </div>
  </div>
));

// Memoized Connect Button
const ConnectButton = memo(({ onClick, isPending }: { onClick: () => void; isPending: boolean }) => (
  <Button
    onClick={onClick}
    disabled={isPending}
    className="bg-[#983279] hover:bg-[#983279]/90 text-white w-full"
  >
    {isPending ? "Connecting..." : "Connect Wallet"}
  </Button>
));

// Memoized Error Modal
const ErrorModal = memo(({ isOpen, onClose, error }: { isOpen: boolean; onClose: () => void; error: any }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <ModalContent className="text-black dark:text-white">
      <ModalHeader className="text-black dark:text-white">Connection Error</ModalHeader>
      <ModalBody>
        <p className="text-red-500">{error?.message || "Failed to connect wallet"}</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
));

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in WasteWise component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function WasteWise() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { isRegistered, currentUser } = useWasteWiseContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { disconnect } = useDisconnect();
  const [showConnectError, setShowConnectError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sdgModal = useRef<HTMLDialogElement>(null);

  const { connect, connectors, error, isPending } = useConnect({
    mutation: {
      onSuccess: () => {
        setIsLoading(true);
        setTimeout(() => {
          onOpen();
          setIsLoading(false);
        }, 800);
      },
      onError(error) {
        console.error("Connection error:", error);
        toast.error("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
      }
    },
  });

  useEffect(() => {
    if (error) {
      setShowConnectError(true);
      console.error("Connection error:", error);
    }
  }, [error]);

  const handleDisconnect = useCallback(() => {
    setIsLoading(true);
    disconnect();
    if (location.pathname !== "/") {
      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 400);
    }
  }, [disconnect, location.pathname, navigate]);

  const handleConnect = useCallback(async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to connect your wallet");
        return;
      }

      const connector = connectors[0];
      if (!connector) {
        toast.error("No wallet connector available");
        return;
      }

      setIsLoading(true);
      await connect({ connector });
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet. Please try again.");
      setIsLoading(false);
    }
  }, [connect, connectors]);

  if (isConnected) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSkeleton />}>
      <>
        <div className="hidden dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar bg-green-200 hover:bg-green-100"
          >
            <div className="w-12 rounded-full">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy"
                alt="avatar"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <div className="h-12 leading-10 my-auto font-bold text-[#026937]">
                {shortenAddress(address as string)}
              </div>
            </li>
            <li className="">
              <Link
                to="/dashboard/profile"
                className="h-12 leading-10 justify-between"
              >
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <button
                title={"disconnect button"}
                type={"button"}
                className="h-12 leading-10 justify-between"
                onClick={handleDisconnect}
              >
                Logout
                <img
                  src={logout}
                  alt="logout-Icon"
                  width="20"
                  className="rotate-180"
                />
              </button>
            </li>
          </ul>
        </div>

            {!isPending && !isLoading ? (
              <MemoizedProfileDropdown
            isRegistered={isRegistered}
            currentUser={currentUser}
          />
        ) : (
              <LoadingSkeleton />
        )}

        {!isRegistered && (
          <Modal
            isDismissable={false}
                size="2xl"
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                  backdrop: "bg-black/50 dark:bg-white/50 backdrop-opacity-40",
                  base: "bg-white dark:bg-black text-black dark:text-white",
                  header: "text-black dark:text-white",
                  body: "text-black dark:text-white",
                  footer: "text-black dark:text-white"
            }}
          >
            <ModalContent className="px-4 py-8">
              {(onClose) => (
                <>
                      <ModalHeader className="font-firaSans font-bold text-2xl flex flex-col gap-1 text-black dark:text-white">
                    Welcome to RecycLink
                  </ModalHeader>
                  <ModalBody>
                        <div className="text-pretty text-black dark:text-white">
                      We would like you to set a name so that we
                      can personalize your EIA card.
                    </div>
                  </ModalBody>
                  <ModalFooter className="self-start mt-2">
                        <Button
                          as={Link}
                          to="/register"
                          className="bg-[#983279] hover:bg-[#983279]/90 text-white"
                        >
                      Set your name
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}

        {!isRegistered && (
          <dialog id="my_modal_4" className="modal" ref={sdgModal}>
                <div className="modal-box w-11/12 max-w-2xl bg-white dark:bg-black text-black dark:text-white">
              <form method="dialog" className="modal-backdrop">
                <div className="modal-action">
                      <button className="btn btn-md btn-rounded btn-ghost absolute right-8 top-8 text-black dark:text-white font-black">
                    ✕
                  </button>
                </div>
              </form>
                  <h3 className="font-firaSans font-bold text-2xl px-1 pb-2 lg:px-4 text-black dark:text-white">
                Welcome to RecycLink
              </h3>
                  <div className="px-1 py-1 lg:px-4 lg:py-4 leading-8 text-balance text-black dark:text-white">
                Thank you for connecting to RecycLink. We would like you to
                set a name so that we can personalize your EIA
                card.
                <div>
                  Kindly click the signup button to fill in those details.
                </div>
                <Link to="/register" className="block mt-4">
                      <Button className="bg-[#983279] hover:bg-[#983279]/90 text-white">Signup</Button>
                </Link>
              </div>
            </div>
          </dialog>
        )}
      </>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
    <div>
      <div className="dropdown rounded-2xl w-full">
          <ConnectButton onClick={handleConnect} isPending={isPending || isLoading} />
        </div>

        <ErrorModal 
          isOpen={showConnectError} 
          onClose={() => setShowConnectError(false)} 
          error={error} 
        />
    </div>
    </ErrorBoundary>
  );
}
