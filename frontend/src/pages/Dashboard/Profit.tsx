import React, { useEffect, useState } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { RECYCLINK_ADDRESS, RECYCLINKABI } from '../../constants';
import { FaWallet, FaMoneyBillWave, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { useWasteWiseContext } from '../../context';
import { toast } from 'sonner';

const Profit = () => {
  const [totalProfit, setTotalProfit] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [verifierProgress, setVerifierProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode } = useWasteWiseContext();

  // Fetch user's profit data
  const { data: userProfit, isSuccess: isProfitSuccess } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getUserProfit",
  });

  // Fetch user's verification status
  const { data: verificationStatus, isSuccess: isVerificationSuccess } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getUserVerificationStatus",
  });

  // Withdraw profit function
  const { writeContract } = useWriteContract();

  const handleWithdraw = async () => {
    try {
      await writeContract({
        address: RECYCLINK_ADDRESS,
        abi: RECYCLINKABI,
        functionName: "withdrawProfit",
      });
      toast.success('Withdrawal successful!');
      setIsLoading(true);
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };

  useEffect(() => {
    if (isProfitSuccess && userProfit) {
      const profit = Number(userProfit);
      setTotalProfit(profit);
      setCurrentBalance(profit);
      setIsWithdrawable(profit > 0);
      setIsLoading(false);
    }
  }, [isProfitSuccess, userProfit]);

  useEffect(() => {
    if (isVerificationSuccess && verificationStatus) {
      const progress = Number(verificationStatus) / 100;
      setVerifierProgress(Math.min(progress * 100, 100));
    }
  }, [isVerificationSuccess, verificationStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 transition-colors duration-200 bg-[#15191E]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-white transition-colors duration-200">
            <FaMoneyBillWave className="text-green-500" />
            My Profit
          </h1>
          <p className="text-lg text-gray-300 transition-colors duration-200">
            Track your earnings and progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Profit Card */}
          <div className="bg-[#1E2329] dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-colors duration-200">
            <div className="flex items-center gap-4 mb-4">
              <FaChartLine className="text-2xl text-green-500" />
              <h2 className="text-xl font-semibold text-white transition-colors duration-200">
                Total Profit
              </h2>
            </div>
            <p className="text-3xl font-bold text-green-500 mb-2">
              ${totalProfit.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 transition-colors duration-200">
              Total earnings from recycling
            </p>
          </div>

          {/* Current Balance Card */}
          <div className="bg-[#1E2329] dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-colors duration-200">
            <div className="flex items-center gap-4 mb-4">
              <FaWallet className="text-2xl text-blue-500" />
              <h2 className="text-xl font-semibold text-white transition-colors duration-200">
                Current Balance
              </h2>
            </div>
            <p className="text-3xl font-bold text-blue-500 mb-2">
              ${currentBalance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 transition-colors duration-200">
              Available for withdrawal
            </p>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="bg-[#1E2329] dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white transition-colors duration-200 mb-2">
                Withdraw Your Earnings
              </h3>
              <p className="text-gray-400 transition-colors duration-200">
                {isWithdrawable
                  ? "You have funds available for withdrawal"
                  : "No funds available for withdrawal"}
              </p>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={!isWithdrawable}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                isWithdrawable
                  ? "bg-[#983279] hover:bg-[#983279]/90 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Verifier Progress Section */}
        <div className="bg-[#1E2329] dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-colors duration-200">
          <div className="flex items-center gap-4 mb-4">
            <FaCheckCircle className="text-2xl text-yellow-500" />
            <h2 className="text-xl font-semibold text-white transition-colors duration-200">
              Verifier Progress
            </h2>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-400 transition-colors duration-200">
              <span>Progress to Verifier Status</span>
              <span>{verifierProgress.toFixed(1)}%</span>
            </div>
          </div>
          <div className="w-full bg-[#2A3036] dark:bg-gray-700 rounded-full h-4 transition-colors duration-200">
            <div
              className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${verifierProgress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-sm text-gray-400 transition-colors duration-200">
            {verifierProgress >= 100
              ? "Congratulations! You've achieved verifier status!"
              : "Continue recycling to become a verifier"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profit; 