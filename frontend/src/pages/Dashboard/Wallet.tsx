import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { useWasteWiseContext } from "../../context";
import { formatDate, formatDateShort, shortenAddress } from "../../utils";
import {
  RECYCLINK_ADDRESS,
  RECYCLINKABI,
  USD_TOKEN_ADDRESS,
  USDTokenABI,
} from "../../constants";
import ReactApexChart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { toast } from "sonner";
import useNotificationCount from "../../hooks/useNotificationCount";
import { formatEther, formatUnits } from "viem";
import { FaRecycle, FaWallet, FaUserCircle } from "react-icons/fa";

interface ChartDataPoint {
  x: number;
  y: number;
}

interface RecycleData {
  timestamp: bigint;
  amount: bigint;
}

const Wallet = () => {
  const { address } = useAccount();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [transactions, setTransactions] = useState<any>([]);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const {
    currentUser,
    setCurrentUser,
    statistics,
    wastewiseStore,
    setNotifCount,
  } = useWasteWiseContext();
  const notificationCount = useNotificationCount();

  const chartOptions: ApexOptions = {
    chart: {
      type: chartType,
      toolbar: {
        show: true
      },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth' as 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#718096'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#718096'
        }
      }
    },
    grid: {
      borderColor: '#2D3748',
      strokeDashArray: 5
    },
    tooltip: {
      theme: 'dark'
    }
  };

  // Get user transactions
  const { data: transactionData, isSuccess: gotTransactions } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getUserTransactions",
    account: address,
  });

  // Get user recycling data
  const { data: recycledData, isSuccess: gotRecycled } = useReadContract<RecycleData[]>({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getUserRecycles",
    account: address,
  });

  // Get token balance
  const { data: tokenData, isSuccess: gotTokenBalance } = useReadContract({
    address: USD_TOKEN_ADDRESS,
    abi: USDTokenABI,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (gotTokenBalance && tokenData) {
      setTokenBalance(Number(formatUnits(tokenData as bigint, 18)));
    }
  }, [gotTokenBalance, tokenData]);

  useEffect(() => {
    if (gotTransactions && transactionData) {
      setTransactions(transactionData);
    }
  }, [gotTransactions, transactionData]);

  useEffect(() => {
    if (gotRecycled && recycledData && Array.isArray(recycledData)) {
      const chartData = recycledData.map((item: RecycleData) => ({
        x: new Date(Number(item.timestamp) * 1000).getTime(),
        y: Number(formatUnits(item.amount, 18))
      }));
      setChartData(chartData);
    }
  }, [gotRecycled, recycledData]);

  // Watch for new transactions
  useWatchContractEvent({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    eventName: "PlasticDeposited",
    onLogs(log) {
      if ((log[0] as any)?.args?.depositor === currentUser?.userAddr) {
        toast.success("Your deposited plastic has been confirmed", {
          duration: 10000,
          onAutoClose: (t) => {
            wastewiseStore
              .setItem(t.id.toString(), {
                id: t.id,
                title: t.title,
                datetime: new Date(),
                type: t.type,
              })
              .then(() => setNotifCount(notificationCount));
          },
        });
      }
    },
  });

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 0: // User
        return <FaUserCircle className="w-8 h-8 text-primary" />;
      case 1: // Admin
        return <FaUserCircle className="w-8 h-8 text-success" />;
      case 2: // Verifier
        return <FaUserCircle className="w-8 h-8 text-warning" />;
      default:
        return <FaUserCircle className="w-8 h-8" />;
    }
  };

  const getRoleName = () => {
    switch (currentUser?.role) {
      case 0:
        return "User";
      case 1:
        return "Admin";
      case 2:
        return "Verifier";
      default:
        return "Unknown";
    }
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
          <p className="text-gray-500">You need to connect your wallet to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6">
      {/* User Info Card */}
      <div className="bg-base-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={currentUser?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${address}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-primary"
            />
            <div className="absolute -bottom-2 -right-2">
              {getRoleIcon()}
                </div>
              </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{currentUser?.name || shortenAddress(address || '')}</h2>
            <p className="text-sm text-gray-500">{getRoleName()}</p>
            <p className="text-sm text-gray-500">Wallet: {shortenAddress(address || '')}</p>
              </div>

          <div className="flex-grow" />
          
          <div className="stats bg-base-300 shadow">
              <div className="stat">
              <div className="stat-title">Balance</div>
              <div className="stat-value text-primary">{tokenBalance.toFixed(2)}</div>
              <div className="stat-desc">USDT</div>
            </div>
          </div>
            </div>
          </div>

      {/* Transaction History */}
      <div className="bg-base-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((tx: any, index: number) => (
                <tr key={index}>
                  <td>{formatDate(Number(tx.timestamp))}</td>
                  <td>{tx.transactionType === 0 ? 'Deposit' : 'Withdrawal'}</td>
                  <td>{formatUnits(tx.amount, 18)} USDT</td>
                  <td>
                    <span className={`badge ${tx.status === 1 ? 'badge-success' : 'badge-warning'}`}>
                      {tx.status === 1 ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!transactions || transactions.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-figure text-primary">
            <FaRecycle className="w-6 h-6" />
          </div>
          <div className="stat-title">Total Recycled</div>
          <div className="stat-value">{currentUser?.totalRecycled || 0}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-figure text-secondary">
            <FaWallet className="w-6 h-6" />
          </div>
          <div className="stat-title">Total Earned</div>
          <div className="stat-value">{tokenBalance.toFixed(2)} USDT</div>
          <div className="stat-desc">↗︎ 90 (14%)</div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="stat-title">Success Rate</div>
          <div className="stat-value">
            {transactions?.filter((tx: any) => tx.status === 1).length / (transactions?.length || 1) * 100}%
          </div>
          <div className="stat-desc">↗︎ Completed transactions</div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-base-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Activity Overview</h3>
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "line" | "bar" | "area")}
            className="select select-bordered select-sm"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="area">Area</option>
          </select>
        </div>
        <div className="h-[400px]">
          <ReactApexChart
            options={chartOptions}
            series={[
              {
                name: "Recycled",
                data: chartData
              }
            ]}
            type={chartType}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Wallet;
