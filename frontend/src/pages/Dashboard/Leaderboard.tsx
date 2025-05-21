import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { useTheme } from "../../context";
import { useReadContract } from "wagmi";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../../constants";
import { formatEther } from "viem";
import { LucideTrophy, LucideFilter, LucideCrown, LucideMedal, LucideAward } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  address: string;
  points: number;
  recycledAmount: string;
  contributionCount: number;
  lastActive: string;
}

const timeFrameOptions = ["All Time", "This Month", "This Week"];
const categoryOptions = ["Points", "Amount Recycled", "Contributions"];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <LucideCrown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <LucideMedal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <LucideAward className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
};

export default function Leaderboard() {
  const { darkMode } = useTheme();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("All Time");
  const [selectedCategory, setSelectedCategory] = useState("Points");

  // Fetch leaderboard data from smart contract
  const { data: leaderboardData } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getLeaderboard",
  });

  // Transform leaderboard data
  const leaderboard = useMemo(() => {
    if (!leaderboardData) return [];
    
    return (leaderboardData as any[]).map((entry, index) => ({
      rank: index + 1,
      address: entry.user,
      points: Number(entry.points),
      recycledAmount: formatEther(entry.recycledAmount),
      contributionCount: Number(entry.contributionCount),
      lastActive: new Date(Number(entry.lastActive) * 1000).toLocaleDateString(),
    }));
  }, [leaderboardData]);

  // Sort leaderboard based on selected category
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => {
      switch (selectedCategory) {
        case "Points":
          return b.points - a.points;
        case "Amount Recycled":
          return Number(b.recycledAmount) - Number(a.recycledAmount);
        case "Contributions":
          return b.contributionCount - a.contributionCount;
        default:
          return 0;
      }
    });
  }, [leaderboard, selectedCategory]);

  // Filter by time frame
  const filteredLeaderboard = useMemo(() => {
    const now = new Date();
    return sortedLeaderboard.filter(entry => {
      const entryDate = new Date(entry.lastActive);
      switch (selectedTimeFrame) {
        case "This Week":
          return now.getTime() - entryDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "This Month":
          return now.getTime() - entryDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  }, [sortedLeaderboard, selectedTimeFrame]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <LucideTrophy className="w-8 h-8 text-[#983279]" />
          <h1 className="text-2xl font-bold text-[#983279]">Leaderboard</h1>
        </div>
        <div className="flex gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="border-[#983279] text-[#983279] hover:bg-[#983279]/10"
                startContent={<LucideFilter className="text-[#983279]" />}
              >
                {selectedTimeFrame}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Time frame filter"
              onAction={(key) => setSelectedTimeFrame(key as string)}
              className="bg-background"
            >
              {timeFrameOptions.map((option) => (
                <DropdownItem key={option} className="text-[#983279]">{option}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="border-[#983279] text-[#983279] hover:bg-[#983279]/10"
                startContent={<LucideFilter className="text-[#983279]" />}
              >
                {selectedCategory}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Category filter"
              onAction={(key) => setSelectedCategory(key as string)}
              className="bg-background"
            >
              {categoryOptions.map((option) => (
                <DropdownItem key={option} className="text-[#983279]">{option}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-background border border-[#983279]/20 hover:border-[#983279]/40 transition-colors">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md text-[#983279]">Total Points</p>
              <p className="text-small text-[#983279]/60">All Users</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-[#983279]">
              {leaderboard.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20 hover:border-[#983279]/40 transition-colors">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md text-[#983279]">Total Recycled</p>
              <p className="text-small text-[#983279]/60">All Users</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-[#983279]">
              {formatEther(leaderboard.reduce((sum, entry) => sum + Number(entry.recycledAmount), 0))} ETH
            </p>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20 hover:border-[#983279]/40 transition-colors">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md text-[#983279]">Total Contributions</p>
              <p className="text-small text-[#983279]/60">All Users</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-[#983279]">
              {leaderboard.reduce((sum, entry) => sum + entry.contributionCount, 0).toLocaleString()}
            </p>
          </CardBody>
        </Card>
      </div>

      <Table
        aria-label="Leaderboard"
        classNames={{
          wrapper: "min-h-[400px]",
          th: "bg-[#983279]/10 text-[#983279] font-bold",
          td: "text-foreground",
        }}
      >
        <TableHeader>
          <TableColumn>RANK</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>POINTS</TableColumn>
          <TableColumn>RECYCLED</TableColumn>
          <TableColumn>CONTRIBUTIONS</TableColumn>
          <TableColumn>LAST ACTIVE</TableColumn>
        </TableHeader>
        <TableBody
          items={filteredLeaderboard}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-8">
              <LucideTrophy className="w-12 h-12 text-[#983279]/40 mb-4" />
              <p className="text-[#983279]/60">No data available</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.rank} className="hover:bg-[#983279]/5">
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRankIcon(item.rank)}
                  <span className="font-medium">{item.rank}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    src={item.profileImage ? getImageUrl(item.profileImage) : undefined}
                    name={item.username || item.address.slice(0, 2)}
                    className="bg-[#983279] text-white"
                  />
                  <Tooltip content={item.address}>
                    <span className="cursor-help font-medium">
                      {item.username || `${item.address.slice(0, 6)}...${item.address.slice(-4)}`}
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="bg-[#983279]/20 text-[#983279] font-medium"
                >
                  {item.points.toLocaleString()}
                </Chip>
              </TableCell>
              <TableCell className="font-medium">{item.recycledAmount} ETH</TableCell>
              <TableCell className="font-medium">{item.contributionCount}</TableCell>
              <TableCell className="font-medium">{item.lastActive}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 