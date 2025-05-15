import localforage from "localforage";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useReadContract } from "wagmi";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../constants";
import { ethers } from "ethers";

type contextType = {
  wastewiseStore: any;
  darkMode: {
    value: boolean;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
  };
  isRegistered: boolean;
  currentUser: any;
  setCurrentUser: any;
  statistics: any;
  setStatistics: any;
  notifCount: number | any;
  setNotifCount: number | any;
  notifications: any;
  setNotifications: any;
  adminsData: any;
  isAdminsDataFetching: boolean;
  isAdminsDataStale: boolean;
  isAdminsDataSuccessful: boolean;
  allUsersData: any;
  isAllUsersDataFetching: boolean;
  isAllUsersDataStale: boolean;
  isAllUsersDataSuccessful: boolean;
  verifiersData: any;
  isVerifiersDataFetching: boolean;
  isVerifiersDataStale: boolean;
  isVerifiersDataSuccessful: boolean;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
};

type userDataType = {
  approvalCount: number;
  country: string;
  email: string;
  gender: number;
  id: number;
  isAdmin: boolean;
  name: string;
  phoneNo: number;
  referral: string;
  role: number;
  timeJoined: number;
  tokenQty: number;
  userAddr: string;
};

const WastewiseContext = createContext<contextType>({
  wastewiseStore: null,
  darkMode: {
    value: false,
    enable: () => {},
    disable: () => {},
    toggle: () => {},
  },
  isRegistered: false,
  currentUser: null,
  setCurrentUser: null,
  statistics: null,
  setStatistics: null,
  notifCount: 0,
  setNotifCount: 0,
  notifications: null,
  setNotifications: null,
  adminsData: null,
  isAdminsDataFetching: false,
  isAdminsDataStale: false,
  isAdminsDataSuccessful: false,
  allUsersData: null,
  isAllUsersDataFetching: false,
  isAllUsersDataStale: false,
  isAllUsersDataSuccessful: false,
  verifiersData: null,
  isVerifiersDataFetching: false,
  isVerifiersDataStale: false,
  isVerifiersDataSuccessful: false,
  provider: null,
  signer: null,
});

export const WastewiseProvider = ({ children }: { children: ReactNode }) => {
  localforage.config({
    driver: [
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE,
    ],
    name: "Wastewise-App",
  });
  let wastewiseStore = localforage.createInstance({
    name: "wastewiseStore",
  });

  const { address, isConnected } = useAccount();
  const [darkMode, setDarkMode] = useState(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return {
      value: savedTheme === 'dark',
      enable: () => {
        setDarkMode(prev => ({ ...prev, value: true }));
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
      },
      disable: () => {
        setDarkMode(prev => ({ ...prev, value: false }));
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      },
      toggle: () => {
        setDarkMode(prev => {
          const newValue = !prev.value;
          localStorage.setItem('theme', newValue ? 'dark' : 'light');
          if (newValue) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { ...prev, value: newValue };
        });
      },
    };
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<userDataType | {}>({});
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<any>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Initialize theme on mount
  useEffect(() => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Rest of your existing code...
  wastewiseStore
    .length()
    .then(function (nKeys) {
      setNotifCount(nKeys);
    })
    .catch(function (err) {
      console.log("Error fetching store length: ", err);
    });

  const fetchNotifications = useCallback(() => {
    wastewiseStore
      .iterate(function (value, key, iterNumber) {
        if (notifCount >= notifications.length) {
          console.log(value);
          setNotifications([...notifications, value]);
        }
        return value;
      })
      .then(function (result) {
        console.log(result);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [notifCount]);

  useEffect(() => {
    fetchNotifications();
  }, [notifCount]);

  const { data } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getUser",
    account: address,
  });

  console.log(address);

  const statisticsRead = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getStatistics",
    account: address,
  });

  const {
    data: adminsData,
    isStale: isAdminsDataStale,
    isStale: isAdminsDataFetching,
    isSuccess: isAdminsDataSuccessful,
  } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getAdmins",
    account: address,
  });

  const {
    data: allUsersData,
    isStale: isAllUsersDataStale,
    isStale: isAllUsersDataFetching,
    isSuccess: isAllUsersDataSuccessful,
  } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getAllUsers",
    account: address,
  });

  const {
    data: verifiersData,
    isSuccess: isVerifiersDataSuccessful,
    isStale: isVerifiersDataStale,
    isFetching: isVerifiersDataFetching,
  } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getVerifiers",
    account: address,
  });

  useEffect(() => {
    setIsRegistered(data ? Number((data as any)?.userAddr) !== 0 : false);
    setCurrentUser(data as any);
    return () => {};
  }, [data, isRegistered]);

  useEffect(() => {
    setStatistics(statisticsRead.data);
  }, [statisticsRead.data, statisticsRead.isSuccess]);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        try {
          const signer = await provider.getSigner();
          setSigner(signer);
        } catch (error) {
          console.error("Failed to get signer:", error);
        }
      }
    };

    initProvider();
  }, []);

  return (
    <WastewiseContext.Provider
      value={{
        wastewiseStore,
        darkMode,
        isRegistered,
        currentUser,
        setCurrentUser,
        statistics,
        setStatistics,
        notifCount,
        setNotifCount,
        notifications,
        setNotifications,
        adminsData,
        isAdminsDataFetching,
        isAdminsDataStale,
        isAdminsDataSuccessful,
        allUsersData,
        isAllUsersDataFetching,
        isAllUsersDataStale,
        isAllUsersDataSuccessful,
        verifiersData,
        isVerifiersDataFetching,
        isVerifiersDataStale,
        isVerifiersDataSuccessful,
        provider,
        signer,
      }}
    >
      {children}
    </WastewiseContext.Provider>
  );
};

export const useWasteWiseContext = () => useContext(WastewiseContext);
export default WastewiseProvider;
