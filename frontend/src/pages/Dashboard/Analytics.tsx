import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { RECYCLINK_ADDRESS, RECYCLINKABI } from '../../constants';
import { useWasteWiseContext } from '../../context';
import { Card, CardBody, CardHeader, Select, SelectItem, Progress } from '@nextui-org/react';
import { FaRecycle, FaMapMarkerAlt, FaChartLine, FaUsers, FaLeaf } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Mock data for testing
const mockAnalyticsData = {
  totalRecycled: 750,
  monthlyRecycled: 150,
  recyclingPoints: [
    {
      id: '1',
      name: 'Downtown Recycling Center',
      location: [51.505, -0.09] as [number, number],
      totalRecycled: 500,
      lastUpdated: new Date().toLocaleDateString()
    },
    {
      id: '2',
      name: 'Green Valley Station',
      location: [51.51, -0.1] as [number, number],
      totalRecycled: 300,
      lastUpdated: new Date().toLocaleDateString()
    }
  ],
  userRank: 5,
  teamRank: 3,
  carbonOffset: 1875,
  nextMilestone: 1000,
  progressToNextMilestone: 75
};

interface RecyclingPoint {
  id: string;
  name: string;
  location: [number, number];
  totalRecycled: number;
  lastUpdated: string;
}

interface AnalyticsData {
  totalRecycled: number;
  monthlyRecycled: number;
  recyclingPoints: RecyclingPoint[];
  userRank: number;
  teamRank: number;
  carbonOffset: number;
  nextMilestone: number;
  progressToNextMilestone: number;
}

// Dynamically import the map component
const MapComponent = React.lazy(() => import('../../components/MapComponent'));

// Loading components
const CardSkeleton = () => (
  <Card className="bg-background border border-[#983279]/20 animate-pulse">
    <CardBody>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-[#983279]/20 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-[#983279]/20 rounded" />
          <div className="h-6 w-32 bg-[#983279]/20 rounded" />
        </div>
      </div>
    </CardBody>
  </Card>
);

const MapSkeleton = () => (
  <Card className="bg-background border border-[#983279]/20 animate-pulse">
    <CardHeader className="flex items-center gap-2">
      <div className="w-6 h-6 bg-[#983279]/20 rounded-full" />
      <div className="h-6 w-40 bg-[#983279]/20 rounded" />
    </CardHeader>
    <CardBody>
      <div className="h-[500px] bg-[#983279]/10 rounded-lg" />
    </CardBody>
  </Card>
);

const Analytics = () => {
  const { address } = useAccount();
  const { currentUser } = useWasteWiseContext();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('month');
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);

  // Memoize contract read options
  const contractReadOptions = useMemo(() => ({
    address: RECYCLINK_ADDRESS as `0x${string}`,
    abi: RECYCLINKABI,
    functionName: "getUserRecycles",
    account: address,
  }), [address]);

  // Fetch user data
  const { data: userData } = useReadContract({
    address: RECYCLINK_ADDRESS as `0x${string}`,
    abi: RECYCLINKABI,
    functionName: "getUser",
    account: address,
  });

  // Fetch analytics data with caching
  const { data: userRecycles, isSuccess: gotAnalytics, error } = useReadContract(contractReadOptions);

  // Memoize data processing
  const processAnalyticsData = useCallback((recycles: any, user: any): AnalyticsData => {
    // For testing, use mock data if contract data is not available
    if (!recycles || !user) {
      return mockAnalyticsData;
    }

    // Calculate total recycled from user's recycle transactions
    const totalRecycled = recycles.reduce((sum: number, tx: any) => sum + Number(tx.numberOfplastics || 0), 0);
    
    // Calculate monthly recycled (last 30 days)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const monthlyRecycled = recycles
      .filter((tx: any) => Number(tx.date) >= thirtyDaysAgo)
      .reduce((sum: number, tx: any) => sum + Number(tx.numberOfplastics || 0), 0);

    return {
      totalRecycled,
      monthlyRecycled,
      recyclingPoints: mockAnalyticsData.recyclingPoints, // Keep mock points for now
      userRank: Number(user?.xpoints || 0),
      teamRank: Number(user?.xrate || 0),
      carbonOffset: totalRecycled * 2.5,
      nextMilestone: 1000,
      progressToNextMilestone: (totalRecycled / 1000) * 100,
    };
  }, []);

  useEffect(() => {
    // Process data using both user recycles and user data
    const processedData = processAnalyticsData(userRecycles, userData);
    setAnalyticsData(processedData);

    if (processedData.recyclingPoints.length > 0) {
      setMapCenter(processedData.recyclingPoints[0].location);
    }
  }, [userRecycles, userData, processAnalyticsData]);

  // Memoize stats cards data
  const statsCards = useMemo(() => {
    if (!analyticsData) return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-background border border-[#983279]/20">
          <CardBody>
            <div className="flex items-center gap-4">
              <FaRecycle className="text-2xl text-[#983279]" />
              <div>
                <p className="text-sm text-foreground/60">Total Recycled</p>
                <p className="text-2xl font-bold text-[#983279]">
                  {analyticsData.totalRecycled.toFixed(2)} kg
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20">
          <CardBody>
            <div className="flex items-center gap-4">
              <FaChartLine className="text-2xl text-[#983279]" />
              <div>
                <p className="text-sm text-foreground/60">Monthly Recycled</p>
                <p className="text-2xl font-bold text-[#983279]">
                  {analyticsData.monthlyRecycled.toFixed(2)} kg
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20">
          <CardBody>
            <div className="flex items-center gap-4">
              <FaUsers className="text-2xl text-[#983279]" />
              <div>
                <p className="text-sm text-foreground/60">User Rank</p>
                <p className="text-2xl font-bold text-[#983279]">
                  #{analyticsData.userRank}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-background border border-[#983279]/20">
          <CardBody>
            <div className="flex items-center gap-4">
              <FaLeaf className="text-2xl text-[#983279]" />
              <div>
                <p className="text-sm text-foreground/60">Carbon Offset</p>
                <p className="text-2xl font-bold text-[#983279]">
                  {analyticsData.carbonOffset.toFixed(2)} kg CO₂
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }, [analyticsData]);

  // Memoize map section
  const mapSection = useMemo(() => {
    if (!analyticsData) return <MapSkeleton />;

    return (
      <Card className="bg-background border border-[#983279]/20">
        <CardHeader className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#983279]" />
          <h2 className="text-xl font-semibold text-foreground">Recycling Points</h2>
        </CardHeader>
        <CardBody>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <Suspense 
              fallback={
                <div className="h-full w-full bg-[#983279]/10 animate-pulse rounded-lg" />
              }
            >
              {analyticsData.recyclingPoints.length > 0 && (
                <MapComponent 
                  center={mapCenter}
                  recyclingPoints={analyticsData.recyclingPoints}
                />
              )}
            </Suspense>
          </div>
        </CardBody>
      </Card>
    );
  }, [analyticsData, mapCenter]);

  // Memoize progress card with accessibility label
  const progressCard = useMemo(() => {
    if (!analyticsData) return <CardSkeleton />;

    return (
      <Card className="bg-background border border-[#983279]/20 mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Progress to Next Milestone</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Next Milestone: {analyticsData.nextMilestone} kg</span>
              <span className="text-[#983279]">{analyticsData.progressToNextMilestone.toFixed(1)}%</span>
            </div>
            <Progress 
              value={analyticsData.progressToNextMilestone} 
              color="secondary"
              className="h-2"
              aria-label="Progress to next recycling milestone"
              classNames={{
                track: "bg-[#983279]/20",
                indicator: "bg-[#983279]"
              }}
            />
          </div>
        </CardBody>
      </Card>
    );
  }, [analyticsData]);

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <FaChartLine className="text-[#983279]" />
            Analytics Dashboard
          </h1>
          <Select
            label="Time Range"
            selectedKeys={[timeRange]}
            onChange={(e) => setTimeRange(e.target.value)}
            className="max-w-xs"
            classNames={{
              label: "text-foreground",
              value: "text-foreground",
              trigger: "bg-background border-[#983279]/20"
            }}
          >
            <SelectItem key="week" value="week">Last Week</SelectItem>
            <SelectItem key="month" value="month">Last Month</SelectItem>
            <SelectItem key="year" value="year">Last Year</SelectItem>
          </Select>
        </div>

        {statsCards}
        {progressCard}
        {mapSection}
      </div>
    </div>
  );
};

export default Analytics; 