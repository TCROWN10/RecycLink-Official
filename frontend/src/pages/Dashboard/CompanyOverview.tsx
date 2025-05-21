import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { FaRecycle, FaChartLine, FaUsers, FaBuilding } from 'react-icons/fa';

const CompanyOverview = () => {
  const metrics = [
    {
      title: 'Total Orders',
      value: '156',
      icon: <FaRecycle className="text-2xl text-[#983279]" />,
      change: '+12%',
    },
    {
      title: 'Total Recycled',
      value: '2,450 kg',
      icon: <FaChartLine className="text-2xl text-[#983279]" />,
      change: '+8%',
    },
    {
      title: 'Team Members',
      value: '8',
      icon: <FaUsers className="text-2xl text-[#983279]" />,
      change: '+2',
    },
    {
      title: 'Active Projects',
      value: '4',
      icon: <FaBuilding className="text-2xl text-[#983279]" />,
      change: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Company Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-background border border-[#983279]/20">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                  <p className="text-sm text-[#983279] mt-1">{metric.change}</p>
                </div>
                {metric.icon}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-background border border-[#983279]/20">
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-[#983279]/5">
                <div className="w-2 h-2 rounded-full bg-[#983279]" />
                <div>
                  <p className="text-foreground">New recycling order received</p>
                  <p className="text-sm text-foreground/60">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="bg-background border border-[#983279]/20">
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Upcoming Tasks</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-[#983279]/5">
                <div>
                  <p className="text-foreground">Process plastic waste collection</p>
                  <p className="text-sm text-foreground/60">Due in 2 days</p>
                </div>
                <div className="w-24 h-2 rounded-full bg-[#983279]/20">
                  <div className="w-1/2 h-full rounded-full bg-[#983279]" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompanyOverview; 